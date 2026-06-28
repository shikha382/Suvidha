-- Make tracking_id have a default value so it's not required on insert
ALTER TABLE public.complaints ALTER COLUMN tracking_id SET DEFAULT '';