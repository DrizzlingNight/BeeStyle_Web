<template>
  <div class="activities-container-wrapper">
    <div class="content-wrapper d-flex flex-column">
      <p class="section-title mb-lg-15 mb-md-12 md-sm-10 mb-8">{{ $t('home.activities.sectionTitle') }}</p>
      <div class="activities-wrapper d-flex justify-space-between mb-15">
        <Activity v-for="activity in activities" :key="activity.id" :activity-data="activity" />
      </div>
      <v-btn color="primary" height="52" outlined class="more-btn">{{ $t('home.activities.showMore') }}</v-btn>
    </div>
  </div>
</template>

<script>
import Activity from './components/activity/Activity.vue'

export default {
  name: 'Activities',
  components: {
    Activity
  },
  data() {
    return {
      activities: [
        {
          id: 1,
          cover: '/static/ui/home/activities/special-1.png',
          name: 'LuLu Market 搶先鑄造活動!',
          description: '快來搶先擁有LuLu Market土地,搶先鑄造活動現正開放中 !',
          isPopular: true,
          isNew: false,
        },
        {
          id: 2,
          cover: '/static/ui/home/activities/special-2.png',
          name: 'Discord炫耀卡片活動開始囉',
          description: '各位地主好!我們準備了炫耀卡片活動～！ 只要加入LuLuMarket的Discord 並於#CardSwagger 頻道內留下想炫耀的卡片截圖以及心得，就算參加完畢！',
          isPopular: false,
          isNew: true,
        },
        {
          id: 3,
          cover: '/static/ui/home/activities/special-3_1.png',
          name: 'Beefi Game 盲盒全面開放',
          description: 'Beefi 提供最棒貨真價實的NFT，現在就手刀加入 Beefi Game 抽取盲盒，獲得屬於自己的牛隻 !',
          isPopular: true,
          isNew: false,
        },
        {
          id: 4,
          cover: '/static/ui/home/activities/special-4.png',
          name: 'BeeStyle策展者計畫',
          description: 'NFT是一種讓您的創意能夠在數位世界產生價值技術，也是一種未來的全新發行方式，透過BeeStyle的顧問服務解決方案讓您在NFT藝術發行之路上不在迷茫，填寫表單，讓我們為您助一臂之力',
          isPopular: false,
          isNew: false,
        },
      ],
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>

.activities-container-wrapper {
  position: relative;
  padding: 112px 216px 112px 216px;

  .content-wrapper {
    max-width: 1280px;
    margin: auto;

    .section-title {
      font-size: 40px;
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
  .activities-container-wrapper {
    padding: 100px 160px 100px 160px;

    .content-wrapper {
      .section-title {
        font-size: 36px;
      }

      .activities-wrapper {
        flex-wrap: wrap;
        gap: 60px;
      }
    }
  }
}

@media screen and ( max-width: 960px ) {
  .activities-container-wrapper {
    padding: 80px 120px 80px 120px;

    .content-wrapper {
      .section-title {
        font-size: 32px;
        text-align: center;
      }

      .activities-wrapper {
        flex-direction: column;
        gap: 100px;
      }
    }
  }
}

@media screen and ( max-width: 600px ) {
  .activities-container-wrapper {
    padding: 60px 16px 60px 16px;

    .content-wrapper {
      .section-title {
        font-size: 28px;
      }

      .activities-wrapper {
        gap: 60px;
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