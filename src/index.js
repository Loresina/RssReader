import './scss/styles.scss';
import i18n from 'i18next';
import resources from './locales/ru.js';
import app from './app.js';

const i18nextInstance = i18n.createInstance();
i18nextInstance.init({
  lng: 'ru',
  debug: false,
  resources,
})
  .then(() => app(i18nextInstance));

// export default i18nextInstance;
