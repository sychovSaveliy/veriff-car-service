<template>
  <div class="my-position">
    <div class="additional-header">
      <h4 class="additional-header__title">{{ content.title }}</h4>
    </div>
    Lat: {{ getUser.position.lat }}
    <br />
    Lng: {{ getUser.position.lng }}
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { additionalContent } from "@/services/Content.service.js";

export default {
  data() {
    return {
      content: additionalContent,
      position: {}
    };
  },
  computed: {
    ...mapGetters(["getUser"])
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

.additional-header {
  padding: 10px;

  &__title {
    text-align: center;
  }
}
</style>
