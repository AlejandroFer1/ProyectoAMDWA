import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://jiazhlyumfugomworbxq.supabase.co";
const SUPABASE_KEY = "sb_publishable_zVYxWKrvyWlGmcGgaI0gYA_3_7zD7O9";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
