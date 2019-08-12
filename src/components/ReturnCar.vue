<template>
  <div class="return-car" :class="{ 'is-freeze': isFreezeState }">
    <v-flex class="retur-car__container" md6 offset-md3>
      <v-card>
        <v-card-title class="overline">{{ content.title }}</v-card-title>
        <v-card-text class="black--text">
          <v-container grid-list-sm>
            <v-layout align-end wrap>
              <v-flex sm6>
                <div class="headline mb-2">
                  {{ getRentedCar.info.brand }}
                  {{ getRentedCar.info.model }}
                  {{ getRentedCar.info.year }}
                </div>
                <div>
                  <div class="headline">
                    {{ content.start }}
                    {{ getTimeString(getUTC) }}
                  </div>
                  <div class="headline">
                    {{ content.now }}
                    {{ getTimeString(currentTime) }}
                  </div>
                </div>
              </v-flex>
              <v-flex sm6>
                <div class="headline">
                  {{ content.diffInHours }}
                  {{ getDiffInHours }}h
                </div>
              </v-flex>
              <v-flex sm12>
                <div class="headline">
                  {{ content.cost }}
                  {{ getCost }}$
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="onActionCard(true)">{{ content.returnBtn }}</v-btn>
          <v-btn v-if="isFreezeState" @click="onActionCard(false)">{{ content.continueBtn }}</v-btn>
          <v-btn v-if="isFreezeState" @click="onPay()">{{ content.payBtn }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    <div>
      <v-container>
        <v-flex sm1 offset-sm-3>
          <v-text-field v-model="priceHour" label="Cost per 1 hour"></v-text-field>
        </v-flex>
      </v-container>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Service } from "@/services";
import { setInterval } from "timers";
import {
  FREEZE_RENTED_CAR_MUTATION,
  CLEAR_RENTED_CAR_MUTATION
} from "@/store/constants";
import { PATH_HOME } from "../router";
const {
  Content: { returnContent },
  Time
} = Service;

export default {
  data() {
    return {
      content: returnContent,
      currentTime: Time.getTime(),
      priceHour: 2
    };
  },
  computed: {
    ...mapGetters(["getRentedCar", "isFreezeState"]),
    getUTC() {
      return Time.getTime(this.getRentedCar.startTime);
    },
    getDiffInHours() {
      let startTime = this.getRentedCar.startTime;
      let currentTime = this.currentTime;

      return Time.diffBetweenTimestamp(startTime, currentTime).toFixed(4);
    },
    getCost() {
      return (this.getDiffInHours * this.priceHour).toFixed(2);
    }
  },
  created() {
    setInterval(() => {
      if (this.isFreezeState) return;
      this.currentTime = Time.getTime();
    }, 1000);
  },
  methods: {
    getTimeString(time) {
      if (typeof time === "number") {
        time = new Date(time);
      }
      const day = time.getDate();
      const month = time.getMonth();

      let hours = time.getHours();
      let minutes = time.getMinutes();
      let seconds = time.getSeconds();

      hours = hours < 10 ? `0${hours}` : hours;
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      return `${day}/${month} - ${hours}:${minutes}:${seconds}`;
    },
    onActionCard(freeze) {
      this.$store.commit({
        type: FREEZE_RENTED_CAR_MUTATION,
        freeze
      });
    },
    onPay() {
      console.log("start payment flow");
      this.$store.commit({
        type: FREEZE_RENTED_CAR_MUTATION,
        freeze: false
      });
      this.$store.commit({
        type: CLEAR_RENTED_CAR_MUTATION
      });
      this.$router.push(PATH_HOME);
    }
  }
};
</script>

<style lang="scss" scoped>
.return-car {
  height: 100%;
  padding-top: 20px;
}

.is-freeze {
  .v-card {
    background-color: rgba(66, 87, 63, 0.3);
  }
}
</style>
