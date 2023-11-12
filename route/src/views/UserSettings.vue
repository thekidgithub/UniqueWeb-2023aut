<template>
  <h2>UserSettings</h2>

  <UserSettingsNav />
  <RouterView></RouterView>
  <RouterView name="PasswordSetting"></RouterView>
  <RouterView name="PasswordConfirm"></RouterView>
</template>

<script>
import UserSettingsNav from "./UserSettingsNav.vue";
export default {
  components: { UserSettingsNav },
};
</script>