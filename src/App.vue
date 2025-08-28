<script setup lang="ts"></script>

<template>
  
  <nav>
      <el-menu class="Topbar" mode="horizontal">
        <el-menu-item index="1" disabled><img src=".\Images\favicon.png"></el-menu-item>
        <el-menu-item index="2"><router-link to="/">Home</router-link></el-menu-item>
        <el-menu-item index="3"><router-link to="/about">About</router-link></el-menu-item>
          
        <el-menu-item index = "4">
          
        </el-menu-item>
      </el-menu>
  </nav>
  <main>
    
    <router-view />
  </main>
</template>

<style scoped>

.TopBar{
  
}

main {
  padding-block-start: 0.5rem;
}
</style>
.el-menu--horizontal {
  --el-menu-horizontal-height: 100px;
}