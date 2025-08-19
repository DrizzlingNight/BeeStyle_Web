<template>
  <v-container fluid style="width: 100%" class="pa-0">
    <v-row class="d-flex justify-space-between pa-0" no-gutters>
      <v-col cols="12" md="4" lg="5" class="d-flex align-center mx-auto justify-center">
        <v-card
            v-if="!isOldImg && NFT"
            flat
        >
          <v-window
              v-model="onboarding"
          >
            <v-window-item
                v-for="n in imgList"
                :key="`card-${n}`"
            >
              <v-card
                  flat
                  width="814"
                  class="img"
              >
                <v-row
                    class="img"
                    align="center"
                    justify="center"
                    no-gutters
                >
                  <v-img :src="host + n" class="mt-3 mx-5 mb-6"  max-height="814px" max-width="814px" style="border-radius: 10px" contain></v-img>
                </v-row>
              </v-card>
            </v-window-item>
          </v-window>
          <v-card-actions class="justify-center mt-3">
            <v-item-group
                v-model="onboarding"
                class="text-center"
                mandatory
                active-class="amber--text accent-3"
            >
              <v-item
                  v-for="n in imgList.length"
                  :key="`btn-${n}`"
                  v-slot="{ active, toggle }"
              >
                <v-btn
                    :input-value="active"
                    icon
                    @click="toggle"
                >
                  <v-icon size="20px">mdi-record</v-icon>
                </v-btn>
              </v-item>
            </v-item-group>
          </v-card-actions>
        </v-card>
        <v-img
            v-if="isOldImg && NFT"
            contain
            max-width="814"
            class="img"
            height="814"

            style="border-radius: 10px"
            :src="imgUrl"></v-img>
        <v-img v-if="!NFT" contain width="231px" height="71px" src="@/assets/defaultPage.png">
        </v-img>
      </v-col>
        <v-card flat color="#1E1E1E" style="height: 100%" class="rightCard">
          <productdetail :NFTData="NFT"></productdetail>
        </v-card>
    </v-row>
  </v-container>
</template>

<script>

import {getNFT} from "@/api/NFT";
import {mapGetters} from "vuex";
import Productdetail from "./ProdetailsComps/Productdetail";

export default {
  name: "prodetails",
  components: {Productdetail},
  data: () => ({
    onboarding: 0,
    NFT_id: null,
    NFT: null,
    imgUrl: null,
    imgList: null
  }),
  mounted() {
    setInterval(()=>{
      this.Carousel()
    }, 60000)
  },
  computed: {
    ...mapGetters([
      'host', 'user'
    ]),
    //详情图片匹配老数据
    isOldImg() {
      if (this.imgList) {
        if (typeof this.imgList === 'string') {
          return true
        } else return false
      } else return true
    }
  },
  created() {
    this.NFT_id = this.$route.params.id
    this.getNFTInfo()
  },
  methods: {
    next() {
      this.onboarding = this.onboarding + 1 === this.length
          ? 0
          : this.onboarding + 1
    },
    Carousel(){
      if (this.onboarding >= this.imgList.length - 1)
        this.onboarding = 0
      else
        this.onboarding ++
    },
    prev() {
      this.onboarding = this.onboarding - 1 < 0
          ? this.length - 1
          : this.onboarding - 1
    },
    getNFTInfo() {
      getNFT(this.NFT_id)
          .then(response => {
            this.NFT = response.data
            this.imgUrl = this.host + response.data.files
            this.imgList = response.data.files
          })
          .catch(() => {
          });
    },
  }
}
</script>

<style scoped>
.rightColor {
  background-color: #1E1E1E;
}

.btnColor{
  background-color: rgba(255, 193, 7, 1);
}
::v-deep .theme--dark.v-btn--active:hover::before, .theme--dark.v-btn--active::before{
  opacity: 0;
}
::v-deep .v-btn--icon.v-size--default{
  width: 26px;
  height: 26px;
}
@media (min-width:1000px) {
  .rightCard {
    width: 638px;
  }
  .img{
    height: 814px;
  }


}
@media (max-width:1000px) {
  .rightCard {
    width: 100%;
  }
  .img{
    min-height: 456px;
    width: 100%;
    height: 100%;
  }

}
</style>