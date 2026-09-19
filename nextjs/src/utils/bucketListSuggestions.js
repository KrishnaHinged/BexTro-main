/**
 * Curated Bucket List Suggestions by Interest Category.
 * 
 * PRIVACY GUARANTEE:
 * These suggestions are purely static, curated life-goal templates matched exclusively
 * to the authenticated user's selected interests. They do not query or expose any other
 * user's personal data or bucket list entries, guaranteeing zero data leakage between users.
 */

export const BUCKET_LIST_CATEGORIES = {
  coding: {
    label: "Coding & Tech",
    iconName: "Code2",
    suggestions: [
      "Build and launch a full-stack SaaS project",
      "Contribute code to a major open-source library",
      "Master a systems language (Rust or Go)",
      "Win or place in a 48-hour hackathon",
      "Publish an open-source developer tool or CLI",
      "Build an AI-powered autonomous agent application",
      "Deploy a high-availability distributed microservice",
      "Create a popular technical blog or tutorial series"
    ]
  },
  art: {
    label: "Art & Design",
    iconName: "Palette",
    suggestions: [
      "Fill an entire 100-page sketchbook from front to back",
      "Host a solo art exhibition or gallery showcase",
      "Master digital 3D sculpting and photorealistic rendering",
      "Paint a large-scale physical canvas or wall mural",
      "Design and release an original complete brand identity",
      "Sell your first original physical artwork or print",
      "Learn ceramics and sculpt handmade pottery",
      "Complete a 30-day daily creative challenge"
    ]
  },
  music: {
    label: "Music & Audio",
    iconName: "Music",
    suggestions: [
      "Learn to play guitar or piano fluently by ear",
      "Compose, produce, and release an original song on Spotify",
      "Perform a live musical set in front of an audience",
      "Master audio mixing and vocal mastering in a DAW",
      "Attend a legendary international music festival",
      "Record and drop a 4-track concept EP",
      "Learn to read sheet music effortlessly",
      "Jam in a live band session with fellow musicians"
    ]
  },
  sports: {
    label: "Sports & Athletics",
    iconName: "Trophy",
    suggestions: [
      "Train for and finish a full marathon (42.2 km)",
      "Reach peak athletic shape & sub-12% body fat",
      "Complete an Olympic triathlon or Spartan Beast race",
      "Earn a colored belt in martial arts (BJJ, Muay Thai, or Judo)",
      "Climb to the summit of a 4,000m+ mountain peak",
      "Master free-standing handstand pushups",
      "Compete in a regional amateur sports league",
      "Learn to surf open ocean waves"
    ]
  },
  travel: {
    label: "Travel & Adventure",
    iconName: "Compass",
    suggestions: [
      "Witness the Northern Lights (Aurora Borealis) in person",
      "Solo backpack across a foreign continent for 30 days",
      "Camp under a pristine desert starry sky",
      "Visit all 7 wonders of the modern world",
      "Go deep-sea scuba diving in a coral reef sanctuary",
      "Skydive from 15,000 feet over scenic coastlines",
      "Live and immerse in a foreign country for 3 months",
      "Hike the Inca Trail to Machu Picchu"
    ]
  },
  fitness: {
    label: "Fitness & Strength",
    iconName: "Dumbbell",
    suggestions: [
      "Hit the 1000lb barbell club (Deadlift + Squat + Bench)",
      "Do 100 consecutive strict pushups without resting",
      "Complete a 75 Hard mental & physical fitness streak",
      "Achieve front splits or full mobility flexibility",
      "Complete an ultramarathon (50km+ trail run)"
    ]
  },
  writing: {
    label: "Writing & Literature",
    iconName: "PenTool",
    suggestions: [
      "Write and publish a 50,000-word book or novel",
      "Maintain an unbroken daily reflection journal for 365 days",
      "Have an essay published in a respected publication",
      "Read 52 transformative books in a single calendar year",
      "Write a full screenplay or stage play"
    ]
  },
  finance: {
    label: "Finance & Wealth",
    iconName: "TrendingUp",
    suggestions: [
      "Earn your first $10,000 completely independently",
      "Achieve full debt-free status and 6-month emergency fund",
      "Build a portfolio generating consistent passive dividends",
      "Invest in an early-stage startup or venture fund",
      "Reach your first $100k net worth milestone"
    ]
  },
  mindfulness: {
    label: "Mindset & Lifestyle",
    iconName: "Brain",
    suggestions: [
      "Complete a 10-day silent Vipassana meditation retreat",
      "Maintain a 100-day waking up at 5:30 AM routine",
      "Mentor an aspiring individual to achieve their goal",
      "Learn to speak a foreign language conversationally",
      "Do a 30-day complete digital and social media detox"
    ]
  },
  universal: {
    label: "Universal Growth",
    iconName: "Target",
    suggestions: [
      "Give a keynote speech to an audience of 200+ people",
      "Cook a restaurant-grade 5-course meal for friends & family",
      "Complete a 365-day uninterrupted habit streak on Bextro",
      "Pilot a small aircraft or glider plane",
      "Build a personal library of 100 essential books"
    ]
  }
};

