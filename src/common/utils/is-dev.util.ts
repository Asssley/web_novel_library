export const isDev = function(): boolean {
  return process.env.NODE_ENV === "development";
}