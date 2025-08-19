<template>
  <div style="height: 100%" class="d-flex align-center">
    <v-card v-click-outside="closeAuction" width="480px" height="564px" class="mx-auto">
      <div class="text-right">
        <v-card-subtitle
            class="d-inline-block pt-5"
            @click="closeAuction"
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
              {{ $t("productDetail.sellDialog.title") }}
            </v-card-text>
            <v-col class="d-flex justify-start align-center">
              <v-img
                  class="borderRadius"
                  max-height="63"
                  max-width="63"
                  :src="isOldImg ? host + imgUrl : host + imgUrl[0]"
              ></v-img>
              <div class="ml-4">
                <div class="description mt-1">{{ this.NFT ? this.NFT.name : "" }}</div>
                <span class="owner">
                    {{ `擁有者: ${NFT ? NFT.user.username : ""}` }}
                  </span>
              </div>
            </v-col>
            <v-col class="mt-4">
              <span class="owner">{{ $t("listed.auction.expiration") }}</span>
              <span>{{ date }}</span>
            </v-col>
            <v-col class="mt-4">
              <div class="ETHColor">
                {{ $t("listed.auction.startAuction") }}
              </div>
              <v-col class="d-flex pa-0">
                <VuetifyNumberInput
                    class="text-h4"
                    v-model.number="price"
                    backgroundColor=""
                    disabled
                >
                </VuetifyNumberInput>
              </v-col>
              <div class="d-flex align-center float-right mt-n14">
                <v-avatar size="18">
                  <img :src="`/static/ui/utils/coin/coin_${coin.id}.png`"/>
                </v-avatar>
                <p class="ml-1 mb-0 ETHColor">{{ coin.code }}</p>
              </div>
              <!-- <v-col class="ETHColor pa-0 mt-n5" style="font-size: 12px">
                <span>≈ ${{ cash }}</span>
              </v-col> -->
            </v-col>
            <!-- <v-col>
              <div class="text-center errorText py-3">{{ $t("listed.auction.errorAccount") }}</div>
            </v-col> -->
            <v-col cols="12" class="mx-auto">
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
                  @click="accountSuccess"
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
import {sellNFT} from "@/api/NFT";
import {mapGetters} from "vuex";
import VuetifyNumberInput from "@/components/VuetifyNumberInput";
import i18n from "@/lang";
export default {
  name: "Auction",
  components: {VuetifyNumberInput},
  data: () => ({}),
  props: [
    "imgUrl",
    "NFT",
    "date",
    "price",
    "coin",
    "config",
    "raw_price_date"
  ],
  computed: {
    ...mapGetters([
      'name', 'user', 'host', "getRate",
    ]),
    //图片匹配老数据
    isOldImg() {
      if (this.imgUrl) {
        if (typeof this.imgUrl === 'string') {
          return true
        } else return false
      } else return true
    },
    rate() {
      return this.getRate(1, Number(process.env.VUE_APP_RATE_TO_COIN_ID))
    },
    cash() {
      return (Number(this.price || 0) * Number(this.rate && this.rate.rate || 0)).toFixed(2)
    }
  },
  methods: {
    goService() {
      this.$store.commit("ui/SET_IS_SERVICE_PAGE_DIALOG", true);
    },
    closeAuction() {
      this.$emit("closeDialog")
      this.toasterErr(i18n.t("errorClose"));
    },
    accountSuccess() {
      sellNFT(this.$route.params.id, {
        'coin': this.coin.id,
        'price': this.price,
        'sell_way': 1,
        'end_days': this.raw_price_date[this.date]
      })
          .then((response) => {
            if (response.code === 0) {
              this.$emit("autionSuccess")
            } else {
              this.toasterErr(response.code)
            }
          })
          .catch(() => {

          })
    },
  }

}
</script>

<style scoped>
::v-deep .theme--dark.v-input input, .theme--dark.v-input textarea {
  color: rgba(255, 255, 255, 1);
}

::v-deep .v-input input {
  max-height: 50px;
}
</style>