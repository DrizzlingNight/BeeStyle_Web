<template>
  <div class="Explore d-flex flex-column flex-md-row fill-height">
    <!-- 側欄過濾器 -->
    <SideFilter
      :is-open="isSideFilterOpen"
      :cancel-sell-way-flag="sideFilterSellWayCancelFlag"
      @filter-toggle-onclick="sideFilterToggleOnclick"
      @sell-way-onclick="sellWayOnclick"
      @sell-coin-onclick="sellCoinOnclick"
      @apply-onclick="applyOnclick"
      @reset-onclick="resetOnclick"
    />

    <!-- 手機版才呈現的filter開關欄 -->
    <div class="d-md-none pa-1" style="background: var(--bg2);">
      <v-btn text @click="sideFilterToggleOnclick" min-width="32" height="32" class="my-auto d-block d-md-none px-0">
        <v-icon color="primary">mdi-filter-outline</v-icon>
      </v-btn>
    </div>

    <!-- 主面板 -->
    <v-container fluid class="main-wrapper">
      <!-- 主面板上方 -->
      <v-row
        class="selector-wrapper pt-1"
        no-gutters
      >
        <!-- NFT 篩選器 -->
        <v-col cols="12" class="d-flex mb-4">
          <div class="align-center d-flex">
            <!-- 出售方式篩選標籤 -->
            <v-chip
              v-if="selectedStatus"
              close
              close-icon="mdi-close"
              class="mr-2"
              style="height: 24px; border-radius: 6px;"
              @click:close="sellWayOnclick(null)"
            >
              <span>{{ $t(`marketPlace.status.${selectedStatus.name}`) }}</span>
            </v-chip>
            <!-- 交易幣種篩選標籤 -->
            <v-chip
              v-if="selectedCoin"
              close
              close-icon="mdi-close"
              class="mr-2"
              style="height: 24px; border-radius: 6px;"
              @click:close="sellCoinOnclick(null)"
            >
              <span>{{ selectedCoin.code }}</span>
            </v-chip>
            <!-- 價錢篩選標籤 -->
            <v-chip
              v-if="showPriceFilterStatus"
              close
              close-icon="mdi-close"
              class="mr-2"
              style="height: 24px; border-radius: 6px;"
              @click:close="filterNFT(true)"
            >
              {{ `${$t('explore.filter.priceRange')} : ${showPriceFilterInfo}` }}
            </v-chip>
            <!-- 搜尋篩選標籤 -->
            <v-chip
              v-if="NFTSearchFilter"
              close
              close-icon="mdi-close"
              class="mr-2"
              style="height: 24px; border-radius: 6px;"
              @click:close="resetSearchFilter"
            >
              {{ NFTSearchFilter }}
            </v-chip>
            <!-- NFT分類標籤 -->
            <v-chip
              v-if="NFTCategoryFilter"
              close
              close-icon="mdi-close"
              class="mr-2"
              style="height: 24px; border-radius: 6px;"
              @click:close="resetCategoryFilter"
            >
              {{ $t(`explore.filter.cate${NFTCategoryFilter}`) }}
            </v-chip>
            <!-- 商品結果 # 件 -->
            <span v-html="$t('explore.filter.results', { amount: dataLength })" class="ml-2"></span>
          </div>
        </v-col>

        <!-- 排序區 -->
        <v-col class="d-flex justify-md-end mb-2">
          <!-- 價格排序選擇器 -->
          <v-select
            :items="priceSortItems"
            flat
            solo
            color="#ffffff"
            :label="$t('explore.ordering.priceOrdering')"
            :item-text="selectLabelGet"
            v-model="priceSortValue"
            @change="getNFTList"
            class="sort-price"
          ></v-select>
          <!-- 時間排序選擇器 -->
          <v-select
            :items="timeSortItems"
            flat
            solo
            color="#ffffff"
            :label="$t('explore.ordering.timeOrdering')"
            :item-text="selectLabelGet"
            v-model="timeSortValue"
            @change="getNFTList"
            class="sort-time ml-5"
          ></v-select>
        </v-col>
        <!-- 分隔線 -->
        <v-col cols="12">
          <v-divider></v-divider>
        </v-col>
      </v-row>
      <!-- NFT 陳列面板 -->
      <v-row no-gutters class="d-flex justify-center" style="min-height: 400px">
        <div class="products-wrapper pt-5 pb-15 ma-0">
          <ProductCard
            v-for="nftData in data"
            :key="nftData.id"
            :initial-nft-data="nftData"
          />
          <!-- 沒有資料時顯示 -->
          <div v-if="data.length === 0 && !loading" class="ma-auto">
            <v-img class="mt-8" max-height="160" max-width="301" src="@/assets/fake/transaction.png"></v-img>
            <p class="text-center mt-8" style="font-size: 22px;font-weight: bold">{{ $t("defaultNone") }}</p>
          </div>
        </div>
      </v-row>
      <!-- 分頁器 -->
      <v-row class="d-flex flex-column align-center my-10" >
        <v-pagination
            v-model="page"
            :length="pageLength"
            :total-visible="7"
        ></v-pagination>
      </v-row>
    </v-container>
    <!-- Loading 遮罩 -->
    <overlay :loading="loading"></overlay>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { getNFTList } from '@/api/NFT'

