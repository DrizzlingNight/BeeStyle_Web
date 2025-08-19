<template>
  <div class="nft-wrapper">
    <div v-if="!isLoading" class="nft-content">
      <!-- 回到上一頁 -->
      <v-btn @click="goBack()" max-height="28" width="auto" text class="d-flex align-center pa-0 mb-4 mb-md-8">
        <v-icon color="primary">mdi-menu-left</v-icon>
        <span class="primary--text" style="font-size: 16px;">{{ $t("nft.backToPreviousPage") }}</span>
      </v-btn>

      <!-- 主要內容 -->
      <div class="primary-content d-flex flex-column mb-10">
        <!-- 主內容 - 主要顯示與操作區 -->
        <div class="primary-content-upper d-flex">
          <!-- 圖片區塊 -->
          <div class="image-content-wrapper">
            <!-- 圖片包皮 -->
            <div class="image-wrapper mb-5 mb-md-12">
              <v-img v-if="!is3dModel" contain :src="data.image" class="nft-image"></v-img>
              <model-viewer v-else :src="data.image" camera-controls environment-image="neutral" shadow-intensity="1" autoplay id="nft-model" class="nft-model" />
            </div>
            <!-- 收錄專輯...中按鈕 -->
            <!-- 2022.01.25 目前並沒有Collection的功能，暫時先隱藏，待後面新增再打開 -->
            <!-- <div @click="toAlbum()" v-ripple class="to-album-btn d-flex justify-center align-center">
              <span class="mr-2 mr-sm-5">已收錄入專輯「藝術的冥想」中</span>
              <div class="album-img-wrapper mr-2 mr-sm-5">
                <div class="album-shadow1"></div>
                <div class="album-shadow2"></div>
                <v-img contain src="/static/ui/nft/nft_img.png" class="album-img"></v-img>
              </div>
              <div class="album-icon"></div>
              <v-icon>mdi-chevron-double-right</v-icon>
            </div> -->
          </div>

          <!-- 資訊區塊 -->
          <div class="info-and-trade-wrapper">
            <div class="info-wrapper d-flex flex-column mb-6 mb-md-12">
              <h1 class="nft-name mb-2 mb-md-4">{{ `${data.name}` }}</h1>
              <!-- 拍賣 -->
              <div v-if="isAuction && data.is_onsale">
                <!-- 最高價格 -->
                <span class="price-title">{{ $t("nft.highestPrice") }}</span>
                <p class="d-flex align-center mb-0">
                  <span class="price-icon mr-2">
                    <img v-if="data.coin" :src="`/static/ui/utils/coin/coin_${data.coin.id}.png`"/>
                  </span>
                  <span v-if="data.coin" class="price primary--text mb-4">
                    {{ `${(data.current_price || 0)} ${data.coin && data.coin.name}` }}
                  </span>
                </p>
                <!-- 起標價格 -->
                <p v-if="data.coin" class="price-title">
                  {{ $t("nft.startingPrice") }} {{ `${(data.price || 0)} ${(data.coin && data.coin.name) || ''}` }}
                </p>
              </div>
              <!-- 直購 -->
              <div v-else>
                <!-- 價格 / 未上架 -->
                <span class="price-title test-2022-04-07">
                  {{ data.is_onsale ? $t("nft.price") : $t('nft.notList') }}
                </span>
                <p v-if="data.is_onsale" class="d-flex align-center mb-3">
                  <span class="price-icon mr-2">
                    <img v-if="data.coin" :src="`/static/ui/utils/coin/coin_${data.coin.id}.png`"/>
                  </span>
                  <span v-if="data.coin" class="price primary--text">
                    {{ data.is_onsale ? `${(data.price || 0)} ${(data.coin && data.coin.name) || ''}` : '--' }}
                  </span>
                </p>
              </div>
              <!-- nft 分類標籤容器 -->
              <div v-if="data.cate" class="catagories-tags-wrapper d-flex my-4">
                <div class="tag rounded-pill">
                  {{ $t(`nft.cate${data.cate}`) }}
                </div>
              </div>
              <v-divider class="mb-5"></v-divider>
              <!-- 創作者與擁有者 容器 -->
              <div class="users-wrapper d-flex mb-4">
                <!-- 創作者 -->
                <div class="user-wrapper d-flex">
                  <v-img @click="userOnclick(data.creator.id)" :src="data.creator.profile.avatar ? `${imageBaseUrl}${data.creator.profile.avatar}` : '/static/ui/utils/user/default.png'" class="user-img mr-5"></v-img>
                  <p class="user-text-wrapper d-flex flex-column justify-space-between mb-0">
                    <span class="user-title">{{ $t("nft.creator") }}</span>
                    <span @click="userOnclick(data.creator.id)" class="user-name primary--text">{{ data.creator && (data.creator.profile.nickname || data.creator.username) }}</span>
                  </p>
                </div>
                <!-- 擁有者 -->
                <div class="user-wrapper d-flex">
                  <v-img @click="userOnclick(data.user.id)" :src="data.user.profile.avatar ? `${imageBaseUrl}${data.user.profile.avatar}` : '/static/ui/utils/user/default.png'" class="user-img mr-5"></v-img>
                  <p class="user-text-wrapper d-flex flex-column justify-space-between mb-0">
                    <span class="user-title">{{ $t("nft.owner") }}</span>
                    <span @click="userOnclick(data.user.id)" class="user-name primary--text">{{ data.user && (data.user.profile.nickname || data.user.username) }}</span>
                  </p>
                </div>
              </div>
              <!-- nft 自訂標籤容器 -->
              <div v-if="data.tag && data.tag[0]" class="nft-tags-wrapper d-flex mb-1">
                <span v-for="(item, index) in data.tag" :key="index" class="tag">
                  {{ `#${item}` }}
                </span>
              </div>
              <!-- 到期日 -->
              <span v-if="data.end_time && data.is_onsale" class="expired-date mb-5">{{ `${$t("nft.expirationDate")}: ${data.end_time}` }}</span>
              <!-- <v-spacer class="d-none d-md-block"></v-spacer> -->
              <v-divider class="mb-6"></v-divider>
              <!-- 收藏、瀏覽、分享按鈕 -->
              <div class="actions-wrapper d-flex">
                <!-- 收藏 -->
                <div v-ripple  @click="likeBtnOnclick(data.id)" class="action action-btn d-flex align-center px-2 ">
                  <v-icon v-if="data.is_like" color="primary" class="action-icon mr-2">mdi-cards-heart</v-icon>
                  <v-icon v-else class="action-icon mr-2">mdi-cards-heart-outline</v-icon>
                  <span class="action-amount">{{ data.likes }}</span>
                </div>
                <!-- 瀏覽 -->
                <!-- <div class="action d-flex align-center px-2">
                  <v-icon class="action-icon mr-2">mdi-eye</v-icon>
                  <span class="action-amount">{{ data.views }}</span>
                </div> -->
                <!-- 分享 -->
                <div @click="shareButtonOnclick(data.id)" v-ripple class="action action-btn d-flex align-center px-2">
                  <v-icon class="action-icon mr-2">mdi-share</v-icon>
                  <!-- 2021.01.25 分享暫時只有分享功能，不加上數字 -->
                  <span class="action-amount">{{ $t("nft.share") }}</span>
                </div>
              </div>
            </div>
            <div v-if="data.is_onsale">
              <!-- 議價要求提示 -->
              <div v-if="isBargainHintShow" class="bargainHint">
                <p class="hint">*{{ $t("nft.bargainHint", [bargainCount]) }}，<span class="button" @click="bargainHintOnClick()">{{ $t("nft.clickToLook") }}</span></p>
              </div>
              <!-- 交易按鈕 -->
              <div v-if="!isMine" class="trade-btn-wrapper d-flex">
                <!-- 購買 -->
                <div v-if="!isAuction && !isBargained" @click="buyOnclick()" v-ripple class="trade-btn buy-btn d-flex justify-center align-center">
                  {{ $t("nft.buy") }}
                </div>
                <!-- 議價 -->
                <div v-if="!isAuction && !isBargained" @click="bargainOnclick()" v-ripple class="trade-btn offer-btn d-flex justify-center align-center">
                  {{ $t("nft.bargain") }}
                </div>
                <!-- 取消議價 -->
                <div v-if="!isAuction && isBargained" @click="cancelBargainOnclick()" v-ripple class="trade-btn buy-btn d-flex justify-center align-center">
                  {{ $t("nft.cancelBargain") }}
                </div>
                <!-- 競價 -->
                <div v-if="isAuction" @click="offerOnclick()" v-ripple class="trade-btn offer-btn d-flex justify-center align-center">
                  {{ $t("nft.offer") }}
                </div>
              </div>
              <!-- 下架 -->
              <div v-if="isMine && !isAuction" class="trade-btn-wrapper d-flex">
                <div v-if="isOfferSelected" @click="makeDealOnclick()" v-ripple class="trade-btn buy-btn d-flex justify-center align-center">
                  {{ $t("nft.makeDeal") }}
                </div>
                <div v-else @click="offShelfOnclick()" v-ripple class="trade-btn buy-btn d-flex justify-center align-center">
                  {{ $t("nft.offShelf") }}
                </div>
              </div>
            </div>
            <!-- 上架 -->
            <div v-else class="trade-btn-wrapper d-flex">
              <div @click="isMine ? listOnclick() : ''" v-ripple :class="{disabled: !isMine}" class="trade-btn buy-btn d-flex justify-center align-center">
                {{ isMine ? $t("nft.list") : $t("nft.notList")}}
              </div>
              <!-- 取消議價 -->
              <div v-if="isBargained" @click="cancelBargainOnclick()" v-ripple class="trade-btn buy-btn d-flex justify-center align-center">
                {{ $t("nft.cancelBargain") }}
              </div>
            </div>
          </div>
        </div>
        <!-- NFT 簡介 -->
        <div class="primary-content-description d-flex flex-column">
          <span class="description-title mb-3">{{ $t("nft.introduction") }}</span>
          <p class="description-content mb-0">{{ data.description }}
          </p>
        </div>
      </div>

      <div class="secondary-content">
        <!-- 分頁 tabs -->
        <v-tabs centered background-color="transparent" class="tabs d-flex justify-center">
          <v-tab @click="currentTab = tab.id" v-for="tab in (isAuction ? auctionTabs : directPriceTabs)" :key="tab.id" class="tab mx-0 mx-md-1 mx-lg-3 mx-xl-5">{{ tab.name }}</v-tab>
        </v-tabs>
        <v-divider></v-divider>
        <!-- 分頁內容 -->
        <Description v-if="currentTab === 0" :data="data" />
        <!-- <Price v-if="currentTab === 1" /> -->
        <!-- 議價列表 -->
        <Bargains
          v-if="currentTab === 1"
          :nft="NFTData"
          :isMine="isMine"
          @confirmMakeOffer="confirmMakeOffer"
        />
        <!-- 競價列表 -->
        <Offers
          v-if="currentTab === 3"
          :nft="NFTData"
          :isMine="isMine"
          @confirmMakeOffer="confirmMakeOffer"
        />
        <!-- 歷史動作列表 -->
        <History v-if="currentTab === 2" />
        <!-- <Details
          v-if="currentTab === 4"
          :nft="NFTData"
        /> -->
      </div>
    </div>
    <Overlay v-else :loading="isLoading" />
    
    <v-dialog
      v-model="isDialogShow"
      persistent
      class="d-flex justify-center align-center"
      width="480px"
    >
      <!-- 選擇議價成交目標彈窗 -->
      <BargainSelectDialog
        v-if="isBargainSelectDialogShow"
        :nft="NFTData"
        :isMine="isMine"
        @closeDialog="closeDialog"
        @confirmMakeOffer="confirmMakeOffer"
        @makeDeal="makeDealOnclick"
      />

      <!-- 購買 -->
      <BuyCard
        v-if="isBuyDialogShow"
        :NFTData="NFTData"
        :isOldImg="isOldImg"
        @closeDialog="closeDialog"
        @showPasswordPage="showPasswordPage"
      />
      
      <!-- 議價 -->
      <Bargain
        v-if="isBargainDialogShow"
        :NFTData="NFTData"
        :isOldImg="isOldImg"
        @closeDialog="closeDialog"
        @showPasswordPage="showPasswordPage"
      />

      <!-- 取消議價 -->
      <CancelBargain
        v-if="isCancelBargainDialogShow"
        :NFTData="NFTData"
        @closeDialog="closeDialog"
      />

      <!-- 競價 -->
      <Offer
        v-if="isOfferDialogShow"
        :NFTData="NFTData"
        :isOldImg="isOldImg"
        @closeDialog="closeDialog"
        @showPasswordPage="showPasswordPage"
      />

      <!-- 下架 -->
      <OffShelf
        v-if="isOffShelfDialogShow"
        :NFTData="NFTData"
        @closeDialog="closeDialog"
      />

      <!-- 成交 -->
      <MakeDeal
        v-if="isMakeDealDialogShow"
        :NFTData="NFTData"
        :isOldImg="isOldImg"
        :confirmOfferData="confirmOfferData"
        @success="success"
        @confirmMakeOffer="confirmMakeOffer"
        @confirmMakeDeal="confirmMakeDeal"
        @closeDialog="closeDialog"
      />
    </v-dialog>

    <v-dialog
      v-model="isSecondDialogShow"
      persistent
      class="d-flex justify-center align-center"
      width="480px"
    >
      <!-- 成交確認 -->
      <ConfirmMakeDeal
        v-if="isConfirmMakeDealShow"
        :confirmOfferData="confirmOfferData"
        @success="success"
        @confirmMakeOffer="confirmMakeOffer"
        @showPasswordPage="showPasswordPage"
        @closeDialog="closeDialog"
      />

      <!-- 密碼確認 -->
      <Password
        v-if="isPasswordDialogShow"
        :request-func="requestFunc"
        :request-params="requestParams"
        :typeFun="typeFun"
        @success="success"
        @closeDialog="closeDialog"
      />
      
      <!-- 購買成功 -->
      <BuySuccess
        v-if="isBuySuccessShow"
        :NFTData="NFTData"
        :title="buySuccessTitle"
        :body="buySuccessBody"
        :toPath="buySuccessToPath"
        @closeDialog="closeDialog"
      />
    </v-dialog>
  </div>
