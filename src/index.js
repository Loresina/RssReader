import './scss/styles.scss';
import * as yup from 'yup';
import i18n from 'i18next';
import watchedState from './view.js';
import resources from './locales/ru.js';

const i18nextInstance = i18n.createInstance();
i18nextInstance.init({
  lng: 'ru',
  debug: false,
  resources,
});

const schema = yup.object().shape({
  input: yup.string()
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      'Enter correct url!',
    )
    .required(i18nextInstance.t('inputError')),
});

const validate = (fields) => schema.validate(fields);

const state = {
  inputForm: {
    input: '',
  },
  validInput: {
    response: '',
  },
  contents: {
    titles: [],
  },

};

const inputForm = document.querySelector('.rss-form');
inputForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const inputValue = formData.get('url');

  watchedState(state).inputForm.input = inputValue;

  // validate(state.inputForm)
  //   .then((goodValidation) => console.log(goodValidation))
  //   .catch((badValidation) => console.log(badValidation));

  validate(state.inputForm)
    .then((goodValidation) => {
      watchedState(state).validInput.response = goodValidation;
    })
    .catch((badValidation) => {
      watchedState(state).validInput.response = badValidation.message;
    });
});

export { state };
