<template>
  <div class="login-view">
    <v-container text-center>
      <v-flex sm4 offset-sm4>
        <v-card id="veriff-root"></v-card>
      </v-flex>
    </v-container>
    <v-btn @click="onSessionsDecision()">{{ type }}</v-btn>
    <v-flex sm1>
      <v-text-field v-model="type"></v-text-field>
    </v-flex>
    <v-btn @click="onWebhook()">Webhook</v-btn>
  </div>
</template>

<script>
import { Service } from "@/services";
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
      ws: null
    };
  },
  created() {
    this.ws = new WebSocket("ws://localhost:7272");
    this.ws.onopen = function() {
      console.log('WS подключенно')
    };
    this.ws.onclose = function(eventclose) {
      console.log('соеденение закрыто причина: ' + this.eventclose)
    };
    this.ws.onmessage = function(msg) {
      console.log(msg);
    };
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
          callbackUrl: "http://localhost:8080",
          onSession: (err, resp) => {
            this.sessionId = resp.verification.id;
            this.status = resp.verification.status;
            window.open(resp.verification.url);
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
    onSessionsDecision() {
      API.fetch("/veriff/api", {
        method: "POST",
        body: {
          API_TOKEN: this.configs.API_KEY,
          API_SECRET: this.configs.API_SECRET,
          sessionId: this.sessionId,
          status: this.status,
          endpoint: this.type
        }
      }).then(({ response }) => {
        if (response.status !== "success") return;

        localStorage.setItem(
          "jwt",
          response.verification && response.verification.sessionToken
        );
      });
    },
    onWebhook() {
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
}
</style>
