<script setup lang="ts">
import { ref } from 'vue';
import { number } from 'zod';

const props = defineProps({
  id: { type: number, required: false, default: 1345423331 },
  name: { type: String, required: false, default: 'AdminName' },
});

const page = ref(1);
</script>

<template>
  <h1>Good morning {{ name }}</h1>
  <div class="flex-container">
    <div id="SideBar">
      <button class="squareButton" @click="page = 1">Users</button>
      <button class="squareButton" @click="page = 2">Bookings</button>
      <button class="squareButton" @click="page = 3">Content</button>
    </div>
    <div id="MainContent">
      <div></div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.squareButton {
  width: 100%;
  height: auto;
  padding-top: 10%;
  padding-bottom: 10%;
  text-align: center;
  font-size: medium;
  font-family: Arial, Helvetica, sans-serif;
  background-color: lightgray;
  line-height: 50%;
  border: 1px;
  transition: 1.2s;
  height: auto;
  font-weight: bold;
}
.squarebutton:hover {
  background-color: black;
  color: white;
}

.flex-container {
  flex: auto;
  flex-wrap: wrap;
  flex-direction: row;
  display: flex;
}
#sidebar {
  flex-direction: column;
  display: flex;
}
</style>
