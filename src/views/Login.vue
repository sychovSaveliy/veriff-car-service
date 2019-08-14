<template>
  <div class="login-view">
    <v-container text-center>
      <v-flex sm4 offset-sm4>
        <v-btn @click="changeForm()">
          {{ typeOfFormSwitcherText }}
        </v-btn>
        <v-divider class="login-view__divider"></v-divider>
        <v-card
          v-show="formSignUp"
          id="veriff-root"
          :class="{ 'in-progress': inProgress }"
        >
          <v-card-text>
            {{ content.signUp }}
          </v-card-text>
          <v-progress-circular
            class="progress-circular"
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-card>
        <v-card v-show="!formSignUp" class="sign-in">
          <v-form v-model="form.validSignIn">
            <v-text-field
              v-model="form.emailSignIn"
              :rules="form.emailRules"
              label="E-mail"
              required
            ></v-text-field>

            <button class="veriff-submit" @click="onSignIn($event)">
              {{ content.signIn }}
            </button>
          </v-form>
        </v-card>
      </v-flex>
    </v-container>
    <v-container text-center>
      <v-flex sm4 offset-sm4>
        <v-breadcrumbs v-if="statusList" :items="statusList" divider="-" />
        <v-card v-show="emailAfterSignUp" class="sign-up">
          <v-form v-model="form.validSignUp">
            <v-text-field
              v-model="form.emailSignUp"
              :rules="form.emailRules"
              label="E-mail"
              required
            ></v-text-field>

            <button class="veriff-submit" @click="onSignUp($event)">
              {{ content.signIn }}
            </button>
          </v-form>
        </v-card>
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
const {
  API,
  Content: { loginContent }
} = Service;

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
      statusList: [],
      formSignUp: true,
      content: loginContent,
      form: {
        validSignIn: false,
        validSignUp: false,
        emailSignIn: "",
        emailSignUp: "",
        emailRules: [
          v => !!v || "E-mail is required",
          v => /.+@.+/.test(v) || "E-mail must be valid"
        ],
        verificationId: null
      },
      emailAfterSignUp: false
    };
  },
  computed: {
    typeOfFormSwitcherText() {
      return this.formSignUp ? this.content.signIn : this.content.signUp;
    }
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
      console.log("hook:", verificationData);
      if (
        verificationData &&
        verificationData.verification &&
        verificationData.verification.status === "approved"
      ) {
        this.emailAfterSignUp = true;

        this.form.verificationId =
          verificationData.verification && verificationData.verification.id;
        // this.$router.push(PATH_HOME);
      }
    },
    bindTokenToUser(token = this.form.verificationId) {
      localStorage.setItem("jwt", token);
      API.fetch("/signup", {
        method: "POST",
        body: {
          token,
          email: this.form.emailSignUp
        }
      }).then(() => {
        this.$router.push(PATH_HOME);
      });
    },
    changeForm() {
      this.formSignUp = !this.formSignUp;
    },
    onSignIn(event) {
      event.preventDefault();
      if (!this.form.validSignIn) return;

      API.fetch("/signin", {
        method: "POST",
        body: {
          email: this.form.emailSignIn
        }
      }).then(resp => {
        if (resp && resp.token) {
          localStorage.setItem("jwt", resp.token);
          this.$router.push(PATH_HOME);
        }
      });
    },
    onSignUp(event) {
      event.preventDefault();
      if (!this.form.validSignUp) return;

      this.bindTokenToUser();
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
    margin-top: 0;
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

.login-view {
  &__divider {
    margin: 10px 0;
  }
}

.sign-in,
.sign-up {
  padding: 10px;
}
</style>
