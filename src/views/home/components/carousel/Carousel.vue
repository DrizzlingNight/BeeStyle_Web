<template>
  <div class="carousel-wrapper d-flex justify-center">
    <div class="carousel carousel-mid">

      <!-- PC -->
      <v-carousel
        :show-arrows="false"
        hide-delimiter-background
        cycle
        interval="5000"
        height="auto"
        class="d-none d-sm-block"
      >
        <v-carousel-item
          v-for="banner in banners"
          :key="banner.id"
          :src="banner.resource"
          class="carousel-item"
          :ripple="false"
          @click="bannerOnclick(banner.link)"
        >
        </v-carousel-item>
      </v-carousel>

      <!-- Mobile -->
      <v-carousel
        :show-arrows="false"
        hide-delimiter-background
        cycle
        continuous
        interval="5000"
        height="auto"
        class="d-block d-sm-none"
      >
        <v-carousel-item
          v-for="banner in banners"
          :key="banner.id"
          :src="banner.resource_mobile"
          class="carousel-item"
          :ripple="false"
          @click="bannerOnclick(banner.link)"
        >
        </v-carousel-item>
      </v-carousel>

    </div>
  </div>
</template>

<script>

export default {
  name: 'Carousel',
  data() {
    return {
      banners: [
        {
          id: 1,
          resource: '/static/ui/home/carousel/Banner_1.png',
          resource_mobile: '/static/ui/home/carousel/Banner_1_mobile.png',
          link: '',
        },
        {
          id: 2,
          resource: '/static/ui/home/carousel/banner_2.png',
          resource_mobile: '/static/ui/home/carousel/banner_2_mobile.png',
          link: 'https://www.youtube.com/channel/UC-BcduBhTrA2N6bzydNlfHA',
        },
      ],
      isMobile: false
    }
  },
  methods: {
    bannerOnclick(link) {
      if (link) {
        window.open(link)
      }
    }
  },
  created() {
  },
}
</script>

<style lang="scss" scoped>
.carousel-wrapper {
  width: 100%;
  position: relative;
  overflow: hidden;

  .carousel {
    width: 100%;
    position: relative;

    .carousel-item {
        cursor: pointer;
    }
  }

  .carousel-cover {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: linear-gradient(270deg, rgba(67, 75, 90, 0) 0%, #2D3948 100%);
    padding: 0px 216px;
  }

  // mobile
  .carousel-cover-mobile {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: linear-gradient(360deg, rgba(67, 75, 90, 0) 0%, #2D3948 100%);
    padding-top: 25%;
  }
}

::v-deep .v-carousel__controls {
  width: auto;
  margin-bottom: 12px;
  margin-left: 50%;
  transform: translate(-50%, 0);

  .v-item-group {
    .v-btn {
      margin: 0px 36px;
      border: 1px solid #ffffff;
      border-radius: 50%;
      width: 20px;
      height: 20px;

      &.v-btn--active {
        background-color: #ffffff;
      }

      .v-btn__content {
        display: none;
      }
    }
  }
}

@media screen and (max-width: 1264px) {
  .carousel-cover {
    padding: 0px 160px !important;

    .cover-title {
      font-size: 40px !important;
      margin-bottom: 48px !important;
    }

    .author-name {
      font-size: 24px !important;
    }

    .NFT-name {
      font-size: 24px !important;
      margin-bottom: 76px !important;
    }

    .purchase-btn {
      width: 160px !important;
      height: 48px !important;
      ::v-deep .v-btn__content {
        font-size: 16px !important;
      }
    }
  }

  ::v-deep .v-carousel__controls {
    margin-bottom: 0px !important;

    .v-item-group {
      .v-btn {
        margin: 0px 16px !important;
        border: 1px solid #ffffff;
        border-radius: 50%;
        width: 16px;
        height: 16px;
  
        &.v-btn--active {
          background-color: #ffffff;
        }
  
        .v-btn__content {
          display: none;
        }
      }
    }
  }
}

@media screen and (max-width: 960px) {
  .carousel-cover {
    padding: 0px 120px !important;

    .cover-title {
      font-size: 32px !important;
      margin-bottom: 24px !important;
    }

    .author-name {
      font-size: 16px !important;
    }

    .NFT-name {
      font-size: 16px !important;
      margin-bottom: 40px !important;
    }

    .purchase-btn {
      width: 120px !important;
      height: 32px !important;
      ::v-deep .v-btn__content {
        font-size: 14px !important;
      }
    }
  }

  ::v-deep .v-carousel__controls {
    margin-bottom: -6px !important;

    .v-item-group {
      .v-btn {
        margin: 0px 10px !important;
        border: 1px solid #ffffff;
        border-radius: 50%;
        width: 10px;
        height: 10px;
  
        &.v-btn--active {
          background-color: #ffffff;
        }
  
        .v-btn__content {
          display: none;
        }
      }
    }
  }
  
}

@media screen and (max-width: 600px) {
  .carousel-cover {
    padding: 0px 16px !important;

    .cover-title {
      font-size: 24px !important;
      margin-bottom: 16px !important;
    }

    .author-name {
      font-size: 14px !important;
      margin-bottom: 0px !important;
    }

    .NFT-name {
      font-size: 14px !important;
      margin-bottom: 16px !important;
    }

    .purchase-btn {
      width: 100px !important;
      height: 28px !important;
      ::v-deep .v-btn__content {
        font-size: 12px !important;
      }
    }
  }

  ::v-deep .v-carousel__controls {
    margin-bottom: -6px !important;

    .v-item-group {
      .v-btn {
        margin: 0px 4px !important;
        border: 1px solid #ffffff;
        border-radius: 50%;
        width: 8px;
        height: 8px;
  
        &.v-btn--active {
          background-color: #ffffff;
        }
  
        .v-btn__content {
          display: none;
        }
      }
    }
  }
  
}


[data-theme = "dark"] {
  .action-btn {
    background: #333333;
    color: #ffffff;
  }
}

</style>