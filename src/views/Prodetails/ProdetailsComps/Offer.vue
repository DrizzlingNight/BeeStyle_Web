<template>
  <div style="height: 100%" class="d-flex align-center">
    <v-card height="705px" width="480px" class="mx-auto">
      <div class="text-right">
        <v-card-subtitle class="d-inline-block pt-5" @click="closeOffer">
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
              {{ $t("productDetail.offerDialog.title") }}
            </v-card-text>
            <v-col class="d-flex justify-start px-3 py-0 mt-8">
              <v-img
                  class="borderRadius"
                  max-height="67"
                  max-width="67"
                  :src="NFTData.image"
              ></v-img>
              <div class="ml-3 mt-3">
                <div class="description">{{ this.NFTData ? this.NFTData.name : "" }}</div>
                <div class="owner mt-2" style="font-size: 14px">
                  {{ `拥有者: ${NFTData ? NFTData.user.username : ""}` }}
                </div>
              </div>
            </v-col>
            <v-col class="d-flex justify-space-between mt-5 ETHColor">
              <div>
                {{ $t("productDetail.price.price") }}
              </div>
              <div>{{ showPrice }}ETH</div>
            </v-col>
            <v-col class="mt-9">
              <div class="ETHColor">
                {{ $t("productDetail.price.youPrice") }}
              </div>
              <v-row no-gutters>
                <v-col class="pa-0">
                  <v-form v-model="offerForm">
                    <VuetifyNumberInput
                        class="text-h4"
                        v-model.number="offerPrice"
                        v-bind:options="biddingVNIOption"
                        :rules="offerRule"
                        :placeholder="
                    $t('productDetail.biddingDialog.youPlaceholdor')
                  "
                        backgroundColor=""
                    >
                    </VuetifyNumberInput>
                    <div class="d-flex float-right mt-n14">
                      <v-avatar size="18" class="mt-1">
                        <img src="@/assets/fake/price/ETH.png"/>
                      </v-avatar>
                      <p class="ml-1 ETHColor">ETH</p>
                    </div>
                  </v-form>
                </v-col>
              </v-row>
              <v-col v-if="offerPrice" class="d-flex pa-0 mt-n4">
                <span class="ETHColor" style="font-size: 12px">≈ ${{ cash }}</span>
              </v-col>
            </v-col>
            <v-col class="d-flex justify-space-between pa-0 mt-4">
              <v-col class="ETHColor">
                <div>{{ $t("productDetail.sellDialog.balance") }}</div>
                <div class="py-1">{{ $t("productDetail.offerDialog.offerFee") }}</div>
                <div>{{ $t("productDetail.offerDialog.freezePrice") }}</div>
              </v-col>
              <v-col class="text-right">
                <div v-if="!offerLowerPrice">{{ showBalance }}ETH</div>
                <div v-else class="errorColor">{{ showBalance }}ETH</div>
                <div class="py-1">{{ showFee }}ETH</div>
                <div>{{ offerWillpay }}ETH</div>
              </v-col>
            </v-col>
            <v-col cols="12" :class="offerLowerPrice ? 'mt-4':'mt-10'">
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
                  :disabled="!offerForm || offerLowerPrice"
                  @click="showPasswordPage "
              >
                {{ $t("confirmBtn") }}
              </v-btn>
            </v-col>
            <v-col
                v-if="offerLowerPrice"
                class="d-flex justify-space-between py-0"
            >
            <span class="errorColor">{{
                $t("productDetail.sellDialog.lowBalance")
              }}</span>
              <v-btn text class="mt-n1" color="#1E88E5" @click="goRecharge">{{
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
import {formatDecimal, numFormat} from "@/utils/math";
import {offerNFT} from "../../../api/NFT";

export default {
  name: "Offer",
  components: {VuetifyNumberInput},
  data() {
    return {
      offerForm: false,
      offerPrice: '',
      biddingVNIOption: {
        locale: i18n.locale,
        length: 12,
        fixed: 4,
      },
      offerRule: [
        (v) => !!v || false,
      ],
    };
  },
  props: [
    "NFTData",
    "isOldImg"
  ],
  created() {
    this.getBalance()
  },
  computed: {
    ...mapGetters(["name", "user", "host", "getRate", "config", "getBalanceById"]),
    //当前价格
    price() {
      return formatDecimal(this.NFTData.current_price, 4)
    },
    showPrice() {
      return numFormat(this.price)
    },
    rate() {
      if (!this.NFTData.coin) {
        return this.getRate(this.config.coin, Number(process.env.VUE_APP_RATE_TO_COIN_ID))
      } else {
        return this.getRate(this.NFTData.coin.id, Number(process.env.VUE_APP_RATE_TO_COIN_ID))
      }
    },
    //现金价值
    cash() {
      return numFormat(formatDecimal(Number(this.rate.rate) * Number(this.offerPrice), 4))
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
    //出价将付
    offerWillpay() {
      return numFormat(formatDecimal(Math.abs(Number(this.offerInterest) + Number(this.offerPrice)), 4))
    },
    //出价手续费
    offerInterest() {
      return formatDecimal((this.NFTsellFee * this.offerPrice), 4)
    },
    showFee() {
      return numFormat(this.offerInterest)
    },
    offerLowerPrice() {
      let totalPrice = Number(this.totalPrice.toString().replace(/[,.]/g, ""))
      let offerWillpay = Number(this.offerWillpay.replace(/[,.]/g, ""))
      if (offerWillpay > totalPrice) {
        return true;
      } else return false;
    },
  },
  methods: {
    goService() {
      this.$store.commit("ui/SET_IS_SERVICE_PAGE_DIALOG", true);
    },
    showPasswordPage() {
      this.$emit("showPasswordPage",
          this.$t("productDetail.buyDialog.titleOffer"),
          this.$t("productDetail.buyDialog.textOffer"),
          "/nft/" + this.NFTData.id + '/offer',
          offerNFT,
          {price: this.offerPrice, token: this.$route.params.id}
      )
    },
    goRecharge() {
      this.$store.commit("ui/SET_IS_SHOW_RECHARGE_DIALOG", true);
    },
    closeOffer() {
      location.reload()
      this.$emit("closeDialog");
      this.toasterErr(i18n.t("errorClose"));
    },
    getBalance() {
      this.$store
          .dispatch("user/balance")
          .then(() => {
          })
          .catch(() => {
          });
    },
  },
};
</script>

<style scoped>
::v-deep .v-input input {
  max-height: 50px;
}
</style>
