<template>
  <h2>login</h2>
  <button @click="login()">Login</button>
</template>

<script setup>
  import { useAuthStore } from '../stores/store.js';
  import { useRouter } from 'vue-router';
  const route = useRouter();
  const login = () => {
    const Auth = useAuthStore();
    Auth.login();
    route.push('/');
  }
</script>