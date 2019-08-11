<template>
  <div class="my-position">
    <div class="additional-header">
      <h4 class="additional-header__title">{{ content.title }}</h4>
    </div>
    <v-container grid-list-md text-center>
      <v-layout wrap>
        <v-flex md4>
          Lat: {{ getUser.position.lat }}
          <br />
          Lng: {{ getUser.position.lng }}
        </v-flex>
        <v-flex md4>
          <v-btn class="managment-action" @click="geolocate()">
            {{ content.reInitPosition }}
          </v-btn>
          <v-btn class="managment-action" @click="emulateCars()">
            {{ content.emulateCars }}
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { CAR_INITIAL_LIST_MUTATION } from "@/store/constants";
import { Service } from "@/services";
const {
  Content: { additionalContent },
  Geolocation,
  API
} = Service;

export default {
  data() {
    return {
      content: additionalContent
    };
  },
  computed: {
    ...mapGetters(["getUser", "getMap"])
  },
  methods: {
    geolocate() {
      let map = this.getMap || {};
      Geolocation.getCurrentPosition(map, {
        store: this.$store
      });
    },
    emulateCars() {
      if (!confirm("Remove list of cars and create new 50 cars")) return;
      localStorage.removeItem("cars");

      API.fetch("/emulate", {
        method: "POST",
        body: {
          position: this.getUser.position,
          size: 50
        }
      }).then(this.initCarsAfterEmulation);
    },
    initCarsAfterEmulation(cars) {
      this.$store.commit({
        type: CAR_INITIAL_LIST_MUTATION,
        cars
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.my-position {
  color: black;
}

.additional-header {
  padding: 10px;

  &__title {
    text-align: center;
  }
}

.managment-action {
  margin: 0 10px 10px;
}
</style>
