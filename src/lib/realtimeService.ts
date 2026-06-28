/**
 * WebSocket Service for Real-time Updates
 * Provides real-time complaint status updates, notifications, and live data
 */

import { supabase } from '@/integrations/supabase/client';

// Types
export interface RealtimeMessage {
  type: 'COMPLAINT_UPDATE' | 'NOTIFICATION' | 'ALERT' | 'CHAT' | 'PRESENCE';
  payload: any;
  timestamp: number;
  channel: string;
}

export interface ComplaintUpdate {
  complaintId: string;
  status: string;
  previousStatus: string;
  updatedBy: string;
  message?: string;
  timestamp: number;
}

export interface LiveNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  action?: {
    label: string;
    url: string;
  };
  timestamp: number;
}

export interface PresenceInfo {
  onlineUsers: number;
  activeComplaints: number;
  departmentsOnline: string[];
}

// Connection state
let isConnected = false;
const subscribers: Map<string, Set<(message: RealtimeMessage) => void>> = new Map();
const presenceInfo: PresenceInfo = {
  onlineUsers: 0,
  activeComplaints: 0,
  departmentsOnline: [],
};

// Supabase Realtime Channels
let complaintsChannel: ReturnType<typeof supabase.channel> | null = null;
let notificationsChannel: ReturnType<typeof supabase.channel> | null = null;
let presenceChannel: ReturnType<typeof supabase.channel> | null = null;

/**
 * Initialize WebSocket connections
 */
export async function initializeRealtime(userId?: string): Promise<boolean> {
  if (isConnected) return true;
  
  try {
    // Complaints channel - listen for real-time updates
    complaintsChannel = supabase
      .channel('complaints-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'complaints',
        },
        (payload) => {
          const message: RealtimeMessage = {
            type: 'COMPLAINT_UPDATE',
            payload: {
              complaintId: payload.new?.id || payload.old?.id,
              status: payload.new?.status,
              previousStatus: payload.old?.status,
              updatedBy: payload.new?.updated_by || 'system',
              timestamp: Date.now(),
            },
            timestamp: Date.now(),
            channel: 'complaints',
          };
          
          notifySubscribers('complaints', message);
        }
      )
      .subscribe();
    
    // Notifications channel - broadcast notifications
    notificationsChannel = supabase
      .channel('notifications')
      .on('broadcast', { event: 'notification' }, (payload) => {
        const message: RealtimeMessage = {
          type: 'NOTIFICATION',
          payload: payload.payload,
          timestamp: Date.now(),
          channel: 'notifications',
        };
        
        notifySubscribers('notifications', message);
      })
      .subscribe();
    
    // Presence channel - track online users
    if (userId) {
      presenceChannel = supabase
        .channel('online-users')
        .on('presence', { event: 'sync' }, () => {
          const state = presenceChannel?.presenceState() || {};
          presenceInfo.onlineUsers = Object.keys(state).length;
          
          const presenceMessage: RealtimeMessage = {
            type: 'PRESENCE',
            payload: presenceInfo,
            timestamp: Date.now(),
            channel: 'presence',
          };
          
          notifySubscribers('presence', presenceMessage);
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          console.log('User joined:', key, newPresences);
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('User left:', key, leftPresences);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await presenceChannel?.track({
              user_id: userId,
              online_at: new Date().toISOString(),
            });
          }
        });
    }
    
    isConnected = true;
    return true;
  } catch (error) {
    console.error('Failed to initialize realtime:', error);
    return false;
  }
}

/**
 * Disconnect from realtime services
 */
export async function disconnectRealtime(): Promise<void> {
  if (complaintsChannel) {
    await supabase.removeChannel(complaintsChannel);
    complaintsChannel = null;
  }
  
  if (notificationsChannel) {
    await supabase.removeChannel(notificationsChannel);
    notificationsChannel = null;
  }
  
  if (presenceChannel) {
    await supabase.removeChannel(presenceChannel);
    presenceChannel = null;
  }
  
  isConnected = false;
}

/**
 * Subscribe to a channel
 */
export function subscribe(
  channel: string,
  callback: (message: RealtimeMessage) => void
): () => void {
  if (!subscribers.has(channel)) {
    subscribers.set(channel, new Set());
  }
  
  subscribers.get(channel)!.add(callback);
  
  // Return unsubscribe function
  return () => {
    subscribers.get(channel)?.delete(callback);
  };
}

/**
 * Notify all subscribers of a channel
 */
