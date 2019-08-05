import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import log from "./middleware/log";
import auth from "./middleware/auth";
import Choosing from './components/Choosing.vue';
import OrderCar from './components/OrderCar.vue';
import ReturnCar from './components/ReturnCar.vue';

export const PATH_HOME = "/";
export const PATH_LOGIN = "/login";
export const PATH_ORDER_CAR = "/order";
export const PATH_RETURN_CAR = "/return";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: PATH_HOME,
      name: "home",
      component: Home,
      meta: {
        middleware: [log, auth]
      },
      children: [
        {
          path: PATH_HOME, component: Choosing, name: 'home'
        },
        {
          path: PATH_ORDER_CAR, component: OrderCar, name: 'order'
        },
        {
          path: PATH_RETURN_CAR, component: ReturnCar, name: 'return'
        }
      ]
    },
    {
      path: PATH_LOGIN,
      name: "login",
      component: Login,
      meta: {
        middleware: [log]
      }
    }
  ]
});

function nextFactory(context, middleware, index) {
  const subsequentMiddleware = middleware[index];
  if (!subsequentMiddleware) return context.next;

  return (...parameters) => {
    context.next(...parameters);
    const nextMiddleware = nextFactory(context, middleware, index + 1);
    subsequentMiddleware({
      ...context,
      next: nextMiddleware
    });
  };
}

router.beforeEach((to, from, next) => {
  if (to.meta.middleware) {
    const middleware = Array.isArray(to.meta.middleware)
      ? to.meta.middleware
      : [to.meta.middleware];

    const context = {
      from,
      next,
      router,
      to
    };
    const nextMiddleware = nextFactory(context, middleware, 1);

    return middleware[0]({
      ...context,
      next: nextMiddleware
    });
  }

  return next();
});

export default router;
