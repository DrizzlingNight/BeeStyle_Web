<template>
  <div class="footer-wrapper">
    <div class="footer-content d-flex">
      <!-- 聯絡方式 -->
      <div class="contacts-wrapper">
        <div class="logo"></div>
        <div class="contacts d-flex align-center">
          <v-btn v-for="contact in contacts" text :key="contact.id" color="primary" class="contact d-flex justify-center pa-0">
            <v-img contain :src="`/static/ui/components/footer/contact_${contact.name}.png`" class="contact-img"></v-img>
          </v-btn>
        </div>
      </div>
      <div class="divider-dark d-lg-none"></div>
      <!-- 合作夥伴 -->
      <div class="partners-wrapper d-flex">
        <div class="partners-group partners-group1 d-flex">
          <v-img height="100%" contain v-for="index in 3" :key="index" :src="`/static/ui/components/footer/partner_${index}.png`" class="partner-img"></v-img>
        </div>
        <div class="partners-group partners-group2 d-flex">
          <v-img height="100%" contain v-for="index in 4" :key="index" :src="`/static/ui/components/footer/partner_${index+3}.png`" class="partner-img"></v-img>
        </div>
      </div>
      <div class="divider-dark d-lg-none"></div>
      <!-- 連結 -->
      <div class="links-wrapper d-flex justify-space-between">
        <div class="links-group links-group-market d-flex flex-column align-center">
          <p class="links-group-title mb-6">{{ $t('footer.links.explore.title') }}</p>
          <a href="/explore" class="mb-4">{{ $t('footer.links.explore.link1') }}</a>
          <a href="/explore?cate=1" class="mb-4">{{ $t('footer.links.explore.link2') }}</a>
          <a href="/explore?cate=2" class="mb-4">{{ $t('footer.links.explore.link3') }}</a>
          <a href="/explore?cate=3" class="mb-4">{{ $t('footer.links.explore.link4') }}</a>
        </div>
        <div class="links-group links-group-about d-flex flex-column align-center">
          <p class="links-group-title mb-6">{{ $t('footer.links.aboutNFT.title') }}</p>
          <a target="_blank" href="https://www.facebook.com/%E9%8F%88%E5%8A%9F%E6%88%BF-251298070129030/videos/?ref=page_internal" class="mb-4">{{ $t('footer.links.aboutNFT.link1') }}</a>
          <a target="_blank" href="https://docs.beestyle.io/" class="mb-4">{{ $t('footer.links.aboutNFT.link2') }}</a>
        </div>
        <!-- <div class="links-group links-group-activity d-flex flex-column align-center justify-space-between">
          <p class="links-group-title mb-6">{{ $t('footer.links.activities.title') }}</p>
          <a href="">{{ $t('footer.links.activities.link1') }}</a>
          <a href="">{{ $t('footer.links.activities.link2') }}</a>
          <a href=""></a>
        </div> -->
      </div>
    </div>
    <!-- 漸層分隔線 -->
    <div class="divider"></div>
    <!-- 版權聲明 -->
    <div class="copyright-wrapper text-center py-lg-9 py-md-6 py-3">
      &#169; 2022 BEEX TECHNOLOGY LIMITED. All rights reserved.
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      contacts: [
        {
          id: 1,
          name: 'email',
        },
        {
          id: 2,
          name: 'discord',
        },
        {
          id: 3,
          name: 'youtube',
        },
        {
          id: 4,
          name: 'instagram',
        },
        {
          id: 5,
          name: 'telegram'
        },
        {
          id: 6,
          name: 'twitter'
        },
      ]
    }
  }
}
</script>

<style lang="scss" scoped>

.footer-wrapper {
  position: relative;
  padding: 100px 216px 0px 216px;
  background: #303030;

  .footer-content {
    max-width: 1280px;
    margin: auto;
    gap: 10px;
    justify-content: space-between;

    .contacts-wrapper {
      .logo {
        width: 200px;
        height: 56px;
        background-image: url('/static/ui/utils/logo/logo_dark.png');
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        margin-bottom: 112px;
      }

      .contacts {
        width: 240px;
        .contact {
          min-width: 20px;
          height: 20px;
          margin-right: 16px;

          .contact-img {
            max-width: 20px;
            height: 20px;
          }
        }
      }
    }

    .partners-wrapper {
      padding-top: 16px;
      width: 30%;

      .partners-group {
        flex-direction: column;
        align-items: flex-start;
        // justify-content: space-between;
        gap: 20px;

        &.partners-group1 {
          margin-right: 0px;
        }
      }

      .partner-img {
        max-height: 28px;
        max-width: 70%;
      }
    }

    .links-wrapper {
      width: 240px;
      max-width: 440px;
      justify-content: flex-end;
      padding-top: 8px;

      .links-group {

        .links-group-title {
          font-size: 20px;
        }

        a {
          font-size: 16px;
          text-decoration: none;
          color: #999999;
          line-height: 16px;
        }
      }
    }

    .divider-dark {
      width: 100%;
      border: 1px solid;
      border-image: linear-gradient(270deg, rgba(0, 0, 0, 0), rgba(6, 6, 8, 1), rgba(0, 0, 0, 0)) 1 1;
    }
  }

  .divider {
    max-width: 1280px;
    border: 1px solid;
    border-image: linear-gradient(270deg, rgba(30, 227, 207, 0), #F4C245) 2 2;
    margin-top: 56px;
  }
}

@media screen and ( max-width: 1264px ) {
  .footer-wrapper {
    padding: 80px 160px 0px 160px;

    .footer-content {
      max-width: 1280px;
      margin: auto;
      justify-content: space-between;
      flex-wrap: wrap;

      .contacts-wrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-bottom: 20px;

        .logo {
          margin-bottom: 40px;
        }

        .contacts {
          width: auto;
          .contact {
            margin: 0px 12px;
          }
        }
      }

      .partners-wrapper {
        width: 100%;
        flex-direction: column;
        padding: 20px 0px;

        .partners-group {
          flex-direction: row;
          align-items: center;
          justify-content: center;

          &.partners-group1 {
            margin-right: 0px;
            margin-bottom: 20px;
          }
        }

        .partner-img {
          max-height: 24px;
          max-width: 20% !important;
        }
      }

      .links-wrapper {
        width: 100%;
        max-width: 100%;
        justify-content: center !important;
        padding-top: 20px;

        .links-group {
          margin: 0px 20px;

          .links-group-title {
            font-size: 20px;
          }

          a {
            margin-bottom: 24px;
          }
        }
      }

    }
    .divider {
      margin-top: 20px;
    }
  }
}

@media screen and ( max-width: 960px ) {
  .footer-wrapper {
    padding: 60px 120px 0px 120px;

    .partner-img {
      height: 20px !important;
    }

    .links-group {
      margin: 0px 16px !important; 
    }

    .links-group-title {
      font-size: 20px !important;
    }
  }
}

@media screen and ( max-width: 600px ) {
  .footer-wrapper {
    padding: 24px 16px 0px 16px;
    
    .logo {
      width: 160px !important;
      margin-bottom: 20px !important;
    }

    .partner-img {
      height: 16px !important;
    }

    .links-group {
      margin: 0px 12px !important;

      a {
        font-size: 14px !important;
      }
    }

    .links-group-title {
      font-size: 16px !important;
    }

    .copyright-wrapper {
      font-size: 12px;
    }
  }
}

</style>