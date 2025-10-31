<script setup lang="ts">
import InputText from '@/components/InputText.vue';
import InputTextarea from '@/components/InputTextarea.vue';
</script>

<template>
  <h1>Feedback form</h1>
  <dev class="flex-container">
    <div class="flex-item">
      <form class="form" action="" @submit.prevent>
        <InputText type="email" name="email-input" label="Email" />

        <InputTextarea type="feedback" name="feedback" label="Your feedback" />

        <div class="button-row">
          <button type="submit" class="button-filled">Submit</button>
          <button type="reset" class="button-outlined">Reset</button>
        </div>
      </form>
    </div>
    <div id="img-Content">
      <img src="@/assets/Images/feedback.png" alt="Feedback" width="400" />
    </div>
  </dev>
</template>

<style lang="css" scoped>
h1 {
  color: #2c3e50;
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  font-weight: 700;
}

.flex-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
#flex-Content {
  flex-direction: row;
}
#flex-item {
  flex-direction: column;
  padding: 1rem;
}
</style>
