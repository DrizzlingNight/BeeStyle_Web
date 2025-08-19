<template>
  <v-col cols="12" class="mt-8">
    <v-row class="mt-2" no-gutters>
      <v-col cols="5" class="d-flex">
        <span class="owner" style="font-size: 16px">{{ $t("productDetail.auctionCard.startPrice") }}：</span>
        <v-avatar size="28" class="mt-1">
          <img src="@/assets/fake/price/ETH.png"/>
        </v-avatar>
        <div class="ml-4">
          <span  style="font-size: 18px">{{ price }}</span>
          <p class="owner" style="font-size: 12px">≈ ${{ processingPrice }}</p>
        </div>
      </v-col>
      <v-spacer></v-spacer>
      <v-col class="text-right px-0" cols="4">
        <div class="owner text-right" style="font-size: 16px">{{ $t("productDetail.auctionCard.remainingDate") }}</div>
        <div class="d-flex mt-2 float-right text-center" style="font-size: 24px;font-family: 'Roboto', sans-serif">
          <div class="date" style="border-radius: 5px">{{ d }}</div>
          <div class="date mx-3" style="border-radius: 5px">{{ h }}</div>
          <div class="date" style="border-radius: 5px">{{ m }}</div>
          <div class="date ml-3" style="border-radius: 5px">{{ s }}</div>
        </div>
      </v-col>
    </v-row>
    <v-row class="mt-7" no-gutters>
      <v-col class="owner" cols="4">
        <span style="font-size: 16px">{{ $t("productDetail.price.newPrice") }}：</span>
        <span>{{ processingPrice }}</span>
      </v-col>
      <v-col class="d-flex justify-end">
        <div class="d-flex mt-2 ml-14 mr-4">
          <v-avatar size="30">
            <img src="@/assets/fake/price/ETH.png"/>
          </v-avatar>
        </div>
        <div>
          <div style="font-size:30px ">{{ showPrice }} ETH</div>
          <div class="owner text-right" style="font-size: 16px">≈ ${{ processingPrice }}</div>
        </div>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import {formatDecimal,numFormat} from "@/utils/math"
import {mapGetters} from "vuex";

export default {
  name: "NftOwnAccount",
  data: () => ({
    d: '',
    h: '',
    m: '',
    s: '',
  }),
  props: [
    "nft"
  ],
  created() {
    this.countTime()
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
      return formatDecimal(this.nft.price, 4)
    },
    showPrice() {
      if(this.price) {
        return numFormat(this.price)
      }
      return null
    },
    processingPrice() {
      return numFormat(formatDecimal(Number(this.price) * this.rate.rate, 4))
    },
    newPrice() {
      return numFormat(formatDecimal(Number(this.current_price), 4))
    },
    //竞拍截止时间
    nftEndTime() {
      const endTime = this.nft.end_time.split(/\./g)[0].replace(/T/g, ' ')
      return endTime
    }
  },
  methods: {
    countTime: function () {
      //获取当前时间
      var date = new Date()
      var now = date.getTime()
      //设置截止时间
      var endDate = new Date(this.nftEndTime)
      var end = endDate.getTime()
      //时间差
      var leftTime = end - now
      //定义变量 d,h,m,s保存倒计时的时间
      if (this.s === '00' && this.m === '00' && this.h === '00' && this.d === '00') {
        clearInterval(timer)
      }
      if (leftTime >= 0) {
        this.d = Math.floor(leftTime / 1000 / 60 / 60 / 24)//天数我没用到，暂且写上
        this.h = Math.floor((leftTime / 1000 / 60 / 60) % 24)
        this.m = Math.floor((leftTime / 1000 / 60) % 60)
        this.s = Math.floor((leftTime / 1000) % 60)
        if (this.s < 10) {
          this.s = '0' + this.s
        }
        if (this.m < 10) {
          this.m = '0' + this.m
        }
        if (this.h < 10) {
          this.h = '0' + this.h
        }
        if (this.d < 10) {
          this.d = '0' + this.d
        }

      }
      //递归每秒调用countTime方法，显示动态时间效果
      let timer = setTimeout(this.countTime, 1000)
    },
  }
}
</script>

<style scoped>
.date {
  width: 40px;
  height: 40px;
  line-height: 40px;
  background-color: rgba(66, 66, 66, 1);
}
</style>
