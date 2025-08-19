<template>
  <div class="own-wrapper">
    <!-- tab欄 包皮 -->
    <div>
      <!-- 擁有的NFT 分類tab欄 -->
      <v-tabs
        v-if="!loading"
        v-model="tab"
        show-arrows
        centered
        class="tabs"
        background-color="transparent"
      >
        <!-- 只有創建者可見 -->
        <template v-if="isCreator">
          <!-- 全部 NFT -->
          <v-tab class="text-capitalize">{{ $t('user.all') }}</v-tab>
          <!-- 已上架的NFT -->
          <v-tab class="text-capitalize">{{ $t('user.isOnSale') }}</v-tab>
          <!-- 未上架的NFT -->
          <v-tab class="text-capitalize">{{ $t('user.notOnSale') }}</v-tab>
          <!-- 已回收的NFT -->
          <!-- <v-tab class="text-capitalize">已收回</v-tab> -->
          <!-- 已過期的NFT -->
          <!-- <v-tab class="text-capitalize">{{ $t('user.expired') }}</v-tab> -->
          <!-- 已銷毀的NFT -->
          <!-- <v-tab class="text-capitalize">{{ $t('user.destroyed') }}</v-tab> -->
          <!-- 參與競價 -->
          <v-tab class="text-capitalize">{{ $t('user.offer') }}</v-tab>
          <!-- 參與議價 -->
          <v-tab class="text-capitalize">{{ $t('user.bargain') }}</v-tab>
          <!-- 收藏的NFT -->
          <v-tab class="text-capitalize">{{ $t('user.favorite') }}</v-tab>
        </template>
        <!-- 非創建者可見 -->
        <template v-else>
          <!-- 全部 NFT -->
          <v-tab class="text-capitalize">{{ $t('user.all') }}</v-tab>
          <!-- 出售中 NFT -->
          <v-tab class="text-capitalize">{{ $t('user.isOnSale') }}</v-tab>
          <!-- 未出售 NFT -->
          <v-tab class="text-capitalize">{{ $t('user.notOnSale') }}</v-tab>
          <!-- 已過期 NFT -->
          <!-- <v-tab class="text-capitalize">{{ $t('user.expired') }}</v-tab> -->
          <!-- 我的出價 -->
          <v-tab class="text-capitalize">{{ $t('user.myOffer') }}</v-tab>
          <!-- 我的競價 -->
          <v-tab class="text-capitalize">{{ $t('user.myBid') }}</v-tab>
        </template>
      </v-tabs>
    </div>
    <!-- NFT 列表欄 -->
    <v-row class="pt-10 pb-14 justify-left" id="nftlistshow" no-gutters>
      <div class="product-wrapper">
        <ProductCard v-for="nft in nftList"
          :key="nft.id" :initial-nft-data="nft"></ProductCard>
      </div>
      <!-- 空狀態 -->
      <v-col v-if="nftList.length === 0 && !loading">
        <default-none></default-none>
      </v-col>
    </v-row>
    <!-- 分頁器 -->
    <v-row class="d-flex justify-center my-10">
      <v-pagination v-model="page" :length="pageLength"></v-pagination>
    </v-row>
    <!-- Loading -->
    <overlay :loading="loading"></overlay>
  </div>
</template>

<script>
import ProductCard from '@/components/productCard/ProductCard.vue'
import DefaultNone from "@/components/DefaultNone";
import {mapGetters} from "vuex";
import {getNFTList} from "@/api/NFT";
// import moment from "moment";
import Overlay from "@/components/Overlay";

// function getNow() {
//   return moment().format("YYYY-MM-DD");
// }

