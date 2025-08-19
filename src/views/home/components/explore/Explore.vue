<template>
  <div class="explore-wrapper">
    <div class="content-wrapper d-flex justify-space-between align-center">
      <!-- 開始探索 -->
      <p v-html="$t('home.explore.startExplore')" class="explore-title mb-10 mb-md-0"></p>
      <!-- 搜索 input 包皮 -->
      <div class="explore-input-wrapper">
        <v-img src="./imgs/search_icon.png" contain class="search-icon"></v-img>
        <input v-model="NFTSearchFilter" type="text" class="explore-input rounded-pill" :placeholder="$t('home.explore.inputPlaceholder')" @keyup.enter="goSearchNft"/>
        <v-btn depressed absolute class="explore-btn pa-0 rounded-pill">{{ $t('home.explore.submit') }}</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Explore',
  data() {
    return {
      NFTSearchFilter: ''
    }
  },
  methods: {
    goSearchNft() {
      // console.log('goSearchNft', this.NFTSearchFilter)
      if (this.NFTSearchFilter) {
        this.$router.push({
          name: 'explore',
          query: {
            search: this.NFTSearchFilter
          }
        })
      } else {
        this.$router.push({
          name: 'explore'
        })
      }
    },
  }
}
</script>

<style lang="scss" scoped>

.explore-wrapper {
  position: relative;
  padding: 68px 216px 68px 216px;
  background: var(--primary);

  .content-wrapper {
    max-width: 1280px;
    margin: auto;

    .explore-title {
        font-size: 48px;
        color: #000000;
    }

    .explore-input-wrapper {
      position: relative;
      width: 50%;
      height: 64px;

      .search-icon {
        width: 32px;
        height: 32px;
        position: absolute;
        top: 50%;
        left: 32px;
        transform: translate(0, -50%);
      }

      .explore-input {
        width: 100%;
        height: 100%;
        background: transparent;
        border: 2px solid #ffffff;
        padding-left: 84px;
        padding-right: 180px;
        font-size: 24px;
        color: #ffffff;
      }

      .explore-btn {
        width: 160px;
        height: 100%;
        background: #ffffff;
        color: var(--primary);
        right: 0px;

        ::v-deep span {
          font-size: 24px;
        }
      }
    }
  }
}

@media screen and ( max-width: 1264px ) {
  .explore-wrapper {
    padding: 52px 160px 52px 160px;

    .explore-title {
      span {
        font-size: 36px !important;
      }
    }

    .explore-input-wrapper {
      width: 50%;
      height: 48px !important;

      .search-icon {
        width: 28px !important;
        height: 28px !important;
        left: 28px !important;
      }

      .explore-input {
        border: 2px solid #ffffff;
        padding-left: 64px !important;
        padding-right: 160px;
        font-size: 20px !important;
      }

      .explore-btn {
        width: 140px !important;

        ::v-deep span {
          font-size: 20px !important;
        }
      }
    }
  }
}

@media screen and ( max-width: 960px ) {
  .explore-wrapper {
    padding: 48px 120px 48px 120px;

    .content-wrapper {
      flex-direction: column;
    }

    .explore-title {
      span {
        font-size: 32px !important;
      }
    }

    .explore-input-wrapper {
      width: 100% !important;
      height: 42px !important;

      .search-icon {
        width: 16px !important;
        height: 16px !important;
        left: 16px !important;
      }

      .explore-input {
        border: 2px solid #ffffff;
        padding-left: 40px !important;
        padding-right: 140px !important;
        font-size: 16px !important;
      }

      .explore-btn {
        width: 120px !important;

        ::v-deep span {
          font-size: 16px !important;
        }
      }
    }
  }
}

@media screen and ( max-width: 600px ) {
  .explore-wrapper {
    padding: 40px 16px 40px 16px;
  }
}


</style>