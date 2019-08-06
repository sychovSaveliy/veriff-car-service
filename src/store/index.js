// services
import API from "@/services/API.service.js";

// constants
import {
  ORDER_TYPE_MUTATION,
  ORDER_TYPE_DEFAULT,
  CAR_INITIAL_LIST_ACTION,
  CAR_INITIAL_LIST_MUTATION,
  CAR_FILTRED_LIST_MUTATION,
  CAR_RESET_FILTRED_LIST_MUTATION,
  CAR_FILTRED_LIST_ACTION
} from "./constants";

export default {
  state: {
    order: {
      type: ORDER_TYPE_DEFAULT
    },
    // TODO: merge cars related data to one structure
    cars: null,
    initialCars: null,
    filtredCars: null
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
      state.initialCars = Object.assign({}, state.cars);
    },
    [CAR_FILTRED_LIST_MUTATION](state, payload) {
      if (!payload || !payload.filtredCars) return;
      state.cars = payload.filtredCars;
    },
    [CAR_RESET_FILTRED_LIST_MUTATION](state) {
      state.cars = state.initialCars;
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
    },
    [CAR_FILTRED_LIST_ACTION]({ commit, state }, payload) {
      let filtredCars = Object.assign({}, state.initialCars);
      for (let id in filtredCars) {
        if (id.indexOf(payload.orderId) === -1) {
          delete filtredCars[id];
        }
      }

      commit({
        type: CAR_FILTRED_LIST_MUTATION,
        filtredCars
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
