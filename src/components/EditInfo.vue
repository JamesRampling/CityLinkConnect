<template>
<div id="Popout" ref="dialogEditInfo" closedby="any">
    <h1>Please input your changes</h1>
    // eslint-disable-next-line vue/no-parsing-error
    <input>Enter your input here</input>
</div>
</template>

<script lang="ts">
import { ref } from 'vue';
defineProps<{ target: HTMLElement }>();

const dialogEditInfo = ref<HTMLDialogElement>();

function show() {
  dialogEditInfo.value?.show();
}

defineExpose({ show });

</script>

<style lang="css" scoped>
#Popout {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border: 2px solid black;
  padding: 20px;
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
