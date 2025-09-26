<script setup lang="ts">
var name = "Random person"
var email = "whoami@example.com"
var locations = "11 Crofton way, parkwood,WA"



defineProps<{ id: number }>();


</script>

<template>
  <h1>User profile {{ id }}</h1>
  <dev class="flex-container"flex-direction="column">
    <dev id="Hint">
      <h1>User Name: </h1>
      <h1>Password: </h1>
      <h1>Email: </h1>
      <h1>Locations: </h1>
    </dev>
    <dev id="ContentField">
      <h2>{{ name }}</h2>
      <h2>*********************</h2>
      <h2>{{ email }}</h2>
      <h2>{{ locations }}</h2>
    </dev>
    <dev id = "edit">
      <h1>Edit</h1>
      <h1>Edit</h1>
      <h1>Edit</h1>
      <h1>Edit</h1>
    </dev>
  </dev>
  <dev id="LinkToNextPageText">
  <h1>Check Submitted Applications</h1>
  </dev>
</template>
<style lang="css" scoped>
.flex-container{
  flex-direction: column;
  border:3cap;
  border-color: gray;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  
}



</style>

