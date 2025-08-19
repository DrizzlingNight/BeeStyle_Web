<template>
  <div style="height: 100%" class="d-flex align-center" >
    <v-card class="text-center mx-auto" width="606" height="463">
      <div class="text-right">
        <v-card-subtitle class="d-inline-block pt-5" @click="closeOffShelf">
          <v-img
              max-height="14"
              max-width="14"
              src="@/assets/fake/close.png"
              style="cursor: pointer"
          ></v-img>
        </v-card-subtitle>
      </div>
      <v-img
          class="mx-auto mt-5"
          max-width="143"
          max-height="143"
          src="@/assets/fake/offShelf.png"
      ></v-img>
      <v-card-text class="white--text mt-5" style="font-size: 24px">{{
          $t("productDetail.offShelf.confirmOffShelf")
        }}
      </v-card-text>
      <v-card-text class="white--text" style="font-size: 16px">
        {{ $t("productDetail.offShelf.text") }}
      </v-card-text>
      <div class="d-flex justify-space-around px-3 mt-2">
        <v-col cols="6">
          <v-btn block style="height: 50px" class="btnColor" @click="confirmOffShelf">
            {{ $t("confirmBtn") }}
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn

              style="height: 50px"
              block
              class="amber--text lighten-1 cancelBorderColor"
              @click="closeOffShelf"
          >
            {{ $t("cancelBtn") }}
          </v-btn>
        </v-col>
      </div>
    </v-card>
  </div>
</template>

<script>
import router from "@/router"
import { cancelSaleNFT } from "@/api/NFT"
import { mapActions, mapGetters } from "vuex"
import i18n from '@/lang'

export default {
  name: "OffShelf",
  data() {
    return {
      closeOffShelfDialog: false
    }
  },
  props: ["NFTData"],
  computed: {
    ...mapGetters(["name", "user"]),
  },
  methods: {
    ...mapActions('alert',['showAlert']),
    closeOffShelf() {
      // location.reload()
      this.$emit("closeDialog")
      // this.toasterErr(i18n.t("errorClose"))
    },
    //下架成功
    confirmOffShelf() {
      cancelSaleNFT(this.NFTData.id)
          .then((res) => {
            if (res.code === 0) {
              this.$toast.success(i18n.t("productDetail.offShelf.closeOffShelf"))
              router.push("/user/" + this.user.id)
            } else {
              this.toasterErr(res.code)
            }
          })
          .catch(() => {
          })
    },
  },
};
</script>

<style scoped>
.close {
  z-index: 999999;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

</style>
