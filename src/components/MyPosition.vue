<template>
  <div class="my-position">
    My Position
  </div>
</template>

<script>
export default {
  data() {
    return {
      position: {}
    };
  },
  methods: {
    applyPosition(position) {
      this.position = position;
    }
  }
};
</script>

<style lang="scss" scoped>
.my-position {
  color: black;
}
</style>
