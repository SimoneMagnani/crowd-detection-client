export interface OnError {
  status: number;
  error: {error: string};
}

export function errorToString(error: OnError): string {
  return `[${error.status}] ${error.error.error}`;
}
