// services
import API from "@/services/API.service.js";

// constants
import {
  ORDER_TYPE_MUTATION,
  ORDER_TYPE_DEFAULT,
  CAR_INITIAL_LIST_ACTION,
  CAR_INITIAL_LIST_MUTATION
} from "./constants";

export default {
  state: {
    order: {
      type: ORDER_TYPE_DEFAULT
    },
    cars: null
  },
  mutations: {
    [ORDER_TYPE_MUTATION](state, payload) {
      state.order.type = payload.newType;
    },
    [CAR_INITIAL_LIST_MUTATION](state, payload) {
      if (!payload || !payload.cars) {
        return console.warn("Invalid cars list: ", payload.cars);
      }
      state.cars = payload.cars;
    }
  },
  actions: {
    [CAR_INITIAL_LIST_ACTION]({ commit, state }) {
      if (state.cars) return;

      API.fetch("/cars").then(resp => {
        commit({
          type: CAR_INITIAL_LIST_MUTATION,
          cars: resp && resp.data && resp.data.cars
        });
      });
    }
  },
  getters: {
    getOrderType(state) {
      return state.order.type;
    },
    getCarList(state) {
      return state.cars;
    }
  }
};
