<template>
  <div class="order-view">
    <div class="actions-bar">
      <div class="actions-wrapper">
        <transition name="fade">
          <v-text-field
            v-if="getOrderType == 'id'"
            v-model="orderId"
            class="action-text-field"
            placeholder="6782"
            :counter="4"
            maxlength="4"
            hint="2-4 symbols"
            @input="onInputId()"
          ></v-text-field>
        </transition>
        <v-btn :class="['action-btn', 'by-id']" @click="onChangeType('id')">
          {{ content.actions.byId }}
        </v-btn>
        <v-btn :class="['action-btn', 'on-map']" @click="onChangeType('map')">
          {{ content.actions.onMap }}
        </v-btn>
      </div>
    </div>
    <div class="action-view">
      <div class="action-view__list">
        <div class="car-list">
          <div v-for="(item, key) in getCarList" :key="item.id">
            {{ key }} - {{ item.info.brand }}
          </div>
        </div>
      </div>
      <div class="action-view__area">
        <div id="map">
          Map
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { orderContent } from "@/services/Content.serivce.js";
import {
  ORDER_TYPE_MUTATION,
  CAR_INITIAL_LIST_ACTION,
  CAR_FILTRED_LIST_ACTION,
  CAR_RESET_FILTRED_LIST_MUTATION
} from "@/store/constants";

export default {
  data() {
    return {
      orderId: "",
      content: orderContent
    };
  },
  computed: {
    getOrderType() {
      return this.$store.getters.getOrderType;
    },
    ...mapGetters(["getCarList"])
  },
  created() {
    this.$store.dispatch({
      type: CAR_INITIAL_LIST_ACTION
    });
  },
  methods: {
    onChangeType(type) {
      this.$store.commit({
        type: ORDER_TYPE_MUTATION,
        newType: type
      });
    },
    onInputId() {
      if (this.orderId.length < 2) {
        this.$store.commit({
          type: CAR_RESET_FILTRED_LIST_MUTATION
        });
        return;
      }
      this.$store.dispatch({
        type: CAR_FILTRED_LIST_ACTION,
        orderId: this.orderId
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~global";

.order-view {
  min-height: 500px;
  height: 75%;
}

.actions-bar {
  display: flex;
  justify-content: center;
}

.action-btn {
  margin: 10px;
}

.actions-wrapper {
  display: flex;
  position: relative;
}

.action-text-field {
  position: absolute;
  left: -45%;
  top: 0;
  padding-top: 8px;
  max-width: 80px;
}

.action-view {
  width: 90%;
  margin: 50px auto;
  height: 100%;
  display: flex;

  &__list {
    height: 100%;
    width: 180px;
    border: 2px solid $color-tile-order;
    border-right-width: 1px;
    border-radius: 15px 0 0 15px;
  }

  &__area {
    height: 100%;
    border: 2px solid $color-tile-order;
    border-radius: 0 15px 15px 0;
    border-left-width: 1px;
    width: 100%;
  }
}
</style>
