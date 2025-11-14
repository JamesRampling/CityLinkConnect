import { ref, type Reactive } from 'vue';
import z from 'zod';

export function useValidation<T extends z.ZodType>(
  schema: T,
  input: Reactive<z.input<T>>,
) {
  const parsed = ref<z.output<T>>();
  const errors = ref<{ [_ in keyof z.output<T>]?: string[] }>({});

  return {
    parsed,
    errors,
    validate: () => {
      const result = schema.safeParse(input);

      parsed.value = result.success ? result.data : undefined;
      errors.value = result.success
        ? {}
        : z.flattenError(result.error).fieldErrors;
    },
  };
}
