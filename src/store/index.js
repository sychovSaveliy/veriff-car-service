import {ORDER_TYPE_MUTATION, ORDER_TYPE_DEFAULT} from './constants';

export default {
    state: {
        order: {
        type: ORDER_TYPE_DEFAULT
        }
    },
    mutations: {
        [ORDER_TYPE_MUTATION](state, payload) {
            state.order.type = payload.newType;
        }
    },
    actions: {},
    getters: {
        getOrderType(state){
            return state.order.type;
        }
    }
};