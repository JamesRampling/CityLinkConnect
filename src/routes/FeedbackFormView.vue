<script setup lang="ts">
import InputText from '@/components/InputText.vue';
import InputTextarea from '@/components/InputTextarea.vue';
</script>

<template>
  <div class="page-wrapper">
    <h1>Give us your feedback</h1>
    <form class="form" action="" @submit.prevent>
      <InputText name="email" label="E-Mail" />
      <InputText name="subject" label="Subject" />
      <InputTextarea name="message" label="Feedback" />

      <div class="button-row">
        <button type="submit" class="button-filled">Submit</button>
      </div>
    </form>
  </div>
</template>
