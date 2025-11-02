export const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err) || String(err);
  } catch {
    return String(err);
  }
};
