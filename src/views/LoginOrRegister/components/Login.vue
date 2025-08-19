<template>
  <v-card width="542" class="login-card">
    <!-- 關閉鈕 -->
    <v-btn @click="closeDialog" icon absolute style="top: 36px; right: 36px;">
      <v-icon style="font-size: 28px;">
        mdi-close
      </v-icon>
    </v-btn>
    <!-- 標題 -->
    <v-card-subtitle class="text-center pa-0 login-title" style="font-size: var(--text-title); color: var(--text-color);">
      {{ $t('navbar.signInDialog.title') }}
    </v-card-subtitle>
    <!-- 表單 -->
    <v-form ref="login" v-model="valid" class="login-form">
      <v-row justify="center" no-gutters>
        <v-col cols="12" class="py-0">
          <!-- 使用者名稱 -->
          <v-text-field
              v-model="loginForm.username"
              :label="$t('navbar.signInDialog.userName')"
              :rules="[() => !!loginForm.username && loginForm.username.length >=5 && loginForm.username.length <=64 || `5-64${ $t('navbar.signInDialog.character') }`]"
              required
              style="font-size: var(--text-md);"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <!-- 密碼 -->
          <v-text-field
              v-model="loginForm.password"
              :label="$t('navbar.signInDialog.password')"
              type="password"
              required
              style="font-size: var(--text-md);"
              :rules="[() => !!loginForm.password && loginForm.password.length <=32 && loginForm.password.length >=6 || `6-32${ $t('navbar.signInDialog.character') }`]"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <!-- 忘記密碼按鈕 -->
          <v-btn
            text
            color="primary"
            small
            class="password pa-0 my-6"
            @click="showPassword"
          >
            {{ $t('navbar.signInDialog.forgotPassword') }}
          </v-btn>
        </v-col>
        <v-col class="d-flex justify-center">
          <!-- 登入按鈕 -->
          <v-btn
            color="primary"
            min-width="200"
            height="32"
            style="border-radius: 12px;"
            depressed
            @click="login"
            :loading="loading"
            :disabled="!valid"
          >
            <span style="color: var(--text-opposite); font-size: var(--text-lg);">
              {{ $t('navbar.signInDialog.signIn') }}
            </span>
          </v-btn>
        </v-col>
        <!-- 還沒有帳號嗎? -->
        <v-col cols="12" class="d-flex justify-center mt-2">
          <div style="font-size: 16px">
            <span class="ETHColor">{{ $t('navbar.signInDialog.registerSuggestion') }}</span>
            <a @click="goRegister" class="pa-0">
              {{ $t('navbar.signInDialog.register') }}
            </a>
          </div>
        </v-col>
      </v-row>
    </v-form>

  </v-card>
</template>

<script>
export default {
  name: "Login",
  data: () => ({
    valid: false,
    loading: false,
    loginForm: {
      email: "",
      password: "",
      username: "",
      profile: {
        phone_number: '',
        notice_url: '',
        tg_notice_chat_id: ''
      },
    },
    usernameRules: [(v) => (v && v.length <= 16 && v.length >= 5) || "5-16字符",],
  }),
  methods: {
    showPassword() {
      this.$emit("showPassword")
    },
    login() {
      this.loading = true;
      this.$store
          .dispatch("user/login", this.loginForm)
          .then(() => {
            this.loading = false;
            this.$emit("closeDialog")
          })
          .catch((error) => {
            this.toasterErr(error.code)
            this.loading = false;
          });
    },
    goRegister() {
      this.$emit("showRegister")
    },
    closeDialog() {
      this.$emit("closeDialog")
    }
  }
}
</script>

<style lang="scss" scoped>

.login-card {
  border-radius: 48px;
  padding: 72px 60px 72px 60px;

  .login-title {
    margin-bottom: 96px;
  }
}

::v-deep .v-input input {
  max-height: 50px;
}

::v-deep.theme--dark.v-text-field:not(.v-input--has-state):hover > .v-input__control > .v-input__slot:before{
  border-color: rgba(102, 102, 102, .73);
}

@media screen and (max-width: 600px) {
  .login-card {
    padding: 72px 30px 72px 30px;
  }
  
}
</style>
