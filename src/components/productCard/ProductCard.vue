<template>
  <v-card @click="cardOnclick()" v-ripple="false" flat rounded="lg" class="NFT-card _NFT-card d-flex flex-column pt-2 px-5 pb-3">
    <div class="card-header-wrapper w-100 d-flex justify-space-between align-center mt-1 mb-2">
      <!-- 創作者標題 -->
      <div @click.stop="creatorOnclick(nftData.creator.id)" class="d-flex align-center users-wrapper user-wrapper">
        <v-img :src="nftData.creator.profile.avatar ? `${imageDatabaseUrl}${nftData.creator.profile.avatar}` : '/static/ui/utils/user/default.png'" class="user-thumbnail holder-thumbnail mr-1 rounded-circle"></v-img>
      </div>
    </div>
    <!-- nft 圖 -->
    <div class="nft-img-wrapper mb-2 d-flex justify-center">
      <v-img v-if="!is3dModel" width="100%" cover :src="`${imageDatabaseUrl}${nftData.files ? nftData.files[0] : ''}`" class="nft-img rounded"></v-img>
      <model-viewer v-else :src="`${imageDatabaseUrl}${nftData.files ? nftData.files[0] : ''}`" camera-controls environment-image="neutral" shadow-intensity="0" autoplay id="nft-model" class="nft-model" />
    </div>
    <!-- 商品主文字內容 -->
    <div class="card-content-wrapper d-flex flex-column">
      <div class="content-header">
        <!-- 商品名稱 -->
        <p class="content-title mb-0">{{ nftData.name }}</p>
        <!-- 商品標籤 -->
        <p class="tags-wrapper mb-2">
          <span v-for="(tag, index) in convertKeywords(nftData.keywords)" :key="index" class="tag mr-2">#{{ tag }}</span>
        </p>
      </div>
      <v-spacer></v-spacer>
      <!-- 商品細節 -->
      <div class="content-body d-flex flex-column">
        <!-- 價錢 -->
        <div class="body-head-wrapper d-flex">
          <div class="body-head-left d-flex flex-column">
            <p v-if="nftData.is_onsale" class="d-flex align-center mb-2" style="line-height: 6px;">
              <v-img width="14" height="auto" :src="`/static/ui/utils/coin/coin_${nftData.coin.id}.png`" contain class="eth-img mr-1"></v-img>
              <span class="product-price">{{ Number(nftData.current_price) }}</span>
            </p>
            <p v-else class="d-flex align-center mb-2" style="line-height: 6px;">{{ $t('nftCard.notOnSale') }}</p>
          </div>
          <!-- 剩餘時間 (限拍賣出售方式) -->
          <div class="body-head-right">
            <!-- 如果不是上架狀態就直接不顯示時間 -->
            <p v-if="nftData.sell_way === '1' && nftData.is_onsale" class="d-flex align-center mb-0">
              <v-icon x-small class="content-icon mr-1">mdi-timer-sand</v-icon>
              <span class="remaining-time">{{ countRemainTime(nftData.end_time) }}</span>
            </p>
          </div>
        </div>
      </div>
      <!-- 取消議價 -->
      <v-btn v-if="isCancelBargainAvailable"  @click.stop="cancelBargainOnclick()">{{ $t("nft.cancelBargain") }}</v-btn>
    </div>
    <!-- 轉出鈕 -->
    <!-- TODO: 2022.04.08 為了上正式，先把轉出功能隱藏 -->
    <!-- <v-btn v-if="isWithdrawBtnShow" @click.stop="withdrawBtnOnclick" class="withdraw-btn pa-0 px-0">
      {{ $t("nft.withdrawNFT.withdraw") }}
    </v-btn> -->
    <!-- 收藏鈕 -->
    <v-btn @click.stop="likeBtnOnclick(nftData.id)" text min-width="auto" height="auto" absolute top right class="favorite-btn pa-0 px-0" :class="{ 'favorite-active': nftData.is_ike }">
      <!-- <v-icon class="favorite-icon">mdi-heart</v-icon> -->
      <v-img v-if="!nftData.is_like" width="20" height="auto" src="/static/ui/explore/productCard/stars_mute.png" class="mr-2"></v-img>
      <v-img v-else width="20" height="auto" src="/static/ui/explore/productCard/stars.png" class="mr-2"></v-img>
      <span class="favorite-number" :class="{ 'favorite-active': nftData.is_like, 'primary--text': nftData.is_like }">{{ nftData.likes }}</span>
    </v-btn>

    <!-- 彈窗 -->
    <v-dialog
      v-model="isDialogShow"
      persistent
      class="d-flex justify-center align-center"
      width="480px"
    >
      <!-- 取消議價 -->
      <CancelBargain
        v-if="isCancelBargainDialogShow"
        :NFTData="nftData"
        @closeDialog="closeDialog"
      />

      <!-- 轉出 -->
      <WithdrawNFT
        v-if="isWithdrawNFTShow"
        :item="nftData"
        @closeDialog="closeDialog"
        @showPasswordPage="showPasswordPage"
        @showWithdrawNFTConfirm="showWithdrawNFTConfirm"
      />

      <!-- 轉出確認 -->
      <WithdrawNFTConfirm
        v-if="isWithdrawNFTConfirmShow"
        :item="withdrawNFTConfirmItem"
        @close="closeDialog"
        @showPasswordPage="showPasswordPage"
      />

      <!-- 密碼確認 -->
      <Password
        v-if="isPasswordShow"
        :request-func="requestFunc"
        :request-params="requestParams"
        @closeDialog="closeDialog"
        @successDialog="successDialog"
      />

      <Success
        v-if="isSuccessShow"
        :successTitle="successTitle"
        :successText="successText"
        :successUser="successUser"
        @closeDialog="closeDialog"
      />
    </v-dialog>

  </v-card>
