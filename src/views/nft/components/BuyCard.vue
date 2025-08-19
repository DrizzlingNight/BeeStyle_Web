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
              style="cursor: pointer"
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
                  v-if="!is3dModel"
                  class="borderRadius"
                  max-height="63"
                  max-width="63"
                  :src="NFTData.image"
              ></v-img>
              <model-viewer v-else :src="NFTData.image" camera-controls environment-image="neutral" shadow-intensity="1" autoplay id="nft-model" class="nft-model" />
              <div class="ml-3 mt-3">
                <div class="description">{{ NFTData ? NFTData.name : "" }}</div>
                <div class="owner mt-1" style="font-size: 14px">
                  {{ `${$t('nft.owner')}: ${NFTData ? (NFTData.user.profile.nickname || NFTData.user.username) : ""}` }}
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
                <img :src="`/static/ui/utils/coin/coin_${NFTData.coin.id}.png`"/>
              </v-avatar>
              <p class="ml-1 mt-1 ETHColor">{{ NFTData.coin && NFTData.coin.name }}</p>
            </div>
            <v-col class="ETHColor pa-0 mt-n3" style="font-size: 12px">
              <span>≈ $ {{ cash }}</span>
            </v-col>
            </v-col>
            <v-col class="d-flex justify-space-between pa-0">
              <v-col class="ETHColor">
                <div>{{ $t("productDetail.sellDialog.balance") }}</div>
                <div class="my-1">{{ $t("productDetail.sellDialog.formalities") }}</div>
                <div>{{ $t("productDetail.sellDialog.willPay") }}</div>
              </v-col>
              <v-col class="text-right">
                <div v-if="!lowerPrice">{{ showBalance }} {{ NFTData.coin && NFTData.coin.name }}</div>
                <div v-else class="errorColor">{{ showBalance }} {{ NFTData.coin && NFTData.coin.name }}</div>
                <div class="my-1">{{ showFee }} {{ NFTData.coin && NFTData.coin.name }}</div>
                <div>{{ payablePrice }} {{ NFTData.coin && NFTData.coin.name }}</div>
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
import { mapGetters } from "vuex"
import { formatDecimal, numFormat } from "@/utils/math"
import VuetifyNumberInput from "@/components/VuetifyNumberInput"
import { buyNFT } from "@/api/NFT"
// import i18n from "@/lang"

// 3D Model viewer
import { ModelViewer } from '@google/model-viewer'

export default {
  name: "BuyCard",
  components: {
    VuetifyNumberInput,
    ModelViewer
  },
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
    //餘額
    totalPrice() {
      if (this.NFTData.coin) {
        let balance = this.getBalanceById(this.NFTData.coin.id)
        return balance && formatDecimal(balance.amount, 4) || "0"
      } else
        return null
    },
    showBalance() {
      return numFormat(this.totalPrice)
    },
    //手續費比率
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
      let payablePrice = Number(this.payablePrice.replace(/[,]/g, ''))
      let totalPrice = Number(this.totalPrice.toString().replace(/[,]/g, ''))

      // console.log('payablePrice', payablePrice)
      // console.log('totalPrice', totalPrice)
  
      if (payablePrice > totalPrice) {
        return true;
      } else return false;
    },
    //現金價值
    cash() {
      return this.rate ? numFormat(formatDecimal(Number(this.rate.rate) * Number(this.nftPrice), 4)) : '--'
    },
    // 判斷是否為3D Model
    is3dModel() {
      const file = this.NFTData.image.split('.')
      const fileExtension = file[file.length -1]
      if (fileExtension === 'gltf-binary') {
        return true
      } else {
        return false
      }
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

<style lang="scss" scoped>
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

// 3D Model Viewer
.nft-model {
  width: 67px;
  height: 67px;
}
</style>
