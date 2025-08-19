<template>
  <v-app id="app" style="background: var(--bg1);">
    <!-- header -->
    <nav-bar></nav-bar>
    <!-- 主內容 -->
    <v-main class="main pa-0">
      <router-view :key="$route.fullPath"></router-view>
    </v-main>
    <!-- 返回上方 -->
    <v-btn @click="toTop" min-width="42" height="42" depressed icon absolute class="to-top-btn pa-0 d-none d-md-block">
      <v-img width="42" height="42" src="/static/ui/utils/to_top.png"></v-img>
    </v-btn>
    <!-- footer -->
    <Footer></Footer>
    <SelectNFTNetwork></SelectNFTNetwork>
    <LinkToWallet></LinkToWallet>
    <DepositNFT></DepositNFT>
    <recharge></recharge>
    <personal-account></personal-account>
    <login-or-register></login-or-register>
    <service-page></service-page>
  </v-app>
</template>

<script>
import NavBar from "@/components/navbar/NavBar";
import Recharge from "./components/Recharge";
import SelectNFTNetwork from '@/components/SelectNFTNetwork'
import LinkToWallet from '@/components/LinkToWallet'
import DepositNFT from '@/components/DepositNFT'
import PersonalAccount from "./views/Withdraw/PersonalAccount";
import Footer from "@/components/footer/Footer";
import {mapGetters} from "vuex";
import LoginOrRegister from "./views/LoginOrRegister/loginOrRegister";
import i18n from "./lang";
import ServicePage from "./views/Service/servicePage";

export default {
  name: "App",
  components: {
    ServicePage,
    LoginOrRegister,
    SelectNFTNetwork,
    LinkToWallet,
    DepositNFT,
    PersonalAccount,
    Recharge,
    NavBar,
    Footer,
  },
  data: () => ({}),
  mounted() {
    let app = document.getElementById("app")
    if (i18n.locale === 'ko-KR') {
      app.style.fontFamily = "GmarketSans"
    } else {
      app.style.fontFamily = ""
    }
  },
  created() {
    this.tryLogin();
    this.getCoin();
    this.getRate();
    this.getConfig();
  },
  computed: {
    ...mapGetters(["showAlert", "config", "isShowLoginDialog"]),
  },
  methods: {
    getRate() {
      this.$store
          .dispatch("coin/getCoinExchangeList")
          .then(() => {
          })
          .catch(() => {
          });
    },
    getCoin() {
      this.$store
          .dispatch("coin/getCoin")
          .then(() => {
          })
          .catch(() => {
          });
    },
    tryLogin() {
      this.$store.commit('ui/SET_IS_USER_DATA_LOADING', true)
      this.$store
          .dispatch("user/user")
          .then(() => {
            this.$store.commit('ui/SET_IS_USER_DATA_LOADING', false)
          })
          .catch(() => {
            this.$store.commit('ui/SET_IS_USER_DATA_LOADING', false)
          });
    },
    getConfig() {
      this.$store
          .dispatch("user/getConfig")
          .then(() => {
          })
          .catch(() => {
          });
    },

    // 2021.11.9 新增回到上方按鈕
    toTop() {
      // FIXME: 回到上方按鈕功能無作用
      // console.log('window.innerHeight', window.innerHeight)
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    }
  },
};
</script>

<style>
  model-viewer#nft-model {
    --poster-color: transparent;
  }
</style>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.main {
  margin-top: 72px;
}

.to-top-btn {
  position: fixed;
  bottom: 34px;
  right: 82px;
  z-index: 10;
}

[data-theme="dark"] {
}

@media screen and (max-width: 960px) {
  .main {
    margin-top: 56px;
  }
  
}
</style>
