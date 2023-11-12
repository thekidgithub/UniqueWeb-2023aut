<template>
  <h1>Hello,id: {{ $route.params.id }},{{ $route.params.user }}</h1>
  <RouterLink :to="{name: 'userhome'}">UserHome</RouterLink>
  <RouterLink to="/thekid/114/profile">UserProfile</RouterLink>
  <RouterLink to="/thekid/114/settings">UserSettings</RouterLink>
  <RouterView></RouterView>
</template>
