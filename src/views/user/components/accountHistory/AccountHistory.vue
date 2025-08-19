<template>
  <div class="account-history-wrapper">
    <!-- 擁有的NFT 分類tab欄 -->
    <v-tabs
        v-model="tab"
        show-arrows
        centered
        class="tabs mb-5"
        background-color="transparent"
    >
      <template>
        <v-tab class="text-capitalize">充提紀錄</v-tab>
        <v-tab class="text-capitalize">帳變紀錄</v-tab>
        <v-tab class="text-capitalize">訂單紀錄</v-tab>
      </template>
    </v-tabs>
    <TransHistory v-if="tab === 0" />
    <ChangeHistory v-if="tab === 1" />
    <OrderHistory v-if="tab === 2" />
  </div>
</template>

<script>
import TransHistory from './components/TransHistory.vue'
import ChangeHistory from './components/ChangeHistory.vue'
import OrderHistory from './components/OrderHistory.vue'


export default {
  name: 'AccountHistory',
  components: {
    TransHistory,
    ChangeHistory,
    OrderHistory
  },
  data() {
    return {
      tab: 0,
    }
  }
}
</script>


<style lang="scss" scoped>

.account-history-wrapper {
  padding: 0px 208px 160px 208px !important;
  max-width: 1440px;
  width: 100%;
  margin: auto;

  .table {
    min-height: 450px;
  }

  ::v-deep .table-row {
    min-height: 32px;
    display: flex;
    align-items: center;

    &:nth-child(odd) {
      background: #f4f4f4;

      p {
        color: #000000;
      }
    }
    .row-time {
      width: 160px;
    }
  }
}

::v-deep .v-expansion-panel:nth-child(odd) {
  background: #f4f4f4;

  p, span {
    color: #000000;
  }

  i {
    color: #000000 !important;
  }
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
  .account-history-wrapper {
    padding: 0px 120px 160px 120px !important;
  }
  
}

@media screen and (max-width: 600px) {
  .account-history-wrapper {
    padding: 0px 16px 160px 16px !important;
  }
  
}

</style>