<template>
  <div style="height: 100%" class="d-flex align-center">
    <v-card class="mx-auto" width="480px" height="592px">
      <div class="text-right">
        <v-card-subtitle class="d-inline-block pt-5" @click="closeMakeDeal">
          <v-img
              max-height="14"
              max-width="14"
              src="@/assets/fake/close.png"
          ></v-img>
        </v-card-subtitle>
      </div>
      <v-container class="mt-n6">
        <v-row class="d-flex justify-center">
          <v-col cols="11">
            <v-card-text class="white--text text-center" style="font-size: 24px">
              {{ $t("productDetail.makeDeal.title") }}
            </v-card-text>
            <v-col class="d-flex">
              <v-img
              class="borderRadius"
                  max-height="67"
                  max-width="67"
              :src="NFTData.image"
              ></v-img>
              <v-col >
                <div class="description">{{ NFTData ? NFTData.name : "" }}</div>
                <div class="owner mt-1">
                  {{ `${NFTData ? NFTData.user.username : ""}` }}
                </div>
              </v-col>
            </v-col>
            <v-col class="d-flex justify-space-between mt-6">
              <div class="ETHColor">
                {{ $t("marketPlace.price.price") }}
              </div>
              <div>{{ price }}ETH</div>
            </v-col>
            <v-col class="mt-9">
              <p class="ETHColor">
                {{ $t("productDetail.makeDeal.text") }}
              </p>
              <v-col class="d-flex pa-0 mt-n3">
                <VuetifyNumberInput
                    class="text-h4"
                    v-model.number="makeDealPrice"
                    backgroundColor=""
                    disabled
                >
                </VuetifyNumberInput>
              </v-col>
              <div class="d-flex float-right mt-n14">
                <v-avatar size="18" class="mt-1">
                  <img src="@/assets/fake/price/ETH.png"/>
                </v-avatar>
                <p class="ml-1 ETHColor">ETH</p>
              </div>
              <v-col class="ETHColor pa-0 mt-n5" style="font-size: 12px">
                <span>≈ ${{ cash }}</span>
              </v-col>
            </v-col>
            <v-col cols="12" class="mx-auto mt-12">
              <div class="hintText mb-4" style="font-size: 12px"><span class="hintText">{{
                  $t("productDetail.sellDialog.text")
                }}</span>
                <v-btn @click="goService" text color="rgba(0,145,255,1)" class="pa-0" height="17px">
                  {{ $t("productDetail.sellDialog.textService") }}
                </v-btn>
              </div>
              <v-btn
                  large
                  block
                  class="btnColor"
                  @click="confirmMakeDeal"
              >
                {{ $t("confirmBtn") }}
              </v-btn>
            </v-col>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import VuetifyNumberInput from "@/components/VuetifyNumberInput";
import { formatDecimal } from "@/utils/math";
import {OfferDeal} from "../../../api/NFT";
import i18n from '@/lang'
export default {
  name: "",
  components: {VuetifyNumberInput},
  data() {
    return {};
  },
  props: ["NFTData", "NFTsellFee", "confirmOffer","isOldImg"],
  computed: {
    ...mapGetters(["name", "user","config", "host", "getRate"]),
    rate() {
      if(!this.NFTData.coin) {
        return this.getRate(this.config.coin, Number(process.env.VUE_APP_RATE_TO_COIN_ID))
      }else {
        return this.getRate(this.NFTData.coin.id, Number(process.env.VUE_APP_RATE_TO_COIN_ID))
      }
    },
    makeDealPrice() {
      return this.confirmOffer.price
    },
    //当前价格
    price() {
      return formatDecimal(this.NFTData.price, 4)
    },
    //现金价值
    cash() {
      return formatDecimal(Number(this.rate.rate) * Number(this.makeDealPrice), 4)
    },
  },
  methods:{
    goService() {
      this.$store.commit("ui/SET_IS_SERVICE_PAGE_DIALOG", true);
    },
    closeMakeDeal() {
      location.reload()
      this.$emit("closeDialog")
      this.toasterErr(i18n.t("errorClose"));
    },
    confirmMakeDeal() {
      this.$emit("showPasswordPage",
          this.$t("productDetail.buyDialog.titleTrade"),
          this.$t("productDetail.buyDialog.textTrade"),
          "/user/" + this.user.id,
          OfferDeal,
          {id: this.confirmOffer.id}
      )
    }
  }
}
</script>

<style  scoped>
::v-deep .theme--dark.v-input input, .theme--dark.v-input textarea {
  color: rgba(255, 255, 255, 1);
}

::v-deep .theme--dark.v-text-field > .v-input__control > .v-input__slot:before {
  border-color: rgba(102, 102, 102, 1) !important;
}

::v-deep .theme--dark.v-text-field.v-input--is-disabled .v-input__slot::before {
  border-image: 0 !important;
}

::v-deep .v-input input {
  max-height: 50px;
}
</style>