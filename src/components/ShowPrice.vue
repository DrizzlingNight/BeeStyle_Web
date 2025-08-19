<template>
  <v-col
      class="d-flex flex-column align-end"
  >
    <v-row
        class="price align-center"
    >
      <v-img
          v-if="price"
          height="17"
          width="17"
          max-height="17"
          max-width="17"
          aspect-ratio="1"
          class="rounded-circle"
          :src="`/static/ui/utils/coin/coin_${coin.id}.png`"/>
      <span class="coin-name">{{ `${showPrice || '--'} ${showPrice && coin && coin.code || ''}` }}</span>
    </v-row>
    <v-row>
      <span class="ETHColor" style="font-size: 9px;" v-if="price">≈ $ {{ cash }}</span>
    </v-row>
  </v-col>
</template>

<script>
import { mapGetters } from "vuex"
import {formatStrPrice,formatDecimal,numFormat} from "@/utils/math";
export default {
  name: "ShowPrice",
  props:[
      'nftPrice',
      'coin'
  ],
  data:()=>({
    coinExchangeList: "",
    rateList: '',
  }),
  computed:{
    ...mapGetters(['getRate']),
    rate(){
      if (this.coin)
        return this.getRate(this.coin.id, Number(process.env.VUE_APP_RATE_TO_COIN_ID))
      return null
    },
    price(){
      if (this.nftPrice)
        return formatStrPrice(this.nftPrice, 4)
      return null
    },
    showPrice() {
      if(this.price) {
        return numFormat(this.price)
      }
      return null
    },
    cash(){
      if(this.price && this.rate) {
        return numFormat(formatDecimal((Number(this.price)) * (Number(this.rate.rate)),4))
      }
      return '--'
    }
  },
  methods:{
  }
}
</script>

<style lang="scss" scoped>
.price {
  flex-wrap: nowrap;

  .coin-name {
    font-size: 14px;
    font-weight: bold;
    margin-left: 8px;
    white-space: nowrap;
  }
}

.ETHColor {
  color: rgba(153, 153, 153, 1);
}
</style>
