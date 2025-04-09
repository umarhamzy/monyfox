import { useEffect, useState } from "react";
import { z } from "zod";

export function useStorage<TypeValidator extends z.Schema>(
  storage: Storage,
  key: string,
  defaultValue: z.infer<TypeValidator>,
  inputSchema: TypeValidator,
) {
  const [value, setValue] = useState<z.infer<TypeValidator> | null>(() => {
    const storedValue = storage.getItem(key);
    if (storedValue) {
      try {
        const parsedValue = JSON.parse(storedValue);
        const validatedValue = inputSchema.parse(parsedValue);
        return validatedValue;
      } catch (error) {
        console.error(error);
        return null;
      }
    }
    return defaultValue;
  });

  useEffect(() => {
    if (value !== null) {
      storage.setItem(key, JSON.stringify(value));
    }
  }, [storage, key, value]);

  return [value, setValue] as const;
}
