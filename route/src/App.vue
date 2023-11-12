<template>
  <RouterLink to="/">Home</RouterLink>
  <RouterLink to="/about">About</RouterLink>
  <RouterLink to="/home">Redirect to home</RouterLink>
  <RouterLink to="/home-alias">Home alias</RouterLink>
  <RouterLink to="/login" @click="logout()">Logout</RouterLink>
  <RouterLink :to="{name: 'userparent', params:{user:'thekid', id: 114}}">User</RouterLink>
  <RouterLink to="/verify-code">VerifyCode</RouterLink>
  <RouterLink to="/store">Store</RouterLink>
  <RouterView name="About1"></RouterView>
  <RouterView name="About2"></RouterView>
  <RouterView></RouterView>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from './stores/store';
const logout = () => {
  const Auth = useAuthStore();
  Auth.isAuthenticated = false;
}
</script>