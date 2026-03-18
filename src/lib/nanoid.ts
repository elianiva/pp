import { customAlphabet } from "nanoid";

const randomId = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 10);

export function generateId(): string {
  return randomId();
}
