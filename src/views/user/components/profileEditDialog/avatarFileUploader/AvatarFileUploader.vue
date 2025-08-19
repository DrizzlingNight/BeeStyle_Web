<template>
  <vue-transmit
      class="imgshow imgupdate"
      v-bind="options"
      ref="uploader"
      @success="uploadSuccess"
  >
    <div @click="triggerBrowse" class="edit-img-wrapper">
      <v-img cover :src="avatarImage || '/static/ui/utils/user/default.png'" style="background: #ffffff;" class="avatar-img rounded-circle"></v-img>
      <v-icon color="primary" class="edit-icon">mdi-pencil</v-icon>
    </div>
  </vue-transmit>
</template>

<script>
const regex = /.*csrftoken=([^;.]*).*$/ // 用于从cookie中匹配 csrftoken值

export default {
  name: "AvatarFileUploader",
  props: {
    avatarImage: {
      type: String,
      default: ''
    }
  },
  data:() => ({
    file:{},
    filePath:'',
    options: {
      acceptedFileTypes: ['image/*'],
      url: `${process.env.VUE_APP_BASE_API}/utils/uploadFile/`,
      headers: {'X-CSRFToken': document.cookie.match(regex) === null
            ? null
            : document.cookie.match(regex)[1]},
      params: {'path': 'avatar'},
      clickable: false,
      responseType: 'json'
    }
  }),
  methods: {
    updateFiles(){
      this.filePath = this.file.xhr.response.data
      this.$emit('update-avatar', {
        fileData: this.file,
        filePath: this.filePath
      })
    },
    triggerBrowse() {
      this.$refs.uploader.triggerBrowseFiles()
    },
    uploadSuccess(file){
      if (this.filePath[file.xhr.response.data])
        return
      this.file = file
      this.updateFiles()
    },
  },
  filters: {
    json(value) {
      return JSON.stringify(value, null, 2)
    }
  }
}
</script>

<style lang="scss" scoped>

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

</style>
