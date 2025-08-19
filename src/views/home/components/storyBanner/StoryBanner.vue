<template>
  <div class="story-banner-wrapper">
    <!-- PC -->
    <v-carousel
      :show-arrows="false"
      hide-delimiters
      hide-delimiter-background
      cycle
      continuous
      interval="5000"
      height="auto"
      class="carousel d-none d-sm-block"
    >
      <v-carousel-item
        v-for="story in stories"
        :key="story.id"
        src="/static/ui/home/storyBanner/index_bottom.png"
        class="carousel-item"
      >
        <div class="carousel-cover d-flex flex-column justify-center align-center">
          <p class="cover-title mb-0 mb-sm-2 mb-md-6">{{ story.title }}</p>
          <p class="cover-description primary--text">藝術家故事</p>
        </div>
      </v-carousel-item>
    </v-carousel>

    <!-- Mobile -->
    <v-carousel
      :show-arrows="false"
      hide-delimiters
      hide-delimiter-background
      cycle
      continuous
      interval="5000"
      height="auto"
      class="carousel d-block d-sm-none"
    >
      <v-carousel-item
        v-for="story in stories"
        :key="story.id"
        src="/static/ui/home/storyBanner/m_bottom.png"
        class="carousel-item-mobile"
      >
        <div class="carousel-cover d-flex flex-column justify-center align-center">
          <p class="cover-title mb-0 mb-sm-2 mb-md-6">{{ story.title }}</p>
          <p class="cover-description primary--text">藝術家故事</p>
        </div>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
export default {
  name: 'StoryBanner',
  data() {
    return {
      stories: [
        {
          id: 1,
          cover: 'story_banner_1',
          coverMobile: 'story_banner_mobile_1',
          title: '約翰·海斯威的《區塊鏈樂中樂外祖》',
        },
        // {
        //   id: 2,
        //   cover: 'story_banner_1',
        //   title: '哭阿',
        // }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>

.story-banner-wrapper {
  width: 100%;
  min-height: 200px !important;

  .carousel {

    // PC
    .carousel-item {

      ::v-deep .v-image {
        min-height: 200px;
      }

      .carousel-cover {
        width: 100%;
        height: 100%;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
        opacity: 0;
        transition: all .3s;
        cursor: pointer;

        .cover-title {
          font-size: 48px;
        }
        .cover-description {
          font-size: 36px;
        }

        &:hover {
          opacity: 1;
          transition: all .3s;
        }
      }
    }

    // Mobile
    .carousel-item-mobile {

      ::v-deep .v-image {
        width: 100%;
        min-height: 200px;
      }

      .carousel-cover {
        width: 100%;
        height: 100%;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
        opacity: 0;
        transition: all .3s;
        cursor: pointer;

        .cover-title {
          font-size: 20px !important;
          text-align: center;
          margin-bottom: 20px !important;
        }
        .cover-description {
          font-size: 16px !important;
        }

        &:hover {
          opacity: 1;
          transition: all .3s;
        }
      }
    }
  }
}

@media screen and (max-width: 1264px) {
  .cover-title {
    font-size: 36px !important;
  }
  .cover-description {
    font-size: 24px !important;
  }
}

@media screen and (max-width: 960px) {
  .cover-title {
    font-size: 28px !important;
  }
  .cover-description {
    font-size: 20px !important;
  }
}

@media screen and (max-width: 600px) {
  .cover-title {
    font-size: 24px !important;
  }
  .cover-description {
    font-size: 16px !important;
  }
}

</style>