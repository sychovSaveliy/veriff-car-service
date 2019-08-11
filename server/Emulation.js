/*
    Car Entity
    {
        "id": "1234",
        "position": {
            "lang": "",
            "lat": ""
        },
        "info": {
            "brand": "Toyota",
            "model": "Corolla",
            "year": "2006",
            "seats": "5"
        }
    }

*/

const { emulationList } = require("./constants");

function getRand(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function EmulateCars(size, userPosition) {
  let list = new Array(size || 50);
  let startId = getRand(1000, 9999); // 4 digits number
  let brandsSize = emulationList.length;
  let langStep = 0.025; // points
  let latStep = 0.015; // points

  for (let i = 0; i < list.length; i++) {
    let selectedBrand = emulationList[getRand(0, brandsSize)];

    let modelsSize = selectedBrand.models.length;
    let selectedModel = selectedBrand.models[getRand(0, modelsSize)];

    list[i] = {
      id: String(startId++),
      position: {
        lng:
          userPosition.lng +
          getRand(-langStep * 1000, 2 * langStep * 1000) / 1000,
        lat:
          userPosition.lat + getRand(-latStep * 1000, 2 * latStep * 1000) / 1000
      },
      info: {
        brand: selectedBrand.brand,
        model: selectedModel.model,
        year: getRand(2003, 2010),
        seats: selectedModel.seats
      }
    };
  }

  return list;
}

module.exports = {
  EmulateCars
};
