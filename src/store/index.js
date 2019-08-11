// services
import { Service } from "@/services";
const { API } = Service;
// constants
import {
  ORDER_TYPE_MUTATION,
  ORDER_TYPE_DEFAULT,
  CAR_INITIAL_LIST_ACTION,
  CAR_INITIAL_LIST_MUTATION,
  CAR_FILTRED_LIST_MUTATION,
  CAR_RESET_FILTRED_LIST_MUTATION,
  CAR_FILTRED_LIST_ACTION,
  INIT_USER_GEO_MUTATION,
  INIT_USER_GEO_ACTION,
  MAP_MUTATION
} from "./constants";

export default {
  state: {
    order: {
      type: ORDER_TYPE_DEFAULT
    },
    // TODO: merge cars related data to one structure
    cars: null,
    initialCars: null,
    filtredCars: null,
    user: {
      position: {
        lat: null,
        lng: null
      }
    },
    map: null
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
      state.initialCars = [...state.cars];
    },
    [CAR_FILTRED_LIST_MUTATION](state, payload) {
      if (!payload || !payload.filtredCars) return;
      state.cars = payload.filtredCars;
    },
    [CAR_RESET_FILTRED_LIST_MUTATION](state) {
      state.cars = state.initialCars;
    },
    [INIT_USER_GEO_MUTATION](state, payload) {
      state.user.position = payload.position;
    },
    [MAP_MUTATION](state, payload) {
      state.map = payload.map;
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
      let filtredCars = [...state.initialCars];
      filtredCars = filtredCars.filter(
        car => car.id.indexOf(payload.orderId) !== -1
      );
      commit({
        type: CAR_FILTRED_LIST_MUTATION,
        filtredCars
      });
    },
    [INIT_USER_GEO_ACTION]({ commit }, payload) {
      // checking of position keys
      commit({
        type: INIT_USER_GEO_MUTATION,
        position: payload.position
      });

      commit({
        type: MAP_MUTATION,
        map: payload.map
      });
    }
  },
  getters: {
    getOrderType(state) {
      return state.order.type;
    },
    getCarList(state) {
      return state.cars;
    },
    getUser(state) {
      return state.user;
    },
    getMap(state) {
      return state.map;
    }
  }
};
