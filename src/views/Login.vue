<template>
  <div class="login-view">
    <v-container text-center>
      <v-flex sm4 offset-sm4>
        <v-card id="veriff-root"></v-card>
      </v-flex>
    </v-container>
    <v-btn @click="onSessionsDecision()">{{ type }}</v-btn>
    <v-text-field v-model="type"></v-text-field>
  </div>
</template>

<script>
import { Service } from "@/services";
const { API } = Service;
const API_URL = "https://api.veriff.me/v1";

export default {
  data() {
    return {
      sessionId: null,
      apiKey: "2b257fd2-7a85-4be4-a8e3-5a455cb9b036",
      apiUrl: "https://api.veriff.me/v1",
      apiSecret: "1ad0d3b1-b36b-42bc-98a1-6824c51ee8a6",
      type: "decision"
    };
  },
  mounted() {
    window.Veriff &&
      window
        .Veriff({
          env: "production",
          apiKey: this.apiKey,
          parentId: "veriff-root",
          callbackUrl: "http://localhost:8080",
          onSession: (err, resp) => {
            this.sessionId = resp.verification.id;
            this.status = resp.verification.status;
            window.open(resp.verification.url);
          }
        })
        .mount({
          submitBtnText: "Veriff Me",
          loadingText: "Please wait..."
        });
  },
  methods: {
    onSessionsDecision() {
      API.fetch("/veriff/api", {
        method: "POST",
        body: {
          API_TOKEN: this.apiKey,
          API_SECRET: this.apiSecret,
          sessionId: this.sessionId,
          status: this.status,
          endpoint: this.type
        }
      }).then(({ response }) => {
        if (response.status !== "success") return;

        localStorage.setItem("jwt", response.verification.sessionToken);
      });
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
