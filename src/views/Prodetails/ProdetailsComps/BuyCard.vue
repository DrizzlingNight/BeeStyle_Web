<template>
  <div style="height: 100%" class="d-flex align-center">
    <v-card width="480" height="643" class="mx-auto">
      <div class="text-right">
        <v-card-subtitle
            class="d-inline-block"
            @click="closeBuy"
        >
          <v-img
              max-height="14"
              max-width="14"
              src="@/assets/fake/close.png"
          ></v-img>
        </v-card-subtitle>
      </div>
      <v-container class="mt-n9">
        <v-row class="d-flex justify-center ">
          <v-col cols="11">
            <v-card-text class="white--text text-center" style="font-size: 24px">
              {{ $t("productDetail.sellDialog.title") }}
            </v-card-text>
            <v-col class="d-flex justify-start px-3 py-0 mt-8">
              <v-img
                  class="borderRadius"
                  max-height="63"
                  max-width="63"
                  :src="NFTData.image"
              ></v-img>
              <div class="ml-3 mt-3">
                <div class="description">{{ this.NFTData ? this.NFTData.name : "" }}</div>
                <div class="owner mt-1" style="font-size: 14px">
                  {{ `拥有者: ${NFTData ? NFTData.user.username : ""}` }}
                </div>
              </div>
            </v-col>
            <v-col class="mt-12">
              <div class="ETHColor">
                {{ $t("marketPlace.price.price") }}
              </div>
            <v-row no-gutters>
              <v-col class="pa-0 mt-1">
                <VuetifyNumberInput
                    class="text-h4"
                    v-model.number="nftPrice"
                    backgroundColor=""
                    disabled
                >
                </VuetifyNumberInput>
              </v-col>
            </v-row>
            <div class="d-flex float-right mt-n14">
              <v-avatar size="18" class="mt-1">
                <img src="@/assets/fake/price/ETH.png"/>
              </v-avatar>
              <p class="ml-1 ETHColor">ETH</p>
            </div>
            <v-col class="ETHColor pa-0 mt-n3" style="font-size: 12px">
              <span>≈ ${{ cash }}</span>
            </v-col>
            </v-col>
            <v-col class="d-flex justify-space-between pa-0">
              <v-col class="ETHColor">
                <div>{{ $t("productDetail.sellDialog.balance") }}</div>
                <div class="my-1">{{ $t("productDetail.sellDialog.formalities") }}</div>
                <div>{{ $t("productDetail.sellDialog.willPay") }}</div>
              </v-col>
              <v-col class="text-right">
                <div v-if="!lowerPrice">{{ showBalance }}ETH</div>
                <div v-else class="errorColor">{{ showBalance }}ETH</div>
                <div class="my-1">{{ showFee }}ETH</div>
                <div>{{ payablePrice }}ETH</div>
              </v-col>
            </v-col>
            <v-col cols="12" class="mx-auto mt-7">
              <div class="hintText mb-4" style="font-size: 12px"><span class="hintText">{{
                  $t("productDetail.sellDialog.text")
                }}</span>
                <v-btn @click="goService" text color="rgba(0,145,255,1)" class="pa-0" height="17px">
                  {{ $t("productDetail.sellDialog.textService") }}
                </v-btn>
              </div>
              <v-btn
                  block
                  class="btnColor"
                  @click="showPasswordPage"
                  :disabled="lowerPrice"
                  style="height: 50px"
              >
                {{ $t("confirmBtn") }}
              </v-btn>
            </v-col>
            <v-col
                v-if="lowerPrice"
                class="d-flex justify-space-between py-0"
            >
              <span class="errorColor">{{ $t("productDetail.sellDialog.lowBalance") }}</span>
              <v-btn text color="#1E88E5" @click="goRecharge">{{
                  $t("productDetail.sellDialog.recharge")
                }}
              </v-btn>
            </v-col>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {formatDecimal, numFormat} from "@/utils/math";
import VuetifyNumberInput from "@/components/VuetifyNumberInput";
import {buyNFT} from "../../../api/NFT";
// import i18n from "@/lang";

export default {
  name: "BuyCard",
  components: {VuetifyNumberInput},
  data: () => ({}),
  props: [
    "NFTData",
    "isOldImg"
  ],
  created() {
    this.getBalance();
  },
  computed: {
    ...mapGetters(["name", "user", "host", "getRate", "config", "getBalanceById"]),
    //余额
    totalPrice() {
      if (this.config) {
        let balance = this.getBalanceById(this.config.coin)
        return balance && formatDecimal(balance.amount, 4) || "0"
      } else
        return null
    },
    showBalance() {
      return numFormat(this.totalPrice)
    },
    //手续费比率
    NFTsellFee() {
      return this.config.nft_sell_fee
    },
    rate() {
      return this.getRate(this.NFTData.coin.id, Number(process.env.VUE_APP_RATE_TO_COIN_ID))
    },
    payablePrice() {
      return numFormat(formatDecimal(Math.abs(Number(this.Interest) + Number(this.nftPrice)), 4))
    },
    nftPrice() {
      return formatDecimal(Number(this.NFTData ? this.NFTData.price : ""), 4)
    },
    Interest() {
      return formatDecimal((this.NFTsellFee * this.nftPrice), 4)
    },
    showFee() {
      return numFormat(this.Interest)
    },
    lowerPrice() {
      let payablePrice = Number(this.payablePrice.replace(/[,.]/g, ''))
      let totalPrice = Number(this.totalPrice.toString().replace(/[,.]/g, ''))
      if (payablePrice > totalPrice) {
        return true;
      } else return false;
    },
    //现金价值
    cash() {
      return formatDecimal(Number(this.rate.rate) * Number(this.nftPrice), 4)
    },
  },
  methods: {
    goService() {
      this.$store.commit("ui/SET_IS_SERVICE_PAGE_DIALOG", true);
    },
    showPasswordPage() {
      this.$emit("showPasswordPage",
          this.$t("productDetail.buyDialog.titleBuy"),
          this.$t("productDetail.buyDialog.textBuy"),
          "/nft/" + this.NFTData.id + '/info',
          buyNFT,
          {abs_amount: this.nftPrice, token: this.$route.params.id}
      )
    },
    closeBuy() {
      // location.reload()
      this.$emit("closeDialog")
      // this.toasterErr(i18n.t("errorClose"));
    },
    goRecharge() {
      this.$store.commit("ui/SET_IS_SHOW_RECHARGE_DIALOG", true);
    },
    getBalance() {
      this.$store
          .dispatch("user/balance")
          .then(() => {
          })
          .catch(() => {
          });
    },
  }
}
</script>

<style scoped>
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
