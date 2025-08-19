<template>
  <div class="nft-description-wrapper">
    <div class="nft-description-content">
      <div v-for="(item, index) in descriptionList" :key="index" class="description-row">
        <p class="description-title">{{ `${item.title}：` }}</p>
        <p class="description-content">{{ item.content }}</p>
      </div>
    </div>
  </div>
</template>

<script>
// import { money_filter } from '@/utils/money'

export default {
  name: 'NftDescription',
  props: {
    data: {
      require: true,
      default: function() { return {} },
    },
  },
  data() {
    return {
    }
  },
  computed: {
    descriptionList() {
      if (this.data) {
        return [
          {
            content: this.data.serialNo_encry,
            title: this.$i18n.t("createNFT.serialNo"),
          },
          // {
          //   content: 'KRW' + money_filter(parseInt(Number(this.data.interest) + Number(this.data.liabilities))),
          //   title: this.$i18n.t("createNFT.liabillties"),
          // },
          // {
          //   content: 'KRW' + money_filter(this.data.liabilities),
          //   title: this.$i18n.t("createNFT.principal"),
          // },
          // {
          //   content: Number(this.data.annualized * 100).toFixed(2) + "%",
          //   title: this.$i18n.t("createNFT.rate"),
          // },
          // {
          //   content: this.data.rating,
          //   title: this.$i18n.t("createNFT.sore"),
          // },
          // {
          //   content: this.data.expiration,
          //   title: this.$i18n.t("createNFT.expiration"),
          // },
          // {
          //   content: this.data.authentication,
          //   title: this.$i18n.t("createNFT.authentication"),
          // },
          // {
          //   content: this.data.archiveName,
          //   title: this.$i18n.t("createNFT.achiveNameInfo"),
          // },
          // {
          //   content: this.data.archiveAddress_encry,
          //   title: this.$i18n.t("createNFT.archiveAddress"),
          // },
        ]
      } else {
        return []
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.nft-description-wrapper {
  .nft-description-content {
    padding-top: 50px;

    .description-row {
      display: flex;
      flex-direction: row;
      margin-bottom: 12px;

      .description-title {
        font-size: 20px;
        color: #424242;
        margin-right: 21px;
      }
      .description-content {
        font-size: 20px;
        color: #FFFFFF;
      }
    }
  }
}
</style>
