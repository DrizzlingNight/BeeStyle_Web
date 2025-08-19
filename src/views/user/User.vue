<template>
  <v-container fluid class="pa-0">
    <v-row justify="center" no-gutters>
      <!-- 封面圖片 -->
      <v-col cols="12" class="cover-wrapper mb-n8">
        <v-img
            v-if="userData"
            cover
            class="user-cover mt-md-7 mx-auto"
            height="200px"
            style="border-radius: 10px;"
            :position="`50% ${100 - Number(userData.profile.bg_position)}%`"
            :src="userData.profile.bg_img !== null ? `${imageFileRoot}${userData.profile.bg_img}` : ''"
        >
        </v-img>
        <!-- 使用者自己沒有封面圖片時顯示加入按鈕 -->
        <v-btn v-if="isSelf && !userData.profile.bg_img" @click="isProfileEditDialogOpen = true" text icon class="cover-edit-btn">
          <v-icon large color="primary">mdi-plus-circle-outline</v-icon>
        </v-btn>
      </v-col>
      <!-- 使用者頭像 -->
      <v-col cols="12" class="text-center pt-0 mt-n8 mt-sm-n2">
          <v-img
              v-if="userData"
              class="user-image"
              :src="userData.profile.bg_img !== null ? `${imageFileRoot}${userData.profile.avatar}` : `/static/ui/utils/user/default.png`"
          ></v-img>
      </v-col>
      <!-- 使用者名稱 -->
      <v-col cols="6" class="text-center mt-2 mb-8">
        <div class="d-flex align-center justify-center">
          <div class="d-flex align-center" style="position: relative;">
            <span class="user-name">{{ userData ? userData.profile.nickname : '--' }}</span>
            <!-- 使用者編輯彈窗開關 -->
            <v-btn v-if="isSelf" @click="isProfileEditDialogOpen = true" text icon style="position: absolute; right: -40px;">
              <v-icon>mdi-account-edit</v-icon>
            </v-btn>
          </div>
        </div>
      </v-col>
      <!-- 使用者簡介 -->
      <v-col cols="8" class="text-center">
        <p class="user-intro">{{ userData ? userData.profile.introduction : '' }}</p>
      </v-col>
      <!-- 個人中心子頁面標籤群 -->
      <v-col cols="12">
        <!-- Nav 按鈕群 -->
        <div class="navigation-wrapper d-flex flex-column flex-sm-row justify-center pt-6 pb-12">
          <!-- 已擁有的NFT -->
          <v-btn
            depressed
            class="navigation-tab own rounded-pill mb-5 mb-sm-0 mr-sm-3"
            :class="{active: currentTab === 'own'}"
            @click="currentTab='own'"
          >
            {{ $t('user.ownedNfts') }}
            <v-icon>mdi-alpha-n-circle-outline</v-icon>
          </v-btn>
          <!-- NFT歷史紀錄 -->
          <v-btn
            v-if="isSelf"
            depressed
            class="navigation-tab nft-records rounded-pill mb-5 mb-sm-0 mr-sm-3"
            :class="{active: currentTab === 'history'}"
            @click="currentTab='history'"
          >
            {{ $t('user.NftRecords') }}
            <v-icon>mdi-text-box-outline</v-icon>
          </v-btn>
          <!-- 帳號歷史紀錄 -->
          <v-btn
            v-if="isSelf"
            depressed
            class="navigation-tab account-records rounded-pill"
            :class="{active: currentTab === 'account'}"
            @click="currentTab='account'"
          >
            {{ $t('user.accountRecords') }}
            <v-icon>mdi-account-details-outline</v-icon>
          </v-btn>
        </div>
      </v-col>
      <v-col cols="12">
        <v-divider></v-divider>
      </v-col>
      <!-- 主內容 -->
      <v-col v-if="isLogin" cols="12" class="d-flex justify-center">
        <!-- 分頁內容 -->
        <!-- NFT歷史主內容 -->
        <v-col v-if="currentTab === 'history'" class="pa-0">
          <NftHistory></NftHistory>
        </v-col>
        <!-- 已擁有主內容 -->
        <v-col v-if="currentTab === 'own'" class="px-0 py-0">
          <Own :userData="userData"></Own>
        </v-col>
        <!-- 帳號紀錄內容 -->
        <v-col v-if="currentTab === 'account'" class="pa-0">
          <AccountHistory />
        </v-col>
      </v-col>
    </v-row>
    <!-- 使用者資料編輯彈窗 -->
    <ProfileEditDialog
        :is-profile-edit-dialog-open="isProfileEditDialogOpen"
        :initial-user-data="userData"
        @dialog-closed="onDialogClosed()"
        @profile-update-succeed="onProfileUpdateSucceed()"
    />
  </v-container>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {getUser} from "@/api/user";
