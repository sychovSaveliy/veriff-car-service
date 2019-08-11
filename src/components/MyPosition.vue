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
          <v-btn @click="geolocate()">
            {{ content.reInitPosition }}
          </v-btn>
        </v-flex>
        <v-flex md4>
          {{ getMap }}
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Service } from "@/services";
const {
  Content: { additionalContent },
  Geolocation
} = Service;

export default {
  data() {
    return {
      content: additionalContent,
      position: {}
    };
  },
  computed: {
    ...mapGetters(["getUser", "getMap"])
  },
  methods: {
    applyPosition(position) {
      this.position = position;
    },
    geolocate() {
      let map = this.getMap;
      map.markers = [];
      Geolocation.getCurrentPosition(this.getMap, {
        store: this.$store
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
</style>
