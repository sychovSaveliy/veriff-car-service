import store from "../store";
export default function accessToRoute(type) {
  return (to, from, next) => {
    if (store.state.rentedCar && type === "order") {
      return next(false);
    }

    if (!store.state.rentedCar && type === "return") {
      return next(false);
    }

    next();
  };
}
