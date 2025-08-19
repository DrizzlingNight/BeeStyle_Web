<template>
  <div>
    <v-container style="max-width: 604px" class="px-5">
      <v-row>
        <v-col cols="12" class="mt-16">
          <span class="font-weight-medium" style="font-size: 40px">{{ $t("listed.title") }}</span>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-btn
              block
              x-large
              class="py-10"
              outlined
              :color="this.isPrice ? 'rgba(247, 181, 0, 1)' : 'rgba(99, 99, 99, 1)'"
              :style="this.isPrice ? 'border-color: rgba(247, 181, 0, 1);' : 'border-color: rgba(99, 99, 99, 1);'"
              @click="isPrice = true"
          >
            <div>
              <div class="white--text" style="font-size: 16px">{{ $t("listed.btn.onePrice") }}</div>
              <span class="ETHColor" style="font-size: 12px">{{ $t("listed.btn.onePriceText") }}</span>
            </div>
          </v-btn>
        </v-col>
        <v-col cols="12" md="6">
          <v-btn
            block
            x-large
            class="py-10"
            outlined 
            :color="this.isPrice ? 'rgba(99, 99, 99, 1)' : 'rgba(247, 181, 0, 1)'"
            :style="this.isPrice ? 'border-color: rgba(99, 99, 99, 1);' : 'border-color: rgba(247, 181, 0, 1);'"
            @click="isPrice = false"
          >
            <div>
              <div class="white--text" style="font-size: 16px">{{ $t("listed.btn.auction") }}</div>
              <span class="ETHColor" style="font-size: 12px">{{ $t("listed.btn.auctionText") }}</span>
            </div>
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="12">
          <v-card class="btnBackColor" flat v-if="isPrice">
            <v-form ref="form" v-model="validOnePrice">
              <p class="mb-1">{{ $t("listed.onePriceSelect.setPrice") }}</p>
              <VuetifyNumberInput
                  class="mt-n2"
                  v-model.number="price"
                  :placeholder="$t('listed.onePriceSelect.setPricePlaceholder')"
                  backgroundColor=""
                  type="number"
                  :rules="inputRules"
              ></VuetifyNumberInput>
              <!-- 2022.03.03 選擇幣種改回上架時選擇 -->
              <p class="mb-1">{{ $t('listed.selectCoin') }}</p>
              <v-select
                  v-model="selectedCoin"
                  :items="coinList"
                  item-text="code"
                  item-value="id"
                  :label="$t('listed.coin')"
                  return-object
                  single-line
                  class="mt-n2"
              ></v-select>
              <p class="caption grey--text lighten-5">{{ $t("listed.onePriceSelect.title") }}</p>
            </v-form>
            <!-- <div class="mt-9">
              <span style="font-size: 16px" class="owner">{{ $t("listed.onePriceSelect.expireDate") }}</span>
              <span style="font-size: 14px">{{ this.NFT ? endDate(this.NFT.expiration) : '--' }}</span>
              <span style="font-size: 12px" class="red--text ml-3">({{ $t("listed.onePriceSelect.errorText") }})</span>
            </div> -->
            <v-col cols="12" md="10" class="mx-auto mt-8 px-0">
              <div>
                <v-btn
                    block
                    style="height: 50px"
                    class="btnColor mb-2 mt-5"
                    @click="success"
                    :disabled="!validOnePrice || !selectedCoin.id || !price"
                >
                  {{ $t("listed.confirmBtn") }}
                </v-btn>
              </div>
            </v-col>
          </v-card>
          <v-card class="btnBackColor" flat v-else>
            <v-form ref="form2" v-model="validAuction">
              <v-col cols="12" class="pa-0 mt-6">
                <div style="font-size: 16px">{{ $t("listed.auction.start") }}</div>
                <VuetifyNumberInput
                    class="text-body-1"
                    v-model.number="price"
                    :placeholder="$t('listed.auction.startPricePlaceholder')"
                    backgroundColor=""
                    type="number"
                    :rules="inputRules"
                ></VuetifyNumberInput>
                <!-- <p class="ETHColor" style="font-size: 12px">{{ $t("listed.auction.startText") }}</p> -->
                <!-- 2022.03.03 選擇幣種改回上架時選擇 -->
                <p class="mb-1">{{ $t('listed.selectCoin') }}</p>
                <v-select
                    v-model="selectedCoin"
                    :items="coinList"
                    item-text="code"
                    item-value="id"
                    :label="$t('listed.coin')"
                    return-object
                    single-line
                    class="mt-n2"
                ></v-select>
              </v-col>
              <!-- 選擇拍賣 -->
              <v-col cols="12" class="pa-0 mt-13">
                <div class="mb-0">{{ $t("listed.auction.end") }}</div>
                <v-select
                    color="#F7B500"
                    class="pt-0 mt-0"
                    v-model="date"
                    :items="price_date"
                    :placeholder="$t('listed.auction.endPlaceholder')"
                    required
                    :rules="inputRules"
                ></v-select>
              </v-col>
              <!-- <div class="d-flex justify-space-between">
                <v-col cols="7" class="pa-0">
                  <div style="font-size: 12px;color: #999999">{{ $t("listed.auction.endText") }}</div>
                </v-col>
                <v-col cols="3" class="pa-0">
                  <div style="font-size: 12px">
                    <span style="font-size: 12px;" class="ETHColor">{{ $t("listed.auction.endDate") }}：</span>
                    <span class="white--text" v-if="DateDiffer(this.NFT ? this.NFT.expiration:'')">{{
                        this.NFT ? endDate(this.NFT.expiration) : '--'
                      }}</span>
                    <span v-else class="red--text">{{ this.NFT ? endDate(this.NFT.expiration) : '--' }}</span>
                  </div>
                </v-col>
              </div> -->
            </v-form>
            <v-col cols="12" md="10" class="mx-auto mt-8">
              <div>
                <!-- 確認發布競拍 -->
                <v-btn
                    block
                    style="height: 50px"
                    class="btnColor mb-2 mt-5"
                    @click="auction = true"
                    :disabled="!validAuction || !selectedCoin.id || !price"
                >
                  {{ $t("listed.confirmAuction") }}
                </v-btn>
              </div>
            </v-col>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="auctionDialog" width="480px">
      <auction v-if="auction" @closeDialog="closeDialog" :raw_price_date="raw_price_date" :imgUrl="imgUrl"
               :config="config" :n-f-t="NFT" :date="date" :coin="selectedCoin" :price="price" @autionSuccess="autionSuccess"></auction>
    </v-dialog>
    <v-dialog v-model="successDialog" width="650px">
      <sell-success v-if="sellSuccess"></sell-success>
    </v-dialog>
  </div>

