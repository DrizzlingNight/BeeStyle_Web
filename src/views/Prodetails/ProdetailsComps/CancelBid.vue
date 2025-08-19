<template>
  <div style="height: 100%" class="d-flex align-center">
    <v-card class="text-center ma-auto" width="606" height="463">
      <div class="text-right">
        <v-card-subtitle class="d-inline-block pt-5" @click="closeCancelBid">
          <v-img
            max-height="14"
            max-width="14"
            src="@/assets/fake/close.png"
          ></v-img>
        </v-card-subtitle>
      </div>
      <v-img
        class="mx-auto mt-4"
        max-width="143"
        max-height="143"
        src="@/assets/fake/offShelf.png"
      ></v-img>
      <v-card-text class="white--text mt-5" style="font-size: 24px">{{
        $t("productDetail.cancelBid.confirmCancelBid")
      }}</v-card-text>
      <v-card-text class="white--text" style="font-size: 16px">
        {{ $t("productDetail.cancelBid.text") }}
      </v-card-text>
      <v-col cols="12" class="mx-auto d-flex justify-space-between mt-1" >
        <v-col cols="6">
          <v-btn block large class="btnColor" @click="confirmCancelBid" style="height: 50px">
            {{ $t("confirmBtn") }}
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn
            block
            large
            class="amber--text lighten-1"
            @click="closeCancelBid"
            style="border: 1px solid #ffc107;height: 50px"
          >
            {{ $t("cancelBtn") }}
          </v-btn>
        </v-col></v-col
      >
    </v-card>
  </div>
</template>

<script>
import { cancelBidNFT } from "@/api/NFT";
import router from "@/router";
import i18n from '@/lang'
import {mapActions} from "vuex";

export default {
  name: "CancelBid",
  data() {
    return {
      closeCancelBidDialog: false,
    };
  },
  props: ["NFTData"],
  methods: {
    ...mapActions('alert',['showAlert']),
    closeCancelBid() {
      // location.reload()
      this.$emit("closeDialog");
      // this.toasterErr(i18n.t("errorClose"));
    },
    confirmCancelBid() {
      cancelBidNFT(this.NFTData.offer_id)
        .then((response) => {
          if(response.code !== 0) {
            this.toasterErr(response.code);
          }else {
            this.$toast.success(i18n.t("productDetail.cancelBid.closeCancelBid"));
            this.$emit("closeDialog");
            if(this.$route.path === `/nft/${this.NFTData.id}/offer`) {
              location.reload()
            }else {
              router.push("/nft/" + this.NFTData.id + '/offer');
            }
          }
        })
        .catch(() => {});
    },
  },
};
</script>

<style  scoped>
.close {
  z-index: 999999;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
