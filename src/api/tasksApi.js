// Fetches seed tasks from a public API (JSONPlaceholder).
//
// Why this is here: the task requires fetching data from a public API and
// using it in the app. Instead of a throwaway call, we use it meaningfully:
// on the very first launch (when the device has no saved tasks yet) we
// pre-populate the list with a few real items pulled from the API.

const SEED_ENDPOINT = 'https://jsonplaceholder.typicode.com/todos?_limit=20';

// Maps a raw API record into the task shape used across our app.
function mapApiTodoToTask(todo) {
  return {
    id: `api-${todo.id}`,
    title: capitalize(todo.title),
    description: 'Imported from the public tasks API.',
    completed: Boolean(todo.completed),
    createdAt: new Date().toISOString(),
  };
}

function capitalize(text = '') {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export async function fetchSeedTasks() {
  const response = await fetch(SEED_ENDPOINT);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.map(mapApiTodoToTask);
}
