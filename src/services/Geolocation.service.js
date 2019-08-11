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

export function addMarker(map) {
  if (map.currentPlace) {
    const marker = {
      position: {
        lat: map.currentPlace.geometry.location.lat(),
        lng: map.currentPlace.geometry.location.lng()
      },
      icon: getImgUrl("car")
    };
    map.markers.push(marker);
    map.places.push(map.currentPlace);
    map.center = marker.position;
    map.currentPlace = null;
  }
}
