<template>
  <div>
    <v-card flat dark class="pa-9 pb-0">
      <v-row>
        <v-card-title
            class="d-inline-block text-truncate mt-4 pa-0"
            style="font-size: 30px;"
        >
          <div class="description1 ml-2">
            {{ this.NFT ? this.NFT.name : "--" }}
          </div>
        </v-card-title>
      </v-row>
      <v-card-text
          class="mt-12 mb-12 pa-0"
          style="font-size: 14px; height: 40px"
      >
        <div class="description2">
          {{ this.NFT ? this.NFT.description : "--" }}
        </div>
      </v-card-text>
      <nft-owner :n-f-t="NFT" class="mb-6"></nft-owner>
      <v-tabs
          v-model="tab"
          class="mt-4"
          background-color="transparent"
          color="basil"
          show-arrows
          fixed-tabs
      >
        <v-tab
            style="font-size: 20px"
            v-for="item in tabItem"
            :key="item"
            :href="'#' + item"
        >
          {{ $t(`productDetail.tabItem.${item}`) }}
        </v-tab>
      </v-tabs>
      <v-divider class="mb-4"></v-divider>
      <v-tabs-items v-model="tab" style="background-color: rgba(0, 0, 0, 0)">
        <v-tab-item value="info">
          <nft-info-tab :isMine="isMine" :n-f-t="NFT"></nft-info-tab>
        </v-tab-item>
        <v-tab-item value="bid">
          <n-f-t-bid-offer :nft="NFT"></n-f-t-bid-offer>
        </v-tab-item>
        <v-tab-item value="offer">
          <nft-make-offer
              :nft="NFT"
              :isMine="isMine"
              @confirmMakeOffer="confirmMakeOffer"
          ></nft-make-offer>
        </v-tab-item>
        <v-tab-item value="history">
          <nft-history-tab></nft-history-tab>
        </v-tab-item>
        <v-tab-item value="detail">
          <nft-detail-tab :nft="NFT"></nft-detail-tab>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
    <v-divider></v-divider>
    <v-card elevation="0" class="d-flex align-center justify-center pb-15 px-9" style="height: 228px">
      <!--  金库  -->
      <v-row justify="center" v-if="isCreator" no-gutters>
        <v-col cols="12" class="d-flex mt-15">
          <v-col cols="6" class="pl-0" v-if="isDeliver">
            <v-btn
                large
                block
                class="btnColor"
                @click="goTransferNFT(NFTData.id)"
                disabled
            >
              <!--            发放-->
              {{ $t("productDetail.price.issue") }}
            </v-btn>
          </v-col>
          <v-col cols="6" class="pl-0" v-else>
            <v-btn
                large
                block
                class="btnColor"
                @click="goTransferNFT(NFTData.id)"
                :disabled="isExpired"
            >
              <!--            发放-->
              {{ $t("productDetail.price.issue") }}
            </v-btn>
          </v-col>
          <v-col cols="6" class="pr-0" v-if="isDeliver">
            <v-btn
                large
                block
                class="btnColor"
                disabled
                @click="destroy = true"
            >
              <!--            销毁-->
              {{ $t("productDetail.price.destroy") }}
            </v-btn>
          </v-col>
          <v-col cols="6" class="pr-0" v-else>
            <v-btn
                large
                block
                class="btnColor"
                :disabled="isExpired"
                @click="destroy = true"
            >
              <!--            销毁-->
              {{ $t("productDetail.price.destroy") }}
            </v-btn>
          </v-col>
        </v-col>
      </v-row>
      <!--      不是金库，是我的-->
      <v-row justify="center" v-else-if="isMine" no-gutters>
        <nft-one-price-description
            :nft="NFT"
            v-if="isOnSale && isOnePrice"
            class="mt-14"
        ></nft-one-price-description>
        <nft-own-account :nft="NFT" v-else-if="isOnSale"></nft-own-account>
        <v-col cols="12" class="d-flex mt-14" v-if="!isOnSale">
          <v-col cols="6" class="pl-0">
            <v-btn
                block
                large
                class="btnColor"
                @click="goSellNFT(NFTData.id)"
            >
              <!--            售卖-->
              {{ $t("productDetail.price.sell") }}
            </v-btn>
          </v-col>
          <v-col cols="6" class="pr-0">
            <v-btn
                block
                large
                class="btnColor"
                :disabled="makeOfferOwn"
                @click="makeDealDialog = true"
            >
              <!--            成交-->
              {{ $t("productDetail.price.deal") }}
            </v-btn>
          </v-col>
        </v-col>
        <v-col cols="12" class="d-flex" v-else>
          <v-col cols="6" class="pl-0" v-if="isOnePrice">
            <v-btn
                block
                large
                class="btnColor"
                @click="goSellNFT(NFTData.id)"
                v-if="!isOnSale"
            >
              <!--            售卖-->
              {{ $t("productDetail.price.sell") }}
            </v-btn>
            <v-btn
                block
                large
                class="btnColor"
                @click="OffShelfDialog = true"
                v-else
            >
              <!--            下架-->
              {{ $t("productDetail.price.OffShelf") }}
            </v-btn>
          </v-col>
          <v-col cols="6" class="pr-0" v-if="isOnePrice">
            <v-btn
                block
                large
                class="btnColor"
                v-if="!isOfferUser"
                :disabled="makeOfferOwn"
                @click="makeDealDialog = true"
            >
              <!--            成交-->
              {{ $t("productDetail.price.deal") }}
            </v-btn>
            <v-btn
                block
                large
                class="btnColor"
                @click="cancelBidDialog = true"
                v-else
            >
              <!--            取消出价-->
              {{ $t("productDetail.price.cancelBid") }}
            </v-btn>
          </v-col>
        </v-col>
      </v-row>
      <!--      不是金库,不是我的-->
      <v-row class="d-flex justify-space-between" v-else no-gutters>
        <div v-if="isOnSale" style="width: 100%">
          <nft-one-price-description
              :nft="NFT"
              v-if="isOnePrice"
          ></nft-one-price-description>
          <nft-auction-description
              :nft="NFT"
              @closeClearInterval="closeClearInterval"
              v-else
          ></nft-auction-description>
        </div>
        <v-col cols="12" :class="!isOnSale?'mt-16':''" class="d-flex pt-0">
          <v-col cols="6" class="pl-0">
            <v-btn
                block
                large
                class="btnColor"
                @click="goLoginOrBuy"
                :disabled="!isOnSale"
                v-if="isOnePrice"
            >
              <!--            购买-->
              {{ $t("productDetail.price.buy") }}
            </v-btn>
            <v-btn
                block
                large
                class="btnColor"
                @click="goLoginOrBidding"
                :disabled="!isOnSale || (isMaxBid && isClear)"
                v-else
            >
              <!--            竞价-->
              {{ $t("productDetail.price.bidding") }}
            </v-btn>
          </v-col>
          <v-col cols="6" class="pr-0">
            <v-btn
                block
                large
                class="btnColor"
                @click="goLoginOrMakeOffer"
                :disabled="isExpired || (isOnSale && !isOnePrice)"
                v-if="isMakeOffer"
            >
              <!--            出价-->
              {{ $t("productDetail.price.bid") }}
            </v-btn>
            <v-btn
                block
                large
                class="btnColor"
                @click="cancelBidDialog = true"
                v-else
            >
              <!--            取消出价-->
              {{ $t("productDetail.price.cancelBid") }}
            </v-btn>
          </v-col>
        </v-col>
      </v-row>
    </v-card>
    <v-dialog
        v-model="prodetailDialog"
        class="d-flex justify-center align-center"
        width="480px"
        @click:outside="clickDialogOutside"
    >
      <!--      购买-->
      <buy-card
          v-if="buyDialog"
          :n-f-t-data="NFT"
          :isOldImg="isOldImg"
          @closeDialog="close"
          @showPasswordPage="showPasswordPage"
      ></buy-card>
      <!--      竞拍-->
      <bidding
          v-if="biddingDialog"
          :n-f-t-data="NFT"
          :isOldImg="isOldImg"
          @closeDialog="close"
          @showPasswordPage="showPasswordPage"
      ></bidding>
      <!--      出价-->
      <offer
          v-if="offerDialog"
          :n-f-t-data="NFT"
          :isOldImg="isOldImg"
          @closeDialog="close"
          @showPasswordPage="showPasswordPage"
      ></offer>

      <!--      成交-->
      <make-deal
          v-if="makeDealDialog"
          :n-f-t-data="NFT"
          :isOldImg="isOldImg"
          :confirmOffer="confirmOffer"
          @success="success"
          @showPasswordPage="showPasswordPage"
          @closeDialog="close"
      ></make-deal>
    </v-dialog>
    <v-dialog
        v-model="prodetailPasswordDialog"
        class="d-flex justify-center align-center"
        width="650px"
        @click:outside="clickDialogOutside"
    >
      <!--      密码-->
      <password
          v-if="passwordDialog"
          :request-func="requestFunc"
          :request-params="requestParams"
          :typeFun="typeFun"
          @success="success"
          @closeDialog="close"
      ></password>
      <!--      购买成功-->
      <buy-success
          v-if="buySuccess"
          :n-f-t-data="NFT"
          :title="buySuccessTitle"
          :body="buySuccessBody"
          :to-path="buySuccessToPath"
          @closeDialog="close"
      ></buy-success>
    </v-dialog>
    <v-dialog
        v-model="prodetailCenterDialog"
        class="d-flex justify-center align-center"
        width="606px"
        @click:outside="clickDialogOutside"
    >
      <!--      下架-->
      <off-shelf
          v-if="OffShelfDialog"
          :n-f-t-data="NFT"
          @closeDialog="close"
      ></off-shelf>
      <!--      取消出价-->
      <cancel-bid
          v-if="cancelBidDialog"
          :n-f-t-data="NFT"
          @closeDialog="close"
      ></cancel-bid>
      <!--      销毁-->
      <destory v-if="destroy" :n-f-t-data="NFT" @showPasswordPage="showPasswordPage" @closeDialog="close"></destory>
    </v-dialog>
  </div>
