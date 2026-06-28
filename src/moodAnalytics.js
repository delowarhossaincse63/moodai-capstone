export function sortEntries(entries) {
  return [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getMoodLabel(value) {
  return {
    1: "Very low",
    2: "Low",
    3: "Neutral",
    4: "Good",
    5: "Great"
  }[value];
}

export function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + Number(value), 0) / values.length;
}

function frequency(items) {
  const counts = items.reduce((map, item) => {
    map.set(item, (map.get(item) || 0) + 1);
    return map;
  }, new Map());

  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
}

export function getTrend(entries) {
  if (entries.length < 4) {
    return { label: "Needs more data", value: 0 };
  }

  const sorted = sortEntries(entries);
  const recent = average(sorted.slice(0, 3).map((entry) => entry.mood));
  const previous = average(sorted.slice(3, 6).map((entry) => entry.mood));
  const delta = recent - previous;

  if (delta >= 0.5) return { label: "Improving", value: delta };
  if (delta <= -0.5) return { label: "Declining", value: delta };
  return { label: "Stable", value: delta };
}

export function getStreak(entries) {
  const dates = new Set(entries.map((entry) => entry.date));
  let streak = 0;
  const cursor = new Date();

  while (dates.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function getActivityImpact(entries) {
  const groups = new Map();

  entries.forEach((entry) => {
    entry.activities.forEach((activity) => {
      if (!groups.has(activity)) groups.set(activity, []);
      groups.get(activity).push(entry.mood);
    });
  });

  return [...groups.entries()]
    .map(([activity, moods]) => ({
      activity,
      averageMood: average(moods),
      count: moods.length
    }))
    .sort((a, b) => b.averageMood - a.averageMood || b.count - a.count);
}

export function buildMoodSummary(entries) {
  const sorted = sortEntries(entries);
  const recent = sorted.slice(0, 10);

  return {
    totalEntries: entries.length,
    dateRange: entries.length
      ? {
          newest: sorted[0].date,
          oldest: sorted[sorted.length - 1].date
        }
      : null,
    averages: {
      mood: average(entries.map((entry) => entry.mood)),
      sleep: average(entries.map((entry) => entry.sleepHours)),
      energy: average(entries.map((entry) => entry.energy))
    },
    trend: getTrend(entries),
    topEmotions: frequency(entries.flatMap((entry) => entry.emotions)).slice(0, 5),
    topActivities: frequency(entries.flatMap((entry) => entry.activities)).slice(0, 5),
    activityImpact: getActivityImpact(entries).slice(0, 5),
    recentEntries: recent.map((entry) => ({
      date: entry.date,
      mood: entry.mood,
      moodLabel: getMoodLabel(entry.mood),
      emotions: entry.emotions,
      activities: entry.activities,
      sleepHours: entry.sleepHours,
      energy: entry.energy,
      note: entry.note
    }))
  };
}
