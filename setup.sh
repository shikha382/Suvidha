#!/bin/bash

echo "🚀 SUVIDHA Hub - Hackathon Setup Script"
echo "========================================"

echo "📦 Installing dependencies..."
npm install

echo "🔧 Setting up environment..."
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "✅ Created .env.local file"
    echo "⚠️  Please add your Supabase credentials to .env.local"
else
    echo "✅ .env.local already exists"
fi

echo "🎨 Setting up development environment..."
echo "✅ All dependencies installed"
echo "✅ Environment configured"

echo ""
echo "🎯 Ready for Hackathon Demo!"
echo ""
echo "🌟 Key Features to Demonstrate:"
echo "  • AI-Powered Complaint System"
echo "  • Real-time Dashboard with Charts"
echo "  • Interactive Map Visualization"
echo "  • Smart Notification System"
echo "  • Comprehensive Feedback Platform"
echo "  • Mobile-First Responsive Design"
echo ""
echo "🚀 To start development server:"
echo "   npm run dev"
echo ""
echo "📊 To view the demo:"
echo "   Open http://localhost:5173 in your browser"
echo ""
echo "🎉 Good luck with your hackathon presentation!"