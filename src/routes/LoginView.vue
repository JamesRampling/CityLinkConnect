<script setup lang="ts">
import InputText from '@/components/InputText.vue';
</script>

<template>
  <div class="page-wrapper">
    <h1 id="h1LoginView">CityLinkConnect</h1>

    <div>
      <div class="login-container">
        <InputText
          label="Username"
          type="text"
          placeholder="Username"
          name="UsernameInput"
        />
        <InputText
          label="Password"
          type="password"
          placeholder="Password"
          name="UserpasswordInput"
        />
        <div class="button-row">
          <button class="button-filled">Login</button>
          <button class="button-outlined">Sign Up</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="css" scoped>
.login-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* .login-container input[type='text'],
.login-container input[type='password'] {
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: border 0.2s;
  outline: none;
} */

#h1LoginView {
  text-align: center;
  color: var(--accent-color);
}
</style>
