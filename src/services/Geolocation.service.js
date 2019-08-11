import { INIT_USER_GEO_ACTION } from "../store/constants.js";
import { getImgUrl } from "@/services";

export function getCurrentPosition(map, { store }) {
  navigator.geolocation.getCurrentPosition(position => {
    const coords = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    map.center = coords;

    map.markers.push({
      position: coords,
      icon: getImgUrl("user")
    });

    store.dispatch({
      type: INIT_USER_GEO_ACTION,
      position: coords,
      map
    });
  });
}

export function addMarker({ map, position, title, id, handler = () => {} }) {
  const marker = {
    position: {
      lat: parseFloat(position.lat),
      lng: parseFloat(position.lng)
    },
    icon: getImgUrl("car"),
    title: title || undefined,
    onClick() {
      handler(id);
    }
  };

  map.markers.push(marker);
}

export function defineNearestRoads(cars) {
  let points = `${cars
    .map(car => `${car.position.lat},${car.position.lng}`)
    .join("|")}`;
  if (!points) return Promise.resolve(cars);
  return fetch(
    `https://roads.googleapis.com/v1/nearestRoads?points=${points}&key=AIzaSyBBhRndXNS_Cku1RAnv5w5ggGbkbK7Zn1Q`
  )
    .then(resp => resp.json())
    .then(resp => {
      resp &&
        resp.snappedPoints &&
        resp.snappedPoints.forEach(item => {
          cars[item.originalIndex].position.lat = item.location.latitude;
          cars[item.originalIndex].position.lng = item.location.longitude;
          cars[item.originalIndex].status = "ready";
        });
      return cars.filter(car => car.status);
    });
}
