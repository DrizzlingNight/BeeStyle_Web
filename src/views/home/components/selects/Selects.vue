<template>
  <div class="selects-container-wrapper">
    <div class="content-wrapper d-flex flex-column">
      <p class="section-title mb-lg-15 mb-md-12 md-sm-10 mb-8">{{ $t('home.selects.sectionTitle') }}</p>
      <div class="selects-wrapper d-flex justify-space-between mb-15">
        <Select v-for="select in selects" :key="select.id" :initial-select-data="select" />
      </div>
      <v-btn @click="moreBtnOnclick()" color="primary" height="52" outlined class="more-btn">{{ $t('home.selects.showMore') }}</v-btn>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { getNFTList } from '@/api/NFT'

import Select from './components/select/Select.vue'


export default {
  name: 'Selects',
  components: {
    Select
  },
  data() {
    return {
      selects: [
        // {
        //   id: 1,
        //   cover: '/static/ui/home/selects/prod_1.png',
        //   name: 'Befi角色卡-2星和牛',
        //   author: {
        //     id: 1,
        //     name: 'dk3',
        //     isVerified: true,
        //   },
        //   reservePrice: '0.35',
        //   likes: 22,
        //   isLiked: false,
        // },
        // {
        //   id: 2,
        //   cover: '/static/ui/home/selects/prod_2.png',
        //   name: '迷霧森林 (SSS)',
        //   author: {
        //     id: 2,
        //     name: 'Ether',
        //     isVerified: true,
        //   },
        //   reservePrice: '1.20',
        //   likes: 69,
        //   isLiked: true,
        // },
        // {
        //   id: 3,
        //   cover: '/static/ui/home/selects/prod_3.png',
        //   name: '迷霧森林 (SS)',
        //   author: {
        //     id: 1,
        //     name: 'ek44',
        //     isVerified: false,
        //   },
        //   reservePrice: '0.60',
        //   likes: 51,
        //   isLiked: false,
        // },
        // {
        //   id: 4,
        //   cover: '/static/ui/home/selects/prod_4.png',
        //   name: '卡塔岩石島 (S)',
        //   author: {
        //     id: 1,
        //     name: '23k4',
        //     isVerified: false,
        //   },
        //   reservePrice: '0.40',
        //   likes: 26,
        //   isLiked: false,
        // },
        // {
        //   id: 5,
        //   cover: '/static/ui/home/selects/prod_5.png',
        //   name: 'Befi角色卡-褐毛和牛',
        //   author: {
        //     id: 1,
        //     name: 'dk3',
        //     isVerified: false,
        //   },
        //   reservePrice: '0.46',
        //   likes: 32,
        //   isLiked: false,
        // },
        // {
        //   id: 6,
        //   cover: '/static/ui/home/selects/prod_6.png',
        //   name: '欣賞他人.就是莊嚴自己',
        //   author: {
        //     id: 1,
        //     name: 'dfg3',
        //     isVerified: false,
        //   },
        //   reservePrice: '0.51',
        //   likes: 62,
        //   isLiked: false,
        // },
        // {
        //   id: 7,
        //   cover: '/static/ui/home/selects/prod_7.png',
        //   name: '父愛，偉岸如青山',
        //   author: {
        //     id: 1,
        //     name: 'dfgkj3',
        //     isVerified: false,
        //   },
        //   reservePrice: '0.48',
        //   likes: 35,
        //   isLiked: false,
        // },
        // {
        //   id: 8,
        //   cover: '/static/ui/home/selects/prod_8.png',
        //   name: '印度眾神 DEVON KE DEVMAHADEV',
        //   author: {
        //     id: 1,
        //     name: 'dfgjk4',
        //     isVerified: false,
        //   },
        //   reservePrice: '2.23',
        //   likes: 132,
        //   isLiked: false,
        // },
      ],
    }
  },
  methods: {
    // alert
    ...mapActions('alert', ['showAlert']),

    // 取得精選作品
    async recommendedNftInit() {
      try {
        // 過濾出推薦的NFT
        const params = {is_recommend: true, limit: 8}
        const response = await getNFTList(params)
        console.log(response)
        this.selects = response.data.results
      } catch(err) {
        console.log(err)
      }
    },

    // 展示更多按鈕被點按
    moreBtnOnclick() {
      this.$router.push({ name: 'explore' })
    }
  },
  created() {
    this.recommendedNftInit()
  }
}
</script>

<style lang="scss" scoped>

.selects-container-wrapper {
  position: relative;
  padding: 112px 216px 112px 216px;
  background: var(--bg2);

  .content-wrapper {
    max-width: 1280px;
    margin: auto;

    .section-title {
      font-size: 40px;
    }

    .selects-wrapper {
      flex-wrap: wrap;
      row-gap: 28px;
      column-gap: 40px;
    }

    .more-btn {
      width: 244px;
      margin: auto;

      ::v-deep span {
        font-size: var(--text-lg) !important;
      }
    }
  }
}

@media screen and ( max-width: 1264px ) {
  .selects-container-wrapper {
    padding: 100px 160px 100px 160px;

    .content-wrapper {
      .section-title {
        font-size: 36px;
      }

      .selects-wrapper {
        flex-wrap: wrap;
        gap: 60px;
      }
    }
  }
}

@media screen and ( max-width: 960px ) {
  .selects-container-wrapper {
    padding: 80px 120px 80px 120px;

    .content-wrapper {
      .section-title {
        font-size: 32px;
        text-align: center;
      }

      .selects-wrapper {
        column-gap: 10px;
        row-gap: 32px;
      }
    }
  }
}

@media screen and ( max-width: 600px ) {
  .selects-container-wrapper {
    padding: 60px 16px 60px 16px;

    .content-wrapper {
      .section-title {
        font-size: 28px;
      }

      .selects-wrapper {
        column-gap: 10px;
        row-gap: 32px;
      }
    }

    .more-btn {
      width: 160px !important;
      height: 32px !important;

      ::v-deep span {
        font-size: var(--text-lg) !important;
      }
    }
  }
}

</style>