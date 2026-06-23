// Input validation rules for the task form, kept separate from the UI
// so the rules are easy to read, reuse and test.

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 300;

// Returns an object of field -> error message. An empty object means "valid".
export function validateTask({ title, description }) {
  const errors = {};

  const trimmedTitle = (title || '').trim();
  if (!trimmedTitle) {
    errors.title = 'Title is required.';
  } else if (trimmedTitle.length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  } else if (trimmedTitle.length > TITLE_MAX) {
    errors.title = `Title must be under ${TITLE_MAX} characters.`;
  }

  if ((description || '').trim().length > DESCRIPTION_MAX) {
    errors.description = `Description must be under ${DESCRIPTION_MAX} characters.`;
  }

  return errors;
}

export function isValid(errors) {
  return Object.keys(errors).length === 0;
}
