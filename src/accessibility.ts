import { getItem, setItem } from '@/utils/localStorage';
import { ref, watch } from 'vue';
import z from 'zod';

const AccessibilityState = z.object({
  fontSize: z.int().default(16),
  themeMode: z
    .union([z.literal('light'), z.literal('dark'), z.literal('light dark')])
    .default('light dark'),
}) satisfies z.ZodObject<Record<string, z.ZodDefault>>;
type AccessibilityState = z.infer<typeof AccessibilityState>;

const accessibilityDefaults = AccessibilityState.parse({});

const localStorageKey = 'accessibility_options';

const accessibilityState = ref(
  getItem(localStorageKey, AccessibilityState).data ?? accessibilityDefaults,
);

const resetAccessibility = () =>
  (accessibilityState.value = accessibilityDefaults);

const applyStyle = (state: AccessibilityState) => {
  document.documentElement.style.fontSize = `${state.fontSize}px`;
  document.documentElement.style.colorScheme = state.themeMode;
};

watch(accessibilityState, applyStyle, { immediate: true, deep: true });
watch(
  accessibilityState,
  (newState) => {
    setItem(localStorageKey, newState);
  },
  { deep: true },
);

export function useAccessibility() {
  return [accessibilityState, resetAccessibility] as const;
}