// 過濾側欄
import SideFilter from './components/sideFilter/SideFilter.vue'

// NFT 卡片
import ProductCard from '@/components/productCard/ProductCard.vue'

// loading 遮罩
import Overlay from '@/components/Overlay'

export default {
  name: "Explore",
  components: {
    Overlay,
    SideFilter,
    // SideFilterMobile,
    ProductCard
  },
  data: () => ({

    // ******** UI 變數 ********
    // 顯示中的金額範圍過濾文字
    showMin: "",
    showMax: "",
    // 當前頁面 index
    page: 1,
    // 是否在 loading
    loading: false,

    // 用來 toggle sideFilter isOpen 的 flag
    isSideFilterOpen: false,

    // 用來改變 sideFilter 出售方式active狀態的 flag
    sideFilterSellWayCancelFlag: true,

    // ******** NFT request 參數 ********
    priceSortValue: '',
    // 頁面容納 nft 數量
    limit: 12,
    timeSortValue: '-sell_info__onsale_time', // 預設從新到舊排序
    // 最低價格限制
    minPrice: '',
    // 最高價格限制
    maxPrice: '',
    // 出售中 (排除沒有上架的NFT)
    isOnSale: true,
    // 是否推薦（is_recommend）
    isRecommend: true,
    // 時間排序
    timeSortItems: [
      {text: 'fromNewToOld', value: '-sell_info__onsale_time'},
      {text: 'fromOldToNew',value: 'sell_info__onsale_time'}
    ],
    // 價格排序
    priceSortItems: [
      {text: 'fromHighToLow', value: '-sell_info__price'},
      {text: 'fromLowToHigh', value: 'sell_info__price'}
    ],
    // 商品出售方式
    selectedStatus: null,
    // 商品機要幣種
    selectedCoin: null,
    
    // ******** NFT response 資料 ********
    // nft 資料
    data: [],
    // 總結果長度
    dataLength: 0,
    // 總頁數
    pageLength: 1,
  }),
  created() {
    this.getNFTList()
  },
  computed: {
    ...mapGetters(["user"]),

    // return 當前價格篩選文字
    showPriceFilterInfo() {
      if (this.showMin === "" && this.showMax !== "")
        return `< ${this.showMax}`
      if (this.showMin !== "" && this.showMax === "")
        return `> ${this.showMin}`
      return `${this.showMin} - ${this.showMax}`
    },
    showPriceFilterStatus() {
      return (this.showMax !== "") || (this.showMin !== "")
    },
    // 回傳"搜尋想要購買的NFT"的搜尋文字
    NFTSearchFilter: {
      get: function () {
        return this.$route.query.search || ''
      },
      set: function (newValue) {
        return newValue
      }
    },
    // 回傳從NAVBAR進入時所選擇的種類
    NFTCategoryFilter: {
      get: function () { return this.$route.query.cate || '' },
      set: function (newVal) { return newVal } 
    },
  },
  watch: {
    // 頁數變化時重新拉取商品資料
    page() {
      this.getNFTList()
    }
  },

  methods: {
    // toggle 側邊過濾欄的flag || 指定動作
    sideFilterToggleOnclick(specifyMission) {
      if (specifyMission === 'open') {
        this.isSideFilterOpen = true
        return
      }
      if (specifyMission === 'close') {
        this.isSideFilterOpen = false
        return
      }
      this.isSideFilterOpen = !this.isSideFilterOpen
    },
    // 根據篩選參數，回傳篩選器的文字內容
    selectLabelGet(a) {
      return this.$t(`explore.ordering.${a.text}`)
    },
    // 取得產品列表
    getNFTList() {
      let info = this._.cloneDeep(this.selectedStatus && this.selectedStatus.info || {}) 
      this.loading = true
      this.selectedCoin && (info.coin = this.selectedCoin.id)
      this.minPrice && (info.min_price = this.minPrice)
      this.maxPrice && (info.max_price = this.maxPrice)
      this.priceSortValue && (info.ordering = this.priceSortValue)
      this.timeSortValue && (info.ordering = `${info.ordering && (info.ordering + ',') || ''}${this.timeSortValue}`)

      info.limit = this.limit
      info.is_onsale = this.isOnSale
      info.search = this.NFTSearchFilter
      info.cate = this.NFTCategoryFilter
      // info.is_recommend = this.isRecommend

      info.offset = this.page === 1 ? 0 : this.limit * (this.page - 1)
      // if (resetPage)
      //   this.page = 1
      // info.offset = this.limit * (this.page - 1)
      info.status = 0 //去掉销毁的数据
      // info.is_onsale = true 
      getNFTList(info)
          .then((response) => {
            console.log('response: ', response)
            console.log(response.data.results)
            this.loading = false
            this.data = response.data.results
            this.dataLength = response.data.count
            this.pageLength = (parseInt(response.data.count / this.limit) + ((response.data.count % this.limit) && 1 || 0)) || 1
            // this.$nextTick(this.rowNumber)
            // 視窗拉到頂部
            window.scrollTo(0,0)
          })
          .catch(() => {
            this.loading = false
          });
    },
    filterNFT(reset = false) {
      if (reset) {
        this.minPrice = ""
        this.maxPrice = ""
        this.selectedStatus = null
        this.selectedCoin = null
      }
      this.showMin = this.minPrice
      this.showMax = this.maxPrice
      this.getNFTList();
    },
    resetSearchFilter() {
      this.$router.push({
        name: 'explore'
      })
    },
    resetCategoryFilter() {
      this.$router.push({ name: 'explore' })
    },
    // 2021.11.18 新增清除鈕觸發的 reset函式
    resetOrdering() {
      this.timeSortValue = '-sell_info__onsale_time'
      this.priceSortValue = ''
      this.filterNFT(true)
    },
    // 出售方式按鈕被點按了(傳入出售方式物件)
    sellWayOnclick(currentSellWayObj) {
      if (currentSellWayObj === null) {
        // 用flag回傳關閉事件到組件中 觸發取消出售方式的active
        this.sideFilterSellWayCancelFlag = !this.sideFilterSellWayCancelFlag
        // 清除以選取出售方式並重新拉取
        this.selectedStatus = ''
        this.filterNFT()
        return
      }
      this.selectedStatus = currentSellWayObj
      this.filterNFT()
    },
    // 出售方式按鈕被點按了(傳入出售方式物件)
    sellCoinOnclick(currentSellCoinObj) {
      if (currentSellCoinObj === null) {
        // 用flag回傳關閉事件到組件中 觸發取消出售方式的active
        this.sideFilterSellCoinCancelFlag = !this.sideFilterSellCoinCancelFlag
        // 清除以選取出售方式並重新拉取
        this.selectedCoin = ''
        this.filterNFT()
        return
      }
      this.selectedCoin = currentSellCoinObj
      this.filterNFT()
    },
    // 確定按鈕被點按了(傳入金額範圍obj)
    applyOnclick(priceRange) {
      console.log(priceRange)
      this.minPrice = priceRange.currentMinPrice
      this.maxPrice = priceRange.currentMaxPrice

      this.filterNFT()
    },
    // 清除按鈕被點按了
    resetOnclick() {
      // 清空所有狀態並拉資料
      this.resetOrdering(true)
    },
  }
}
</script>

