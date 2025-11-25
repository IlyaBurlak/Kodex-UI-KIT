export const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err) || String(err);
  } catch {
    console.error('Error while serializing error', err);
    return String(err);
  }
};
