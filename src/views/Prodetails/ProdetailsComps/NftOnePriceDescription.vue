<template>
  <v-col cols="12" class="mb-4 mt-16 pa-0 d-flex">
    <div class="owner mr-4">{{ $t("productDetail.price.price") + ':' }}</div>
    <div class="d-flex">
      <v-avatar size="28" class="mr-4">
        <img src="@/assets/fake/price/ETH.png"/>
      </v-avatar>
      <div class="mt-n2">
        <div style="font-size: 30px">{{ showPrice }}</div>
        <div class="owner" style="font-size: 16px">≈ ${{ processingPrice }}</div>
      </div>
    </div>
  </v-col>
</template>

<script>
import {formatDecimal, numFormat} from "@/utils/math";
import {mapGetters} from "vuex";

export default {
  name: "NftOnePriceDescription",
  data: () => ({
  }),
  props: ["nft"],
  created() {
  },
  computed: {
    ...mapGetters(['getRate','getCoinById']),
    coin() {
      if (this.nft && this.nft.coin.id) {
        return this.getCoinById(this.nft.coin.id)
      } else
        return null
    },
    rate(){
      if (this.coin)
        return this.getRate(this.coin.id, Number(process.env.VUE_APP_RATE_TO_COIN_ID))
      return null
    },
    price() {
      return formatDecimal(this.nft.price, 4);
    },
    showPrice() {
      if (this.price) {
        return numFormat(this.price)
      }
      return null
    },
    processingPrice() {
      return numFormat(formatDecimal(Number(this.price) * this.rate.rate, 4));
    },
  },
  methods: {
  },
};
</script>

<style scoped>
.owner {
  color: rgba(158, 158, 158, 1);
}
</style>