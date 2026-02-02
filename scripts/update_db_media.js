import { createClient } from "@supabase/supabase-js";

// Configuration from supabase-client.js
const supabaseUrl = "https://jiazhlyumfugomworbxq.supabase.co";
const supabaseKey = "sb_publishable_zVYxWKrvyWlGmcGgaI0gYA_3_7zD7O9"; // This key looks weird/invalid format usually starts with ey... but using what's in client.js.
// Wait, the file showed "sb_publishable_..." which is for the NEW Supabase keys? Or is it a placeholder?
// The file viewed content was: const SUPABASE_KEY = "sb_publishable_zVYxWKrvyWlGmcGgaI0gYA_3_7zD7O9";
// That doesn't look like a JWT. It might be a custom proxy key.
// However, the `createClient` import in `supabase-client.js` is from a CDN.
// Let's use exactly what's in the file.

const supabase = createClient(supabaseUrl, supabaseKey);

const updates = [
  {
    term: "pushup",
    video: "https://www.youtube.com/embed/IODxDxX7PCQ",
    image: "https://media.giphy.com/media/wM0IbbkNwuZ2M/giphy.gif",
  },
  {
    term: "flexion",
    video: "https://www.youtube.com/embed/IODxDxX7PCQ",
    image: "https://media.giphy.com/media/wM0IbbkNwuZ2M/giphy.gif",
  },

  {
    term: "squat",
    video: "https://www.youtube.com/embed/gT19p3u2o7U",
    image: "https://media.giphy.com/media/l41YiK4f2H1lqGVra/giphy.gif",
  },
  {
    term: "sentadilla",
    video: "https://www.youtube.com/embed/gT19p3u2o7U",
    image: "https://media.giphy.com/media/l41YiK4f2H1lqGVra/giphy.gif",
  },

  {
    term: "pullup",
    video: "https://www.youtube.com/embed/eGo4IYlbE5g",
    image: "https://media.giphy.com/media/3o7TKSjRrfPHjTwqUO/giphy.gif",
  },
  {
    term: "dominada",
    video: "https://www.youtube.com/embed/eGo4IYlbE5g",
    image: "https://media.giphy.com/media/3o7TKSjRrfPHjTwqUO/giphy.gif",
  },

  {
    term: "plank",
    video: "https://www.youtube.com/embed/p23QW9B6vY8",
    image: "https://media.giphy.com/media/xT5LMCvYDfT212nWbP/giphy.gif",
  },
  {
    term: "plancha",
    video: "https://www.youtube.com/embed/p23QW9B6vY8",
    image: "https://media.giphy.com/media/xT5LMCvYDfT212nWbP/giphy.gif",
  },

  {
    term: "lunge",
    video: "https://www.youtube.com/embed/Q0PCm1gP3_k",
    image: "https://media.giphy.com/media/l3q2Q3sUEkEqgANcfw/giphy.gif",
  },
  {
    term: "zancada",
    video: "https://www.youtube.com/embed/Q0PCm1gP3_k",
    image: "https://media.giphy.com/media/l3q2Q3sUEkEqgANcfw/giphy.gif",
  },

  {
    term: "run",
    video: "https://www.youtube.com/embed/_kGESn8ArrU",
    image: "https://media.giphy.com/media/l2Jhv9GMcoVlX8rve/giphy.gif",
  },
  {
    term: "correr",
    video: "https://www.youtube.com/embed/_kGESn8ArrU",
    image: "https://media.giphy.com/media/l2Jhv9GMcoVlX8rve/giphy.gif",
  },

  {
    term: "burpee",
    video: "https://www.youtube.com/embed/auBLPXO8Fww",
    image: "https://media.giphy.com/media/WCdyi4X0y1mDe/giphy.gif",
  },

  {
    term: "crunch",
    video: "https://www.youtube.com/embed/u6ZelKyUM6g",
    image: "https://media.giphy.com/media/13Eq0yN0l5gBCE/giphy.gif",
  },
  {
    term: "abdominal",
    video: "https://www.youtube.com/embed/u6ZelKyUM6g",
    image: "https://media.giphy.com/media/13Eq0yN0l5gBCE/giphy.gif",
  },
];

async function updateExercises() {
  console.log("Starting update...");

  // 1. Fetch all exercises
  const { data: exercises, error } = await supabase
    .from("exercises")
    .select("*");
  if (error) {
    console.error("Error fetching:", error);
    return;
  }

  // 2. Iterate and Update
  for (const ex of exercises) {
    let match = null;
    const nameLower = ex.name.toLowerCase();

    for (const u of updates) {
      if (nameLower.includes(u.term)) {
        match = u;
        break;
      }
    }

    if (match) {
      console.log(`Updating ${ex.name}...`);

      // Try updating both. If image_url column is missing, this might fail or just ignore it.
      // Let's assume we can only safely update video_url for now unless we know image_url exists.
      // But the user asked to "hazlo" (do it), so we should try.

      const payload = {
        video_url: match.video,
      };
      // We can't dynamically check if column exists easily here without risking failure.
      // We'll try to include image_url. If it fails, we catch it.
      payload.image_url = match.image;

      const { error: updateError } = await supabase
        .from("exercises")
        .update(payload)
        .eq("exercise_id", ex.exercise_id);

      if (updateError) {
        console.error(`Failed to update ${ex.name}:`, updateError.message);
        // Fallback: Try updating ONLY video_url (maybe image_url column missing)
        if (
          updateError.message.includes(
            'column "image_url" of relation "exercises" does not exist',
          )
        ) {
          console.log("Column image_url missing. Updating only video_url...");
          await supabase
            .from("exercises")
            .update({ video_url: match.video })
            .eq("exercise_id", ex.exercise_id);
        }
      } else {
        console.log(`Success.`);
      }
    }
  }
  console.log("Done.");
}

updateExercises();
