import 'bootstrap/dist/css/bootstrap.min.css';
import { string, setLocale } from 'yup';
import i18next from 'i18next';
import initializeWatcher from './view';
import en from './locales/en';

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
    };

    const stateInit = {
      form: {
        state: 'filling',
        errors: [],
      },
      feeds: [],
      posts: [],
    };

    const state = initializeWatcher(stateInit, elements);

    setLocale({
      mixed: {
        notOneOf: i18nextInstance.t('duplicate'),
      },
      string: {
        url: i18nextInstance.t('invalidUrl'),
      },
    });

    const validateURL = (url) => {
      const urlSchema = string()
        .required()
        .url()
        .notOneOf(state.feeds);

      urlSchema.validate(url)
        .then(() => {
          state.form.errors = [];
          state.feeds.push(url);
          state.form.state = 'downloading';
        })
        .catch((e) => {
          state.form.errors = e.errors;
          state.form.state = 'invalid';
          throw new Error(e);
        });
    };

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const url = formData.get('url');
      validateURL(url);
    });
  });
};