</template>

<script>
import Overlay from '@/components/Overlay.vue'

import { getNFT, likeNFT, getNFTOffer } from "@/api/NFT"
import { mapGetters } from "vuex";
import { money_filter } from '@/utils/money'
import { dateFormat }  from '@/utils/date'
// 若為當前用戶的NFT會用到的選擇議價價格彈窗
import BargainSelectDialog from './components/BargainSelectDialog.vue'
// 直購彈窗
import BuyCard from './components/BuyCard.vue'
// 競價彈窗
import Offer from './components/Offer.vue'
// 議價彈窗
import Bargain from './components/Bargain.vue'
// 取消議價彈窗
import CancelBargain from './components/CancelBargain.vue'
import Password from './components/Password.vue'
import BuySuccess from './components/BuySuccess.vue'
import OffShelf from './components/OffShelf.vue'
import MakeDeal from './components/MakeDeal.vue'
import ConfirmMakeDeal from './components/ConfirmMakeDeal.vue'
// 詳情 tab內容
import Description from './components/nftDescription/NftDescription.vue'
// 競價 tab內容
import Offers from './components/nftOffers/NftOffers.vue'
// 議價 tab內容
import Bargains from './components/nftBargains/NftBargains.vue'
// import Price from './components/nftPrice/NftPrice.vue'
// 歷史 tab內容
import History from './components/nftHistory/NftHistory.vue'
// import Details from './components/nftDetails/NftDetails.vue'