</template>



<script>
// TODO 重構
// !!!!!!! 這頁他媽資料跟邏輯超亂要找時間重構 (或是重寫)


import {getNFT, sellNFT} from "@/api/NFT";
import VuetifyNumberInput from "@/components/VuetifyNumberInput";

import i18n from "@/lang";
import {getConfig} from "@/api/coin";
import {mapGetters} from "vuex";
import Auction from "./ListedComps/Auction";
import SellSuccess from "./ListedComps/SellSuccess";

export default {
  name: "listed",
  components: {SellSuccess, Auction, VuetifyNumberInput},
  data: () => ({
    selectedCoin: {},
    // 給 VuetifyNumberInput 吃的Option
    inputOption: {
      locale: "zh-TW",
      prefix: "",
      suffix: "",
      length: 11,
      fixed: 4,
      precision:4,
    },
    dialog: false,
    validOnePrice: false,
    validAuction: false,
    sellSuccess: false,
    price: '',
    auction: false,
    date: '',
    NFT_id: '',
    NFT: null,
    imgUrl: null,
    isPrice: true,
    config: '',
    price_date: [],
    raw_price_date: null,
    annualizedVNIOption: {
      locale: i18n.locale,
      suffix: "ETH",
      length: 10,
      fixed: 4,
      placeholder: i18n.t("listed.onePriceSelect.title")
    },
    inputRules: [(v) => !!v || ""],
  }),
  created() {
    // 若未登入就返回原頁
    if (!this.isLogin) {
      this.$router.go(-1)
    }
    this.NFT_id = this.$route.params.id
    this.getNFTInfo()
    this.getConfig()
  },
  computed: {
    ...mapGetters([
      'name', 'user', 'host', 'coinList'
    ]),
    //判斷是否登錄
    isLogin() {
      return this.user ? true : false
    },
    auctionDialog() {
      return this.auction || this.sellSuccess
    },
    successDialog() {
      return this.sellSuccess
    },
    endDate() {
      return function (time) {
        let data = new Date(time).toJSON();
        if (data != null) {
          let current = data.split(/T/g)[0]
          let chinaDate1 = new Date(current.replace(/-/g, '/'))
          let china2 = chinaDate1.toUTCString()
          let chinaDateArray = china2.split(' ')
          let displayDate = `${chinaDateArray[1]}， ${chinaDateArray[2]},${chinaDateArray[3]}`
          return displayDate
        }

      }
    },
    DateDiffer() {
      return function (time) {
        //date1结束时间
        let date1 = new Date(time);
        //date2当前时间
        let date2 = new Date();
        date1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
        date2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
        const diff = date1.getTime() - date2.getTime(); //目标时间减去当前时间
        const diffDate = diff / (24 * 60 * 60 * 1000);  //计算当前时间与结束时间之间相差天数
        if (diffDate < this.config.nft_sell_end_time_limit) {
          return false
        }
        return true
      }
    },
    showSelectDate() {
      let selectDate = []
      let timeList = []
      //过期时间
      let expiration = new Date(this.NFT ? this.NFT.expiration : '')
      //当前时间
      let current = new Date();
      expiration = new Date(expiration.getFullYear(), expiration.getMonth(), expiration.getDate());
      current = new Date(current.getFullYear(), current.getMonth(), current.getDate());
      const diff = expiration.getTime() - current.getTime(); //目标时间减去当前时间
      const diffDate = diff / (24 * 60 * 60 * 1000);  //计算当前时间与结束时间之间相差天数
      const diffDateExprient = diffDate - this.config.nft_sell_expired_time_limit //截止时间-当前时间-规定的1天间隔
      for (let i in this.price_date) {
        let time = Number(this.price_date[i].split(' ')[0])
        timeList.push(time)
      }
      for (let i = 0; i < timeList.length; i++) {
        if (timeList[i] < diffDateExprient) {
          selectDate.push(this.price_date[i])
        }
      }
      return selectDate
    }
  },
  methods: {
    goDetail() {
      this.$router.push('/nft/' + this.NFT_id)
    },
    closeDialog() {
      this.auction = false
    },
    autionSuccess() {
      this.auction = false
      this.sellSuccess = true
    },
    async getNFTInfo() {
      await getNFT(this.NFT_id)
          .then(response => {
            console.log('getNFTInfo res', response)
            this.NFT = response.data
            this.selectedCoin = response.data.coin || this.coinList[0]
            this.inputOption.suffix = this.selectedCoin.name
            this.imgUrl = response.data.files
          })
          .catch(() => {
          });
    },
    success() {
      sellNFT(this.NFT_id, {'coin': this.selectedCoin.id, 'price': this.price, 'sell_way': 0})
          .then((response) => {
            if (response.code === 0) {
              this.sellSuccess = true
            } else {
              this.toasterErr(response.code)
            }
          })
          .catch(() => {

          })
    },

    getConfig() {
      getConfig()
          .then((response) => {
            this.config = response.data
            this.raw_price_date = response.data.nft_sell_end_time_days
            for (let i in response.data.nft_sell_end_time_days) {
              this.price_date.push(i)
            }
          })
          .catch(() => {
          });
    },
  }
}
</script>

<style scoped>
.btnBackColor {
  background-color: rgba(0, 0, 0, 0) !important;
}

.owner {
  color: rgba(149, 149, 149, 1)
}

.close {
  z-index: 999999;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

::v-deep .theme--dark.v-divider {
  height: 2px;
  border: 1px solid #333333;
}

::v-deep .theme--dark.v-text-field > .v-input__control > .v-input__slot:before {
  border-color: #333333 !important;
}

::v-deep .theme--dark.v-text-field.v-input--is-disabled .v-input__slot::before {
  border-image: 0 !important;
}
</style>