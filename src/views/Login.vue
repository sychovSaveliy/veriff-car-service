<template>
  <div class="login-view">
    <v-container text-center>
      <v-flex sm4 offset-sm4>
        <v-card id="veriff-root" :class="{ 'in-progress': inProgress }">
          <v-progress-circular
            class="progress-circular"
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-card>
      </v-flex>
    </v-container>
    <v-container text-center>
      <v-flex sm4 offset-sm4>
        <v-breadcrumbs v-if="statusList" :items="statusList" divider="-" />
      </v-flex>
    </v-container>
    <!-- <v-btn @click="onSessionsDecision()">{{ type }}</v-btn>
    <v-flex sm1>
      <v-text-field v-model="type"></v-text-field>
    </v-flex>
    <v-btn @click="onWebhook()">Webhook</v-btn> -->
  </div>
</template>

<script>
import { Service } from "@/services";
import { PATH_HOME } from "../router";
const { API } = Service;

export default {
  data() {
    return {
      sessionId: null,
      // TODO: Need move to /configs endpoint
      configs: {
        API_KEY: null,
        API_URL: null,
        API_SECRET: null,
        env: null
      },
      type: "decision",
      veriffConfig: {},
      ws: null,
      inProgress: false,
      statusList: []
    };
  },
  created() {
    this.ws = new WebSocket("wss://veriff-web-hook.herokuapp.com/");
    this.ws.onopen = function() {
      console.log("WS open");
    };
    this.ws.onclose = function(eventclose) {
      console.log("ws closed: " + eventclose);
    };
    this.ws.onmessage = this.onWsMessage;
  },
  mounted() {
    API.fetch("/configs")
      .then(({ API_KEY, API_URL, API_SECRET, env }) => {
        this.configs.API_KEY = API_KEY;
        this.configs.API_URL = API_URL;
        this.configs.API_SECRET = API_SECRET;
        this.configs.env = env;
      })
      .then(() => {
        this.veriffConfig = {
          env: this.configs.env,
          apiKey: this.configs.API_KEY,
          parentId: "veriff-root",
          onSession: (err, resp) => {
            this.sessionId = resp.verification.id;
            this.status = resp.verification.status;
            window.open(resp.verification.url);
            this.inProgress = true;
          }
        };

        window.Veriff &&
          window.Veriff(this.veriffConfig).mount({
            submitBtnText: "Veriff Me",
            loadingText: "Please wait..."
          });
      });
  },
  methods: {
    onWsMessage(response) {
      let verificationData =
        response && response.data && JSON.parse(response.data);
      this.statusList.push({
        text: verificationData.action || verificationData.success,
        disabled: true
      });
      console.log(verificationData);
      if (
        verificationData &&
        verificationData.verification &&
        verificationData.verification.status === "approved"
      ) {
        localStorage.setItem(
          "jwt",
          verificationData.verification && verificationData.verification.id
        );

        this.$router.push(PATH_HOME);
      }
    }
  }
};
</script>

<style lang="scss">
#veriff-root {
  .veriff-container {
    width: 100%;
    height: 100%;
    padding: 10px;
  }

  .veriff-text {
    text-align: center;
  }

  .progress-circular {
    display: none;
    position: absolute;
    left: calc(50% - 16px);
    top: calc(50% - 16px);
    z-index: 2;
  }

  &.in-progress {
    position: relative;
    &:after {
      content: "";
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background-color: rgba(0, 0, 0, 0.7);
    }

    .progress-circular {
      display: block;
    }
  }
}
</style>
