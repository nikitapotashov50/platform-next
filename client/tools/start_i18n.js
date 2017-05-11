import i18n from 'i18next'
import axios from 'axios'

const startI18n = file => i18n.init({
  fallbackLng: 'ru',
  resources: file,
  ns: [ 'common' ],
  defaultNS: 'common',
  debug: false
})

export async function getTranslations (lang) {
  const { data } = await axios.get(`http://localhost:3001/static/i18n/${lang}.json`)

  return {
    [lang]: {
      common: data
    }
  }
}

export default startI18n
