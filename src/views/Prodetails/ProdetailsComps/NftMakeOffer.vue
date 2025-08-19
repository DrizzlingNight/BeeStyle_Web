<template>
  <v-list two-line height="430px" class="overflow-y-auto list d-flex align-top" @scroll.native="historyScroll">
    <v-list-item-group
        v-model="selected"
        style="width: 100%"
        v-if="items.length !== 0"

    >
      <template v-for="(item,index) in items">
        <v-list-item :key="item.title" @click="goMakeDeal(index)">
          <template v-slot:default="{ active }">
            <v-list-item-icon
                style="margin-right: 10px;margin-top: 20px; margin-bottom: unset;"
            >
              <v-img
                  src="@/assets/fake/people.png"
                  aspect-ratio="1"
              ></v-img>
            </v-list-item-icon>
            <v-list-item-content>
              <v-row class="d-flex justify-space-around">
                <v-col class="d-flex flex-column align-self-center">
                  <span class="text-caption text-truncate">{{ item.user.username }}</span>
                  <span class="text-caption">{{ moment().to(item.created_time) }}</span>
                </v-col>
                <show-price class="mr-8" :coin="coin" :nft-price="item.price" symbol="ETH"></show-price>
              </v-row>
            </v-list-item-content>

            <v-list-item-action v-if="isMine">
              <v-icon
                  v-if="!active"
                  color="grey lighten-1"
              >
                mdi-circle-outline
              </v-icon>
              <v-icon
                  v-else
                  color="yellow darken-3"
              >
                mdi-circle-slice-8
              </v-icon>
            </v-list-item-action>
          </template>
        </v-list-item>
      </template>
    </v-list-item-group>
    <div class="ma-auto" v-if="items.length === 0 && !loading">
      <v-img class="mt-8" max-height="160" max-width="301" src="@/assets/fake/transaction.png"></v-img>
      <p class="text-center mt-8" style="font-size: 22px;font-weight: bold">{{ $t("defaultNone") }}</p>
    </div>
    <overlay :loading="loading"></overlay>
  </v-list>
</template>

<script>
import ShowPrice from "@/components/ShowPrice";
import {mapGetters} from "vuex"
import {getNFTOffer} from "@/api/NFT";
import Overlay from "../../../components/Overlay";
import * as _ from "lodash";

export default {
  name: "NftMakeOffer",
  components: {Overlay, ShowPrice},
  props: [
    "nft",
    "isMine"
  ],
  data: () => ({
    selected: null,
    items: [],
    selectItem: '',
    limit: 10,
    page: 0,
    count: 0,
    loading: true,
    closeMakeOfferPassword: false
  }),
  computed: {
    ...mapGetters(['user', "getCoinById"]),
    coin() {
      if (this.nft && this.nft.coin.id) {
        return this.getCoinById(this.nft.coin.id)
      } else
        return null
    },
  },

  created() {
    this.getNftOfferList()
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
        this.getNftOfferList();
      }
    },
    getNftOfferList() {
      if (this.limit * this.page - this.count > 0) return false
      getNFTOffer({token: this.$route.params.id, offset: this.limit * this.page})
          .then(res => {
            this.page = this.page + 1
            this.loading = false
            this.count = res.data.count
            this.items = _.concat(this.items, res.data.results)

          }).catch(err => {
        console.error(err)
      })
    },
    goMakeDeal(index) {
      if (!this.isMine) return false
      this.$emit("confirmMakeOffer", this.items[index])
    }
  }
}
</script>

<style scoped>
.list::-webkit-scrollbar {
  display: none;
}
</style>
