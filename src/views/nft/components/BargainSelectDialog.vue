<template>
  <div style="height: 100%" class="d-flex align-center">
    <v-card width="480" min-height="643" class="mx-auto">
      <div class="text-right">
        <v-card-subtitle
            class="d-inline-block"
            @click="closeBargainDialog"
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
        <v-row class="d-flex justify-center">
          <v-col cols="11">
            <v-card-text class="white--text text-center" style="font-size: 24px">
              {{ $t('nft.bargainDialog.title', [count]) }}
            </v-card-text>
            <v-card-text class="hintText text-center">
              {{ $t('nft.bargainDialog.description') }}
            </v-card-text>
            <!-- NFT資訊 -->
            <v-col class="d-flex justify-start px-3 py-0 mt-4">
              <v-img
                  v-if="!is3dModel"
                  class="borderRadius"
                  max-height="80"
                  max-width="80"
                  :src="nft ? nft.image : ''"
              ></v-img>
              <model-viewer v-else :src="nft ? nft.image : ''" camera-controls environment-image="neutral" shadow-intensity="0" autoplay id="nft-model" class="nft-model" />
              <div class="ml-3 mt-3">
                <div class="description" style="font-size: 18px">{{ nft ? nft.name : "" }}</div>
                <div class="owner mt-1" style="font-size: 14px">
                  {{ `${$t('nft.owner')}: ${nft ? (nft.user.profile.nickname || nft.user.username) : ""}` }}
                </div>
              </div>
            </v-col>
            <!-- 出價列表 -->
            <v-list two-line height="230px" class="overflow-y-auto list d-flex align-top mt-4" @scroll.native="historyScroll">
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
                            <span class="text-caption text-truncate">{{ (item.user.profile.nickname || item.user.username) }}</span>
                            <span class="text-caption">{{ moment().to(item.created_time) }}</span>
                          </v-col>
                          <show-price class="mr-8" :coin="getCoin(item.coin)" :nft-price="item.price" symbol="ETH"></show-price>
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
            <v-col cols="12" class="mx-auto mt-7">
              <div class="hintText mb-4" style="font-size: 12px">
                <span class="hintText">{{ $t('nft.bargainDialog.alert') }}</span>
              </div>
              <v-btn
                  block
                  class="btnColor"
                  :disabled="!isSelected"
                  @click="confirmMakeDeal"
                  style="height: 50px"
              >
                {{ $t("nft.makeDeal") }}
              </v-btn>
            </v-col>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import ShowPrice from "@/components/ShowPrice"
import { mapGetters } from "vuex"
import { getNFTOffer } from "@/api/NFT"
import Overlay from "@/components/Overlay"
import * as _ from "lodash"

// 3D Model viewer
import { ModelViewer } from '@google/model-viewer'

export default {
  name: "BargainDialog",
  components: {
    Overlay,
    ShowPrice,
    ModelViewer
  },
  props: [
    "nft",
    "isMine",
    "isOldImg"
  ],
  data() {
    return {
      selected: null,
      items: [],
      selectItemIndex: '',
      limit: 10,
      page: 0,
      count: 0,
      loading: true,
      closeMakeOfferPassword: false,
      isSelected: false,
    }
  },
  computed: {
    ...mapGetters(['user', "getCoinById"]),
    coin() {
      if (this.nft && this.nft.coin.id) {
        return this.getCoinById(this.nft.coin.id)
      } else
        return null
    },
    // 判斷是否為3D Model
    is3dModel() {
      const file = this.nft.image.split('.')
      const fileExtension = file[file.length -1]
      if (fileExtension === 'gltf-binary') {
        return true
      } else {
        return false
      }
    },
  },

  created() {
    this.getNftOfferList()
  },
  methods: {
    // 取得幣種
    getCoin(id) {
      const coin = this.getCoinById(id)
      return coin
    },
    closeBargainDialog() {
      this.isSelected = false
      this.selectItemIndex = null
      this.$emit("confirmMakeOffer", null, this.isSelected)
      this.$emit("closeDialog")
    },
    //下拉加載更多
    historyScroll(e) {
      //向上滾動高度
      let scrollTop = e.srcElement.scrollTop
      //內容總高度
      let scrollHeight = e.srcElement.scrollHeight
      //內容可視區域大小
      let clientHeight = e.srcElement.clientHeight
      //內容距離底部多少距離
      let height = scrollHeight - scrollTop - clientHeight
      // console.log('內容總高度',scrollHeight)
      // console.log('向上滾動高度',scrollTop)
      // console.log('內容可視區域大小',clientHeight)
      // console.log('內容距離底部多少距離',scrollHeight-scrollTop-clientHeight)
      if (!height) {
        this.getNftOfferList()
      }
    },
    getNftOfferList() {
      if (this.limit * this.page - this.count > 0) return false
      getNFTOffer({token: this.$route.params.id, offset: 0})
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

      if (this.selectItemIndex === index && this.isSelected) {
        this.isSelected = false
      } else {
        this.isSelected = true
      }
      this.selectItemIndex = index
      // console.log('this.isSelected',this.isSelected)
      this.$emit("confirmMakeOffer", this.items[index], this.isSelected)
    },
    confirmMakeDeal() {
      this.$emit('closeDialog')
      this.$emit('makeDeal')
    }
  }
}
</script>

<style lang="scss" scoped>
.list::-webkit-scrollbar {
  display: none;
}

.BargainDialog {
  display: flex;
  align-items: center;
  justify-content: center;
}

// 3D Model Viewer
.nft-model {
  width: 80px;
  height: 80px;
}
</style>