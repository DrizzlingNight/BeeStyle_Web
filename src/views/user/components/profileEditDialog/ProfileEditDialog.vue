<template>
  <v-dialog v-model="isProfileEditDialogOpen" max-width="650" height="auto" persistent>
    <v-card class="text-center edit-card rounded-lg pa-10">
      <!-- 關閉鈕 -->
      <v-btn @click="closeDialog()" class="close-btn" text icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <!-- 標題 -->
      <h2>編輯使用者資料</h2>
      <p class="body-2">支持的圖片類型：JPG、PNG、SVG、gif。最大大小：50 MB。</p>
      <v-divider class="mb-5"></v-divider>
      <!-- 表單 -->
      <v-form ref="form" v-model="isFormValid">
        <v-row no-gutters justify="center">
          <!-- 使用者頭像 -->
          <v-col cols="12" class=" d-flex flex-column align-center justify-center mb-6">
            <div class="mb-2">{{ $t('user.profileEditDialog.userAvatar') }}</div>
            <AvatarFileUploader :avatar-image="avatar" @update-avatar="updateAvatar" />
            <!-- <div class="edit-img-wrapper">
              <v-img @click="avatarEditOnclick()" cover :src="avatar || '/static/ui/utils/user/default.png'" style="background: #ffffff;" class="avatar-img rounded-circle"></v-img>
              <v-icon color="primary" class="edit-icon">mdi-pencil</v-icon>
            </div> -->
          </v-col>
          <!-- 封面相片 -->
          <v-col cols="12" class="mb-10">
            <div class="mb-2">{{ $t('user.profileEditDialog.userCover') }}</div>
            <CoverFileUploader
                :is-dialog-open="isProfileEditDialogOpen"
                :cover-image="cover"
                :cover-position="coverPosition"
                @update-cover="updateCover"
                @update-cover-position="updateCoverPosition"
            />
            <!-- <div class="edit-img-wrapper">
              <v-img @click="coverEditOnclick()" cover :src="cover" width="100%" height="120" style="background: rgba($color: #ffffff, $alpha: .2);" class="cover-img rounded-lg"></v-img>
              <v-icon color="primary" class="edit-icon">mdi-pencil</v-icon>
            </div> -->
          </v-col>
          <!-- 使用者暱稱 -->
          <v-col cols="12">
            <div class="mb-2">{{ $t('user.profileEditDialog.userNickname') }}*</div>
            <v-text-field
                color="#F7B500"
                class="mt-0 pt-0 body-2"
                v-model="nickname"
                :rules="nicknameRules"
                :label="$t('user.profileEditDialog.userNicknameLabel')"
                single-line
                required
                :counter="32"
                maxlength="32"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <!-- 使用者簡介 -->
            <div class="mb-2">{{ $t('user.profileEditDialog.userDescription') }}</div>
            <v-textarea
                color="#F7B500"
                class="mt-0 pt-0 body-2"
                v-model="intro"
                :label="$t('user.profileEditDialog.userDescriptionLabel')"
                auto-grow
                rows="1"
                :counter="128"
                maxlength="128"
            ></v-textarea>
          </v-col>
          <v-col cols="12">
            <v-btn
                block
                x-large
                color="primary"
                :disabled="!isFormValid"
                class="mt-14"
                @click="updateProfile"
                :loading="isLoading"
            >
              {{ $t('user.profileEditDialog.submit') }}
          </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { updateProfile } from '@/api/user'

import AvatarFileUploader from './avatarFileUploader/AvatarFileUploader.vue'
import CoverFileUploader from './coverFileUploader/CoverFileUploader.vue'

import i18n from '@/lang'

