// Format date as human-readable string (e.g., "15 December 2025")
export function formatDateReadable(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-IN', options);
}

// Get minimum date (today)
export function getMinDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// Get date in YYYY-MM-DD format
export function getDateString(date) {
  return date.toISOString().split('T')[0];
}

// Check if date is in the past
export function isPastDate(dateString) {
  const inputDate = new Date(dateString + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate < today;
}
