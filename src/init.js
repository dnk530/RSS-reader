import 'bootstrap/dist/css/bootstrap.min.css';
import { string, setLocale } from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import initializeWatcher from './view';
import en from './locales/en';
import parseXML from './parser';

export default () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'en',
    debug: true,
    resources: {
      en,
    },

  }).then(() => {
    const elements = {
      form: document.querySelector('form'),
      input: document.querySelector('#url-input'),
      feedback: document.querySelector('.feedback'),
      button: document.querySelector('form button[type="submit"]'),
    };

    const stateInit = {
      form: {
        state: 'filling',
        errors: [],
      },
      feeds: [],
      posts: [],
    };

    const state = initializeWatcher(stateInit, elements, i18nextInstance);

    setLocale({
      mixed: {
        notOneOf: i18nextInstance.t('duplicate'),
      },
      string: {
        url: i18nextInstance.t('invalidUrl'),
      },
    });

    const validateURL = (str) => {
      const urlSchema = string()
        .required()
        .url()
        .notOneOf(state.feeds);

      urlSchema.validate(str)
        .then(() => {
          state.form.errors = [];
          state.feeds.push(str);
          state.form.state = 'downloading';
          return str;
        })
        .then((url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`))
        .then((res) => {
          state.form.state = 'download successful';
          return parseXML(res.data.contents);
        })
        .catch((e) => {
          if (e.message === 'Network Error') {
            state.form.state = 'download error';
            throw new Error(e);
          }
          state.form.errors = e.errors;
          state.form.state = 'invalid';
          throw new Error(e);
        });
    };

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const userInput = formData.get('url');
      validateURL(userInput);
    });
  });
};
