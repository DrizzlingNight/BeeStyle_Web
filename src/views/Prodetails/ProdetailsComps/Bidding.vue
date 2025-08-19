<template>
  <div style="height: 100%" class="d-flex align-center">
    <v-card width="480px" height="705px" class="mx-auto">
      <div class="text-right">
        <v-card-subtitle
            class="d-inline-block pt-5"
            @click="closeBidding"
        >
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
              {{ $t("productDetail.biddingDialog.title") }}
            </v-card-text>
            <v-col class="d-flex justify-start px-3 py-0 mt-5">
              <v-img
                  class="borderRadius"
                  max-height="67"
                  max-width="67"
                  :src="NFTData.image"
              ></v-img>
              <div class="ml-3 mt-3">
                <div class="description">{{ NFTData ? NFTData.name : "" }}</div>
                <div class="owner mt-1" style="font-size: 14px">
                  {{ `${NFTData ? NFTData.user.username : ""}` }}
                </div>
              </div>
            </v-col>
            <v-col class="d-flex justify-space-between pt-0 mt-8">
              <div class="ETHColor">{{ $t("productDetail.biddingDialog.currentPrice") }}</div>
              <div>{{ showPrice }}ETH</div>
            </v-col>
            <v-col class="mt-8">
              <div class="ETHColor mb-1">{{ $t("productDetail.biddingDialog.ownPrice") }}</div>
              <v-row no-gutters>
                <v-col class="pa-0">
                  <v-form v-model="biddingForm">
                    <VuetifyNumberInput
                        class="text-h4"
                        v-model="biddingPrice"
                        v-bind:options="biddingVNIOption"
                        :rules="[biddingRule]"
                        :placeholder="$t('productDetail.biddingDialog.bidddingPlaceholder')"
                        backgroundColor=""
                        hide-details
                    >
                    </VuetifyNumberInput>
                  </v-form>
                </v-col>
              </v-row>
              <div class="d-flex float-right align-top mt-n8">
                <v-avatar size="18" class="mt-1">
                  <img src="@/assets/fake/price/ETH.png"/>
                </v-avatar>
                <p class="ml-1 ETHColor">ETH</p>
              </div>
              <v-col class="d-flex justify-space-between pa-0 mt-3">
                <span class="ETHColor" style="font-size: 12px">≈ ${{ cash }}</span>
                <div>
                  <form class="radio" @change="btnPrice" style="font-size: 14px">
                    <input type="radio" v-model="selectBtn" name="p_1" value="2" id="p_1"><label
                      style="border-radius: 6px" for="p_1">2x</label>
                    <input type="radio" v-model="selectBtn" name="p_1" value="5" id="p_2"><label
                      style="border-radius: 6px" for="p_2">5x</label>
                    <input type="radio" v-model="selectBtn" name="p_1" value="10" id="p_a"><label
                      style="border-radius: 6px" for="p_a">10x</label>
                  </form>
                </div>
              </v-col>
            </v-col>
            <v-col class="d-flex justify-space-between pa-0 mt-3">
              <v-col class="ETHColor">
                <div>{{ $t("productDetail.sellDialog.balance") }}</div>
                <div class="my-1">{{ $t("productDetail.sellDialog.formalities") }}</div>
                <div>{{ $t("productDetail.sellDialog.willPay") }}</div>
              </v-col>
              <v-col class="text-right">
                <div v-if="!biddingLowerPrice">{{ showBalance }}ETH</div>
                <div v-else class="errorColor">{{ showBalance }}ETH</div>
                <div class="my-1">{{ showFee }}ETH</div>
                <div>{{ biddingWillpay }}ETH</div>
              </v-col>
            </v-col>
            <v-col :class="biddingLowerPrice ? 'mt-3':'mt-10'">
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
                  :disabled="!biddingForm || biddingLowerPrice"
                  @click="showPasswordPage"
              >
                {{ $t("confirmBtn") }}
              </v-btn>
            </v-col>
            <v-col
                v-if="biddingLowerPrice"
                class="d-flex justify-space-between py-0"
            >
              <span class="errorColor">{{ $t("productDetail.sellDialog.lowBalance") }}</span>
              <v-btn class="mt-n1" text color="#1E88E5" @click="goRecharge">{{
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
import i18n from "@/lang";
import VuetifyNumberInput from "@/components/VuetifyNumberInput";
import {formatDecimal, numFormat} from "@/utils/math"
import {bidNFT} from "../../../api/NFT";

export default {
  name: "Bidding",
  components: {VuetifyNumberInput},
  data: () => ({
    biddingForm: false,
    selectBtn: "",
    biddingPrice: '',
    biddingVNIOption: {
      locale: i18n.locale,
      length: 12,
      fixed: 4,
    },
  }),
  props: [
    "NFTData",
    "isOldImg"
  ],
  created() {
    this.getBalance()
  },
  computed: {
    ...mapGetters(["name", "user", "host", "getRate", "config", "getBalanceById"]),
    rate() {
      return this.getRate(this.NFTData.coin.id, Number(process.env.VUE_APP_RATE_TO_COIN_ID))
    },
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
    biddingLowerPrice() {
      if (this.totalPrice) {
        let totalPrice = Number(this.totalPrice.replace(/[,.]/g, ""))
        let biddingWillpay = Number(this.biddingWillpay.replace(/[,.]/g, ""))
        if (biddingWillpay > totalPrice) {
          return true
        }
      }
      return false
    },
    //当前价格
    price() {
      return formatDecimal(this.NFTData.current_price, 4)
    },
    showPrice() {
      if (this.price) {
        return numFormat(this.price)
      }
      return null
    },
    //竞拍将付
    biddingWillpay() {
      return numFormat(formatDecimal(Math.abs(Number(this.biddingInterest) + Number(this.biddingPrice)), 4))
    },
    payablePrice() {
      return formatDecimal(Math.abs(Number(this.Interest) + Number(this.nftPrice)), 4)
    },
    //现金价值
    cash() {
      return numFormat(formatDecimal(Number(this.rate.rate) * Number(this.biddingPrice), 4))
    },
    //竞价手续费
    biddingInterest() {
      return formatDecimal((this.NFTsellFee * this.biddingPrice), 4)
    },
    showFee() {
      return numFormat(this.biddingInterest)
    }
  },
  methods: {
    goService() {
      this.$store.commit("ui/SET_IS_SERVICE_PAGE_DIALOG", true);
    },
    getBalance() {
      this.$store
          .dispatch("user/balance")
          .then(() => {
          })
          .catch(() => {
          });
    },
    //竞价输入验证
    biddingRule(val) {
      if (Number(val) <= Number(this.price)) {
        return i18n.t("productDetail.biddingDialog.bidingRules")
      } else return true
    },
    closeBidding() {
      // location.reload()
      this.$emit("closeDialog")
      // this.toasterErr(i18n.t("errorClose"));
    },
    btnPrice() {
      this.biddingPrice = this.selectBtn * this.price
    },
    goRecharge() {
      this.$store.commit("ui/SET_IS_SHOW_RECHARGE_DIALOG", true);
    },
    showPasswordPage() {
      this.$emit("showPasswordPage",
          this.$t("productDetail.buyDialog.titleBid"),
          '',
          "/nft/" + this.NFTData.id + '/bid',
          bidNFT,
          {price: this.biddingPrice, token: this.$route.params.id}
      )
    },
  }

}
</script>

<style scoped>

.errorColor {
  color: #e02020;
}

.radio input[type="radio"] {
  display: none;
}

.radio input[type="radio"] + label {
  padding: 0.2em 0.5em;
  margin: 0.2em 0.5em;
  border: 1px solid rgba(255, 193, 7, 1);
  color: rgba(255, 255, 255, 1);
}
.radio input[type="radio"] + label:nth-last-child(1){
  margin-right: 0px;
}
.radio input[type="radio"]:checked + label {
  /*padding: 0.2em 0.5em;*/
  /*margin: 0.2em 0.5em;*/
  /*border: 1px solid red;*/
  background: rgba(255, 193, 7, 1);
  color: black;
}

::v-deep .v-input input {
  max-height: 50px;
}

::v-deep .theme--dark.v-text-field > .v-input__control > .v-input__slot:before {
  border-color: rgba(102, 102, 102, 1) !important;
}

::v-deep .theme--dark.v-text-field.v-input--is-disabled .v-input__slot::before {
  border-image: 0 !important;
}
</style>
