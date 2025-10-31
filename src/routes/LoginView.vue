<template>
  <h1 id="h1LoginView">CityLinkConnect</h1>

  <div class="login-container">
    <input type="text" placeholder="Username" />
    <input type="password" placeholder="Password" />
    <button class="button-filled">Login</button>
  </div>
</template>
<style lang="css" scoped>
.login-container {
  display: flex;
  flex-direction: column;
  width: 500px;
  background: #fff;
  margin: 20px;
  border: 1px solid black;
  padding-top: 10px;
  padding-bottom: 40px;
  padding-left: 5px;
  padding-right: 5px;
  gap: 18px;
}

.login-container input[type='text'],
.login-container input[type='password'] {
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: border 0.2s;
  outline: none;
}

#h1LoginView {
  text-align: center;
  color: var(--accent-color);
}
</style>
