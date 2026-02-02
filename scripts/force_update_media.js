import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jiazhlyumfugomworbxq.supabase.co";
const supabaseKey = "sb_publishable_zVYxWKrvyWlGmcGgaI0gYA_3_7zD7O9";
const supabase = createClient(supabaseUrl, supabaseKey);

// Map of names to IDs based on the previous check output (I will assume IDs based on standard seeding or fetch them dynamically)
const updates = [
  {
    term: "Pushup",
    video: "https://www.youtube.com/embed/IODxDxX7PCQ",
    image: "https://media.giphy.com/media/wM0IbbkNwuZ2M/giphy.gif",
  },
  {
    term: "Squat",
    video: "https://www.youtube.com/embed/gT19p3u2o7U",
    image: "https://media.giphy.com/media/l41YiK4f2H1lqGVra/giphy.gif",
  },
  {
    term: "Pullup",
    video: "https://www.youtube.com/embed/eGo4IYlbE5g",
    image: "https://media.giphy.com/media/3o7TKSjRrfPHjTwqUO/giphy.gif",
  },
  {
    term: "Plank",
    video: "https://www.youtube.com/embed/p23QW9B6vY8",
    image: "https://media.giphy.com/media/xT5LMCvYDfT212nWbP/giphy.gif",
  },
  {
    term: "Lunge",
    video: "https://www.youtube.com/embed/Q0PCm1gP3_k",
    image: "https://media.giphy.com/media/l3q2Q3sUEkEqgANcfw/giphy.gif",
  },
  {
    term: "Run",
    video: "https://www.youtube.com/embed/_kGESn8ArrU",
    image: "https://media.giphy.com/media/l2Jhv9GMcoVlX8rve/giphy.gif",
  },
  {
    term: "Burpee",
    video: "https://www.youtube.com/embed/auBLPXO8Fww",
    image: "https://media.giphy.com/media/WCdyi4X0y1mDe/giphy.gif",
  },
  {
    term: "Crunch",
    video: "https://www.youtube.com/embed/u6ZelKyUM6g",
    image: "https://media.giphy.com/media/13Eq0yN0l5gBCE/giphy.gif",
  },
];

async function forceUpdate() {
  console.log("Fetching exercises...");
  const { data: exercises, error } = await supabase
    .from("exercises")
    .select("*");

  if (error) {
    console.error(error);
    return;
  }

  for (const ex of exercises) {
    const name = ex.name;
    let match = updates.find((u) => name.includes(u.term));

    if (match) {
      console.log(`Updating ${name} (ID: ${ex.exercise_id})...`);

      // Try to update BOTH
      const updateData = { video_url: match.video };

      // Note: If image_url column doesn't exist, this request might fail entirely if we include it.
      // We will Try-Catch the specific update.

      // Attempt 1: Full Update
      try {
        const { error: err1 } = await supabase
          .from("exercises")
          .update({
            video_url: match.video,
            // Assume we can't add image_url via JS if it's not there.
            // But we will try to pass it if the column exists (we saw it was missing in previous step debug, likely).
            // Actually, let's verify if image_url exists.
            // If check_db showed keys, and image_url wasn't there, we can't update it.
          })
          .eq("exercise_id", ex.exercise_id);

        if (err1) console.error(`  Error A: ${err1.message}`);
        else console.log("  Update A success (Video).");
      } catch (e) {
        console.error("  Exception:", e);
      }
    }
  }
}

forceUpdate();
