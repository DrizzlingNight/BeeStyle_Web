import Vue from 'vue'
import VueI18n from 'vue-i18n'

// 引入隱私權
import privacyFile from './modules/privacy'

Vue.use(VueI18n)

// 取得 資料夾中所有的語言包
function loadLocaleMessages () {
  const locales = require.context('./', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  let messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)

      // TODO 2022.3.3 應版本需求先硬是插入一包隱私權政策文檔，後續尚需優化模組
      messages[locale].privacy = privacyFile.privacy
    }
  })

  return messages
}

const messages = loadLocaleMessages()

// 獲取語言
export function getLanguage() {
  // 如果localStorage有存語言就 return該語言
  const chooseLanguage = localStorage.language
  if (chooseLanguage) return chooseLanguage

  // localStorage沒有存就看瀏覽器語言
  // 
  const language = (navigator.language || navigator.browserLanguage).toLowerCase()
  const locales = Object.keys(messages)
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale
    }
  }
  return 'zh-TW' //預設語言設定為中文
}
const i18n = new VueI18n({
  // set locale
  // options: en | zh | es
  // locale: "en",
  locale: getLanguage(),
  // set locale messages
  silentTranslationWarn: true,
  messages
})

export default i18n
