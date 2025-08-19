<template>
  <v-navigation-drawer
    :bottom="isMobile"
    permanent
    class="pt-1 side-filter"
    :class="{ hide: !isOpen }"
    style="z-index: 5;box-shadow: none;background: var(--bg2);"
  >
    <!-- 過濾器 header -->
    <v-list-item class="px-1">
      <div class="header-wrapper d-flex justify-space-between" style="border-radius: 6px; width: 100%; height: 36px;">
        <v-list-item-title v-if="isOpen" class="ml-2">{{ $t('explore.filter.filterTitle') }}</v-list-item-title>
        <v-btn
          v-if="isOpen"
          text
          color="primary"
          min-width="40"
          @click.stop="toggleIsOpen"
          class="pa-0"
        >
          <v-icon v-if="isOpen">mdi-arrow-left</v-icon>
          <v-icon v-else>mdi-filter-outline</v-icon>
        </v-btn>
        <v-btn v-else text @click.stop="toggleIsOpen" color="primary" min-width="40" class="pa-0">
          <v-icon >mdi-filter-outline</v-icon>
        </v-btn>
      </div>
    </v-list-item>
    <!-- 過濾器 body -->
    <v-expansion-panels
        v-if="isOpen"
        v-model="panels"
        multiple
        accordion
        flat
    >
      <!-- 出售方式過濾欄 -->
      <v-expansion-panel class="panel" style="background: var(--bg2);">
        <!-- 出售方式延展鈕 -->
        <v-expansion-panel-header expand-icon="mdi-menu-down" class="px-4 pt-4 pb-2" style="min-height: 20px;">
          <div>
            {{ $t('explore.filter.sellWay') }}
          </div>
        </v-expansion-panel-header>
        <!-- 狀態延展內容 -->
        <v-expansion-panel-content
          eager
        >
          <v-chip-group
              column
              @change="sellWaySelected"
              v-model="currentSellWay"
              active-class="chip-active"
          >
            <v-chip
              large
              class="chip col-5 justify-center ma-0"
              v-for="way in sellWayList"
              :key="way.code"
              :value="way"
              style="height: 24px"
            >
              {{ $t(`explore.filter.sellWayText.${way.name}`) }}
            </v-chip>
          </v-chip-group>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <div style="width: 100%;">
        <v-divider></v-divider>
      </div>
      <!-- 交易貨幣過濾欄 -->
      <v-expansion-panel class="panel" style="background: var(--bg2);">
        <!-- 交易幣種延展鈕 -->
        <v-expansion-panel-header expand-icon="mdi-menu-down" class="px-4 pt-4 pb-2" style="min-height: 20px;">
          <div>
            {{ $t('explore.filter.sellCoin') }}
          </div>
        </v-expansion-panel-header>
        <!-- 幣種延展內容 -->
        <v-expansion-panel-content
          eager
        >
          <v-chip-group
              column
              @change="sellCoinSelected"
              v-model="currentSellCoin"
              active-class="chip-active"
          >
            <v-chip
              large
              class="chip col-5 justify-center ma-0"
              v-for="coin in coinList"
              :key="coin.id"
              :value="coin"
              style="height: 24px"
            >
              {{ coin.code }}
            </v-chip>
          </v-chip-group>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <div style="width: 100%;">
        <v-divider></v-divider>
      </div>
      <!-- 價格過濾欄 -->
      <v-expansion-panel class="panel" style="background: var(--bg2);">
        <!-- 價格延展鈕 -->
        <v-expansion-panel-header class="pa-4" expand-icon="mdi-menu-down" style="min-height: 20px;">
          <div>
            {{ $t('explore.filter.priceRange') }}
          </div>
        </v-expansion-panel-header>
        <!-- 價格延展內容 -->
        <v-expansion-panel-content>
          <v-container>
            <v-form :value="false">
              <v-row class="d-flex justify-space-between">
                <v-col cols="5" class="pa-0">
                  <p class="mb-0 pl-1">{{ $t('marketPlace.price.min') }}</p>
                  <!-- 最小金額 input -->
                  <v-text-field
                      type="number"
                      single-line
                      dense
                      outlined
                      v-model="currentMinPrice"
                      class="inputPrice"
                      autocomplete="off"
                  >
                    {{ $t('explore.filter.minPrice') }}
                  </v-text-field>
                </v-col>
                <span class="pt-5" >~</span>
                <v-col cols="5" class="pa-0">
                  <!-- 最大金額 input -->
                  <p class="mb-0 pl-1">
                    {{ $t('explore.filter.maxPrice') }}
                  </p>
                  <v-text-field
                      type="number"
                      single-line
                      dense
                      outlined
                      v-model="currentMaxPrice"
                      class="inputPrice"
                      autocomplete="off"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <!-- 不合規價格範圍的警示 -->
                <span
                  class="mt-n5 caption red--text col-12"
                  v-if="(currentMinPrice && currentMaxPrice) && isPriceRangeInvalid"
                >
                  {{ $t('explore.filter.priceInvalidError') }}
                </span>
              </v-row>
            </v-form>
          </v-container>
        </v-expansion-panel-content>
        <v-divider></v-divider>
        <!-- 送出與清空鈕 wrapper -->
        <v-col class="pa-0 col-12 mt-10 d-flex justify-center">
          <!-- 確認 -->
          <v-btn
              min-width="84"
              height="28"
              dense
              color="primary"
              depressed
              class="mr-4"
              style="border-radius: 12px;"
              :disabled="isPriceRangeEmpty || isPriceRangeInvalid"
              @click="applyOnclick">
            {{ $t('explore.filter.submit') }}
          </v-btn>
          <!-- 清空 -->
          <v-btn
              min-width="84"
              height="28"
              dense
              outlined
              depressed
              style="border-radius: 12px;"
              @click="resetOnclick">
            {{ $t('explore.filter.clear') }}
          </v-btn>
        </v-col>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SideFilter',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    cancelSellWayFlag: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    // ******** UI 變數 ********
    isMobile: false, // 預設false
    panels: [0, 1],
    // 出售方式按鈕選項
    sellWayList: [
      {name: 'buyNow', code: 1, info: {sell_way: 0}},
      {name: 'onAuction', code: 0, info: {sell_way: 1}},
    ],
    currentMinPrice: '',
    currentMaxPrice: '',
    // 商品出售類型
    currentSellWay: null,
    // 商品交易幣種
    currentSellCoin: null
  }),

  watch: {
    toggleIsOpenFlag() {
      this.isOpen = !this.isOpen
    },
    cancelSellWayFlag() {
      this.currentSellWay = null
    },
    cancelSellCoinFlag() {
      this.currentSellCoin = null
    }
  },
  
  computed: {
    ...mapGetters(['coinList']),

    // 金額欄位是否為空的
    isPriceRangeEmpty() {
      return !Number(this.currentMinPrice) && !Number(this.currentMaxPrice)
    },
    // 輸入金額範圍是否正常
    isPriceRangeInvalid() {
      // 如果沒有填入東西就直接 return false
      if (!this.currentMinPrice || !this.currentMaxPrice) return false

      // 如果有填入東西:
      const currentMinPrice = Number(this.currentMinPrice)
      const currentMaxPrice = Number(this.currentMaxPrice)
      if (!currentMinPrice || !currentMaxPrice) return true
      if (this.currentMinPrice > this.currentMaxPrice) return true
      return false
    },
  },

  methods: {

    onResize() {
      if (this.$vuetify.breakpoint.width < 960) { // 960 以下要變成 mobile型態
        this.isMobile = true
      } else {
        this.isMobile = false
      }
    },
    addWidowResizeListener() {
      window.addEventListener('resize', this.onResize, { passive: true })
    },
    removeWindowResizeListener() {
      window.removeEventListener('resize', this.onResize, { passive: true })
    },

    // 開關側欄
    toggleIsOpen(specifyMission) {

      this.$emit('filter-toggle-onclick', specifyMission)
    },

    // 清除按鈕點按
    resetOnclick() {
      this.currentSellWay = null
      this.currentSellCoin = null
      this.currentMinPrice = ''
      this.currentMaxPrice = ''
      this.$emit('reset-onclick')
    },

    // 金額區間確定鈕點按
    applyOnclick() {
      const priceRange = {
        currentMinPrice: this.currentMinPrice,
        currentMaxPrice: this.currentMaxPrice
      }
      // 清空價格範圍
      this.currentMinPrice = ''
      this.currentMaxPrice = ''

      this.$emit('apply-onclick', priceRange)
    },

    // 出售方式選擇
    sellWaySelected() {
      console.log('currentSellWay: ', this.currentSellWay)
      const currentSellWayObj = this.currentSellWay ? this.currentSellWay : null
      
      // 外部透過傳入是否為空直來決定是否要 resetFilter
      this.$emit('sell-way-onclick', currentSellWayObj)
    },

    // 交易幣種選擇
    sellCoinSelected() {
      console.log('currentSellCoin: ', this.currentSellCoin)
      const currentSellCoinObj = this.currentSellCoin ? this.currentSellCoin : null
      
      // 外部透過傳入是否為空直來決定是否要 resetFilter
      this.$emit('sell-coin-onclick', currentSellCoinObj)
    },
  },

  created() {
    this.addWidowResizeListener()
  },
  beforeDestroy() {
    this.removeWindowResizeListener()
  }
}
</script>

<style lang="scss" scoped>

.side-filter {
  width: 340px !important;

  &.hide {
    width: 50px !important;
  }
}

.chip {
  border-radius: 10px !important;
  margin-bottom: 12px !important;
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
  .side-filter {
    position: absolute;
    width: 50% !important;

    &.hide {
      width: 0px !important;
    }
  }

  .hideSmallNavigation {
    display: none;
  }

  .icon {
    display: block;
  }
}

@media screen and (max-width: 600px) {

  .side-filter {
    width: 100% !important;
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