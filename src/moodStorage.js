export const STORAGE_KEY = "moodai.entries";

export const EMOTIONS = [
  "Anxious",
  "Calm",
  "Hopeful",
  "Sad",
  "Focused",
  "Irritable",
  "Grateful",
  "Lonely",
  "Confident",
  "Overwhelmed"
];

export const ACTIVITIES = [
  "Exercise",
  "Meditation",
  "Study",
  "Work",
  "Social time",
  "Therapy",
  "Outdoor time",
  "Creative work",
  "Rest",
  "Screen break"
];

export const ENERGY_LEVELS = [
  { value: 1, label: "1 - Drained" },
  { value: 2, label: "2 - Low" },
  { value: 3, label: "3 - Steady" },
  { value: 4, label: "4 - Good" },
  { value: 5, label: "5 - Energized" }
];

export function getEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function createEntry(form) {
  return {
    id: crypto.randomUUID(),
    date: form.date,
    mood: Number(form.mood),
    emotions: form.emotions,
    activities: form.activities,
    sleepHours: Number(form.sleepHours),
    energy: Number(form.energy),
    note: form.note.trim(),
    createdAt: new Date().toISOString()
  };
}

export function saveEntry(entry) {
  const existing = getEntries().filter((item) => item.date !== entry.date);
  saveEntries([...existing, entry]);
}

export function deleteEntry(id) {
  saveEntries(getEntries().filter((entry) => entry.id !== id));
}

export function seedDemoData() {
  const today = new Date();
  const samples = [
    [0, 4, ["Calm", "Focused"], ["Exercise", "Study"], 7.5, 4, "Got a good start and felt steady after a walk."],
    [1, 3, ["Overwhelmed", "Hopeful"], ["Work", "Screen break"], 6.5, 3, "Busy day, but a short break helped me reset."],
    [2, 2, ["Anxious", "Lonely"], ["Work"], 5.5, 2, "Slept poorly and avoided messages."],
    [3, 3, ["Focused", "Irritable"], ["Study", "Rest"], 7, 3, "Productive but tense in the afternoon."],
    [4, 4, ["Grateful", "Calm"], ["Social time", "Outdoor time"], 8, 4, "Dinner with friends lifted my mood."],
    [5, 2, ["Sad", "Overwhelmed"], ["Screen break"], 6, 2, "Hard to concentrate. Needed more rest."],
    [6, 5, ["Confident", "Hopeful"], ["Exercise", "Creative work"], 8, 5, "Felt strong after finishing a creative task."],
    [7, 4, ["Calm", "Grateful"], ["Meditation", "Study"], 7.5, 4, "Morning meditation made the day feel manageable."],
    [8, 3, ["Anxious", "Focused"], ["Work", "Outdoor time"], 6.5, 3, "Some worry, but getting outside helped."],
    [9, 4, ["Hopeful", "Confident"], ["Exercise", "Social time"], 7, 4, "Good energy and better connection today."]
  ];

  const entries = samples.map(([daysAgo, mood, emotions, activities, sleepHours, energy, note]) => {
    const date = new Date(today);
    date.setDate(today.getDate() - daysAgo);
    return createEntry({
      date: date.toISOString().slice(0, 10),
      mood,
      emotions,
      activities,
      sleepHours,
      energy,
      note
    });
  });

  saveEntries(entries);
  return entries;
}