function notifySubscribers(channel: string, message: RealtimeMessage): void {
  subscribers.get(channel)?.forEach(callback => {
    try {
      callback(message);
    } catch (error) {
      console.error('Subscriber callback error:', error);
    }
  });
}

/**
 * Send a broadcast notification
 */
export async function sendNotification(notification: Omit<LiveNotification, 'id' | 'timestamp'>): Promise<boolean> {
  try {
    const fullNotification: LiveNotification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    
    await notificationsChannel?.send({
      type: 'broadcast',
      event: 'notification',
      payload: fullNotification,
    });
    
    return true;
  } catch (error) {
    console.error('Failed to send notification:', error);
    return false;
  }
}

/**
 * Get current presence info
 */
export function getPresenceInfo(): PresenceInfo {
  return { ...presenceInfo };
}

/**
 * Subscribe to specific complaint updates
 */
export function subscribeToComplaint(
  complaintId: string,
  callback: (update: ComplaintUpdate) => void
): () => void {
  const channel = supabase
    .channel(`complaint-${complaintId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'complaints',
        filter: `id=eq.${complaintId}`,
      },
      (payload) => {
        callback({
          complaintId,
          status: payload.new.status,
          previousStatus: payload.old?.status || '',
          updatedBy: payload.new.updated_by || 'system',
          message: payload.new.internal_notes,
          timestamp: Date.now(),
        });
      }
    )
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Live chat between citizen and department
 */
export interface ChatMessage {
  id: string;
  complaintId: string;
  senderId: string;
  senderType: 'citizen' | 'department' | 'system';
  message: string;
  attachments?: string[];
  timestamp: number;
  read: boolean;
}

const chatChannels: Map<string, ReturnType<typeof supabase.channel>> = new Map();

export function joinComplaintChat(
  complaintId: string,
  userId: string,
  onMessage: (message: ChatMessage) => void
): {
  sendMessage: (message: string, attachments?: string[]) => Promise<boolean>;
  leave: () => void;
} {
  const channelName = `chat-${complaintId}`;
  
  const channel = supabase
    .channel(channelName)
    .on('broadcast', { event: 'message' }, (payload) => {
      onMessage(payload.payload as ChatMessage);
    })
    .subscribe();
  
  chatChannels.set(channelName, channel);
  
  return {
    sendMessage: async (message: string, attachments?: string[]) => {
      try {
        const chatMessage: ChatMessage = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          complaintId,
          senderId: userId,
          senderType: 'citizen', // Determine based on user role
          message,
          attachments,
          timestamp: Date.now(),
          read: false,
        };
        
        await channel.send({
          type: 'broadcast',
          event: 'message',
          payload: chatMessage,
        });
        
        return true;
      } catch (error) {
        console.error('Failed to send chat message:', error);
        return false;
      }
    },
    leave: () => {
      supabase.removeChannel(channel);
      chatChannels.delete(channelName);
    },
  };
}

/**
 * Real-time department activity tracking
 */
export interface DepartmentActivity {
  departmentId: string;
  departmentName: string;
  activeAgents: number;
  complaintsInProgress: number;
  averageResponseTime: number;
  lastActivity: number;
}

export function subscribeToDepartmentActivity(
  callback: (activities: DepartmentActivity[]) => void
): () => void {
  // Simulated department activity updates
  const interval = setInterval(async () => {
    const activities: DepartmentActivity[] = [
      {
        departmentId: 'bwssb',
        departmentName: 'BWSSB - Water Supply',
        activeAgents: 12 + Math.floor(Math.random() * 5),
        complaintsInProgress: 45 + Math.floor(Math.random() * 20),
        averageResponseTime: 2.5 + Math.random(),
        lastActivity: Date.now(),
      },
      {
        departmentId: 'bescom',
        departmentName: 'BESCOM - Electricity',
        activeAgents: 18 + Math.floor(Math.random() * 5),
        complaintsInProgress: 62 + Math.floor(Math.random() * 20),
        averageResponseTime: 1.8 + Math.random(),
        lastActivity: Date.now(),
      },
      {
        departmentId: 'bbmp-roads',
        departmentName: 'BBMP - Roads',
        activeAgents: 8 + Math.floor(Math.random() * 5),
        complaintsInProgress: 95 + Math.floor(Math.random() * 30),
        averageResponseTime: 5.2 + Math.random() * 2,
        lastActivity: Date.now(),
      },
    ];
    
    callback(activities);
  }, 30000); // Update every 30 seconds
  
  return () => clearInterval(interval);
}