// 3D Model viewer
import { ModelViewer } from '@google/model-viewer'

export default {
  name: 'Nft',
  components: {
    Overlay,
    BargainSelectDialog,
    BuyCard,
    Offer,
    Bargain,
    CancelBargain,
    Password,
    BuySuccess,
    OffShelf,
    MakeDeal,
    ConfirmMakeDeal,
    Description,
    // Price,
    Offers,
    Bargains,
    History,
    ModelViewer,
    // Details
  },
  data() {
    return {
      imageBaseUrl: process.env.VUE_APP_FILE_BASE_API,
      isLoading: false,
      isLikeLoading: false,
      isBargainSelectDialogShow: false,
      isBuyDialogShow: false,
      isOfferDialogShow: false,
      isBargainDialogShow: false,
      isCancelBargainDialogShow: false,
      isPasswordDialogShow: false,
      isBuySuccessShow: false,
      isOffShelfDialogShow: false,
      isMakeDealDialogShow: false,
      isConfirmMakeDealShow: false,
      isOfferSelected: false,
      currentTab: 0,
      // 競標的tabs
      auctionTabs: [
        {
          id: 0,
          name: this.$t("nft.tabs.description"),
          toPath: 'description'
        },
        {
          id: 3,
          name: this.$t("nft.tabs.offers"),
          toPath: 'offers'
        },
        {
          id: 2,
          name: this.$t("nft.tabs.history"),
          toPath: 'history'
        },
      ],
      // 直購的tabs
      directPriceTabs: [
        {
          id: 0,
          name: this.$t("nft.tabs.description"),
          toPath: 'description'
        },
        {
          id: 1,
          name: this.$t("nft.tabs.bargains"),
          toPath: 'bargains'
        },
        {
          id: 2,
          name: this.$t("nft.tabs.history"),
          toPath: 'history'
        },
      ],
      data:{}, // NFT 詳情
      NFTData: null, // 傳遞prop用的NFT 詳情
      buySuccessTitle: "",
      buySuccessBody: "",
      buySuccessToPath: "",
      requestFunc: null,
      requestParams: null,
      typeFun: null,
      makeOfferOwn: true,
      confirmOfferData: {},
      isBargainHintShow: false, // 是否顯示議價提示文字
      bargainCount: 0, // 總議價數
      // 測試用資料
      testData: {
        image: '/static/ui/nft/nft_img.png',
        name: 'Creator2.—good',
        serialNo: '25',
        price: '2.9K',
        cate: ['ART', '宗教藝術'],
        creator: {
          username: 'Ether Huang',
        },
        user: {
          username: 'Ether Huang',
        },
        tag: ['創作', '命運', '唬爛的文章會有人買嗎?'],
        expiration: '2020/03/21',
        likes: '12.3W',
        views: '100W',
        description: '我的系列著眼於保護花朵的美麗，並以獨特的方式觀察它們，每一朵花都是我親手挑選的。我與花一起工作，因為我喜歡它們的生命週期如何與工作齊頭並進的想法。他們有一個開始和結束的目的。就像作品一旦完成就會融化一樣，如果沒有攝影的捕捉，作品可能永遠不會被看到。',
        annualized: '0.0000',
        archiveAddress_encry: 'sd********df',
        archiveName: 'fsfd',
        authentication: 'sdfsf',
        rating: 'sss',
        interest: 1234,
        liabilities: 233,
        serialNo_encry: 'sd********sd',
      },
    }
  },
  computed: {
    ...mapGetters(['host', 'user', 'coinList', 'getCoinById']),
    //判斷是否登錄
    isLogin() {
      return this.user ? true : false
    },
    // 判斷使否為舊數據的圖片
    isOldImg() {
      if (this.NFTData) {
        if (typeof this.NFTData.files === 'string') {
          return true
        } else return false
      } else return true
    },
    //返回true是本人
    isMine() {
      return this.NFTData && this.user && this.user.id === this.NFTData.user.id;
    },
    isDialogShow() {
      return this.isBuyDialogShow || this.isOfferDialogShow || this.isBargainDialogShow || this.isCancelBargainDialogShow || this.isOffShelfDialogShow || this.isMakeDealDialogShow || this.isBargainSelectDialogShow
    },
    isSecondDialogShow() {
      return this.isPasswordDialogShow || this.isBuySuccessShow || this.isConfirmMakeDealShow
    },
    // 判斷是否為拍賣
    isAuction() {
      return this.data.sell_way === '1'
    },
    // 判斷是否議價過
    isBargained() {
      return this.data.offer_id !== null && !this.isMine
    },
    // 判斷是否為3D Model
    is3dModel() {
      const file = this.data.image.split('.')
      const fileExtension = file[file.length -1]
      if (fileExtension === 'gltf-binary') {
        return true
      } else {
        return false
      }
    },
  },
  async created() {
    await this.getNftDetail()
    await this.getBargainInfo()
  },
  mounted() {
    
  },
  methods: {
    // 取得幣種
    getCoin(id) {
      const coin = this.getCoinById(id)
      return coin
    },
    goBack() {
      const previousPageUrl = document.referrer
      const currentDomain = document.location.origin
      const isInCurrentDomain = previousPageUrl.includes(currentDomain)
      // 前一頁屬於BS網站就直接返回上一頁
      if(isInCurrentDomain) {
        this.$router.go(-1)
        return
      }
      // 前一頁不是BS網站就跳轉到交易市場
      this.$router.push({ name: 'explore' })
    },
    goExplore() {
      this.$router.push({
        name: 'explore'
      })
    },
    // 使用者投向或是名稱被點擊
    userOnclick(userId) {
      this.$router.push({ name: 'user', params: {id: userId} })
    },
    success() {
      this.isBuySuccessShow = true
    },
    closeDialog() {
      this.isBargainSelectDialogShow = false
      this.isBuyDialogShow = false
      this.isOfferDialogShow = false
      this.isBargainDialogShow = false
      this.isCancelBargainDialogShow = false
      this.isPasswordDialogShow = false
      this.isBuySuccessShow = false
      this.isOffShelfDialogShow = false
      this.isMakeDealDialogShow = false
      this.isConfirmMakeDealShow = false
    },
    showPasswordPage(title, body, toPath, requestFunc, requestParams, typeFun) {
      this.buySuccessTitle = title
      this.buySuccessBody = body
      this.buySuccessToPath = toPath
      this.requestFunc = requestFunc
      this.requestParams = requestParams
      this.typeFun = typeFun
      this.isPasswordDialogShow = true
      this.isBuyDialogShow = false
      this.isOfferDialogShow = false
      this.isBargainSelectDialogShow = false
      this.isBargainDialogShow = false
      this.isMakeDealDialogShow = false
      this.isConfirmMakeDealShow = false
    },
    // 確定選擇的成交價
    confirmMakeOffer(data, isSelected) {
      if (!data) {
        this.confirmOfferData = null
        this.isOfferSelected = false
        return
      }
      
      if (this.user.id === data.user.id) {
        this.makeOfferOwn = true
        this.toasterErr(this.$t("productDetail.makeDeal.errorText"))
      } else {
        this.makeOfferOwn = false
        this.confirmOfferData = data
        this.confirmOfferData.coin = this.getCoin(data.coin)
        this.isOfferSelected = isSelected
      }
    },
    // 確認成交
    confirmMakeDeal() {
      this.isMakeDealDialogShow = false
      this.isConfirmMakeDealShow = true
    },
    async getNftDetail() {
      const id = this.$route.params.id
      this.isLoading = true
      await getNFT(id).then(res => {
        console.log('getNftDetail res', res)
        if (res.code === 0) {
          this.NFTData = { ...res.data }
          this.NFTData.coin = this.NFTData.coin ? this.getCoin(this.NFTData.coin.id) : null
          this.NFTData.image = `${this.host}${this.NFTData.files[0]}`

          this.data = { ...res.data }
          this.data.end_time = this.data.end_time ? dateFormat( this.data.end_time, 'yyyy/MM/dd hh:mm:ss') : null
          this.data.image = `${this.host}${this.data.files[0]}`
          this.data.price = money_filter(Number(this.data.price))
          this.data.current_price = money_filter(Number(this.data.current_price))
          this.data.coin = this.data.coin ? this.getCoin(this.data.coin.id) : null

          // 轉換keywords成tag
          const tag =  this.data.keywords ?  this.data.keywords.split(',') : null
          this.data.tag = tag

          console.log('currentData: ', this.data)
        } else {
          this.goBack()
        }
        this.isLoading = false
      }).catch(err => {
        console.log('getNftDetail-err', err)
        this.goBack()
        this.isLoading = false
      })
    },
    async getBargainInfo() {
      if (this.isMine && !this.isAuction && this.data.is_onsale) {
        await getNFTOffer({token: this.$route.params.id, offset: 10})
          .then(async res => {
            if (res.data.count > 0) {
              this.bargainCount = res.data.count
              this.isBargainHintShow = true
            }
          }).catch(err => {
            console.error(err)
          })
      }
    },
    // 收藏
    async likeBtnOnclick(nftId) {
      if (this.isLogin) {
        try {
          // 如果按收藏還在loading就不給發送request
          if (this.isLikeLoading) {
            return
          }
          this.isLikeLoading = true
          const response = await likeNFT(nftId)
          console.log('likeNFT res', response)
          // 請求成功，觸發後續本地資料變動
          this.likeRequestSucceed()
          this.isLikeLoading = false
        } catch(err) {
          console.log('likeNFT -err', err)
          this.isLikeLoading = false
        }
      } else {
        this.$store.commit("ui/SET_IS_SHOW_LOGIN_DIALOG", true)
      }
    },
     // 收藏請求成功觸發資料變動
    likeRequestSucceed() {
      // 改變收藏數
      if (this.data.is_like) {
        this.data.likes --
      } else {
        this.data.likes ++
      }
      // toggle 是否已經收藏
      this.data.is_like = !this.data.is_like
    },
    // 分享按鈕被點按
    shareButtonOnclick(nftId) {
      const domain = window.location.host
      const nftUrl = `${domain}/nft/${nftId}`

      // 產生一個文字區塊 -> 置入要複製的字串 -> 將文字區塊塞入body -> 選取文字區塊 -> 執行複製選取的api -> 移除該文字區塊 -> 跳alert完成動作
      const el = document.createElement('textarea')
      el.value = nftUrl
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)

      this.$toast.success(this.$t('nft.alreadyCopyToClipboard'))
    },
    toAlbum() {},
    buyOnclick() {
      if (this.isLogin) {
        this.isBuyDialogShow = true
      } else {
        this.$store.commit("ui/SET_IS_SHOW_LOGIN_DIALOG", true)
      }
    },
    // 點按議價提示
    bargainHintOnClick() {
      if (this.isLogin) {
        this.isBargainSelectDialogShow = true
      } else {
        this.$store.commit("ui/SET_IS_SHOW_LOGIN_DIALOG", true)
      }
    },
    // 點按議價
    bargainOnclick() {
      if (this.isLogin) {
        this.isBargainDialogShow = true
      } else {
        this.$store.commit("ui/SET_IS_SHOW_LOGIN_DIALOG", true)
      }
    },
    // 取消議價
    cancelBargainOnclick() {
      if (this.isLogin) {
        this.isCancelBargainDialogShow = true
      } else {
        this.$store.commit("ui/SET_IS_SHOW_LOGIN_DIALOG", true)
      }
    },
    // 點按出價
    offerOnclick() {
      if (this.isLogin) {
        this.isOfferDialogShow = true
      } else {
        this.$store.commit("ui/SET_IS_SHOW_LOGIN_DIALOG", true)
      }
    },
    listOnclick() {
      this.$router.push({
        name: 'listed',
        params: {
          id: this.data.id
        }
      })
    },
    offShelfOnclick() {
      if (this.isLogin) {
        this.isOffShelfDialogShow = true
      } else {
        this.$store.commit("ui/SET_IS_SHOW_LOGIN_DIALOG", true)
      }
    },
    makeDealOnclick() {
      if (this.isLogin) {
        this.isMakeDealDialogShow = true
      } else {
        this.$store.commit("ui/SET_IS_SHOW_LOGIN_DIALOG", true)
      }
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.nft-wrapper {
  width: 100%;
  padding: 40px 216px 132px 216px;

  .nft-content {
    max-width: 1280px;
    margin: 0 auto;

    .primary-content {
      width: 100%;

      .primary-content-upper {
        width: 100%;
        gap: 8%;
        margin-bottom: 48px;

        .image-content-wrapper {
          width: 488px;

          .image-wrapper {
            display: flex;
            justify-content: center;
            width: 100%;
            height: 488px;
            border-radius: 25px;
            overflow: hidden;

            .nft-image {
              width: 100%;
              height: 100%;
            }
          }

          .to-album-btn {
            width: 100%;
            height: 68px;
            background: linear-gradient(311.29deg, #FFB600 0%, #F4C245 87.23%);
            border-radius: 8px;
            cursor: pointer;

            span {
              font-size: 20px;
              user-select: none;
            }

            .album-img-wrapper {
              position: relative;
              width: 52px;
              height: 52px;

              .album-img {
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 4px;
              }

              .album-shadow1 {
                position: absolute;
                top: 50%;
                left: 38%;
                transform: translate(0%, -50%);
                width: 84%;
                height: 84%;
                background: #2c2c2c;
                opacity: .6;
                border-radius: 4px;
              }
              
              .album-shadow2 {
                position: absolute;
                top: 50%;
                left: 22%;
                transform: translate(0%, -50%);
                width: 92%;
                height: 92%;
                background: #2c2c2c;
                border-radius: 4px;
              }
            }

            .album-icon {
              
            }
          }
        }

        .info-and-trade-wrapper {
          flex-grow: 1;


          .info-wrapper {
            min-height: 488px;

            .nft-name {
              font-size: 40px;
            }

            .price-title {
              font-size: 20px;
              color: var(--text-secondary);
            }

            .price-icon {
              font-size: 20px;
              padding-top: 5px;
              
              img {
                width: 36px;
                height: 36px;
              }
            }

            .price {
              font-size: 40px;
              font-weight: 600;
            }

            .starting-price-icon {
              font-size: 18px;
              padding-top: 5px;
              
              img {
                width: 32px;
                height: 32px;
              }
            }

            .starting-price {
              font-size: 36px;
              font-weight: 600;
            }

            .catagories-tags-wrapper {
              width: 100%;
              gap: 12px;

              .tag {
                background: rgba(244, 194, 69, 0.5);
                border: 1px solid $primary;
                padding: 4px 12px;
                font-size: 20px;
              }
            }

            .users-wrapper {
              gap: 48px;

              .user-wrapper {
                .user-img {
                  width: 64px;
                  height: 64px;
                  border-radius: 50%;
                  cursor: pointer;
                }

                .user-text-wrapper {
                  .user-title {
                    font-size: 16px;
                    color: var(--text-secondary);
                  }

                  .user-name {
                    font-size: 20px;
                    max-width: 120px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    cursor: pointer;
                  }
                }
              }
            }

            .nft-tags-wrapper {
              gap: 16px;
              flex-wrap: wrap;
              
              .tag {
                font-size: 20px;
                color: var(--primary);
              }
            }

            .expired-date {
              font-size: 20px;
              color: var(--text-secondary);
            }

            .actions-wrapper {
              gap: 72px;

              .action {
                border-radius: 4px;
                
                .action-icon {
                  font-size: 36px;
                }

                .action-amount {
                  font-size: 20px;
                }

                &.action-btn {
                  cursor: pointer;
                  user-select: none;
                }
              }
            }
          }

          .bargainHint {
            .hint {
              font-size: 20px;
            }
            .button {
              cursor: pointer;
              font-size: 20px;
              color: gray;
            }
          }

          .trade-btn-wrapper {
            width: 100%;
            gap: 28px;

            .trade-btn {
              flex-grow: 1;
              height: 68px;
              border-radius: 8px;
              font-size: 20px;
              cursor: pointer;
              user-select: none;

              &.buy-btn {
                background: var(--primary);
              }

              &.offer-btn {
                border: 1px solid var(--primary);
                color: var(--primary);
              }

              &.disabled {
                cursor: not-allowed;
                background: #515153 !important;
              }
            }
          }
        }

      }

      .primary-content-description {
        border: 1px solid rgba(225, 225, 225, .8);
        border-radius: 4px;
        padding: 20px 32px 32px 32px;

        .description-title,
        .description-content {
          font-size: 20px;
        }
      }
    }

    .secondary-content {
      
      .tabs {
        .tab {
          font-size: 20px;
        }
        
        .v-tab:not(.v-tab--active) {
          color: #ffffff;
        }
      }
    }
  }
}

// 3D Model Viewer
.nft-model {
  width: 500px;
  height: 500px;
}

@media screen and (max-width: 1500px) {
  .nft-wrapper {
    width: 100%;
    padding: 40px 216px 132px 216px;

    .nft-content {
      max-width: 1280px;
      margin: 0 auto;

      .primary-content {
        width: 100%;

        .primary-content-upper {
          width: 100%;
          gap: 0px;
          flex-direction: column;
          margin-bottom: 48px;

          .image-content-wrapper {
            width: 100%;
            // max-width: 600px;
            margin: 0 auto;
            margin-bottom: 100px;

            .image-wrapper {
              width: 100%;
              height: 100%;
              border-radius: 25px;
              overflow: hidden;

              .nft-image {
                width: 100%;
                max-width: 600px;
                height: 100%;
                margin: 0 auto;
                border-radius: 20px;
              }
            }

            .to-album-btn {
              width: 100%;
              height: 68px;
              background: linear-gradient(311.29deg, #FFB600 0%, #F4C245 87.23%);
              border-radius: 8px;
              cursor: pointer;

              span {
                font-size: 20px;
                user-select: none;
              }

              .album-icon {
                
              }
            }
          }

          .info-and-trade-wrapper {
            flex-grow: 1;


            .info-wrapper {
              min-height: 488px;

              .nft-name {
                font-size: 40px;
              }

              .price-title {
                font-size: 20px;
                color: var(--text-secondary);
              }

              .price-icon {
                font-size: 20px;
              }

              .price {
                font-size: 40px;
                font-weight: 600;
              }

              .starting-price-icon {
                font-size: 18px;
              }

              .starting-price {
                font-size: 36px;
                font-weight: 600;
              }

              .catagories-tags-wrapper {
                width: 100%;
                gap: 12px;

                .tag {
                  background: rgba(244, 194, 69, 0.5);
                  border: 1px solid $primary;
                  padding: 4px 12px;
                  font-size: 20px;
                }
              }

              .users-wrapper {
                gap: 48px;

                .user-wrapper {
                  .user-img {
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                  }

                  .user-text-wrapper {
                    .user-title {
                      font-size: 16px;
                      color: var(--text-secondary);
                    }

                    .user-name {
                      font-size: 20px;
                    }
                  }
                }
              }

              .nft-tags-wrapper {
                gap: 16px;
                
                .tag {
                  font-size: 20px;
                  color: var(--primary);
                }
              }

              .expired-date {
                font-size: 20px;
                color: var(--text-secondary);
              }

              .actions-wrapper {
                gap: 72px;

                .action {
                  border-radius: 4px;
                  
                  .action-icon {
                    font-size: 36px;
                  }

                  .action-amount {
                    font-size: 20px;
                  }

                  &.action-btn {
                    cursor: pointer;
                    user-select: none;
                  }
                }
              }
            }

            .trade-btn-wrapper {
              width: 100%;
              gap: 28px;

              .trade-btn {
                flex-grow: 1;
                height: 68px;
                border-radius: 8px;
                font-size: 20px;
                cursor: pointer;
                user-select: none;

                &.buy-btn {
                  background: var(--primary);
                }

                &.offer-btn {
                  border: 1px solid var(--primary);
                  color: var(--primary);
                }
              }
            }
          }

        }

        .primary-content-description {
          border: 1px solid rgba(225, 225, 225, .8);
          border-radius: 4px;
          padding: 20px 32px 32px 32px;

          .description-title,
          .description-content {
            font-size: 20px;
          }
        }
      }

      .secondary-content {
        
        .tabs {
          .tab {
            font-size: 20px;
          }
          
          .v-tab:not(.v-tab--active) {
            color: #ffffff;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1264px) {
  .nft-wrapper {
    width: 100%;
    padding: 40px 160px 132px 160px;

    .nft-content {
      max-width: 1280px;
      margin: 0 auto;

      .primary-content {
        width: 100%;

        .primary-content-upper {
          width: 100%;
          gap: 0px;
          flex-direction: column;
          margin-bottom: 40px;

          .image-content-wrapper {
            width: 100%;
            // max-width: 600px;
            margin: 0 auto;
            margin-bottom: 100px;

            .image-wrapper {
              width: 100%;
              height: 100%;
              border-radius: 25px;
              overflow: hidden;

              .nft-image {
                width: 100%;
                max-width: 600px;
                height: 100%;
                margin: 0 auto;
                border-radius: 20px;
              }
            }

            .to-album-btn {
              width: 100%;
              height: 68px;
              background: linear-gradient(311.29deg, #FFB600 0%, #F4C245 87.23%);
              border-radius: 8px;
              cursor: pointer;

              span {
                font-size: 20px;
                user-select: none;
              }

              .album-icon {
                
              }
            }
          }

          .info-and-trade-wrapper {
            flex-grow: 1;


            .info-wrapper {
              min-height: 488px;

              .nft-name {
                font-size: 40px;
              }

              .price-title {
                font-size: 20px;
                color: var(--text-secondary);
              }

              .price-icon {
                font-size: 20px;
              }

              .price {
                font-size: 40px;
                font-weight: 600;
              }

              .starting-price-icon {
                font-size: 18px;
              }

              .starting-price {
                font-size: 36px;
                font-weight: 600;
              }

              .catagories-tags-wrapper {
                width: 100%;
                gap: 12px;

                .tag {
                  background: rgba(244, 194, 69, 0.5);
                  border: 1px solid $primary;
                  padding: 4px 12px;
                  font-size: 20px;
                }
              }

              .users-wrapper {
                gap: 48px;

                .user-wrapper {
                  .user-img {
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                  }

                  .user-text-wrapper {
                    .user-title {
                      font-size: 16px;
                      color: var(--text-secondary);
                    }

                    .user-name {
                      font-size: 20px;
                    }
                  }
                }
              }

              .nft-tags-wrapper {
                gap: 16px;
                
                .tag {
                  font-size: 20px;
                  color: var(--primary);
                }
              }

              .expired-date {
                font-size: 20px;
                color: var(--text-secondary);
              }

              .actions-wrapper {
                gap: 72px;

                .action {
                  border-radius: 4px;
                  
                  .action-icon {
                    font-size: 36px;
                  }

                  .action-amount {
                    font-size: 20px;
                  }

                  &.action-btn {
                    cursor: pointer;
                    user-select: none;
                  }
                }
              }
            }

            .trade-btn-wrapper {
              width: 100%;
              gap: 28px;

              .trade-btn {
                flex-grow: 1;
                height: 68px;
                border-radius: 8px;
                font-size: 20px;
                cursor: pointer;
                user-select: none;

                &.buy-btn {
                  background: var(--primary);
                }

                &.offer-btn {
                  border: 1px solid var(--primary);
                  color: var(--primary);
                }
              }
            }
          }

        }

        .primary-content-description {
          border: 1px solid rgba(225, 225, 225, .8);
          border-radius: 4px;
          padding: 20px 32px 32px 32px;

          .description-title,
          .description-content {
            font-size: 20px;
          }
        }
      }

      .secondary-content {
        
        .tabs {
          .tab {
            font-size: 20px;
          }
          
          .v-tab:not(.v-tab--active) {
            color: #ffffff;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 960px) {
  .nft-wrapper {
    width: 100%;
    padding: 40px 120px 132px 120px;

    .nft-content {
      max-width: 1280px;
      margin: 0 auto;

      .primary-content {
        width: 100%;

        .primary-content-upper {
          width: 100%;
          gap: 0px;
          flex-direction: column;
          margin-bottom: 32px;

          .image-content-wrapper {
            width: 100%;
            // max-width: 600px;
            margin: 0 auto;
            margin-bottom: 40px;

            .image-wrapper {
              width: 100%;
              height: 100%;
              border-radius: 25px;
              overflow: hidden;

              .nft-image {
                width: 100%;
                max-width: 600px;
                height: 100%;
                margin: 0 auto;
                border-radius: 20px;
              }
            }

            .to-album-btn {
              width: 100%;
              height: 68px;
              background: linear-gradient(311.29deg, #FFB600 0%, #F4C245 87.23%);
              border-radius: 8px;
              cursor: pointer;

              span {
                font-size: 16px;
                user-select: none;
              }

              .album-icon {
                
              }
            }
          }

          .info-and-trade-wrapper {
            flex-grow: 1;


            .info-wrapper {
              min-height: 100%;

              .nft-name {
                font-size: 36px;
              }

              .price-title {
                font-size: 16px;
                color: var(--text-secondary);
              }

              .price-icon {
                font-size: 16px;
              }

              .price {
                font-size: 36px;
                font-weight: 600;
              }

              .starting-price-icon {
                font-size: 14px;
              }

              .starting-price {
                font-size: 32px;
                font-weight: 600;
              }

              .catagories-tags-wrapper {
                width: 100%;
                gap: 12px;

                .tag {
                  background: rgba(244, 194, 69, 0.5);
                  border: 1px solid $primary;
                  padding: 4px 12px;
                  font-size: 16px;
                }
              }

              .users-wrapper {
                gap: 24px;

                .user-wrapper {
                  .user-img {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                  }

                  .user-text-wrapper {
                    .user-title {
                      font-size: 12px;
                      color: var(--text-secondary);
                    }

                    .user-name {
                      font-size: 16px;
                    }
                  }
                }
              }

              .nft-tags-wrapper {
                gap: 8px;
                
                .tag {
                  font-size: 16px;
                  color: var(--primary);
                }
              }

              .expired-date {
                font-size: 16px;
                color: var(--text-secondary);
              }

              .actions-wrapper {
                gap: 20px;

                .action {
                  border-radius: 4px;
                  
                  .action-icon {
                    font-size: 24px;
                  }

                  .action-amount {
                    font-size: 16px;
                  }

                  &.action-btn {
                    cursor: pointer;
                    user-select: none;
                  }
                }
              }
            }

            .trade-btn-wrapper {
              width: 100%;
              gap: 28px;

              .trade-btn {
                flex-grow: 1;
                height: 48px;
                border-radius: 8px;
                font-size: 20px;
                cursor: pointer;
                user-select: none;

                &.buy-btn {
                  background: var(--primary);
                }

                &.offer-btn {
                  border: 1px solid var(--primary);
                  color: var(--primary);
                }
              }
            }
          }

        }

        .primary-content-description {
          border: 1px solid rgba(225, 225, 225, .8);
          border-radius: 4px;
          padding: 20px 32px 32px 32px;

          .description-title,
          .description-content {
            font-size: 16px;
          }
        }
      }

      .secondary-content {
        
        .tabs {
          .tab {
            font-size: 16px;
            min-width: 60px;
          }
          
          .v-tab:not(.v-tab--active) {
            color: #ffffff;
          }
        }
      }
    }
  }

  // 3D Model Viewer
  .nft-model {
    width: 300px;
    height: 300px;
  }
}

@media screen and (max-width: 600px) {
  .nft-wrapper {
    width: 100%;
    padding: 10px 16px 132px 16px;

    .nft-content {
      max-width: 1280px;
      margin: 0 auto;

      .primary-content {
        width: 100%;

        .primary-content-upper {
          width: 100%;
          gap: 0px;
          flex-direction: column;
          margin-bottom: 32px;

          .image-content-wrapper {
            width: 100%;
            // max-width: 600px;
            margin: 0 auto;
            margin-bottom: 24px;

            .image-wrapper {
              width: 100%;
              height: 100%;
              border-radius: 25px;
              overflow: hidden;

              .nft-image {
                width: 100%;
                max-width: 600px;
                height: 100%;
                margin: 0 auto;
                border-radius: 20px;
              }
            }

            .to-album-btn {
              width: 100%;
              height: 68px;
              background: linear-gradient(311.29deg, #FFB600 0%, #F4C245 87.23%);
              border-radius: 8px;
              cursor: pointer;

              span {
                font-size: 16px;
                user-select: none;
              }

              .album-img-wrapper {
                position: relative;
                width: 40px;
                height: 40px;
              }

              .album-icon {
                
              }
            }
          }

          .info-and-trade-wrapper {
            flex-grow: 1;


            .info-wrapper {
              min-height: 100%;

              .nft-name {
                font-size: 36px;
              }

              .price-title {
                font-size: 16px;
                color: var(--text-secondary);
              }

              .price-icon {
                font-size: 16px;
              }

              .price {
                font-size: 36px;
                font-weight: 600;
              }

              .starting-price-icon {
                font-size: 14px;
              }

              .starting-price {
                font-size: 32px;
                font-weight: 600;
              }


              .catagories-tags-wrapper {
                width: 100%;
                gap: 12px;

                .tag {
                  background: rgba(244, 194, 69, 0.5);
                  border: 1px solid $primary;
                  padding: 4px 12px;
                  font-size: 16px;
                }
              }

              .users-wrapper {
                gap: 20px;

                .user-wrapper {
                  .user-img {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                  }

                  .user-text-wrapper {
                    .user-title {
                      font-size: 12px;
                      color: var(--text-secondary);
                    }

                    .user-name {
                      font-size: 16px;
                      max-width: 88px;
                    }
                  }
                }
              }

              .nft-tags-wrapper {
                gap: 8px;
                
                .tag {
                  font-size: 16px;
                  color: var(--primary);
                }
              }

              .expired-date {
                font-size: 16px;
                color: var(--text-secondary);
              }

              .actions-wrapper {
                gap: 20px;

                .action {
                  border-radius: 4px;
                  
                  .action-icon {
                    font-size: 24px;
                  }

                  .action-amount {
                    font-size: 16px;
                  }

                  &.action-btn {
                    cursor: pointer;
                    user-select: none;
                  }
                }
              }
            }

            .trade-btn-wrapper {
              width: 100%;
              gap: 28px;

              .trade-btn {
                flex-grow: 1;
                height: 48px;
                border-radius: 8px;
                font-size: 20px;
                cursor: pointer;
                user-select: none;

                &.buy-btn {
                  background: var(--primary);
                }

                &.offer-btn {
                  border: 1px solid var(--primary);
                  color: var(--primary);
                }
              }
            }
          }

        }

        .primary-content-description {
          border: 1px solid rgba(225, 225, 225, .8);
          border-radius: 4px;
          padding: 16px 24px 24px 24px;

          .description-title,
          .description-content {
            font-size: 16px;
          }
        }
      }

      .secondary-content {
        
        .tabs {
          .tab {
            font-size: 16px;
            min-width: 60px;
          }
          
          .v-tab:not(.v-tab--active) {
            color: #ffffff;
          }
        }
      }
    }
  }
}

</style>