</template>

<script>
import { likeNFT } from '@/api/NFT'
import { mapGetters } from 'vuex'

// 轉出NFT
import WithdrawNFT from './components/WithdrawNFT'
import Password from './components/Password'
import WithdrawNFTConfirm from './components/WithdrawNFTConfirm'
import Success from './components/Success'

// 取消議價彈窗
import CancelBargain from '@/views/nft/components/CancelBargain.vue'

// 3D Model viewer
import { ModelViewer } from '@google/model-viewer'

export default {
  name: 'NftCard',
  components: {
    WithdrawNFT,
    Password,
    WithdrawNFTConfirm,
    Success,
    CancelBargain,
    ModelViewer
  },
  props: {
    initialNftData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      imageDatabaseUrl: process.env.VUE_APP_FILE_BASE_API,
      likeIsLoading: false,
      isBargainExpired: true, // 議價紀錄是否被成交過了 默認為true
      isWithdrawNFTShow: false,
      isWithdrawNFTConfirmShow: false,
      isPasswordShow: false,
      isSuccessShow: false,
      isCancelBargainDialogShow: false,
      nftData: {},
      withdrawNFTConfirmItem: {},
      successTitle: '',
      successText: '',
      successUser: '',
      requestFunc: '',
      requestParams: '',
    }
  },
  computed: {
    ...mapGetters(['host', 'user']),

    //判斷是否登錄
    isLogin() {
      return this.user ? true : false
    },

    //返回true是本人
    isMine() {
      return this.nftData && this.user && this.user.id === this.nftData.user.id
    },

    // 判斷議價是否顯示
    isCancelBargainAvailable() {
      return this.nftData.offer_id !== null && !this.isMine
    },

    // 彈窗是否顯示
    isDialogShow() {
      return this.isCancelBargainDialogShow || this.isWithdrawNFTShow || this.isWithdrawNFTConfirmShow || this.isPasswordShow || this.isSuccessShow
    },

    // 判斷是否為3D Model
    is3dModel() {
      if (!this.nftData.files) return false
      const file = this.nftData.files[0].split('.')
      const fileExtension = file[file.length -1]
      if (fileExtension === 'gltf-binary') {
        return true
      } else {
        return false
      }
    },

    // 判斷轉出紐是否顯示
    isWithdrawBtnShow() {
      if (this.$route.name !== 'user') return false // 如果不是在個人中心就不顯示
      if (!this.nftData) return false
      if (this.nftData.is_onsale || !this.isMine) {
        return false
      } else {
        return true
      }
    },
  },

  created() {
    this.nftData = { ...this.initialNftData }
  },

  methods: {

    // 關閉彈窗
    closeDialog() {
      this.isWithdrawNFTShow = false
      this.isWithdrawNFTConfirmShow = false
      this.isPasswordShow = false
      this.isSuccessShow = false
      this.isCancelBargainDialogShow = false
    },

    // 取消議價
    cancelBargainOnclick() {
      if (this.isLogin) {
        this.isCancelBargainDialogShow = true
      } else {
        this.$store.commit('ui/SET_IS_SHOW_LOGIN_DIALOG', true)
      }
    },

    // 轉換keywords成tag
    convertKeywords(keywords) {
      const tags = keywords ? keywords.split(',') : null
      return tags ? tags.slice(0, tags.length - 1) : null // 去除最後一個,(空白)
    },

    // 跳轉到 nft詳情頁
    cardOnclick() {
      const nftId = this.nftData.id
      this.$router.push({ name: 'nft', params: { id: nftId } })
    },

    // 創作者投向被點按
    creatorOnclick(creatorId) {
      this.$router.push({ name: 'user', params: { id: creatorId } })
    },

    // 按讚請求成功觸發資料變動
    likeRequestSucceed() {
      // 改變按讚數
      if (this.nftData.is_like) {
        this.nftData.likes --
      } else {
        this.nftData.likes ++
      }
      // toggle 是否已經按讚
      this.nftData.is_like = !this.nftData.is_like
    },

    // 按讚
    async likeBtnOnclick(nftId) {
      if (this.isLogin) {
        try {
          // 如果按讚扭還在loading就不給發送request
          if (this.likeIsLoading) {
            return
          }
          this.likeIsLoading = true
          const response = await likeNFT(nftId)
          console.log(response)
          // 請求成功，觸發後續本地資料變動
          this.likeRequestSucceed()
          this.likeIsLoading = false
        } catch(err) {
          console.log(err)
          this.likeIsLoading = false
        }
      } else {
        this.$store.commit('ui/SET_IS_SHOW_LOGIN_DIALOG', true)
      }
    },

    // 轉出NFT Start
    withdrawBtnOnclick() {
      this.nftData.image = `${this.host}${this.nftData.files[0]}`
      this.$store.commit('ui/SET_CONNECTED_WALLET_ACCOUNT', '')
      this.isWithdrawNFTShow = true
    },
    showPasswordPage(title, body, toUser, requestFunc, requestParams) {
      this.successTitle = title;
      this.successText = body;
      this.successUser = toUser;
      this.requestFunc = requestFunc
      this.requestParams = requestParams
      this.isWithdrawNFTShow = false
      this.isWithdrawNFTConfirmShow = false
      this.isPasswordShow = true
    },
    showWithdrawNFTConfirm(item) {
      this.withdrawNFTConfirmItem = item
      this.isWithdrawNFTShow = false
      this.isWithdrawNFTConfirmShow = true
    },
    successDialog() {
      this.isWithdrawNFTShow = false
      this.isPasswordShow = false
      this.isWithdrawNFTConfirmShow = false
      this.isSuccessShow = true
    },
    // 轉出NFT End

    // 計算剩餘時間
    countRemainTime(endTime) {
      // 獲取當前時間
      const date = new Date()
      const now = date.getTime()
      // 獲取截止時間
      const endDate = new Date(endTime)
      const end = endDate.getTime()
      // 計算時間差
      const leftTime = end - now
      
      // 如果時間到期就回傳 '- -'
      if (leftTime <= 0) return '- -'

      // 取得剩餘時間的 日(d)、時(h)、分(m)、秒(s)
      let d = Math.floor(leftTime / 1000 / 60 / 60 / 24)//天数我没用到，暂且写上
      let h = Math.floor((leftTime / 1000 / 60 / 60) % 24)
      let m = Math.floor((leftTime / 1000 / 60) % 60)
      let s = Math.floor((leftTime / 1000) % 60)

      //递归每秒调用countTime方法，显示动态时间效果
      // setTimeout(this.countTime, 1000)
      // const remainTimeObj = {s:s,m:m,h:h,d:d}

      // 整理時間字串
      const dayText = d ? `${d}${this.$t('nftCard.d')}` : ''
      const hourText = h ? `${h}${this.$t('nftCard.h')}` : ''
      const minText = m ? `${m}${this.$t('nftCard.m')}` : ''
      const secText = s ? `${s}${this.$t('nftCard.s')}` : ''

      // return剩餘時間
      return dayText + hourText + minText + secText
    },
  }
}
</script>

