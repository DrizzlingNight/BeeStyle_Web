<template>
  <div style="height: 100%" class="d-flex align-center">
    <v-card class="text-center mx-auto" width="650px" height="520px">
      <v-card-subtitle class="text-right pt-3 pr-3 pb-0">
        <v-btn @click="closePassword" icon>
          <v-icon class="grey--text lighten-2">close</v-icon>
        </v-btn>
      </v-card-subtitle>
      <v-card-text style="font-size: 24px" class="white--text mt-8">{{ $t("productDetail.passwordDialog.passwordValidation") }}
      </v-card-text>
      <v-card-text class="mt-2" style="font-size: 16px">
        {{ $t("productDetail.passwordDialog.verifyIdentidy") }}
      </v-card-text>
      <v-form @submit.prevent v-model="passwordVilid">
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
import i18n from '@/lang'
import {mapActions, mapGetters} from "vuex";
import router from "@/router";
export default {
  name:'Password',

  data () {
    return {
      passwordVilid: false,
      passwordJudge: false,
      password: "",
    }
  },
  props: [
    "requestFunc",
    "requestParams",
    "typeFun"
  ],
  computed: {
    ...mapGetters(["name", "user", "host"]),
  },
  methods:{
    ...mapActions('alert',['showAlert']),
    closePassword() {
      // location.reload()
      this.$emit("closeDialog")
      // this.toasterErr(i18n.t("errorClose"));
    },
    passwordRules(val) {
      if (!val) {
        return false;
      }
      if (this.passwordJudge) {
        return this.$t('errorPassword');
      }
      return true;
    },
    changePassword() {
      this.passwordJudge = false;
    },
    passwordConfrim() {
      this.requestFunc({
        ...this.requestParams,
        password: this.password,
      }).then((response) => {
        if (response.code != 0) {
          this.passwordJudge = true;
          this.passwordJudge = true;
          this.toasterErr(response.code)
        } else {
          if(this.typeFun) {
            this.$toast.success(i18n.t("productDetail.destoryDialog.closeDestory"))
            router.push("/user/" + this.user.id + '/')
          }else {
            this.$emit("closeDialog")
            this.$emit("success")
          }

        }
      })
      .catch(() => {
      });
    },
  }
}
</script>

<style  scoped>
::v-deep .v-input input {
  max-height: 50px;
}

</style>
