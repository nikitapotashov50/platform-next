import i18n from 'i18next'
import ruLocale from '../../static/i18n/ru.json'

const startI18n = file => i18n.init({
  fallbackLng: 'ru',
  resources: file,
  ns: [ 'common' ],
  defaultNS: 'common',
  debug: false
})

export async function getTranslations (lang) {
  return {
    [lang]: {
      common: ruLocale
    }
  }
}

export default startI18n
