import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('Auth', () => {
  const isAuthenticated = ref(false);

  function login() {
    isAuthenticated.value = true;
  }

  function logout() {
    isAuthenticated.value = false;
  }

  return {isAuthenticated, login, logout};
})

export const useCountStore = defineStore('Count', {
  state: () => {
    return {
      count: 0
    };
  },
  getters: {
    doubleCount(state) {
      return state.count * 2;
    }
  },
  actions: {
    increment() {
      this.count++;
    }
  }
})