<style lang="scss" scoped>

// 卡片
.NFT-card {
  position: relative;
  // width: 240px;
  min-width: 240px;
  min-height: 360px;
  height: 100%;
  background: var(--bg-card);
  border: 1px solid #e2e2e2;
  top: 0px;
  transition: all .3s;

  &:hover {
    top: -2px;
    box-shadow: 0px 0px 8px 0px #ffffff !important;
    border: 1px solid $primary !important;
    transition: all .2s;
  }

  // 卡片頭
  .card-header-wrapper {
    font-size: 8px;
    
    .users-wrapper {
      position: relative;

      .user-thumbnail {
        width: 24px;
        height: 24px;

        &.author-thumbnail {
          position: absolute;
          left: 8px;
        }
      }
    }

  }
  // 圖片
  .nft-img-wrapper {
    .nft-img {
      height: 200px;
    }
  }

  // 文字內容
  .card-content-wrapper {
    flex-grow: 1;

    .content-title {
      font-size: var(--text-md);
      max-width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .tags-wrapper {
      max-width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      .tag {
        color: var(--text-secondary);
      }
    }

    .content-body {
      align-items: flex-end;

      .body-head-wrapper {
        flex-direction: column;
        .body-head-left {
          align-items: flex-end;
        }
      }

      .content-icon {
        color: #919191;
      }

      .eth-img {
        width: 8px;
        height: 15px;
      }

      .price-unit {
        font-size: 8px;
      }

      .price-transform {
        color: var(--text-secondary);
      }

      .remaining-time {
        color: #ffffff;
      }
    }
  }

  // 收藏紐
  .favorite-btn {
    top: 10px;
    right: 10px;
    
    .favorite-icon {
      color: var(--text-secondary);
      font-size: var(--text-md);
    }

    .favorite-number {
      color: var(--text-secondary);
      font-size: var(--text-md);
    }

    &.favorite-active {
      
      .favorite-icon {
        color: #e31e1e;
      }
      
      .favorite-number {
        color: #e31e1e;
      }
    }
  }

  // 轉出鈕
  .withdraw-btn {
    position: absolute;
    top: 12px;
    left: 40%;
    min-width: 40px;
    height: 20px;
    // background-color: yellow;
    font-size: 14px;
  }


}

// 輪播器下方點點
::v-deep .v-carousel__controls {
  position: absolute;
  bottom: -10px;

  .v-item-group {
    width: 32px;
    display: flex;
    justify-content: center;
    .v-btn {
      background-color: rgba($color: #333333, $alpha: 0.3);
      border-radius: 50%;
      margin: 2px;
      width: 6px;
      height: 6px;

      &.v-btn--active {
        background-color: #333333;
      }

      .v-btn__content {
        display: none;
      }
    }
  }
}

// 3D Model Viewer
.nft-model {
  width: 215px;
  height: 200px;
}

@media screen and (max-width: 600px) {
  .NFT-card {

  .card-header-wrapper {
    font-size: 8px;
    
    .users-wrapper {
      position: relative;

      .user-thumbnail {
        width: 28px;
        height: 28px;

        &.author-thumbnail {
          background: green;
          position: absolute;
          left: 8px;
        }
      }
    }

  }
  }
}

[data-theme = "dark"] {
  .NFT-card {
    border: 1px solid transparent;
  }

  .v-carousel__controls .v-item-group .v-btn {
    // TODO 沒改到
    background-color: rgba($color: #ffffff, $alpha: 0.3) !important;
  }

  .content-body {

    .content-icon {
      color: #ffffff !important;
    }
  }
}

</style>