export default {
  name: 'ProfileEditDialog',
  components: {
    AvatarFileUploader,
    CoverFileUploader
  },
  props: {
    isProfileEditDialogOpen: {
      type: Boolean,
      default: false
    },
    initialUserData: {
      type: Object,
      default: () => ({})
    }
  },
  watch: {
    // 開啟彈窗時帶入基本資料
    isProfileEditDialogOpen(newVal) {
      if(newVal) {
      const initialUserProfile = this.initialUserData.profile
      
      this.nickname = initialUserProfile.nickname || ''
      this.intro = initialUserProfile.introduction || ''
      this.avatar = initialUserProfile.avatar ? `${this.imageFileRoot}${initialUserProfile.avatar}` : ''
      this.cover = initialUserProfile.bg_img ? `${this.imageFileRoot}${initialUserProfile.bg_img}` : ''
      this.coverPosition = initialUserProfile.bg_position || ''
      // 關閉時清空基本資料
      } else {
        this.initialUserProfile = null
        this.nickname = ''
        this.intro = ''
        this.avatar = ''
        this.cover = ''
        this.coverPosition = ''
      }
    }
  },
  data: () => ({
    imageFileRoot: `${process.env.VUE_APP_FILE_BASE_API}`,
    isFormValid: false,
    isLoading: false,
    // 用戶名稱
    nickname: '',
    // 用戶簡介
    intro: '',
    // 用戶頭像
    avatar: '',
    // 用戶封面圖片
    cover: '',
    // 用戶圖片高度調整
    coverPosition: '',
    // 暱稱輸入欄規則
    nicknameRules: [
      (v) => !!v || i18n.t('user.profileEditDialog.userNicknameRules.required'),
      (v) => (v && v.length <= 32) || i18n.t('user.profileEditDialog.userNicknameRules.maximum', 32),
    ],

    // update request 用的 path 資料
    newAvatarPath: '',
    newCoverPath: ''
  }),
  methods: {
    // 關閉時更新父組件開關
    closeDialog() {
      this.$emit('dialog-closed')
    },

    // 頭像資料更新
    updateAvatar(fileObj) {
      this.avatar = fileObj.fileData.dataUrl
      this.newAvatarPath = fileObj.filePath
    },

    // 封面編輯被點按
    updateCover(fileObj) {
      // this.cover = fileObj.fileData.dataUrl
      this.cover = process.env.VUE_APP_FILE_BASE_API + fileObj.filePath
      this.newCoverPath = fileObj.filePath
      this.coverPosition = (fileObj.coverPosition).toString()
    },

    // 封面圖拉條更新
    updateCoverPosition(position) {
      this.coverPosition = (position).toString()
    },

    // 送出編輯
    async updateProfile() {
      try {
        this.isLoading = true
        const payload = {
          nickname: this.nickname,
          avatar: this.newAvatarPath !== '' ? this.newAvatarPath : this.initialUserData.profile.avatar, // 沒有更新(空字串) 就傳回本來的
          bg_img: this.newCoverPath !== '' ? this.newCoverPath : this.initialUserData.profile.cover, // 沒有更新(空字串) 就傳回本來的
          bg_position: this.coverPosition,
          introduction: this.intro
        }
        const res = await updateProfile(payload)
        console.log(res)
        this.$toast.success(i18n.t('user.profileEditDialog.updateSucceed'))
        // 通知父層資料更新成功 重新抓一次用戶資料
        this.$emit('profile-update-succeed')
        // 關閉彈窗
        this.closeDialog()
        this.isLoading = false
      } catch(err) {
        console.log(err)
        this.$toast.error(this.$t(err.code))
        this.isLoading = false
      }
    }
  },
}
</script>

<style lang="scss" scoped>

.edit-card {
  position: relative;
  max-width: 650px;
  max-height: 90vh;

  // 關閉鈕
  .close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
  }

  // 圖片編輯
  .edit-img-wrapper {
    position: relative;
    cursor: pointer;

    .edit-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: none;
    }

    .avatar-img {
      width: 64px;
      height: 64px;
    }

    &:hover {

      .avatar-img::after,
      .cover-img::after {
        content: '';
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba($color: #ffffff, $alpha: .2)
      }

      .edit-icon {
        display: block;
      }
    }
  }

  // 頭像圖片
  .avatar-img {
    
  }

  // 封面圖片
  .cover-img {

  }
}

</style>