import Own from "./components/own/Own"
import NftHistory from "./components/nftHistory/NftHistory.vue"
import AccountHistory from './components/accountHistory/AccountHistory.vue'
import ProfileEditDialog from './components/profileEditDialog/ProfileEditDialog.vue'

export default {
  name: "User",
  components: {
    Own,
    NftHistory,
    AccountHistory,
    ProfileEditDialog
  },
  data: () => ({
    imageFileRoot: process.env.VUE_APP_FILE_BASE_API,
    isProfileEditDialogOpen: false,
    userData: null,
    // redemption:true,
    currentTab: "own",
    tabs: [
      {
        id: 0,
        name: 'own'
      },
      {
        id: 1,
        name: 'nft_history'
      },
      {
        id: 2,
        name: 'account_history'
      }
    ]
  }),
  computed: {
    ...mapGetters(["user"]),
    //判斷是否登錄
    isLogin() {
      return this.user ? true : false
    },
    // 是否是自己 ?
    isSelf() {
      return this.userData && this.user && this.userData.id === this.user.id
    },
    persettingDialog() {
      return this.redemption
    }
  },
  created() {
    const userId = this.$route.params.id
    this.getUser(userId)
  },
  mounted() {
    if (!this.isLogin) {
      this.$toast.warning(this.$t('tip.loginToSeeUser'),{
        hideProgressBar: true,
        timeout: false
      })
      this.$store.commit("ui/SET_IS_SHOW_LOGIN_DIALOG", true)
    }
  },
  methods: {
    ...mapActions('alert', ['showAlert']),

    // 切換分頁
    changeCurrentTab(val) {
      this.currentTab = val
    },

    // ?????????
    onError() {
    },

    // 取得頁面使用者資料
    getUser(id) {
      getUser(id)
          .then((response) => {
            console.log(response)
            this.userData = response.data;
          })
          .catch(() => {
          });
    },

    // 當資料編輯彈窗元件主動關閉時
    onDialogClosed() {
      this.isProfileEditDialogOpen = false
    },

    // 用戶成功更新個人資料時
    onProfileUpdateSucceed() {
      const selfId = this.user.id
      this.getUser(selfId)
    }
  },
};
</script>

<style lang="scss" scoped>

.highlight {
  background: pink !important;
  outline: crimson !important;
}

.cover-wrapper {
  position: relative;
  padding: 0px 72px !important;

  .cover-edit-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, 0%);
  }

  .user-cover {
    background: rgba($color: #ffffff, $alpha: .2);
  }
}

.user-image {
  background: #ffffff;
  border: 3px solid var(--primary);
  border-radius: 50%;
  margin: auto;
  width: 80px;
  height: 80px;
}

.user-name {
  font-size: var(--text-title);
}

.navigation-wrapper {
  .navigation-tab {
    height: 36px;

    ::v-deep .v-btn__content {
      font-size: var(--text-md) !important;
    }

    &.active {
      background: transparent;
      border: 1px solid var(--primary);

      ::v-deep .v-btn__content {
        color: var(--primary) !important;
      }
    }
  }
}

@media screen and (max-width: 600px) {

  .cover-wrapper {
    padding: 0px 16px !important;
  }

  .user-image {
    width: 132px;
    height: 132px;
  }

  .navigation-tab {
    max-width: 168px;
    min-height: 40px;
    border-radius: 18px !important;
    margin: auto;
  }
  
}

@media (max-width: 1024px) {
  // .navigation {
  //   display: none;
  // }
}
</style>
