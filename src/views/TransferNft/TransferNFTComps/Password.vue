<template>
  <div style="height: 100%" class="d-flex align-center">
    <v-card class="text-center mx-auto" width="650px" height="520px">
      <v-card-subtitle class="text-right pt-3 pr-3 pb-0">
        <v-btn @click="closePassword" icon>
          <v-icon class="grey--text lighten-2">close</v-icon>
        </v-btn>
      </v-card-subtitle>
      <v-card-text style="font-size: 24px" class="white--text mt-8">
        {{ $t("productDetail.passwordDialog.passwordValidation") }}
      </v-card-text>
      <v-card-text class="mt-2" style="font-size: 16px">
        {{ $t("productDetail.passwordDialog.verifyIdentidy") }}
      </v-card-text>
      <v-form v-model="passwordVilid">
        <v-col cols="8" class="d-flex pb-0 ma-auto mt-10">
          <v-text-field
              color="#F7B500"
              v-model="password"
              :label="$t('confirmPassword.password')"
              :rules="[passwordRules]"
              required
              type="password"
              @input="changePassword"
          ></v-text-field>
        </v-col>
        <v-col cols="8" class="d-flex mx-auto mt-16">
          <v-btn
              x-large
              block
              class="btnColor"
              :disabled="!passwordVilid"
              style="height: 50px"
              @click="passwordConfrim"
          >
            {{ $t("confirmBtn") }}
          </v-btn>
        </v-col>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import {mapActions} from "vuex";
import {transferNFT} from "@/api/NFT";
import i18n from '@/lang/index';
export default {
  name: "Password",
  data: () => ({
    passwordVilid: false,
    passwordJudge: false,
    password: "",
  }),
  props: [
    "receiverUsername","id"
  ],
  methods: {
    ...mapActions('alert', ['showAlert']),
    closePassword() {
      this.toasterErr(i18n.t("errorClose"))
      this.$emit("closeDialog")
    },
    passwordRules(val) {
      if (val.password === "") {
        return false;
      }
      if (this.passwordJudge) {
        return "密码错误";
      }
      return true;
    },
    changePassword() {
      this.passwordJudge = false;
    },
    passwordConfrim() {
      transferNFT(this.id,{
        to:this.receiverUsername,
        password: this.password,
      }).then((response) => {
        if (response.code != 0) {
          this.$emit("closeDialog")
          this.toasterErr(response.code)
          this.$emit("showFailed")
        } else {
          this.$emit("closeDialog")
          this.$emit("showSuccess")
        }
      })
          .catch(() => {
          });
    },
  }
}
</script>

<style scoped>
::v-deep .v-input input {
  max-height: 50px;
}
</style>
