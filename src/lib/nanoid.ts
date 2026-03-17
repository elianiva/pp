import { nanoid as _nanoid } from "nanoid";

export function generateId(): string {
  return _nanoid(8);
}
