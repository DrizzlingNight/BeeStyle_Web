<template>
  <div>
    <v-list class="overflow-y-auto list" height="430px" @scroll.native="historyScroll">
      <v-timeline v-if="NFTHistoryList.length !== 0" dense>
        <v-timeline-item small v-for="(history, index) in NFTHistoryList" :key="index">
          <template v-slot:icon>
            <div v-if="index === 0" class="hollowCircle2"></div>
            <div v-else class="hollowCircle1"></div>
          </template>
          <div class="d-flex justify-space-between align-center">
            <div class="d-flex justify-space-between align-center" style="font-size: 14px">
              <v-img class="d-inline-block mr-2" max-width="40" max-height="41"
                     src="@/assets/fake/people.png"></v-img>
              <div v-if="history.opt === 1">
                <span class="ETHColor">{{ $t("productDetail.history.you") }}</span>{{
                  ' ' + history.user.username + ' '
                }}<span
                  class="ETHColor">{{ $t("productDetail.history.create") }}</span></div>
              <div v-if="history.opt === 2">
                <span class="ETHColor">{{ $t("productDetail.history.you") }}</span>{{
                  ' ' + history.user.username + ' '
                }}<span
                  class="ETHColor">{{ $t("productDetail.history.deliver") }}</span></div>
              <div v-if="history.opt === 3">{{ history.user.username + ' ' }}<span
                  class="ETHColor">{{ $t("productDetail.history.onSale") }}</span></div>
              <div v-if="history.opt === 4">{{ history.user.username + ' ' }}<span
                  class="ETHColor">{{ $t("productDetail.history.cancelSale") }}</span></div>
              <div v-if="history.opt === 5">{{ history.user.username + ' ' }}<span
                  class="ETHColor">{{ $t("productDetail.history.makeOffer") }}</span>
                <div>{{ price(history.detail.price) }}ETH</div>
              </div>
              <div v-if="history.opt === 6">{{ history.user.username + ' ' }}<span
                  class="ETHColor">{{ $t("productDetail.history.bid") }}</span>
                <div>{{ price(history.detail.price) }}ETH</div>
              </div>
              <div v-if="history.opt === 7">{{ history.user.username + ' ' }}<span
                  class="ETHColor">{{ $t("productDetail.history.bought") }}</span>
                <div>{{ price(history.detail.price) }}ETH</div>
              </div>
              <div v-if="history.opt === 8">{{ history.user.username + ' ' }}<span
                  class="ETHColor">{{ $t("productDetail.history.redeem") }}</span>
                <div>{{ price(history.detail.price) }}ETH</div>
              </div>
              <div v-if="history.opt === 9">{{ history.user.username + ' ' }}<span
                  class="ETHColor">{{ $t("productDetail.history.destory") }}</span></div>
              <div v-if="history.opt === 10">{{ history.user.username + ' ' }}<span
                  class="ETHColor">{{ $t("productDetail.history.cancelOffer") }}</span></div>
              <div v-if="history.opt === 11">{{ history.user.username + ' ' }}<span
                  class="ETHColor">{{ $t("productDetail.history.transferOut") }}</span></div>
            </div>
            <div class="caption ETHColor">{{ date(history.created_time) }}</div>
          </div>
        </v-timeline-item>
      </v-timeline>
      <div class="ma-auto" v-if="NFTHistoryList.length === 0 && !loading">
        <v-img class="mt-8" max-height="160" max-width="301" src="@/assets/fake/transaction.png"></v-img>
        <p class="text-center mt-8" style="font-size: 22px;font-weight: bold">{{ $t("defaultNone") }}</p>
      </div>
      <overlay :loading="loading"></overlay>
    </v-list>
  </div>

</template>

<script>
import {formatDecimal} from "@/utils/math";
import {getNFTHistory} from "@/api/NFT";
import Overlay from "../../../components/Overlay";
import * as _ from "lodash";
import {numFormat} from "../../../utils/math";

export default {
  name: "NftHistoryTab",
  components: {Overlay},
  data: () => ({
    NFTHistoryList: [],
    loading: true,
    limit: 10,
    page: 0,
    count:0,
  }),
  created() {
    this.getNFTHistory();
  },
  computed: {
    date() {
      return function (time) {
        let current = time.replace(/-/g, "/").replace(/T/g, " ").split(/\./g)[0];
        return current;
      };
    },
    price() {
      return function (price) {
        let currentPrice = price.split(/E/g)[0];
        return numFormat(formatDecimal(currentPrice, 4));
      };
    },
  },
  methods: {
    //下拉加载更多
    historyScroll(e) {
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
        this.getNFTHistory();
      }
    },
    //获取某一nft历史记录
    getNFTHistory() {
      if(this.limit * this.page - this.count > 0) return false
      getNFTHistory({
        token: this.$route.params.id,
        offset: this.limit * this.page
      })
          .then((response) => {
            this.page = this.page + 1
            this.loading = false
            this.count = response.data.count
            this.NFTHistoryList = _.concat(this.NFTHistoryList, response.data.results)
          })
          .catch(() => {
          });
    },
  },
};
</script>

<style scoped>
.ETHColor {
  color: rgba(153, 153, 153, 1);
}

.list::-webkit-scrollbar {
  display: none;
}

.hollowCircle1 {
  width: 100%;
  height: 100%;
  background: #0f0f0f;
  border-radius: 50%;
  border: 2px solid rgba(151, 151, 151, 1);
}

.hollowCircle2 {
  width: 100%;
  height: 100%;
  background: #d8d8d8;
  border-radius: 50%;
  border: 2px solid rgba(216, 216, 216, 1);
}

::v-deep .v-timeline--dense:not(.v-timeline--reverse):before {
  height: calc(100% - 81px) !important;
  position: absolute !important;
  top: 40px !important;
  background-color: rgba(151, 151, 151, 1) !important;
}
</style>
