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
            @keyup.enter="onEnter(orderId)"
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
          <transition-group name="filter-cars" tag="div">
            <div
              v-for="item in getCarList"
              :key="item.id"
              ref="carList"
              class="car-item"
              :class="{ 'search-active': item.id === activeCar.id }"
              :title="item.id"
              @click="onClickCarItem(item.id)"
            >
              <img
                class="car-item__image"
                :src="getImgUrl(item.info.brand)"
                alt="model"
              />
              {{ item.info.model }}
              <span class="car-item__id">{{ item.id }}</span>
            </div>
          </transition-group>
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
      content: orderContent,
      activeCar: {
        id: 10,
        info: {}
      },
      carListUnWatch: null
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

    this.$store.subscribe(mutation => {
      switch (mutation.type) {
        case CAR_RESET_FILTRED_LIST_MUTATION:
          // need for scrolling after Enter event in input
          this.$nextTick(() => this.carListUnWatch && this.carListUnWatch());
          return;
      }
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
    },
    getImgUrl(name) {
      var images = require.context("../assets/cars_logo/", false, /\.png$/);
      return images("./" + name.toLowerCase() + ".png");
    },
    onEnter(id) {
      let filtredList = this.getCarList;
      if (!filtredList.length) return;
      let positionInList = this.setActiveCar(id);

      this.carListUnWatch = this.$watch("getCarList", function() {
        this.$refs.carList[positionInList].scrollIntoView();
      });

      this.orderId = "";
      this.$store.commit({
        type: CAR_RESET_FILTRED_LIST_MUTATION
      });
    },
    onClickCarItem(id) {
      this.setActiveCar(id);
      this.orderId = "";
    },
    setActiveCar(id) {
      let filtredList = this.getCarList;

      for (let i = 0; i < filtredList.length; i++) {
        if (filtredList[i].id === id) {
          this.activeCar.id = id;
          this.activeCar.info = filtredList[i].info;
          return i; // position car in list
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~global";

.order-view {
  min-height: 350px;
  max-height: 350px;
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

    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-track {
      background: #ddd;
    }

    &::-webkit-scrollbar-thumb {
      background: #666; 
    }
  }

  &__area {
    height: 100%;
    border: 2px solid $color-tile-order;
    border-radius: 0 15px 15px 0;
    border-left-width: 1px;
    width: 100%;
  }
}

.car-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 10px 5px;
  transition: 0.2s;
  user-select: none;

  &:first-child {
    border-top-left-radius: 13px;
  }

  &.search-active {
    background-color: $color-light-grey;

    & + .car-item:hover {
      @include shadow-between-items;
    }
  }

  &__image {
    width: 20px;
    height: 20px;
    margin: 0 10px;
  }

  &__id {
    margin-left: auto;
    font-size: 10px;
    color: $color-light-grey;
  }

  &:hover {
    background-color: $color-light-grey;

    & + .search-active {
      @include shadow-between-items;
    }
  }
}
</style>
