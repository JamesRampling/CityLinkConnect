import { getItem, setItem } from '@/utils/localStorage';
import { ref, watch } from 'vue';
import z from 'zod';

const AccessibilityState = z.object({
  themeMode: z
    .union([z.literal('light'), z.literal('dark'), z.literal('light dark')])
    .default('light dark'),
  fontSize: z.int().default(16),
  fontFamily: z
    .union([
      z.literal('sans'),
      z.literal('serif'),
      z.literal('comic'),
      z.literal('monospace'),
    ])
    .default('sans'),
  lineHeight: z.number().default(1.2),
  letterSpacing: z.number().default(0),
}) satisfies z.ZodObject<Record<string, z.ZodDefault>>;
type AccessibilityState = z.infer<typeof AccessibilityState>;

const accessibilityDefaults = AccessibilityState.parse({});

const localStorageKey = 'accessibility_options';

const accessibilityState = ref(
  getItem(localStorageKey, AccessibilityState).data ?? accessibilityDefaults,
);

const resetAccessibility = () =>
  (accessibilityState.value = { ...accessibilityDefaults });

const fontFamilies = {
  sans: '',
  serif: 'serif',
  comic: `
    'Comic Sans MS',
    'Comic Sans',
    'Chalkboard SE',
    'Comic Neue',
    cursive,
    sans-serif
  `,
  monospace: 'monospace',
} satisfies Record<AccessibilityState['fontFamily'], string>;

const applyStyle = (state: AccessibilityState) => {
  const style = document.documentElement.style;

  style.colorScheme = state.themeMode;
  style.fontSize = `${state.fontSize}px`;
  style.fontFamily = fontFamilies[state.fontFamily];
  style.lineHeight = `${state.lineHeight}`;
  style.letterSpacing = `${state.letterSpacing}px`;
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
