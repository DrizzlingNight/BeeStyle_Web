<template>
  <v-card width="542" class="reset-card">
    <!-- 關閉鈕 -->
    <v-btn @click="closeDialog" icon absolute style="top: 36px; right: 36px;">
      <v-icon style="font-size: 28px;">
        mdi-close
      </v-icon>
    </v-btn>
    <!-- 標題 -->
    <v-card-subtitle class="text-center pa-0 reset-title" style="font-size: var(--text-title); color: var(--text-color);">
      {{ $t('navbar.resetPasswordDialog.title') }}
    </v-card-subtitle>
    <!-- 表單 -->
    <v-form ref="login" v-model="valid">
      <v-row justify="center" no-gutters>
        <v-col cols="12" class="py-0">
          <!-- 信箱 -->
          <v-text-field
              :rules="[() => (loginForm.email && loginForm.email.length <=32) || `${ $t('navbar.resetPasswordDialog.lessThan') }32${ $t('navbar.resetPasswordDialog.character') }`]"
              v-model="loginForm.email"
              :label="$t('navbar.resetPasswordDialog.email')"
              required
              autocomplete="new-password"
          ></v-text-field>
        </v-col>
        <v-col cols="12" class="py-0">
          <!-- 驗證碼 -->
          <v-text-field
              v-model="loginForm.code"
              :label="$t('navbar.resetPasswordDialog.verificationCode')"
              required
              autocomplete="new-password"
          ></v-text-field>
          <!-- 發送驗證碼按鈕 -->
          <v-btn
              class="send-btn d-flex float-right mt-n16 px-3"
              color="primary"
              @click="sendVerificationCode"
              :loading="isSendingCode"
              :disabled="!loginForm.email"
          >
          <span class="bottomText">{{ $t('navbar.resetPasswordDialog.sendCode') }}</span>
          </v-btn>
        </v-col>
        <v-col cols="12">
          <!-- 新密碼 -->
          <v-text-field
              v-model="loginForm.password"
              :label="$t('navbar.resetPasswordDialog.newPassword')"
              type="password"
              autocomplete="new-password"
              required
              :rules="[() => !!loginForm.password && loginForm.password.length <=32 && loginForm.password.length >=6 || `6-32${ $t('navbar.resetPasswordDialog.character') }`]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" class="py-0">
          <!-- 確認新密碼 -->
          <v-text-field
              v-model="repeatPassword"
              :label="$t('navbar.resetPasswordDialog.confirmNewPassword')"
              type="password"
              required
              autocomplete="new-password"
              :rules="[affirmPass]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" class="d-flex justify-center">
          <!-- 重置密碼 -->
          <v-btn
            color="primary"
            min-width="200"
            height="32"
            style="border-radius: 12px;"
            depressed
            @click="password"
            :loading="loading"
            :disabled="!valid"
          >
            <span style="color: var(--text-opposite); font-size: var(--text-lg);">
              {{ $t('navbar.resetPasswordDialog.resetPassword') }}
            </span>
          </v-btn>
        </v-col>
        <!-- 已經有帳號? -->
        <v-col cols="12" class="d-flex justify-center mt-4">
          <div class="mb-4" style="font-size: 16px">
            <span class="ETHColor">{{ $t('navbar.resetPasswordDialog.signInSuggestion') }}</span>
            <a @click="goLogin" color="rgba(30, 136, 229, 1)" class="pa-0">
              {{ $t('navbar.resetPasswordDialog.signIn') }}
            </a>
          </div>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script>
import {sendEmail, resetPassword} from "@/api/user"

export default {
  name: "Password",
  data: () => ({
    valid: false,
    repeatPassword: '',
    loading: false,
    isSendingCode: false,
    loginForm: {
      email: "",
      password: "",
      username: "",
      code: "",
      profile: {
        phone_number: '',
        notice_url: '',
        tg_notice_chat_id: ''
      },
    },
  }),
  methods: {
    affirmPass(val) {
      if (val !== this.loginForm.password) {
        return this.$t('navbar.resetPasswordDialog.passwordsNotMatch')
      }
      return true;
    },
    closeDialog() {
      this.$emit("closeDialog")
    },
    goLogin() {
      this.$emit("showLogin")
    },
    resetForm(){
      this.loginForm = {
        email: this.loginForm.email,
        password: "",
        username: "",
        profile: {
          phone_number: '',
          notice_url: '',
          tg_notice_chat_id: ''
        }
      }
    },
    //发送验证码
    sendVerificationCode() {
      this.isSendingCode = true
      sendEmail({email: this.loginForm.email, code_type: 2}).then((res) => {
        if (res.code === 0) {
          this.resetForm()
          this.$toast.success(this.$t('navbar.resetPasswordDialog.verificationCodeSent'))
        } else {
          this.toasterErr(res.code)
        }
        this.isSendingCode = false
      }).catch((err) => {
        console.error('err', err)
        this.isSendingCode = false
      })
    },
    password() {
      resetPassword({
        email: this.loginForm.email,
        new_password: this.loginForm.password,
        verify_code: this.loginForm.code
      }).then((res) => {
        if (res.code === 0) {
          this.$emit("showLogin")
          this.$toast.success(this.$t('navbar.resetPasswordDialog.resetSucceed'))
        } else {
          this.toasterErr(res.code)
        }
      }).catch((err) => {
        console.error('err', err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.reset-card {
  border-radius: 48px;
  padding: 72px 60px 72px 60px;

  .reset-title {
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
  .reset-card {
    padding: 72px 30px 72px 30px;
  }
  
}
</style>