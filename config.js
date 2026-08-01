import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

export const supabase = createClient(
    process.env.https://xzoidkaoupxzntkjviov.supabase.co,
    process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6b2lka2FvdXB4em50a2p2aW92Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTMwOTkzMywiZXhwIjoyMTAwODg1OTMzfQ.epdQsktP05cS0QVv9kUlrVwngYzmYkfS01KQI45EyZM
);