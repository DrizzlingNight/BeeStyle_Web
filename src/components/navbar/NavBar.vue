<template>
  <div>
    <v-app-bar elevate-on-scroll app height="auto" class="header d-flex flex-column mb-10">
      <v-container fluid class="pa-0">
        <v-row no-gutters class="header-down d-flex align-center pl-0 pl-md-8">
          <!-- 搜尋鈕 -->
          <v-btn @click="isSearchNavigationOpen = !isSearchNavigationOpen" min-width="56" height="100%" text class="d-flex d-md-none pa-0">
            <v-img v-if="isSearchNavigationOpen" width="22" height="22" contain src="/static/ui/components/navbar/search.png" class="px-0"></v-img>
            <v-img v-else width="20" height="20" contain src="/static/ui/components/navbar/search.png" class="px-0"></v-img>
          </v-btn>
          <!-- LOGO -->
          <v-btn text class="logo d-flex align-center px-0" @click="goFrontPage">
            <v-img contain src="/static/ui/utils/logo/logo_dark.png" class="logo-img"></v-img>
          </v-btn>
          <!-- 搜尋 -->
          <v-col cols="3" class="search-wrapper d-none d-md-flex align-center pa-0">
            <input v-model="NFTSearchFilter" type="text" class="search-input pl-13" :placeholder="$t('navbar.searchPlaceholder')" @keyup.enter="goSearchNft">
            <v-icon color="primary" class="search-icon px-3">mdi-magnify</v-icon>
          </v-col>
          <v-spacer></v-spacer>
          <!-- nav tabs -->
          <v-col cols="4" lg="4" class="links pa-0 d-none d-md-block">
            <template>
              <v-tabs hide-slider centered height="72" center background-color="transparent" >
                <v-spacer></v-spacer>
                <!-- nav 連結 -->
                <v-tab @click="navLinkOnclick(navLink.id)" v-for="navLink in navLinks" exact-active-class="tab-active" :key="navLink.id" :to="navLink.link" class="tab mx-md-1 mx-lg-2">
                  {{ $t(`navbar.navLink${navLink.id}`) }}
                </v-tab>
              </v-tabs>
            </template>
          </v-col>
          <!-- 創造NFT -->
          <v-btn @click="goCreateNft" text height="100%" class="create-nft-btn d-none d-md-block mx-md-2 mx-lg-4 px-0">
            <span style="font-size: var(--text-md);">{{ $t('navbar.navLink7') }}</span>
          </v-btn>
          <!-- <v-spacer></v-spacer> -->
          <!-- 選擇語言 -->
          <v-col cols="1" class="text-center d-none d-md-block">
            <v-menu open-on-hover offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" text class="px-2">
                  <!-- <v-avatar size="30px">
                    <v-img class="img" :src="selectedLanguage.imgUrl"></v-img>
                  </v-avatar> -->
                  <v-icon class="d-block d-lg-none">mdi-earth</v-icon>
                  <span
                    class="ml-3 mr-6 d-none d-lg-block navI18n--text"
                    style="font-size: 14px; font-weight: bold"
                    >{{ selectedLanguage.imgName }}</span
                  >
                  <v-img
                    class="ml-n4 d-none d-lg-block"
                    height="7"
                    max-width="13"
                    src="@/assets/fake/arrow.png"
                  ></v-img>
                </v-btn>
              </template>
              <v-list class="pa-0">
                <v-list-item
                  v-for="(item, index) in language"
                  :key="index"
                  @click="choiceLanguage(item)"
                  class="px-1 navI18n--text"
                  style="min-height: 40px"
                >
                  <!-- <v-avatar size="30px">
                    <v-img class="img" :src="item.imgUrl"></v-img>
                  </v-avatar> -->
                  <v-list-item-title class="ml-4">
                    {{ item.imgName }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
          <v-divider vertical class="d-none d-md-block"></v-divider>
          <!-- 登入鈕 -->
          <v-btn v-if="!user" @click="showLogin" text width="72" height="100%" class="d-none d-md-block login-btn primary--text">
            <v-img width="24" height="26" contain src="/static/ui/components/navbar/me.png"></v-img>
          </v-btn>
          <!-- 帳號 drop-down -->
          <div v-else style="height: 100%;">
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" text width="72" height="100%" class="d-none d-md-block px-0 login-btn rounded-0 primary--text">
                  <v-img width="24" height="25" contain src="/static/ui/components/navbar/me.png"></v-img>
                </v-btn>
              </template>
              <!-- drop-down -->
              <v-list class="pa-0">
                <v-list-item
                    v-for="(item, index) in items"
                    :key="index"
                    class="px-2"
                    @click="goDifferPage(index)"
                >
                  <v-icon size="22px">{{ item.icon }}</v-icon>
                  <v-list-item-title class="ml-1">{{ item.text }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
          <v-divider vertical class="d-none d-md-block"></v-divider>
          <!-- 錢包 按紐 -->
          <v-btn @click="goPersonalAccount" text width="72" height="100%" class="d-none d-md-block rounded-0 primary--text">
            <v-img width="24" height="25" contain src="/static/ui/components/navbar/wallet.png"></v-img>
          </v-btn>
          <!-- 漢堡 -->
          <v-btn text min-width="auto" @click="isNavigationOpen = !isNavigationOpen" class="d-md-none px-0 hamburger" :class="{ 'active': isNavigationOpen }">
            <!-- <v-icon>mdi-menu</v-icon> -->
            <span class="hamburger-bar"></span>
          </v-btn>
          <!-- Mobile 選擇語言 -->
          <div class="text-center mt-1 d-block d-md-none" style="position: absolute; right: 60px;">
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" text class="pa-0">
                  <v-icon>mdi-earth</v-icon>
                  <!-- <span style="font-size: 14px">{{
                    selectedLanguage.imgName
                  }}</span> -->
                </v-btn>
              </template>
              <v-list class="pa-0">
                <v-list-item
                  v-for="(item, index) in language"
                  :key="index"
                  @click="choiceLanguage(item)"
                  class="px-1"
                  style="min-height: 40px;"
                >
                  <!-- <v-img
                    class="img"
                    width="30px"
                    height="30px"
                    :src="item.imgUrl"
                  ></v-img> -->
                  <v-list-item-title class="ml-4">
                    {{ item.imgName }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>

          <!-- Mobile 側欄 -->
          <v-navigation-drawer
            v-model="isNavigationOpen"
            fixed
            hide-overlay
            height="auto"
            right
            temporary
            class="side-navigation d-flex flex-column align-center"
          >
            <v-list
              height="100vh"
              class="side-nav-content d-flex flex-column justify-space-between px-4 pt-5"
            >
              <v-list-item-group
                active-class=" text--accent-4"
              >
                <!-- 側欄連結 -->
                <v-list-item disabled class="mb-4">
                  <v-list-item-title class="side-nav-link primary--text">{{ $t('navbar.mobileNavLinkTitle') }}</v-list-item-title>
                </v-list-item>
                <div class="divider mb-7"></div>
                <!-- 登入與註冊 -->
                <v-list-item v-if="!user" @click="showLogin" active-class="no-active" class="mb-3">
                  <v-list-item-title class="side-nav-link">{{ $t('navbar.mobileLoginRegister') }}</v-list-item-title>
                </v-list-item>
                <!-- 個人資料頁 -->
                <v-list-item v-if="user" @click="goDifferPage(1)" active-class="no-active" class="mb-3">
                  <v-list-item-title class="side-nav-link">{{ $t('navbar.mobileMyAccount') }}</v-list-item-title>
                </v-list-item>
                <!-- 錢包頁 -->
                <v-list-item @click="goPersonalAccount" active-class="no-active" class="mb-3">
                  <v-list-item-title class="side-nav-link">{{ $t('navbar.mobileWallet') }}</v-list-item-title>
                </v-list-item>
                <!-- 連結 -->
                <v-list-item v-for="navLink in navLinksMobile" :key="navLink.id" :to="navLink.link" class="mb-3" style="background: transparent !important;">
                  <v-list-item-title class="side-nav-link">{{ $t(`navbar.navLink${navLink.id}`) }}</v-list-item-title>
                </v-list-item>
                <v-spacer></v-spacer>
                <!-- 登出 -->
                <v-list-item v-if="user" @click="goDifferPage(2)" active-class="no-active" class="">
                  <v-list-item-title class="side-nav-link">{{ $t('navbar.mobileSignOut') }}</v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-navigation-drawer>

          <!-- Mobile 搜尋側欄 -->
          <v-navigation-drawer
            v-model="isSearchNavigationOpen"
            fixed
            hide-overlay
            height="auto"
            left
            temporary
            class="side-navigation d-flex flex-column align-center"
          >
            <v-list
              height="100vh"
              class="side-nav-content d-flex flex-column px-4 pt-5"
            >
              <v-list-item-group
                active-class=" text--accent-4"
              >
                <!-- 搜尋欄 -->
                <div class="search-wrapper d-flex align-center pt-10">
                  <input v-model="NFTSearchFilter" type="text" class="search-input pl-13" :placeholder="$t('navbar.searchPlaceholder')" @keyup.enter="goSearchNft">
                  <v-icon color="primary" class="search-icon px-3">mdi-magnify</v-icon>
                </div>
              
              </v-list-item-group>
            </v-list>
          </v-navigation-drawer>
        </v-row>
      </v-container>
    </v-app-bar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import router from "@/router";
import { logOut } from "@/api/user";
import i18n from "@/lang";
import * as _ from "lodash";
import Storage from '@/utils/storage'

export default {
  name: "NavBar",
  data() {
    return {
      selectedItem: 0,
      isNavigationOpen: false,
      isSearchNavigationOpen: false,
      exceptLanguage: ['ko-KR'], // 不要顯示的語言
      navLinks: [
        // 交易市場
        {
          id: 1,
          link: '/explore'
        },
        // 宗教藝術
        {
          id: 2,
          link: '/explore?cate=1'
        },
        // 街頭藝術
        {
          id: 3,
          link: '/explore?cate=2'
        },
        // GAME-FI
        {
          id: 4,
          link: '/explore?cate=3'
        },
        // {
        //   id: 5,
        //   link: ''
        // },
        // {
        //   id: 6,
        //   link: '/activities'
        // }
      ],
      navLinksMobile: [
        // 交易市場
        {
          id: 1,
          link: '/explore'
        },
        // 宗教藝術
        {
          id: 2,
          link: '/explore?cate=1'
        },
        // 街頭藝術
        {
          id: 3,
          link: '/explore?cate=3'
        },
        // GAME-FI
        {
          id: 4,
          link: '/explore?cate=2'
        },
        {
          id: 5,
          link: ''
        },
        // {
        //   id: 6,
        //   link: '/activities'
        // },
        {
          id: 7,
          link: '/create_nft'
        }
      ],
      isDarkMode: true,
      NFTSearchFilter: '', // 搜尋NFT字串
    }
  },
  computed: {
    ...mapGetters(['name', 'user', 'isUserDataLoading', 'isShowDrawerDialog']),
    //判斷是否登錄
    isLogin() {
      return this.user ? true : false
    },
    items() {
      return [
        {
        icon: 'mdi-account',
        text: this.$t('navbar.accountDropdown.dropdownItem1'),
        },
        {
          icon: 'mdi-file-document',
          text: this.$t('navbar.accountDropdown.dropdownItem2'),
        },
        {
          icon: 'mdi-logout',
          text: this.$t('navbar.accountDropdown.dropdownItem3'),
        }
      ]
    },
    language: {
      get() {
        let res = Object.keys(i18n.messages)
        res = res.filter(item => !this.exceptLanguage.includes(item)) // 排除不要顯示的語言
        return res.map(l => ({
          imgUrl: `/static/ui/utils/language/${l}.png`,
          imgName: i18n.messages[l]['language'],
          lang: l
        }))
      },
      set() {
      }
    },
    selectedLanguage: {
      get() {
        let selected = i18n.locale
        let res = _.find(this.language, (lang) => (lang.lang === selected))
        return res || this.language[0]
      },
      set() {
      }
    },
    username() {
      return this.user.username.substr(0, 10) + '...'
    },
  },
  created() {
    // window.i18n = i18n
    
    // 2021.11.3 加入色彩監聽
    this.colorSchemeInit()
  },
  methods: {
    showLogin() {
      if (this.isUserDataLoading) return // 如果還不知道有沒有登入就擋掉
      this.$store.commit("ui/SET_IS_SHOW_LOGIN_DIALOG", true);
      // 2021.11.11 跳出時關閉側攔
      this.isNavigationOpen = false
    },
    showRegister() {
      this.$store.commit("ui/SET_IS_REGISTER_DIALOG", true);
      // 2021.11.11 跳出時關閉側攔
      this.isNavigationOpen = false
    },
    goUserHome() {
      if (this.$route.path != `/user/${this.user.id}/`)
        router.push(`/user/${this.user.id}/`);
    },
    goFrontPage() {
      router.push("/");
    },
    goMarketPlace() {
      if (this.$route.path != `/explore`) router.push("/explore");
    },
    goSearchNft() {
      // console.log('goSearchNft', this.NFTSearchFilter)
      if (this.NFTSearchFilter) {
        this.$router.push({
          name: 'explore',
          query: {
            search: this.NFTSearchFilter
          }
        })
      }
      this.NFTSearchFilter = ''
    },
    //选择多语言
    choiceLanguage(item) {
      let app = document.getElementById("app")
      this.selectedLanguage = item
      i18n.locale = item.lang
      localStorage.setItem("language", item.lang);
      if (i18n.locale === 'ko-KR') {
        app.style.fontFamily = "GmarketSans"
      } else {
        app.style.fontFamily = ""
      }
    },
    goDifferPage(index) {
      if (index === 0) {
        if (this.$route.path != `/user/${this.user.id}/`)
          router.push(`/user/${this.user.id}/`);
      } else if (index === 1) {
        // TODO 2021.11.26 不再使用 /trade 這個頁面，先改為導到個人頁面
        router.push(`/user/${this.user.id}/`)

        // if (this.$route.path != `/trade/`)
        //   router.push(`/trade/`);
      } else if (index === 2) {
        logOut();
        this.$store.commit("user/SET_USER", null);
        Storage.removeLocal('user')
        if (this.$route.path != "/") router.push("/");
      }
    },
    goPersonalAccount() {
      if (this.isUserDataLoading) return // 如果還不知道有沒有登入就擋掉
      let drawer = this.isShowDrawerDialog;
      this.$store.commit("ui/SET_IS_SHOW_DRAWER_DIALOG", !drawer);

      // 2021.11.11 跳出時關閉側攔
      this.isNavigationOpen = false
    },
    goCreateNft() {
      if (this.isUserDataLoading) return // 如果還不知道有沒有登入就擋掉
      if (this.isLogin) {
        this.$router.push('/create_nft')
      } else {
        this.showLogin()
      }
    },
    // 2021.11.3 加入新的監測色彩函式
    colorSchemeInit() {
      let theme = 'dark' // default theme
      const localTheme = localStorage.getItem('theme')

      if (localTheme) {
        if (localTheme === 'dark') {
          this.isDarkMode = true
          theme = 'dark'
        } else {
          this.isDarkMode = false
          return
        }
      }

      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark')
      }
    },
    navLinkOnclick(linkId) {
      // 如果是 "什麼是NFT" 就跳轉到鏈工房
      if (linkId === 5) {
        window.open('https://www.facebook.com/%E9%8F%88%E5%8A%9F%E6%88%BF-251298070129030/videos/?ref=page_internal')
      } else if (linkId === 7) {
        // 如果是 "創建NFT" 就跳轉到創建NFT
        this.goCreateNft()
      }
    }
  },
  watch: {
    isDarkMode(newVal) {
      console.log('theme change')
      if (newVal === true) {
        document.documentElement.setAttribute('data-theme', 'dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.setAttribute('data-theme', 'light')
        localStorage.setItem('theme', 'light')
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

// .purse {
//   cursor: pointer;
// }
// .marketPlace{
//   color: #EBEBEB;
// }
::v-deep .v-toolbar__content, .v-toolbar__extension{
  padding: 0;
}

.header {
  background: var(--bg1);
  z-index: 1000 !important;

  .header-down {
    width: 100%;
    height: 72px;
    background: var(--bg1);
    flex-wrap: nowrap;

    .logo {
      margin-right: 30px;
      .logo-img {
        width: 140px !important;
      }

    }

    .search-wrapper {
      position: relative;

      .search-input {
        width: 100%;
        max-width: 506px;
        height: 44px;
        color: #ffffff;
        border: 1px solid #dedede;
        border-radius: 22px;
      }

      .search-icon {
        position: absolute;
        left: 10px;
      }
    }

    .links {
      max-width: 520px;
      
      .tab {
        position: relative;
        font-size: var(--text-md);
        padding: 0px;
        margin-left: 40px;
        min-width: auto;

        &.create-nft-btn {
          .v-btn__content {
            color: red;
            font-size: var(--text-md) !important;
          }
        }

        &.tab-active::after {
          content: '';
          display: block;
          position: absolute;
          width: 100%;
          height: 3px;
          border-radius: 3px 3px 0px 0px;
          bottom: 0px;
          background: var(--primary);
        }
      }

      .create-nft {
        color: var(--primary) !important;
      }
    }

    .hamburger {
      min-width: 56px !important;
      height: 100%;

      .hamburger-bar {
        position: relative;
        display: block;
        width: 22px;
        height: 3px;
        background: #333333;
        border-radius: 1.5px;
        transition: all .2s;

        &::before,
        &::after {
          content: '';
          display: block;
          position: absolute;
          left: 50%;
          transform: translate(-50%, 0);
          width: 24px;
          height: 3px;
          background: #333333;
          border-radius: 1.5px;
          transition: all .2s;
        }

        &::before {
          top: -8px;
        }
        &::after {
          bottom: -8px;
        }
      }

      &.active {
        .hamburger-bar {
          width: 18px;
          transition: all .2s;

          &::before {
            left: 70% !important;
            transition: all .2s;
          }
          &::after {
            left: 30% !important;
            transition: all .2s;
          }
        }
      }
    }
  }

  .side-navigation {
    background: transparent;
    box-shadow: none;
    margin-top: 56px !important;
    z-index: 10000;

    .side-nav-content {
      background: rgba($color: #000000, $alpha: .85);
      padding-bottom: 80px;

      // .search-wrapper {
      //   position: relative;

      //   .search-input {
      //   width: 100%;
      //   max-width: 100%;
      //   height: 44px;
      //   color: #ffffff;
      //   border: 1px solid #dedede;
      //   border-radius: 22px;
      // }
      //   .search-icon {
      //     position: absolute;
      //     left: 10px;
      //   }
      // }

      .divider {
        width: 100% !important;
        height: 1px;
        border: 1px solid;
        border-image: linear-gradient(270deg, rgba(103, 103, 103, 0), rgba(55, 55, 55, 1)) 1 1;
      }
  
      .side-nav-link {
        width: 100% !important;
        text-align: start;
        font-size: var(--text-lg);
        color: #ffffff;

      }

      .no-active::before {
        opacity: 0 !important;
      }

      .v-list-item--active::before {
        opacity: 0 !important;
      }
    }


  }

  ::v-deep .v-navigation-drawer__content {
    width: 100%;
    background: none;
  }
}

@media screen and (max-width: 1264px) {
  .header-down {
    .logo {
      margin-right: 20px !important;
      .logo-img {
        max-width: 100px !important;
      }
    }
  }
  
}

@media screen and (max-width: 960px) {
  .header-down {
    height: 56px !important;

    .logo {
      position: absolute;
      left: 50%;
      transform: translate(-50%, 0);

      .logo-img {
        max-width: 120px !important;
      }
    }
  }
  .side-navigation {
    margin-top: 56px !important;
    width: 50% !important;
  }
  
}

@media screen and (max-width: 600px) {
  .header-down {
    .logo {
      margin-right: 0px !important;

      .logo-img {
        width: 140px;
      }
    }
  }

  .side-navigation {
    margin-top: 56px !important;
    width: 100% !important;

    .side-nav-link {
      text-align: center !important;
    }
  }
}


[data-theme = "dark"] {
  .header-up {

    .search-input {
      color: #757575 !important;
      background: #343434 !important;
      border: 1px solid #414141 !important;
    }


    .login-btn,.register-btn {
      border: 1px solid #b1b1b1 !important;
      background: #ffffff !important;
      color: #333333;
    }
  }

  .wallet-btn {
    color: #ffffff;
  }

  .locale-btn {
    border: 1px solid #222222;
    background: #333333;

    & span, i {
      color: #ffffff !important;
    }

  }

  .locale-dropdown {
    background: #333333 !important;
  }
  .locale-item {
    color: #ffffff !important;
  }

  .tab {
    color: #ffffff !important;
  }

  .hamburger {
    .hamburger-bar {
      background: #ffffff !important;

      &::before, &::after {
        background: #ffffff !important;
      }
    }
  }
}

</style>
