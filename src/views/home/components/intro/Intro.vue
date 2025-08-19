<template>
  <!-- // TODO 檔案名稱已由 about -> intro 內容命名與變數尚未一起更改 -->
  <div class="about-wrapper">
    <div class="content-wrapper d-flex flex-column align-center">
      <!-- title -->
      <p v-html="$t('home.intro.sectionTitle')" class="about-title mb-0 mb-lg-12"></p>
      <!-- 區塊1 -->
      <div class="section section1">
        <div class="text-wrapper">
          <p class="text-title primary--text mb-8">{{ $t('home.intro.block1.blockTitle') }}</p>
          <p v-html="$t('home.intro.block1.blockDescription')" class="text-description mb-0">
          </p>
        </div>
        <v-img contain src="/static/ui/home/about/section1_img.png" class="section-img"></v-img>
      </div>
    </div>
    <!-- 區塊2 -->
    <div class="content-wrapper d-flex flex-column align-center">
      <div class="section section2">
        <v-img src="/static/ui/home/about/section2_img.png" class="section-img"></v-img>
        <div class="text-wrapper">
          <p class="text-title primary--text text-md-end mb-8">{{ $t('home.intro.block2.blockTitle') }}</p>
          <p v-html="$t('home.intro.block2.blockDescription')" class="text-description text-md-end mb-0">
          </p>
        </div>
      </div>
    </div>
    <!-- 區塊3 -->
    <div class="content-wrapper d-flex flex-column align-center">
      <div class="section section3">
        <div class="text-wrapper">
          <p class="text-title primary--text mb-8">{{ $t('home.intro.block3.blockTitle') }}</p>
          <p v-html="$t('home.intro.block3.blockDescription')" class="text-description mb-0"></p>
        </div>
        <v-img src="/static/ui/home/about/section3_img.png" class="section-img"></v-img>
      </div>
    </div>
    <!-- 區塊4 -->
    <div class="content-wrapper d-flex flex-column align-center">
      <div class="section section4">
        <v-img src="/static/ui/home/about/section4_img.png" class="section-img"></v-img>
        <div class="text-wrapper">
          <p class="text-title primary--text text-md-end mb-8">{{ $t('home.intro.block4.blockTitle') }}</p>
          <p v-html="$t('home.intro.block4.blockDescription')" class="text-description text-md-end mb-0"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Intro',
  data() {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>

.about-wrapper {
  position: relative;
  padding-top: 100px;

  .content-wrapper {
    padding: 0px 216px;

    .about-title {
      font-size: 40px;
    }

    &:nth-child(even) {
      background: var(--bg2);
    }

    .section {
      width: 100%;
      max-width: 1280px;
      margin: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .text-wrapper {
        .text-title {
          font-size: 32px;
          margin-bottom: 32px;
        }

        .text-description {
          font-size: 20px;
        }
      }


      &.section1 {
        padding: 40px 0px;

        .text-wrapper {
          max-width: 35%;
        }
        .section-img {
          max-width: 50%;
        }
      }
      &.section2 {
        padding: 80px 0px;

        .text-wrapper {
          max-width: 35%;
        }
        .section-img {
          max-width: 40%;
        }
      }
      &.section3 {
        padding: 56px 0px;

        .text-wrapper {
          max-width: 45%;
        }
        .section-img {
          max-width: 40%;
        }
      }
      &.section4 {
        padding: 40px 0px;

        .text-wrapper {
          max-width: 35%;
        }
        .section-img {
          max-width: 30%;
        }
      }
    }

  }
}

@media screen and ( max-width: 1264px ) {
  .about-wrapper {
    padding-top: 80px;

    .content-wrapper {
      padding: 0px 160px !important;

      .about-title {
        font-size: 36px;
      }

      .section {
        .text-wrapper {
          .text-title {
            font-size: 24px !important;
            margin-bottom: 28px !important;
          }

          .text-description {
            font-size: 16px !important;
          }
        }

        &.section1 {
          .text-wrapper {
            max-width: 35%;
          }
          .section-img {
            max-width: 50%;
          }
        }
        &.section2 {
          .text-wrapper {
            max-width: 35%;
          }
          .section-img {
            max-width: 40%;
          }
        }
        &.section3 {
          .text-wrapper {
            max-width: 45%;
          }
          .section-img {
            max-width: 40%;
          }
        }
        &.section4 {
          .text-wrapper {
            max-width: 35%;
          }
          .section-img {
            max-width: 30%;
          }
        }
      }
    }
  }
}

@media screen and ( max-width: 960px ) {
  .about-wrapper {
    padding-top: 60px;

    .content-wrapper {
      padding: 0px 120px !important;

      .about-title {
        font-size: 32px;
      }

      .section {
        flex-direction: column;
        text-align: center !important;
        
        .text-wrapper {
          max-width: 80% !important;
          text-align: center !important;
          
          .text-title {
            font-size: 20px !important;
            margin-bottom: 20px !important;
          }

          .text-description {
            font-size: 16px !important;
          }
        }

        .section-img {
          max-width: 50% !important;
        }
      }

      &:nth-child(odd) .section {
        flex-direction: column-reverse !important;
      }
    }
  }
}

@media screen and ( max-width: 600px ) {
  .about-wrapper {
    padding-top: 40px;

    .content-wrapper {
      padding: 0px 16px !important;

      .about-title {
        font-size: 28px;
      }
    }
  }
}


</style>