<template>
  <v-list height="430px" class="overflow-y-auto list d-flex align-top">
    <div v-if="nft">
      <v-list-item two-line v-for="detail in files" :key="detail.id">
        <v-list-item-content>
          <v-list-item-title class="caption ETHColor"
          >{{ detail.title }}
          </v-list-item-title>
          <v-list-item-subtitle class="tabItemSub mt-1"
          >{{ detail.subtitle ? detail.subtitle : '- -' }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title class="caption ETHColor"
          >{{ $t("detailTab.blockchain") }}
          </v-list-item-title>
          <v-list-item-subtitle class="tabItemSub mt-1"
          > Ethereum
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </div>
    <overlay v-else></overlay>
  </v-list>
</template>

<script>
import i18n from "@/lang";
import Overlay from "../../../components/Overlay";
export default {
  name: "NftDetailTab",
  data: () => ({}),
  props: ["nft"],
  components: {Overlay},
  computed: {
    files() {
      if (this.nft.block_chain_info !== null) {
        return [
          {
            subtitle: this.nft.block_chain_info.contract_address,
            title: i18n.t("detailTab.address"),
          },
          {
            subtitle: this.nft.block_chain_info.owner,
            title: i18n.t("detailTab.id"),
          },
          // {
          //   subtitle: this.nft.block_chain_info.block_server,
          //   title: i18n.t("detailTab.blockchain"),
          // },
        ];
      } else return [
        {
          subtitle: '_ _',
          title: i18n.t("detailTab.address"),
        },
        {
          subtitle: '_ _',
          title: i18n.t("detailTab.id"),
        },
        // {
        //   subtitle: '_ _',
        //   title: i18n.t("detailTab.blockchain"),
        // },
      ];
    },
  },
};
</script>

<style scoped>
.tabItemSub {
  color: #fafafa !important;
}

.list::-webkit-scrollbar {
  display: none;
}
</style>