<style lang="scss" scoped>

.Explore {
  padding-top: 10px;
}

.chip {
  border-radius: 10px !important;
}

// 價格與時間排序
.sort-price, .sort-time {
  max-width: 96px;
  width: 96px;
  height: 24px;

  ::v-deep .v-input__slot {
    height: 24px;
    width: 96px;
    padding: 0px 6px !important;
    margin: 0px;
    background: var(--primary) !important;

    // .v-select__slot {
    // }

    .v-label {
      font-size: var(--text-basic);
      color: #ffffff;
    }

    .v-select__selection {
      font-size: var(--text-basic);
      color: #ffffff;
    }

    .v-icon {
      color: #ffffff;
      font-size: var(--text-basic);
    }
  }
}

::v-deep .v-list-item {
  min-height: 20px !important;

  .v-list-item__content {
    justify-content: center !important;
    padding: 10px 0px 10px 0px;

    .v-list-item__title {
      text-align: center;
    }
  }
}

::v-deep .v-chip--active.chip-active {
  background-color: var(--primary) !important;
  border: none;
  color: none;

    span {
      color: #ffffff !important;
    }
  
  &::before {
    background-color: transparent;
  }

}

.main-wrapper {
  padding: 0px 78px 60px 36px !important;
  max-width: 1200px;

  .products-wrapper {
    width: 100%;
    max-width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    grid-gap: 20px;
  }
}


