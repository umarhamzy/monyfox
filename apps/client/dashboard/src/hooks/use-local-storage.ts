import { useEffect, useState } from "react";
import { z } from "zod";

export function useLocalStorage<TypeValidator extends z.Schema>(
  key: string,
  defaultValue: z.infer<TypeValidator>,
  inputSchema: TypeValidator,
) {
  const [value, setValue] = useState<z.infer<TypeValidator> | null>(() => {
    const storedValue = localStorage.getItem(key);
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
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [
    value,
    // Do not allow setting the value to null
    setValue as React.Dispatch<React.SetStateAction<z.TypeOf<TypeValidator>>>,
  ] as const;
}
