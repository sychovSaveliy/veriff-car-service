<template>
  <v-app>
    <v-app-bar app>
      <v-container class="app-bar">
        <span class="title" @click="onClickLogo">
          Car rental service<span v-if="getRentedCar" class="font-weight-black">
            | {{ getRentedCar.info.model }} in your hands!
          </span>
        </span>
        <transition name="fade">
          <span
            v-if="currentPage.className != 'home'"
            class="current-page-tab"
            :class="currentPage.className"
          >
            {{ currentPage.text }}
          </span>
        </transition>
      </v-container>
    </v-app-bar>
    <v-content>
      <router-view></router-view>
      <MyPosition />
    </v-content>
  </v-app>
</template>

<script>
import { PATH_HOME } from "../router";
import { mapGetters } from "vuex";
import { Service } from "@/services";
const {
  Content: { choosingContent }
} = Service;

import MyPosition from "@/components/MyPosition.vue";
export default {
  components: {
    MyPosition
  },
  data() {
    return {
      currentPage: this.switchPath()
    };
  },
  computed: {
    ...mapGetters(["getRentedCar"])
  },
  watch: {
    $route() {
      this.currentPage = this.switchPath();
    }
  },
  methods: {
    onClickLogo() {
      this.$router.push(PATH_HOME);
    },
    switchPath() {
      switch (this.$router.history.current.name) {
        case "home":
          return {
            className: "home",
            text: ""
          };
        case "order":
          return {
            className: "order",
            text: choosingContent.orderTitle
          };
        case "return":
          return {
            className: "return",
            text: choosingContent.returnTitle
          };
      }
    }
  }
};
</script>
<style lang="scss">
@import "~global";
.app-bar {
  display: flex;
  justify-content: center;
}

.title {
  cursor: pointer;
  margin-right: auto;
  user-select: none;
}

.current-page-tab {
  margin-left: auto;
  color: $color-white;
  padding: 4px 40px;
  border-radius: 15px;
  text-transform: uppercase;
  font-weight: bold;

  &.order {
    background-color: $color-tile-order;
  }

  &.return {
    background-color: $color-tile-return;
  }
}
</style>
