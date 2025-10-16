<template>
  <div class="AboutUSSideShow"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AboutUSSideShow',
  props: {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: false },
  },
});
</script>

<style scoped>
.AboutUSSideShow {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background: #fafafa;
}
</style>
