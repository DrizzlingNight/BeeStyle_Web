<template>
  <div class="d-flex justify-space-between">
    <vue-transmit
        class="imgshow imgupdate"
        :class="{ 'is-full-width': !isSliderShowing }"
        v-bind="options"
        ref="uploader"
        @success="uploadSuccess"
        draggable="false"
    >
      <div @click="triggerBrowse" class="edit-img-wrapper">
        <!-- 顯示的圖片 -->
        <v-img
            @loadstart="getImageSize"
            @load="checkIfSliderShouldShow"
            cover
            :src="coverImage"
            :height="frameHeight"
            :position="`50% ${100 - coverPosition}%`"
            width="100%"
            style="background: rgba($color: #ffffff, $alpha: .2); object-fit: cover;"
            class="cover-img rounded-lg"
            id="cover-img"
        ></v-img>
        <!-- 編輯icon -->
        <v-icon color="primary" class="edit-icon">mdi-pencil</v-icon>
      </div>
    </vue-transmit>

    <!-- 高度微調 slider -->
    <v-slider v-if="isSliderShowing" v-model="coverPositionY" vertical style="max-width: 28px; max-height: 120px;"></v-slider>
  </div>
</template>

<script>
const regex = /.*csrftoken=([^;.]*).*$/ // 用于从cookie中匹配 csrftoken值

export default {
  name: "CoverFileUploader",
  props: {
    // 父組件 isDialogOpen flag
    isDialogOpen: {
      type: Boolean,
      default: false
    },
    // 父組件傳入的 圖片資源位置url
    coverImage: {
      type: String,
      default: ''
    },
    // 父組件傳入的原圖片微調高度位置
    coverPosition: {
      type: String,
      default: ''
    }
  },
  data:() => ({
    // ******** 圖片高度設定相關
    // 封面高度設定值
    frameHeight: 120,
    // 圖片的原始尺寸
    imgOriginalSize: {
      width: 0,
      height: 0
    },
    // 高度微調百分比
    coverPositionY: 50,
    // 高度拉條是否顯示
    isSliderShowing: true,

    // ******** 圖片資源相關
    file:{},
    filePath:'',
    options: {
      acceptedFileTypes: ['image/*'],
      url: `${process.env.VUE_APP_BASE_API}/utils/uploadFile/`,
      headers: {'X-CSRFToken': document.cookie.match(regex) === null
            ? null
            : document.cookie.match(regex)[1]},
      params: {'path': 'cover'},
      clickable: false,
      responseType: 'json'
    }
  }),
  watch: {
    // 彈窗關閉時重置拿到的資料
    isDialogOpen(newVal) {
      if(!newVal) {
        this.file = {}
        this.filePath = ''
        this.coverPositionY = 50 // 回到置中狀態
      } else {
        // 彈窗開啟時與父層同步最新高度資訊
        this.coverPositionY = this.coverPosition
      }
    },

    // 微調高度調整時更新微調參數資料到父組件
    coverPositionY() {
      this.updateCoverPosition()
    }
  },
  created() {
    // 組件產生時同步最新高度資訊
    this.coverPositionY = this.coverPosition
  },
  methods: {
    // 有新的圖片上傳時更新資料並將資料傳回父層
    updateFiles(){
      this.filePath = this.file.xhr.response.data
      this.$emit('update-cover', {
        fileData: this.file,
        filePath: this.filePath,
        coverPosition: this.coverPositionY
      })
    },
    // slider被拖曳時將資料同步給父層
    updateCoverPosition() {
      this.$emit('update-cover-position', this.coverPositionY)
    },
    // 觸發瀏覽本地資料
    triggerBrowse() {
      this.$refs.uploader.triggerBrowseFiles()
    },
    // 當本地檔案載入完成時
    uploadSuccess(file){
      if (this.filePath[file.xhr.response.data])
        return
      this.file = file
      this.updateFiles()
      this.coverPositionY = 50
    },


    // 取得圖片資源尺寸
    getImageSize(url) {
      const vueInstance = this
      const img = new Image()
      let size = {
        width: 0,
        height: 0
      }
      // 圖片加載時調用
      img.onload = function() {
        size = {
          width: this.width,
          height: this.height
        }
        // 置入原圖片尺寸
        vueInstance.imgOriginalSize = {
          ...vueInstance.imgOriginalSize,
          ...size
        }
      }
      img.src = url
    },

    // 確認是否要顯示拉條
    checkIfSliderShouldShow() {
      // 圖片外框DOM
      const imgDom = document.querySelector('#cover-img > .v-responsive__content')
      // 圖片外框比例
      const imgDomProportion = imgDom.offsetHeight / imgDom.offsetWidth
      // 圖片素材比例
      const imgOriginalProportion = this.imgOriginalSize.height / this.imgOriginalSize.width
      // 若圖片素材比例大於外框比例就顯示拉條
      if (imgOriginalProportion >= imgDomProportion) {
        this.isSliderShowing = true
      } else {
        this.isSliderShowing = false
      }
    }
  },
  filters: {
    json(value) {
      return JSON.stringify(value, null, 2)
    }
  }
}
</script>

<style lang="scss" scoped>

  // 拉條
  ::v-deep .v-slider--vertical {
    min-height: 120px;
    margin-bottom: 0px;
  }

  .imgshow,.imgupdate {
    width: calc(100% - 32px);

    &.is-full-width {
      width: 100%;
    }
  }

  // 圖片編輯
  .edit-img-wrapper {
    width: 100%;
    position: relative;
    cursor: pointer;


    .edit-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: none;
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

</style>
