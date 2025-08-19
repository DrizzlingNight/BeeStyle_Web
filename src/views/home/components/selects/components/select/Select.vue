<template>
  <div @click="toNFT(selectData.id)" class="select d-flex flex-column">
    <v-img :src="`${imageDatabaseUrl}${selectData.files[0]}`" contain width="100%" class="select-cover mb-4"></v-img>
    <div class="content-up d-flex align-end justify-space-between mb-1">
      <p class="select-name mb-0">{{ selectData.name }}</p>
      <p class="reserve-price-text mb-0">{{ $t('home.selects.select.reservationPrice') }}</p>
    </div>
    <div class="content-down d-flex align-center justify-space-between">
      <p class="select-author-name d-flex align-center mb-0">
        <span>{{ selectData.creator.username }}</span>
        <v-img v-if="selectData.creator.isVerified || true" max-width="16" height="16" contain src="/static/ui/home/selects/tick.png" class="ml-1"></v-img>
      </p>
      <p class="select-price d-flex align-center mb-0">
        <v-img width="14" height="auto" contain :src="`/static/ui/utils/coin/coin_${selectData.coin.id}.png`"></v-img>
        <span class="reserve-price pl-2">{{ priceToFixedFilter(selectData.price) }}</span>
      </p>
    </div>
    <v-divider class="divider"></v-divider>
    <div class="content-bottom d-flex align-center justify-space-between pt-3">
      <v-btn @click.stop="shareButtonOnclick(selectData.id)" min-width="16" max-height="13" text class="pa-0">
        <v-img max-width="100%" max-height="100%" contain src="/static/ui/home/selects/share_icon.png"></v-img>
      </v-btn>
      <v-btn @click.stop="likeBtnOnclick(selectData.id)" text min-width="40" height="auto" class="like-btn px-0 d-flex align-center">
        <v-img v-if="selectData.is_like" width="16" height="auto" src="/static/ui/home/selects/stars.png"></v-img>
        <v-img v-else width="16" height="auto" src="/static/ui/home/selects/stars_mute.png"></v-img>
        <span class="like-btn-number pl-1" :class="{ 'primary--text': selectData.is_like }">{{ selectData.likes }}</span>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { likeNFT } from "@/api/NFT"

export default {
  name: 'Select',
  props: {
    initialSelectData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      selectData: {},
      isLikeLoading: false,
      imageDatabaseUrl: process.env.VUE_APP_FILE_BASE_API,
    }
  },
  computed: {
    // 取得vuex使用者
    ...mapGetters(['user']),
    // 是否有登入
    isSignIn() {
      return this.user ? true : false
    }
  },
  methods: {
    // 將價錢後面的小數點多餘的0去掉
    priceToFixedFilter(price) {
      return Number(price)
    },
    // 到該nft的NFT頁面
    toNFT(nftId) {
      this.$router.push({ name: 'nft', params: { id:  nftId} })
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

      this.$toast.success(this.$t('home.selects.select.alreadyCopyToClipboard'))
    },
    // 按讚收藏
    async likeBtnOnclick(nftId) {
      if (this.isSignIn) {
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
      if (this.selectData.is_like) {
        this.selectData.likes --
      } else {
        this.selectData.likes ++
      }
      // toggle 是否已經收藏
      this.selectData.is_like = !this.selectData.is_like
    },
  },
  created() {
    this.selectData = {...this.initialSelectData}
  }
}
</script>

<style lang="scss" scoped>

.select {
  // border: 1px solid rgba($color: #ffffff, $alpha: .2);
  width: 20%;
  max-width: 388px;
  cursor: pointer;

  .select-cover {
    min-height: 200px;
    max-height: 240px;
  }

  .content-up {
    .select-name {
      max-width: 75%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 20px;
    }
    .reserve-price-text {
      color: #999999;
    }
  }

  .content-down {
    .select-author-name {
      width: 50%;

      span {
        width: calc(100% - 16);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #999999;
      }
    }
    .select-price {
      font-size: 20px;

      .reserve-price {
        font-size: 20px;
      }
    }
  }

  .divider {
    background: #333333 !important;
    border-color: #333333 !important;
  }

  .content-bottom {
    .like-btn {
      height: 14px !important;

      .like-btn-number {
        font-size: 18px;
        color: #999999;
      }
    }
  }

}

@media screen and (max-width: 1264px) {
  .select {
    width: 40%;

    .select-cover {
      min-height: 300px;
      max-height: 340px;
    }
  }
}

@media screen and (max-width: 960px) {
  .select {
    width: calc(50% - 10px);

    .select-cover {
      min-height: 200px;
      max-height: 240px;
    }
  }
  
}

@media screen and (max-width: 600px) {
  .select {
    width: calc(50% - 10px);

    .content-up {
      .select-name {
        max-width: 75%;
        font-size: 16px;
      }

      .reserve-price-text {
        font-size: 12px;
      }
    }

    .content-down {
      .select-author-name {
        width: 50%;

        span {
          width: calc(100% - 16);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: #999999;
          font-size: 12px;
        }
      }
      .select-price {
        font-size: 20px;

        .reserve-price {
          font-size: 16px;
        }
      }
    }

    .content-bottom {
      .like-btn {
        height: 12px !important;

        .like-btn-number {
          font-size: 16px;
        }
      }
    }
  }
}

</style>