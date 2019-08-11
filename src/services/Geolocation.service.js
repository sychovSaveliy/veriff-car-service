import { INIT_USER_GEO_ACTION } from "../store/constants.js";

function getCurrentPosition(map, { store, getImgUrl }) {
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
      position: coords
    });
  });
}

function setMarker(){

}

export default {
  getCurrentPosition,
  setMarker
};
