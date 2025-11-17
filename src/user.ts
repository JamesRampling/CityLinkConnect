import { User } from '#shared/models';
import { getItem, setItem } from '@/utils/localStorage';
import { ref, watch } from 'vue';
import z from 'zod';

export const UserState = User.extend({ token: z.jwt() });

const localStorageKey = 'user_state';

const userState = ref<z.infer<typeof UserState> | undefined>(
  getItem(localStorageKey, UserState).data,
);

watch(userState, (newValue) => {
  setItem(localStorageKey, newValue);
});

export function useUser() {
  return userState;
}
