import type { Result } from '#shared/utils/Result';
import { ref, type Reactive } from 'vue';
import z from 'zod';

export function useValidation<T extends z.ZodType>(
  schema: T,
  input: Reactive<z.input<T>>,
) {
  const errors = ref<{ [_ in keyof z.output<T>]?: string[] }>({});

  return {
    errors,
    validate: () => {
      const result = schema.safeParse(input);

      errors.value = result.success
        ? {}
        : z.flattenError(result.error).fieldErrors;

      return result.data;
    },
  };
}

export function useSubmission<I extends z.ZodType, R>(
  schema: I,
  fields: Reactive<z.input<I>>,
  action: (form: z.infer<I>) => Promise<Result<R, unknown>>,
  success: (result: R) => Promise<unknown>,
) {
  const { errors, validate } = useValidation(schema, fields);
  const submissionError = ref();

  return {
    fieldErrors: errors,
    submissionError,

    submit: async () => {
      const parsed = validate();
      if (parsed === undefined) return;

      const result = await action(parsed);
      if (result.ok) {
        await success(result.data);
      } else {
        submissionError.value = result.error;
      }
    },
  };
}
