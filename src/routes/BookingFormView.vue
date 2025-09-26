<script setup lang="ts">
defineProps<{ serviceId: number }>();
</script>

<template>
  <div class="page-wrapper">
    <h1>New Service Booking</h1>
    <form class="form" action="" @submit.prevent>
      <div class="input-text">
        <label for="email-input">Email</label>
        <input id="email-input" type="text" name="email" />
      </div>

      <div class="input-text">
        <label for="date-input">Date</label>
        <input id="date-input" type="date" name="date" />
      </div>

      <div class="input-checkbox">
        <input id="checkbox-input" type="checkbox" name="checkbox-input" />
        <label for="checkbox-input">Checkbox</label>
      </div>

      <div class="button-row">
        <button type="submit" class="button-filled">Submit</button>
        <button type="reset" class="button-outlined">Reset</button>
      </div>
    </form>
  </div>
</template>
