<script setup lang="ts">
const props = defineProps<{
  id: number;
  name: string;
  email: string;
  locations: string;
}>();
</script>

<template>
  <h1>User profile {{ id }}</h1>
  <dev id="OutsideBox">
    <dev class="flex-container" flex-direction="column">
      <dev id="Hint">
        <h1>User Name:</h1>
        <h1>Password:</h1>
        <h1>Email:</h1>
        <h1>Locations:</h1>
      </dev>
      <dev id="ContentField">
        <h2>{{ name }}</h2>
        <h2>*********************</h2>
        <h2>{{ email }}</h2>
        <h2>{{ locations }}</h2>
      </dev>
      <dev id="edit">
        <h1>Edit</h1>
        <h1>Edit</h1>
        <h1>Edit</h1>
        <h1>Edit</h1>
      </dev>
    </dev>
  </dev>
  <dev id="LinkToNextPageText">
    <button>Check Submitted Applications</button>
  </dev>
</template>
<style lang="css" scoped>
.flex-container {
  display: flex;
  flex-direction: row;
  gap: 10px;
  border: 3cap;
  border-color: gray;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  justify-content: space-around;
  margin: 5cap;
}

#LinkToNextPageText {
  background-color: gray;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 600;
  padding-left: 10px;
  padding-top: 5px;

  border: 5px;
}
#OutsideBox {
  padding-left: 5px;
  padding-top: 10px;
  padding-right: 15px;
  padding-bottom: 5px;
  border-spacing: 3px;
  border: 2px;
  border-style: dotted;
  border-color: black;
}
</style>
