<template>
  <div>
    <v-list two-line height="430px" class="overflow-y-auto list d-flex align-top"
            @scroll.native="makeOfferScroll">
      <v-list-item-group
          color="inhert"
          v-model="selected"
          v-if="items.length !== 0"
          style="width: 100%"
      >
        <v-list-item v-for="(item) in items" :key="item.title">
          <v-list-item-icon
              style="margin-right: 10px; margin-bottom: unset;"
          >
            <v-img
                class="mt-2"
                max-height="20"
                max-width="20"
                src="@/assets/fake/people.png"
                aspect-ratio="1"
            ></v-img>
          </v-list-item-icon>
          <v-row class="d-flex justify-space-around" no-gutters>
            <v-col class="d-flex flex-column align-self-center">
              <span class="text-caption text-truncate">{{ item.user.username }}</span>
              <span class="text-caption">{{ moment().to(item.created_time) }}</span>
            </v-col>
            <show-price :nft-price="item.price" class="mt-2 mr-2" :coin="coin" symbol="ETH"></show-price>
          </v-row>
        </v-list-item>
      </v-list-item-group>
      <div v-if="items.length === 0 && !loading" class="ma-auto">
        <v-img class="mt-8" max-height="160" max-width="301" src="@/assets/fake/transaction.png"></v-img>
        <p class="text-center mt-8" style="font-size: 22px;font-weight: bold">{{ $t("defaultNone") }}</p>
      </div>
      <overlay :loading="loading"></overlay>
    </v-list>
  </div>
</template>

<script>
import ShowPrice from "@/components/ShowPrice";
import {mapGetters} from "vuex"
import {getNFTBid} from "@/api/NFT";
import {formatDecimal} from "@/utils/math";
import Overlay from "../../../components/Overlay";
import * as _ from "lodash";

export default {
  name: "NFTBidOffer",
  components: {Overlay, ShowPrice},
  props: [
    "nft"
  ],
  data: () => ({
    selected: null,
    items: [],
    loading: true,
    selectItem: '',
    limit: 10,
    page: 0,
    count:0,
  }),
  computed: {
    ...mapGetters(['user', "getCoinById"]),
    nftPrice() {
      return formatDecimal(Number(this.nft ? this.nft.price : ""), 4)
    },
    coin() {
      if (this.nft && this.nft.coin.id) {
        return this.getCoinById(this.nft.coin.id)
      } else
        return null
    },
  },
  created() {
    this.getNFTBid()
  },
  methods: {
    //下拉加载更多
    makeOfferScroll(e) {
      //向上滚动高度
      let scrollTop = e.srcElement.scrollTop
      //内容总高度
      let scrollHeight = e.srcElement.scrollHeight
      //内容可视区域大小
      let clientHeight = e.srcElement.clientHeight
      //内容距离底部多少距离
      let height = scrollHeight - scrollTop - clientHeight
      // console.log('内容总高度',scrollHeight)
      // console.log('向上滚动高度',scrollTop)
      // console.log('内容可视区域大小',clientHeight)
      // console.log('内容距离底部多少距离',scrollHeight-scrollTop-clientHeight)
      if (!height) {
        this.getNFTBid();
      }
    },
    getNFTBid() {
      if(this.limit * this.page - this.count > 0) return false
      getNFTBid({token: this.$route.params.id, offset: this.limit * this.page})
          .then(res => {
            this.page = this.page + 1
            this.loading = false
            this.count = res.data.count
            this.items = _.concat(this.items, res.data.results)
          }).catch(err => {
        console.error(err)
      })
    },
  }
}
</script>

<style scoped>
</style>