</template>
<script>
import {getBalance} from "@/api/user";
import {mapGetters, mapActions} from "vuex";
import router from "@/router";
import {numberToCurrency} from "@/utils/money";
import {getNFTBidList} from "@/api/NFT";
import NftOwner from "@/views/Prodetails/ProdetailsComps/NftOwner";
import NftInfoTab from "@/views/Prodetails/ProdetailsComps/NftInfoTab";
import NftHistoryTab from "@/views/Prodetails/ProdetailsComps/NftHistoryTab";
import NftDetailTab from "@/views/Prodetails/ProdetailsComps/NftDetailTab";
import NftMakeOffer from "@/views/Prodetails/ProdetailsComps/NftMakeOffer";
import NftOnePriceDescription from "./NftOnePriceDescription";
import NftAuctionDescription from "./NftAuctionDescription";
import NftOwnAccount from "./NftOwnAccount";
import {formatDecimal, formatStrPrice} from "@/utils/math";
import BuyCard from "./BuyCard";
import Bidding from "./Bidding";
import BuySuccess from "./BuySuccess";
import Password from "./Password.vue";
import Offer from "./Offer.vue";
import CancelBid from "./CancelBid.vue";
import OffShelf from "./OffShelf.vue";
import MakeDeal from "./MakeDeal.vue";
import NFTBidOffer from "./NFTBidOffer";
import Destory from "./Destory";
import i18n from '@/lang'

