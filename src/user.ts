import { ref } from 'vue';

const userState = ref<{ id: number; display_name: string }>();

export function useUser() {
  return userState;
}