.inputPrice input[type='number'] {
  -moz-appearance: textfield;
}

.inputPrice input::-webkit-outer-spin-button,
.inputPrice input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

::v-deep .v-navigation-drawer__border {
  display: none;
}

::v-deep .v-expansion-panel-content__wrap {
  padding-top: 10px !important;
  padding-bottom: 10px !important;
}

::v-deep .v-input__slot {
  min-height: auto !important;
  border-radius: 10px !important;

  .v-text-field__slot {
    input {
      padding: 0;
      line-height: 24px !important;
    }
  }
}


.shownavigation {
  width: 340px !important;
}

.hidenavigation {
  width: 50px !important;
}

::v-deep .v-chip-group--column .v-slide-group__content {
  justify-content: space-between;
}

@media screen and (max-width: 960px) {
  .main-wrapper {
    padding: 0px 36px 60px 36px !important;
  }

  .shownavigation {
    display: none;
  }

  .hidenavigation {
    display: none;
  }

  /* .shownSmallNvigation {
    width: 200px;
    display: block;
  } */

  .hideSmallNavigation {
    display: none;
  }

  .icon {
    display: block;
  }
}

@media screen and (max-width: 600px) {

  .main-wrapper {
    padding: 0px 16px 60px 16px !important;
  }

  .sort-price, .sort-time {
    max-width: 112px;
    width: 112px;
    height: 32px;

    ::v-deep .v-input__slot {
      height: 32px;
      width: 112px;
      padding: 0px 6px !important;
      margin: 0px;
      background: var(--primary) !important;
      border-radius: 14px !important;
    }
  }
  
}
</style>
