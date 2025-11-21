import { AuthenticationStatus, User } from '#shared/models';
import { getItem, setItem } from '@/utils/localStorage';
import { jwtDecode } from 'jwt-decode';
import { computed, readonly, ref, watch } from 'vue';
import z from 'zod';

const tokenKey = 'user_token';
const userInfoKey = 'user_info';

const token = ref(getItem(tokenKey, z.jwt()).data ?? '');

watch(token, (newValue) => {
  setItem(tokenKey, newValue);
});

const userInfo = ref(getItem(userInfoKey, User).data);

watch(userInfo, (newValue) => {
  setItem(userInfoKey, newValue);
});

const auth = computed(() =>
  token.value
    ? AuthenticationStatus.safeParse(jwtDecode(token.value)).data
    : undefined,
);

function setUserState(value?: z.infer<typeof User> & { token: string }) {
  if (value) {
    const { token: authToken, ...user } = value;
    token.value = authToken;
    userInfo.value = user;
  } else {
    token.value = '';
    userInfo.value = undefined;
  }
}

export function useUser() {
  return {
    setUserState,
    userInfo: readonly(userInfo),
    token: readonly(token),
    auth,
  };
}