/**
 * Normalizes an interest string to match known categories.
 */
function normalizeCategory(interest) {
  const normalized = (interest || "").toLowerCase().trim();
  if (normalized.includes("cod") || normalized.includes("dev") || normalized.includes("program") || normalized.includes("software") || normalized.includes("tech")) {
    return "coding";
  }
  if (normalized.includes("art") || normalized.includes("paint") || normalized.includes("draw") || normalized.includes("design")) {
    return "art";
  }
  if (normalized.includes("music") || normalized.includes("song") || normalized.includes("audio") || normalized.includes("guitar") || normalized.includes("piano")) {
    return "music";
  }
  if (normalized.includes("sport") || normalized.includes("run") || normalized.includes("athle") || normalized.includes("football") || normalized.includes("basket")) {
    return "sports";
  }
  if (normalized.includes("travel") || normalized.includes("trip") || normalized.includes("adventure") || normalized.includes("explore")) {
    return "travel";
  }
  if (normalized.includes("fit") || normalized.includes("gym") || normalized.includes("workout") || normalized.includes("lift")) {
    return "fitness";
  }
  if (normalized.includes("writ") || normalized.includes("book") || normalized.includes("read") || normalized.includes("journal")) {
    return "writing";
  }
  if (normalized.includes("financ") || normalized.includes("money") || normalized.includes("crypto") || normalized.includes("invest") || normalized.includes("business")) {
    return "finance";
  }
  if (normalized.includes("mind") || normalized.includes("meditat") || normalized.includes("yoga") || normalized.includes("spirit")) {
    return "mindfulness";
  }
  return null;
}

/**
 * Returns prioritized suggestions categorized by the user's active interests.
 * @param {Array<string>|Set<string>} userInterests - The user's active interests.
 * @returns {Array<{ categoryKey: string, categoryLabel: string, icon: string, items: string[] }>}
 */
export function getSuggestionsForInterests(userInterests = []) {
  const interestArray = Array.isArray(userInterests)
    ? userInterests
    : Array.from(userInterests || []);

  const matchedCategories = new Set();

  interestArray.forEach((interest) => {
    const key = normalizeCategory(interest);
    if (key && BUCKET_LIST_CATEGORIES[key]) {
      matchedCategories.add(key);
    }
  });

  // If user selected standard keys directly
  interestArray.forEach((interest) => {
    const lower = (interest || "").toLowerCase().trim();
    if (BUCKET_LIST_CATEGORIES[lower]) {
      matchedCategories.add(lower);
    }
  });

  // Always append universal suggestions if few matches
  if (matchedCategories.size < 2) {
    matchedCategories.add("universal");
  }

  const result = [];
  matchedCategories.forEach((catKey) => {
    const cat = BUCKET_LIST_CATEGORIES[catKey];
    if (cat) {
      result.push({
        categoryKey: catKey,
        categoryLabel: cat.label,
        iconName: cat.iconName,
        items: cat.suggestions
      });
    }
  });

  return result;
}
