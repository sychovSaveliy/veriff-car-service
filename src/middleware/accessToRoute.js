import store from "../store";
export default function accessToRoute(to, from, next) {
  if (store.state.rentedCar) {
    return next(false);
  }

  next();
}
