<script setup lang="ts">
import InputCheckbox from '@/components/InputCheckbox.vue';
import InputSelect from '@/components/InputSelect.vue';
import InputText from '@/components/InputText.vue';
import InputTextarea from '@/components/InputTextarea.vue';
defineProps<{ serviceId: number }>();
</script>

<template>
  <div class="page-wrapper">
    <h1>New Service Booking</h1>
    <form class="form" action="" @submit.prevent="onSubmit">
      <InputText type="email" name="email-input" label="Email" />

      <InputText type="date" name="date-input" label="asdf" />

      <InputCheckbox id="checkbox-input-2" name="asdf" label="Checkbox" />

      <InputTextarea name="service-information" label="Service information" />

      <InputSelect name="service-type" label="Service type" />

      <div class="button-row">
        <button type="submit" class="button-filled">Submit</button>
        <button type="reset" class="button-outlined">Reset</button>
      </div>
    </form>
  </div>
</template>
