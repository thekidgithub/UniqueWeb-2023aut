<template>
  <p>count: {{ store.count }}</p>
  <button @click="store.increment()">add</button>
  <button @click="console.log(store.doubleCount)">return double</button>
</template>

<script setup>
  import { useCountStore } from '../stores/store.js'
  const store = useCountStore();
</script>