<template>
  <div class="choosing">
    <div class="choosing-tile order" @click="onClickOrder">
      <span>{{ content.orderTitle }}</span>
    </div>
    <div class="choosing-tile return" @click="onClickReturn">
      <span>{{ content.returnTitle }}</span>
    </div>
  </div>
</template>

<script>
import { Service } from "@/services";
const {
  Content: { choosingContent }
} = Service;
import { PATH_ORDER_CAR, PATH_RETURN_CAR } from "../router";

export default {
  data() {
    return {
      content: choosingContent
    };
  },
  methods: {
    onClickOrder() {
      this.$router.push(PATH_ORDER_CAR);
    },
    onClickReturn() {
      this.$router.push(PATH_RETURN_CAR);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~global";

.choosing {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  padding-top: 30px;
  user-select: none;

  &-tile {
    width: 300px;
    height: 200px;
    border-radius: 15px;
    margin: 0 40px;
    color: $color-white;
    text-transform: uppercase;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    cursor: pointer;
    transition: box-shadow 0.1s, font-size 0.2s 1s;

    &:hover {
      box-shadow: 0px 0px 20px grey inset;
      font-size: 42px;
    }

    &.order {
      background-color: $color-tile-order;
    }

    &.return {
      background-color: $color-tile-return;
    }
  }
}
</style>
