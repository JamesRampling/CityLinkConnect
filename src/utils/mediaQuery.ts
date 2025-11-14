import { onUnmounted, readonly, ref } from 'vue';

export function useMediaQuery(query: string) {
  const mediaQuery = matchMedia(query);

  const matches = ref(mediaQuery.matches);

  const listener = (e: MediaQueryListEvent) => {
    matches.value = e.matches;
  };

  mediaQuery.addEventListener('change', listener);

  onUnmounted(() => {
    mediaQuery.removeEventListener('change', listener);
  });

  return { matches: readonly(matches) };
}
