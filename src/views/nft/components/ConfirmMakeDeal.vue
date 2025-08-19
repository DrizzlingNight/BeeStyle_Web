<template>
  <div style="height: 100%" class="d-flex align-center">
    <v-card class="text-center ma-auto" width="606" height="463">
      <div class="text-right">
        <v-card-subtitle class="d-inline-block pt-5" @click="closeConfirmMakeDeal">
          <v-img
            max-height="14"
            max-width="14"
            src="@/assets/fake/close.png"
            style="cursor: pointer"
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
        $t("nft.confirmMakeDeal.title")
      }}</v-card-text>
      <v-card-text class="white--text" style="font-size: 16px">
        {{ $t("nft.confirmMakeDeal.description") }}
      </v-card-text>
      <v-col cols="12" class="mx-auto d-flex justify-space-between mt-1" >
        <v-col cols="6">
          <v-btn block large class="btnColor" @click="confirmMakeDeal" style="height: 50px">
            {{ $t("confirmBtn") }}
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn
            block
            large
            class="amber--text lighten-1"
            @click="closeConfirmMakeDeal"
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
// import router from "@/router"
// import i18n from '@/lang'
import { mapActions, mapGetters } from "vuex"
import { OfferDeal } from "@/api/NFT"

export default {
  name: "ConfirmMakeDeal",
  data() {
    return {
      closeConfirmMakeDealDialog: false,
    }
  },
  props: ["confirmOfferData"],
  computed: {
    ...mapGetters(["user"]),
  },
  methods: {
    ...mapActions('alert',['showAlert']),
    closeConfirmMakeDeal() {
      this.$emit("confirmMakeOffer", null, false)
      this.$emit("closeDialog")
    },
    confirmMakeDeal() {
      this.$emit("showPasswordPage",
          this.$t("productDetail.buyDialog.titleTrade"),
          this.$t("productDetail.buyDialog.textTrade"),
          "/user/" + this.user.id,
          OfferDeal,
          {id: this.confirmOfferData.id}
      )
    },
  },
}
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
