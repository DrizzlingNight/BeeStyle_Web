<template>
  <v-container class="mt-16">
    <v-row class="text-center">
      <v-col cols="10" class="mx-auto">
        <v-col>
          <v-img
              contain
              height="302"
              class="ma-auto rounded-lg"
              max-width="302"
              :src="imgUrl ? isOldImg ? host + imgUrl : host + imgUrl[0] : require('@/assets/defaultPage.png')"
          ></v-img>
        </v-col>
        <v-col cols="12" class="mt-4">
          <span style="font-size: 30px">{{ $t("transferNFT.title") }}NFT</span>
        </v-col>
        <v-col cols="6" class="mx-auto">
          <p class="tranfserNFT text-left mb-0">{{ $t("loginAndResister.email") }}</p>
          <v-form v-model="valid" ref="form">
            <v-text-field
                color="#F7B500"
                class="mt-0 pt-0 tranfserNFTPlaceholder"
                v-model="receiverUsername"
                :placeholder='$t("transferNFT.inputEmail")'
                required
                :rules="textRules"
            ></v-text-field
            >
          </v-form>
        </v-col>
        <v-col cols="4" class="mx-auto">
          <v-btn
              x-large
              block
              class="btnColor mt-5 mb-16"
              dark
              @click="transferNFT"
              :disabled="!valid"
          >
            {{ $t("transferNFT.title") }}
          </v-btn>
        </v-col>
      </v-col>
    </v-row>
    <v-dialog
        v-model="transferNFTDialog"
        class="d-flex justify-center align-center"
        width="650px"
    >
      <success-dialog
          v-if="success"
          @closeDialog="closeDialog"
          :receiverUsername="receiverUsername"
      ></success-dialog>
      <failed-dialog
          v-if="faild"
          @closeDialog="closeDialog"
      ></failed-dialog>
      <password
          v-if="password"
          :receiverUsername="receiverUsername"
          :id="id"
          @closeDialog="closeDialog"
          @showFailed="showFailed"
          @showSuccess="showSuccess"
      >
      </password>
    </v-dialog>
  </v-container>
</template>
<script>
import { getNFT} from "@/api/NFT";
import {mapGetters} from "vuex";
import i18n from '@/lang/index';
import SuccessDialog from "./TransferNFTComps/successDialog";
import FailedDialog from "./TransferNFTComps/failedDialog";
import Password from "./TransferNFTComps/Password";

export default {
  name: "transfernft",
  components: {Password, FailedDialog, SuccessDialog},
  data: () => ({
    receiverUsername: "",
    isReallyPeople: false,
    success: false,
    faild: false,
    password: false,
    requestFunc: "",
    id: null,
    imgUrl: "",
    NFT: null,
    valid: false,
    textRules: [
      (v) => /.+@.+\..+/.test(v) || i18n.t("transferNFT.errorEmail"),
    ],
  }),
  computed: {
    ...mapGetters(["host", "user"]),
    transferNFTDialog() {
      return this.password || this.success || this.faild
    },
    //图片匹配老数据
    isOldImg() {
      if (this.imgUrl) {
        if (typeof this.imgUrl === 'string') {
          return true
        } else return false
      } else return true
    },
  },
  created() {
    this.id = this.$route.params.id;
    this.getNFTInfo();
  },
  methods: {
    closeDialog() {
      this.password = false
      this.success = false
      this.faild = false
    },

    showFailed() {
      this.faild = true
    },
    showSuccess() {
      this.success = true
    },
    getNFTInfo() {
      getNFT(this.id)
          .then((response) => {
            this.NFT = response.data;
            this.imgUrl = response.data.files;
          })
          .catch(() => {
          });
    },
    transferNFT() {
      if (!this.valid) {
        this.$refs.form.reset();
      } else {
        this.loading = true;
        this.password = true
      }
    },
  }
};
</script>

<style scoped>
::v-deep .v-input input {
  max-height: 50px;
}

::v-deep .theme--dark.v-text-field > .v-input__control > .v-input__slot:before {
  border-color: rgba(102, 102, 102, 1) !important;
}

::v-deep .theme--dark.v-text-field.v-input--is-disabled .v-input__slot::before {
  border-image: 0 !important;
}

.continue {
  box-shadow: 0px 1px 18px 0px rgba(0, 0, 0, 0.12), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 3px 5px -1px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  border: 1px solid #FFC107;
}
</style>