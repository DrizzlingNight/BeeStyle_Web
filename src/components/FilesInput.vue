<template>
  <div class="container">
    <v-row>
      <div v-for="(file, index) in filesPath" :key="index">
        <v-img
            v-if="!is3dModel"
            :src="`${imageBaseUrl}${file}`"
            class="imgshow"
        >
          <!-- <div
              class="masked"
          >
            <p
                style="position: absolute;bottom: 10px"
            >{{ $t("createNFT.setCover") }}</p>
          </div> -->
          <v-icon
              style="position: absolute;top: 6px;right: 6px;color: #8e8e8e"
              @click.stop="remove(file)"
          >mdi-close</v-icon>
        </v-img>
        <model-viewer v-else :src="`${imageBaseUrl}${file}`" camera-controls environment-image="neutral" shadow-intensity="1" autoplay >
          <v-icon
              style="position: absolute;top: 6px;right: 6px;color: #8e8e8e"
              @click.stop="remove(file)"
          >
            mdi-close
          </v-icon>
        </model-viewer>
      </div>
      <!-- 隱藏起來的檔案上傳input，透過triggerBrowse去觸發 -->
      <form ref="uploadForm">
        <input ref="uploader" type="file" :accept="acceptedFileTypes" class="hidden-file" @change="changeFile" />
      </form>
      <!-- 2022.03.23 捨棄原本vue-transmit的上傳檔案，改成用method uploadFile上傳 -->
      <vue-transmit
          v-if="!files.length"
          class="imgshow imgupdate"
          v-bind="options"
          @success="uploadSuccess"
      >
        <div class="d-flex flex-column align-center pt-16"
             @click="triggerBrowse"
        >
          <img
              src="/static/ui/createNft/uploadImg.png"
              style="width: 78px;"
              class="mb-3"
          />
          <p
              style="color: #0091FF"
          >{{ $t("createNFT.upload") }}</p>
        </div>
      </vue-transmit>
    </v-row>
    <!-- Loading 遮罩 -->
    <overlay :loading="loading"></overlay>
  </div>
</template>

<script>
import { ModelViewer } from '@google/model-viewer'
import { uploadFile } from '@/api/file'

// loading 遮罩
import Overlay from '@/components/Overlay'

const regex = /.*csrftoken=([^;.]*).*$/ // 用于从cookie中匹配 csrftoken值

export default {
  name: "FilesInput",
  props: {
    acceptedFileTypes: {
      type: String,
      default: '.jpg, .png, .svg, .gif, .webp'
    }
  },
  components: {
    ModelViewer,
    Overlay
  },
  data:() => ({
    loading: false,
    is3dModel: false,
    testFile: null,
    files:[],
    filesPath:[],
    imageBaseUrl: process.env.VUE_APP_FILE_BASE_API,
    options: {
      acceptedFileTypes: ['image/*', '.glb', '.mp3'],
      url: `${process.env.VUE_APP_BASE_API}/utils/uploadFile/`,
      headers: {'X-CSRFToken': document.cookie.match(regex) === null
            ? null
            : document.cookie.match(regex)[1]},
      params: {"path": "nftFile"},
      clickable: false,
      responseType: 'json'
    }
  }),
  methods: {
    updateFiles(){
      // this.filesPath = this.files.map(file=>(file.xhr.response.data))
      this.filesPath = [...this.files]
      this.$emit("update", this.filesPath)
    },
    triggerBrowse() {
      this.$refs.uploader.click()
    },
    async uploadSuccess(file){
      if (this.filesPath.indexOf(file.xhr.response.data) !== -1)
        return
      this.files.push(file)
      this.updateFiles()
    },
    setFirst(file){
      if (this.files.length < 2)
        return
      let index = this.files.indexOf(file)
      this.files[index] = this.files[0]
      this.files[0] = file
      this.$forceUpdate()
      this.updateFiles()
    },
    remove(file){
      let index = this.files.indexOf(file)
      this.files.splice(index, 1)
      this.$forceUpdate()
      this.updateFiles()
    },
    changeFile(event) {
      const files = event.target.files || event.dataTransfer.files
      if (!files.length) return
      console.log('changeFile files', files)
      if (files[0].name.split('.')[1] === 'glb') {
        this.testFile = new Blob([files[0]], { type: "model/gltf-binary" })
      } else if (files[0].name.split('.')[1] === 'mp3') {
        this.testFile = new Blob([files[0]], { type: "audio/mp3" })
      } else {
        this.testFile = files[0]
      }
      this.$refs.uploadForm.reset() // 重置檔案上傳input
      this.uploadFile()
    },
    async uploadFile() {
      const params = {
        file: this.testFile,
        path: 'nftFile',
      }
      this.loading = true
      await uploadFile(params).then(res => {
        console.log('uploadFile res', res)
        const file = res.data
        if (file.split('.')[1] === 'gltf-binary') {
          this.is3dModel = true
        } else {
          this.is3dModel = false
        }
        this.files.push(res.data)
        this.updateFiles()
        this.$toast.success(this.$t('tip.uploadSuccess'))
        this.loading = false
      }).catch(err => {
        console.log('uploadFile err', err)
        this.$toast.error(this.$t('tip.uploadFailed'))
        this.is3dModel = false
        this.loading = false
      })
    },
  },
  filters: {
    json(value) {
      return JSON.stringify(value, null, 2)
    }
  }
}
</script>

<style scoped>
.imgshow {
  height:238px;
  width: 242px;
  margin: 8px;
  border-radius: 10px;
}
.imgupdate {
  border: 2px dashed #333333;
}
#mask_layer {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background-color: #FFFFFF;
}
.masked {
  height: 100%;
  width: 100%;
  z-index: 2;
  position: absolute;
  top: 50px;
  left: 0;
  color: #0091FF;
  transition: top .2s;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.masked:hover{
  top: 0px;
  position: absolute;
  background: rgba(255,255,255,.7);
}

.hidden-file {
 width: 0px;
 height: 0px;
 overflow: hidden;
}

</style>
