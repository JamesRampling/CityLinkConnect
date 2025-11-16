<template>
  <div class="page-wrapper">
    <h1>Login</h1>
    <!-- <form class="form" action="" @submit.prevent="validate"> -->
    <!-- <InputText -->
    <!-- v-model="field.given_names" -->
    <!-- name="given-names" -->
    <!-- label="Given Names" -->
    <!-- /> -->

    <!-- <InputText v-model="field.last_name" name="last-name" label="Last Name" /> -->

    <!-- <InputText v-model="field.email" name="email" label="E-Mail" /> -->

    <InputText name="password" label="Password" />

    <!-- <InputText v-model="field.phone" name="phone" label="Phone Number" /> -->

    <div class="button-row">
      <button type="submit" class="button-filled">Submit</button>
    </div>
    <!-- </form> -->
    <router-link to="/register">Register</router-link>
  </div>
</template>