export default {
  name: "Own",
  props: ["userData"],
  components: {
    Overlay,
    // "show-case": ShowCase,
    ProductCard,
    "default-none": DefaultNone,
  },
  watch: {
    user() {
      this.getNFTList();
    },
    userData() {
      this.getNFTList();
    },
    tab() {
      this.getNFTList();
    },
    page() {
      this.getNFTList(this.searchInfo, false);
    },
  },
  computed: {
    ...mapGetters(["user"]),
    isCreator() {
      return (
          this.userData &&
          this.user &&
          this.userData.id === this.user.id &&
          this.user.profile.is_creator
      );
    },
    //判断是否过期
    isExpired() {
      return function (time) {
        let now = this.moment();
        let expired = this.moment(time ? time.expiration : "");
        return expired.diff(now) < 0;
      }
    },
    isOwnOffer() {
      return function (i) {
        if (this.tab === 4) {
          if (!this.isExpired(this.nftList[i])) {
            return true
          } else return false
        } else {
          return true
        }
      }
    },
    tabNum() {
      return {
        creator: [
          { is_redeem: false, user: this.user.id, status: 0 }, // 全部
          { is_onsale: true, user: this.user.id, is_redeem: false, status: 0 }, // 已上架
          { is_onsale: false, user: this.user.id, is_redeem: false, status: 0 }, // 未上架
          // {is_redeem: true, status: 0},
          // { expiration: getNow, user: this.user.id, status: 0 }, // 已過期
          // { status: 1, user: this.user.id}, // 已銷毀
          { bid_user: this.user.id, is_onsale: true, status: 0 }, // 參與的競價
          { offer_user: this.user.id, status: 0 }, // 參與的議價
          { is_like: true }, // 收藏的(包含已上架與未上架)
        ],
        notCreator: [
          {status: 0}, // 全部
          {is_onsale: true, status: 0}, // 已上架
          {is_onsale: false, status: 0}, // 未上架
          // {expiration: getNow, status: 0}, // 已過期
          {tabs: 'offers', is_redeem: false, offer_user: this.$route.params.id, status: 0}, // 我的出價
          {tabs: 'bids', is_redeem: false, is_onsale: true, sell_way: '1', bid_user: this.$route.params.id, status: 0}, // 我的競價
        ],
      }
    }
  },
  data: () => ({
    tab: 0,
    nftList: [],
    loading: true,
    limit: 12,
    page: 1,
    pageLength: 1,
    searchInfo: null,
    ordering: '-sell_info__updated_time' // 根據最後更新時間排序
  }),
  mounted() {
    this.getNFTList();
    this.tab = Number(this.$route.params.selectedTab);
  },
  methods: {
    getNFTList(info = {}, resetPage = true) {
      if (!(this.user && this.userData)) return;
      this.loading = true;
      // 排序
      info.ordering = this.ordering
      // 分页
      info.limit = this.limit;
      if (resetPage) this.page = 1;
      info.offset = this.limit * (this.page - 1);

      this.searchInfo = info;
      // 用户
      if (this.isCreator) {
        // 2022.02.18 把個人中心 已擁有的NFT 用creator改成用user去篩選
        // info.creator = this.user.id;
        // info.user = this.user.id
        info = {...info, ...this._.cloneDeep(this.tabNum.creator[this.tab])};
      } else {
        if (this.tab !== 4 && this.tab !== 5) {
          info.user = this.$route.params.id;
        }
        info = {
          ...info,
          ...this._.cloneDeep(this.tabNum.notCreator[this.tab]),
        };
      }
      let keys = Object.keys(info);
      keys.forEach((k) => {
        if (typeof info[k] === "function") info[k] = info[k]();
      });
      getNFTList(info)
          .then((response) => {
            this.loading = false;
            this.nftList = response.data.results;
            this.pageLength =
                parseInt(response.data.count / this.limit) +
                ((response.data.count % this.limit && 1) || 0);
            this.pageLength || (this.pageLength = 1);
          })
          .catch(() => {
            this.loading = false;
          });
    },
  },
}

</script>

<style lang="scss" scoped>
.highlight {
  background: pink;
  outline: 1px solid red;
}

.own-wrapper {
  padding: 0px 208px 160px 208px;
  max-width: 1440px;
  margin: auto;
}

.product-wrapper {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  grid-gap: 20px;
}

::v-deep .v-tabs-bar {
  height: 32px !important;
}

::v-deep .v-tab {
  min-width: 0px !important;
}

::v-deep .v-slide-group__prev,
::v-deep .v-slide-group__next {
  min-width: 0px !important;
}

::v-deep  .v-tabs-slider-wrapper {
  bottom: auto !important;
}

@media screen and (max-width: 960px) {
  .own-wrapper {
    padding: 0px 120px 160px 120px;
  }
}

@media screen and (max-width: 600px) {
  .own-wrapper {
    padding: 0px 16px 160px 16px;
  }
  
}

</style>
