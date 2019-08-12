import * as API from "./API.service.js";
import * as Content from "./Content.service.js";
import * as Geolocation from "./Geolocation.service.js";
import * as Time from "./Time.service.js";

export function getImgUrl(name) {
  var images = require.context("../assets/cars_logo/", false, /\.png$/);
  return images("./" + name.toLowerCase() + ".png");
}

export const Service = { API, Content, Geolocation, Time };
