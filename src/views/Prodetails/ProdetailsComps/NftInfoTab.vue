<template>
  <v-list
      height="430px"
      width="100%"
      class="overflow-y-auto list px-0"
  >
    <div v-if="NFT">
      <v-list-item v-for="(file,index) in files" :key="file.id" class="px-0 pb-1" style="min-height: 40px">
      <span class="d-inline-block text-break" style="font-size: 14px">
        <span
            class="ETHColor"
        >{{ file.title }}：</span> {{ file.subtitle }}
      </span>
        <div v-if="index === 0 && !isMine || index === 8 && !isMine">
          <v-img class="d-inline-block mt-1 ml-2" style="width: 14px;height: 14px" contain
                 src="@/assets/fake/infoTab/lock.png"></v-img>
        </div>
      </v-list-item>
    </div>
    <overlay v-else></overlay>
  </v-list>
</template>

<script>
import i18n from "@/lang";
import Overlay from "../../../components/Overlay";

export default {
  name: "NftInfoTab",
  components: {Overlay},
  props: [
    "NFT",
    "isMine"
  ],
  computed: {
    files() {
      if (this.NFT) {
        return [
          {
            subtitle: this.NFT.serialNo_encry,
            title: i18n.t("createNFT.serialNo"),
          },
          {
            subtitle: 'KRW ' + this.numFormat(parseInt(Number(this.NFT.interest) + Number(this.NFT.liabilities))),
            title: i18n.t("createNFT.liabillties"),
          },
          {
            subtitle: 'KRW ' + this.numFormat(this.NFT.liabilities),
            title: i18n.t("createNFT.principal"),
          },
          {
            subtitle: Number(this.NFT.annualized * 100).toFixed(2) + "%",
            title: i18n.t("createNFT.rate"),
          },
          {
            subtitle: this.NFT.rating,
            title: i18n.t("createNFT.sore"),
          },
          {
            subtitle: this.NFT.expiration,
            title: i18n.t("createNFT.expiration"),
          },
          {
            subtitle: this.NFT.authentication,
            title: i18n.t("createNFT.authentication"),
          },
          {
            subtitle: this.NFT.archiveName,
            title: i18n.t("createNFT.achiveNameInfo"),
          },
          {
            subtitle: this.NFT.archiveAddress_encry,
            title: i18n.t("createNFT.archiveAddress"),
          },
        ];
      } else return [];
    },
  },
  methods: {
    numFormat(num) {
      var res = num.toString().replace(/\d+/, function (n) { // 先提取整数部分
        return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
          return $1 + ",";
        });
      })
      return res;
    }
  }
}
</script>

<style scoped>
.list::-webkit-scrollbar {
  display: none;
}
</style>
