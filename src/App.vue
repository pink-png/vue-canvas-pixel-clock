<script setup lang="ts">
import canvasclock from './components/canvasclock.vue'
</script>

<template>
  <component :is="canvasclock"></component>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
