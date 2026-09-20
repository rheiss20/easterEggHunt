const STORAGE_KEY = 'easterEggHuntLeaderboard';
const SEEDED_ENTRY = {
  name: 'Howie',
  time: 8 * 60 * 1000,
};
const PREVIOUS_SEED_TIME = 25 * 60 * 1000;
export const LEADERBOARD_PAGE_SIZE = 20;
export const MINIMUM_COMPLETION_TIME = 60 * 1000;

const normalizeName = (name) => name.trim().toLocaleLowerCase();

const keepFastestRuns = (entries) => {
  const fastestByName = new Map();
  entries.forEach((entry) => {
    if (!entry || typeof entry.name !== 'string' || !Number.isFinite(entry.time)) {
      return;
    }
    const normalizedName = normalizeName(entry.name);
    if (!normalizedName) return;
    const existingEntry = fastestByName.get(normalizedName);
    if (!existingEntry || entry.time < existingEntry.time) {
      fastestByName.set(normalizedName, {
        name: entry.name.trim(),
        time: Math.max(0, Math.floor(entry.time)),
      });
    }
  });
  return Array.from(fastestByName.values()).sort(
    (left, right) => left.time - right.time,
  );
};

export const formatLeaderboardTime = (milliseconds) => {
  const safeMilliseconds = Math.max(0, Math.floor(milliseconds));
  const hours = Math.floor(safeMilliseconds / 3600000);
  const minutes = Math.floor((safeMilliseconds % 3600000) / 60000);
  const seconds = Math.floor((safeMilliseconds % 60000) / 1000);
  const remainder = safeMilliseconds % 1000;
  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, '0'))
    .concat(String(remainder).padStart(3, '0'))
    .join(':');
};

export const getLeaderboard = () => {
  let savedEntries = [];
  try {
    savedEntries = JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    savedEntries = [];
  }

  const migratedEntries = savedEntries.filter(
    (entry) =>
      !(entry.name === SEEDED_ENTRY.name && entry.time === PREVIOUS_SEED_TIME),
  );
  const entries = keepFastestRuns([SEEDED_ENTRY, ...migratedEntries]);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  return entries;
};

export const submitLeaderboardTime = (name, time) => {
  const entries = keepFastestRuns([...getLeaderboard(), { name, time }]);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  return entries;
};

export const getLeaderboardIndex = (entries, name) =>
  entries.findIndex((entry) => normalizeName(entry.name) === normalizeName(name));

export const isPlausibleCompletionTime = (time) =>
  Number.isFinite(time) && time >= MINIMUM_COMPLETION_TIME;