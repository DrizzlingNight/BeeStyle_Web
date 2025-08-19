<template>
  <v-card width="542" class="register-card">
    <!-- 關閉鈕 -->
    <v-btn @click="closeDialog" icon text absolute style="top: 36px; right: 36px;">
      <v-icon style="font-size: 28px;">
        mdi-close
      </v-icon>
    </v-btn>
    <!-- 註冊標題 -->
    <v-card-subtitle class="text-center pa-0 register-title" style="font-size: var(--text-title);">
      {{ $t('navbar.registerDialog.title') }}
    </v-card-subtitle>
    <!-- 註冊表單 -->
    <v-form ref="login" v-model="valid">
        <v-row justify="center" no-gutters>
          <v-col cols="12" class="py-0">
            <!-- 使用者名稱 -->
            <v-text-field
                v-model="loginForm.username"
                :label="$t('navbar.registerDialog.userName')"
                :rules="[() => !!loginForm.username && loginForm.username.length >=5 && loginForm.username.length <=16 || `5-16${ $t('navbar.registerDialog.character') }`]"
                required
                autocomplete="new-password"
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="py-0">
            <!-- 信箱 -->
            <v-text-field
                :rules="emailRules"
                v-model="loginForm.email"
                :label="$t('navbar.registerDialog.email')"
                required
                autocomplete="new-password"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <!-- 密碼 -->
            <v-text-field
                v-model="loginForm.password"
                :label="$t('navbar.registerDialog.password')"
                type="password"
                required
                autocomplete="new-password"
                :rules="[() => !!loginForm.password && loginForm.password.length <=32 && loginForm.password.length >=6 || `6-32${ $t('navbar.registerDialog.character') }`]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="py-0">
            <!-- 密碼確認 -->
            <v-text-field
                v-model="repeatPassword"
                :label="$t('navbar.registerDialog.confirmPassword')"
                type="password"
                required
                autocomplete="new-password"
                :rules="[affirmPass]"
            ></v-text-field>
          </v-col>
          <!-- 是否為公司帳號 checkbox -->
          <v-col cols="12" class="mt-n3">
            <v-radio-group
              v-model="isCompany"
              :label="$t('navbar.registerDialog.accountType')"
              row
              class="is-company"
            >
              <v-radio
                :label="$t('navbar.registerDialog.person')"
                value="0"
              ></v-radio>
              <v-radio
                :label="$t('navbar.registerDialog.company')"
                value="1"
              ></v-radio>
            </v-radio-group>
          </v-col>
          <!-- 條款 checkbox -->
          <v-col cols="12" class="mt-n3">
            <v-card-subtitle class="pa-0" style="font-size: 12px">
              <v-checkbox
                  class="d-inline-block"
                  v-model="checkbox"
                  :label="$t('navbar.registerDialog.agreement')"
              >
              </v-checkbox>
              <v-btn
                  text
                  small
                  color="primary"
                  class=" mt-n2 ml-1 pa-0"
                  @click="goService"
              >
                <div style="font-size: 12px">{{ $t('navbar.registerDialog.terms') }}</div>
              </v-btn>
            </v-card-subtitle>
          </v-col>
          <!-- 建立帳號按鈕 -->
          <v-col cols="12" class="d-flex justify-center">
            <v-btn
              color="primary"
              depressed
              width="200"
              height="32"
              @click="register"
              :loading="loading"
              :disabled="!valid || !checkbox"
              class="submit-button mb-1"
            >
              <span style="font-size: var(--text-lg); color: var(--text-opposite);">
                {{ $t('navbar.registerDialog.createAccount') }}
              </span>
            </v-btn>
          </v-col>
          <v-col cols="12" class="d-flex justify-center">
            <div style="font-size: 16px">
              <span class="ETHColor">{{ $t('navbar.registerDialog.signInSuggestion') }}</span>
              <a @click="goLogin" color="rgba(30, 136, 229, 1)" class="pa-0">
                {{ $t('navbar.registerDialog.signIn') }}
              </a>
            </div>
          </v-col>
        </v-row>
    </v-form>
  </v-card>
</template>

<script>
import {signUp} from "@/api/user"
// import router from "../../../router"

export default {
  name: "Register",
  data:() => ({
    valid: false,
    loading: false,
    checkbox:false,
    isCompany: "0",
    repeatPassword:'',
    loginForm: {
      email: "",
      password: "",
      username: "",
    },
  }),
  computed: {
    emailRules() {
      return  [(v) => /.+@.+\..+/.test(v) || this.$t('navbar.registerDialog.invalidEmailHint')]
    }
  },
  methods:{
    affirmPass(val) {
      if (val !== this.loginForm.password) {
        return this.$t('navbar.registerDialog.passwordsNotMatch')
      }
      return true;
    },
    closeDialog() {
      this.$emit("closeDialog")
    },
    goService() {
      this.$store.commit("ui/SET_IS_SERVICE_PAGE_DIALOG", true);
    },
    register() {
      this.loading = true
      let info = {
        ...this.loginForm,
        profile: {
          nickname: this.loginForm.username, // 默認暱稱與用戶名一樣
          is_company: this.isCompany === '1' ? true : false,
        }
      }
      info.username = info.username.trim()
      signUp(info).then((res) => {
        if (res.code) {
          this.toasterErr(res.code)
          this.loading = false
        } else {
          this.loading = false
          this.$toast.success(this.$t('navbar.registerDialog.createSucceed'))
          this.$emit("showLogin")
        }
      }).catch((err) => {
        this.toasterErr(err.code)
        this.loading = false
      });
    },
    goLogin() {
      this.$emit("showLogin")
    }
  }
}
</script>

<style lang="scss" scoped>

.register-card {
  padding: 72px 60px 76px 60px;

  .register-title {
    margin-bottom: 100px;
  }

  .submit-button {
    border-radius: 12px;
  }
}

::v-deep .v-input input {
  max-height: 50px;
}

::v-deep .theme--dark.v-text-field:not(.v-input--has-state):hover > .v-input__control > .v-input__slot:before{
  border-color: rgba(102, 102, 102, .73);
}
::v-deep .v-label:nth-last-child(1) {
  font-size: 12px;
}
::v-deep .v-icon.v-icon {
  font-size: 16px;
  border-radius: 2px;
}
::v-deep .v-application--is-ltr .v-input--selection-controls__input {
  margin-right: 0;
}

.is-company {
  ::v-deep .v-label {
    font-size: 16px;
  }
}

@media screen and (max-width: 600px) {
  .register-card {
    padding: 72px 30px 76px 30px;
  }
  
}
</style>