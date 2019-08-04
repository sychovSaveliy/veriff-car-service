<template>
  <div class="login-view">
    Login
  </div>
</template>

<script>
export default {
  created() {
    localStorage.setItem("jwt", "mock");
  }
};
</script>

<style lang="sass" scoped></style>
