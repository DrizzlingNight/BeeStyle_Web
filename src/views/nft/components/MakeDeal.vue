<template>
  <div style="height: 100%" class="d-flex align-center">
    <v-card class="mx-auto" width="480px" height="592px">
      <div class="text-right">
        <v-card-subtitle class="d-inline-block pt-5" @click="closeMakeDeal">
          <v-img
              max-height="14"
              max-width="14"
              src="@/assets/fake/close.png"
              style="cursor: pointer"
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
              v-if="!is3dModel"
              class="borderRadius"
                  max-height="67"
                  max-width="67"
              :src="NFTData.image"
              ></v-img>
              <model-viewer v-else :src="NFTData.image" camera-controls environment-image="neutral" shadow-intensity="1" autoplay id="nft-model" class="nft-model" />
              <v-col >
                <div class="description">{{ NFTData ? NFTData.name : "" }}</div>
                <div class="owner mt-1">
                  {{ `${NFTData ? (NFTData.user.profile.nickname || NFTData.user.username) : ""}` }}
                </div>
              </v-col>
            </v-col>
            <v-col class="d-flex justify-space-between mt-6">
              <div class="ETHColor">
                {{ $t("marketPlace.price.price") }}
              </div>
              <div>{{ price }} {{ NFTData.coin && NFTData.coin.name }}</div>
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
                  <img :src="`/static/ui/utils/coin/coin_${confirmOfferData.coin.id}.png`"/>
                </v-avatar>
                <p class="ml-1 mt-1 ETHColor"> {{ confirmOfferData.coin && confirmOfferData.coin.name }}</p>
              </div>
              <v-col class="ETHColor pa-0 mt-n5" style="font-size: 12px">
                <span>≈ $ {{ cash }}</span>
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
import { mapGetters } from "vuex"
import VuetifyNumberInput from "@/components/VuetifyNumberInput"
import { formatDecimal, numFormat } from "@/utils/math"
// import { OfferDeal } from "@/api/NFT"
// import i18n from '@/lang'

// 3D Model viewer
import { ModelViewer } from '@google/model-viewer'

export default {
  name: "",
  components: {
    VuetifyNumberInput,
    ModelViewer
  },
  data() {
    return {}
  },
  props: ["NFTData", "NFTsellFee", "confirmOfferData","isOldImg"],
  computed: {
    ...mapGetters(["name", "user","config", "host", "getRate"]),
    rate() {
      if(!this.confirmOfferData.coin) {
        return this.getRate(this.config.coin, Number(process.env.VUE_APP_RATE_TO_COIN_ID))
      }else {
        return this.getRate(this.confirmOfferData.coin.id, Number(process.env.VUE_APP_RATE_TO_COIN_ID))
      }
    },
    makeDealPrice() {
      return this.confirmOfferData.price
    },
    //當前價格
    price() {
      return numFormat(formatDecimal(this.NFTData.price, 4))
    },
    //現金價值
    cash() {
      return this.rate ? numFormat(formatDecimal(Number(this.rate.rate) * Number(this.makeDealPrice), 4)) : '--'
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
  methods:{
    goService() {
      this.$store.commit("ui/SET_IS_SERVICE_PAGE_DIALOG", true)
    },
    closeMakeDeal() {
      // location.reload()
      this.$emit("confirmMakeOffer", null, false)
      this.$emit("closeDialog")
      // this.toasterErr(i18n.t("errorClose"))
    },
    confirmMakeDeal() {
      this.$emit("confirmMakeDeal")
    }
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