const NFT_SELLWAY = {
  onePrice: 0,
  auction: 1,
};
export default {
  name: "Productdetail",
  components: {
    Destory,
    NFTBidOffer,
    BuySuccess,
    Bidding,
    "buy-card": BuyCard,
    NftOwnAccount,
    NftAuctionDescription,
    NftOnePriceDescription,
    NftMakeOffer,
    NftDetailTab,
    NftHistoryTab,
    NftInfoTab,
    NftOwner,
    Password,
    Offer,
    CancelBid,
    OffShelf,
    MakeDeal,
  },
  filters: {
    numberToCurrency,
  },
  data: () => ({
    showOffShelf: true,
    OffShelf: false,
    tab: "info",
    showBuy: false,
    buyDialog: false,
    biddingDialog: false,
    passwordDialog: false,
    buySuccess: false,
    offerDialog: false,
    closeDialog: false,
    closeDestroyDialog: false,
    closeOffShelfDialog: false,
    closebuyPassword: false,
    OffShelfDialog: false,
    cancelBidDialog: false,
    makeDealDialog: false,
    destroy: false,
    isClear: false,
    price: 0,
    type: 0,
    e6: 4,
    coinList: "",
    rateList: "",
    totalPrice: 0,
    NFTMaxBid: 0,
    offerUserId: 0,
    makeOfferOwn: true,
    selected: "",
    confirmOffer: {},
    NFTHistoryList: [],
    buySuccessTitle: "",
    buySuccessBody: "",
    buySuccessToPath: "",
    requestFunc: null,
    requestParams: null,
    typeFun: null
  }),
  props: ["NFTData"],
  created() {
    this.getBalance();
    this.getNFTBidList();
  },
  mounted() {
    this.tab = this.$route.params.tab;
  },
  computed: {
    ...mapGetters(["name", "user", "host", "config"]),
    //图片匹配老数据
    isOldImg() {
      if (this.NFTData) {
        if (typeof this.NFTData.files === 'string') {
          return true
        } else return false
      } else return true
    },
    prodetailDialog() {
      return (
          this.buyDialog ||
          this.biddingDialog ||
          this.OffShelfDialog ||
          this.offerDialog ||
          this.makeDealDialog
      );
    },
    prodetailPasswordDialog() {
      return this.passwordDialog || this.buySuccess
    },
    prodetailCenterDialog() {
      return this.destroy || this.OffShelfDialog || this.cancelBidDialog;
    },
    //判断是否登录
    isLogin() {
      return this.user ? true : false;
    },
    //返回true是金库
    isCreator() {
      return this.user && this.user.profile && this.user.profile.is_creator;
    },
    //返回true是本人
    isMine() {
      return this.NFTData && this.user && this.user.id === this.NFTData.user.id;
    },
    //返回是否自己对这个nft的出价
    isOfferUser() {
      return this.NFTData && this.user.id === this.offerUserId;
    },
    //返回true已经发放
    isDeliver() {
      return this.NFTData && this.NFTData.is_deliver === true;
    },
    //是否选择出价
    isSelected() {
      return this.NFTData && this.NFTData.is_deliver === true;
    },
    //判断是否过期
    isExpired() {
      let now = this.moment();
      let expired = this.moment(this.NFTData ? this.NFTData.expiration : "");
      return expired.diff(now) < 0;
    },
    //返回true是销毁
    isDestroy() {
      return this.NFTData && this.NFTData.status === 1;
    },
    //返回true在售卖
    isOnSale() {
      return this.NFTData && this.NFTData.is_onsale;
    },
    //返回0是一口价
    isOnePrice() {
      return this.NFTData && Number(this.NFTData.sell_way) === NFT_SELLWAY.onePrice
    },
    //返回是否他的竞价为最高竞价
    isMaxBid() {
      return this.user && this.user.id === this.NFTMaxBid;
    },
    //判断是否出价
    isMakeOffer() {
      return this.NFTData && this.NFTData.offer_id === null;
    },
    //nft购买手续费
    NFTsellFee() {
      return this.config.nft_sell_fee;
    },
    tabItem() {
      // if (!this.NFT) return ["info", "bid", "offer", "history", "detail"];
      if (!this.isOnSale) return ["info", "offer", "history", "detail"];
      if (this.isOnePrice) {
        return ["info", "offer", "history", "detail"];
      }
      return ["info", "bid", "history", "detail"];
    },
    passwordRules(val) {
      if (val.password === "") {
        return false;
      }
      if (this.passwordJudge) {
        return "密码错误";
      }
      return true;
    },
    Interest() {
      return formatDecimal(this.NFTsellFee * this.nftPrice, 4);
    },
    lowerPrice() {
      let payablePrice = Number(this.payablePrice.replace(/[,.]/g, ""));
      let totalPrice = Number(this.totalPrice.toString().replace(/[,.]/g, ""));
      if (payablePrice > totalPrice) {
        return true;
      } else return false;
    },
    payablePrice() {
      return formatDecimal(
          Math.abs(Number(this.Interest) + Number(this.nftPrice)),
          4
      );
    },
    NFT() {
      return this.NFTData ? this.NFTData : null;
    },
    rateData() {
      return this.rate ? this.rate : null;
    },
    nftPrice() {
      return formatDecimal(Number(this.NFTData ? this.NFTData.price : ""), 4);
    },
  },
  methods: {
    ...mapActions("alert", ["showAlert"]),
    goTransferNFT(_id) {
      router.push("/transfernft/" + _id);
    },
    goSellNFT(_id) {
      router.push("/sell/" + _id);
    },
    success() {
      this.buySuccess = true;
    },
    //购买未登录去登录
    goLoginOrBuy() {
      if (this.isLogin) {
        this.buyDialog = true;
      } else {
        this.$store.commit("ui/SET_IS_SHOW_LOGIN_DIALOG", true);
      }
    },
    //出价未登录去登录
    goLoginOrMakeOffer() {
      if (this.isLogin) {
        this.offerDialog = true;
      } else {
        this.$store.commit("ui/SET_IS_SHOW_LOGIN_DIALOG", true);
      }
    },
    //竞价未登录去登录
    goLoginOrBidding() {
      if (this.isLogin) {
        this.biddingDialog = true;
      } else {
        this.$store.commit("ui/SET_IS_SHOW_LOGIN_DIALOG", true);
      }
    },
    getBalance() {
      getBalance()
          .then((response) => {
            this.totalPrice = formatStrPrice(response.data.results[0].amount, 4);
          })
          .catch(() => {
          });
    },
    //当竞价时间截止
    closeClearInterval() {
      this.isClear = true;
    },
    showPasswordPage(title, body, toPath, requestFunc, requestParams, typeFun) {
      this.buySuccessTitle = title;
      this.buySuccessBody = body;
      this.buySuccessToPath = toPath;
      this.requestFunc = requestFunc;
      this.requestParams = requestParams;
      this.typeFun = typeFun
      this.passwordDialog = true;
      this.buyDialog = false;
      this.biddingDialog = false;
      this.offerDialog = false;
      this.makeDealDialog = false;
    },
    //确定选择的成交价
    confirmMakeOffer(data) {
      if (this.user.id === data.user.id) {
        this.makeOfferOwn = true
        this.toasterErr(i18n.t("productDetail.makeDeal.errorText"))
      } else {
        this.makeOfferOwn = false
        this.confirmOffer = data;
      }
    },
    close() {
      this.buyDialog = false;
      this.biddingDialog = false;
      this.passwordDialog = false;
      this.buySuccess = false;
      this.OffShelfDialog = false;
      this.destroy = false;
      this.offerDialog = false;
      this.cancelBidDialog = false;
      this.makeDealDialog = false;
      this.destroy = false;
      // this.toasterErr(i18n.t("errorClose"))
    },
    closeTotal() {
      this.buySuccess = false;
      this.passwordDialog = false;
    },
    goRecharge() {
      this.$store.commit("ui/SET_IS_SHOW_RECHARGE_DIALOG", true);
    },
    closeBuy() {
      this.passwordDialog = false;
      this.buyDialog = false;
    },
    goMarketPlace() {
      if (this.$route.path != `/explore`) router.push("/explore");
    },
    //点击按钮判断是否还在自己手上
    // butOffShelf() {
    //   console.log(this.user.id)
    //   console.log(this.NFT.user.id)
    //   if(this.user.id === this.NFT.user.id){
    //     return this.OffShelfDialog = true
    //   }else {
    //     location.reload()
    //     return this.toasterErr(i18n.t("errorOwnCommodity"))
    //
    //   }
    // },
    //当点击弹窗之外时运行
    clickDialogOutside() {
      this.buyDialog = false;
      this.biddingDialog = false;
      this.passwordDialog = false;
      this.buySuccess = false;
      this.OffShelfDialog = false;
      this.destroy = false;
      this.offerDialog = false;
      this.cancelBidDialog = false;
      this.makeDealDialog = false;
      this.destroy = false;
    },
    getNFTBidList() {
      getNFTBidList({
        token: this.$route.params.id,
      })
          .then((response) => {
            this.NFTMaxBid = response.data.results[0].user.id;
          })
          .catch(() => {
          });
    },
  }
  ,
}
;
</script>

<style scoped>

.description1 {
  word-break: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  height: 42px;
  font-size: 30px;
  font-weight: bold;
  color: #fafafa;
  line-height: 34px;
}

.description2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  width: 100%;
  height: 60px;
  font-size: 14px;
  font-weight: 400;
  color: #fafafa;
  line-height: 20px;
}
</style>
