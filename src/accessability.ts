import { ref, watch } from 'vue';

interface AccessibilityState {
  fontSize: number;
  themeMode: 'light' | 'dark' | 'light dark';
}

const accessibilityDefaults = {
  fontSize: 16,
  themeMode: 'light dark',
} satisfies AccessibilityState;

const accessibilityState = ref();

const resetAccessibility = () => {
  accessibilityState.value = {
    reset: resetAccessibility,
    ...accessibilityDefaults,
  };
};

const applyStyle = (state: AccessibilityState) => {
  document.documentElement.style.fontSize = `${state.fontSize}px`;
  document.documentElement.style.colorScheme = state.themeMode;
};

resetAccessibility();
watch(accessibilityState, applyStyle, { immediate: true, deep: true });

export function useAccessibility() {
  return accessibilityState;
}
