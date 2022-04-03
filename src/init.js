import { string, setLocale } from 'yup';
import i18next from 'i18next';
import initializeWatcher from './view';
import resources from './locales/index';
import fetchData from './fetcher';

const defaultLng = 'ru';

export default () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: defaultLng,
    debug: false,
    resources,

  }).then(() => {
    const elements = {
      form: document.querySelector('form'),
      input: document.querySelector('#url-input'),
      feedback: document.querySelector('.feedback'),
      button: document.querySelector('form button[type="submit"]'),
      feeds: document.querySelector('[content-id="feeds"]'),
      posts: document.querySelector('[content-id="posts"]'),
      modal: {
        title: document.querySelector('.modal-title'),
        body: document.querySelector('.modal-body'),
        button: document.querySelector('.full-article'),
        closeButton: document.querySelector('.modal-footer > button.btn-secondary'),
      },
      header: document.querySelector('h1'),
      lead: document.querySelector('p.lead'),
      example: document.querySelector('.example'),
      inputLabel: document.querySelector('label'),
    };

    const stateInit = {
      form: {
        state: 'filling',
        errors: [],
      },
      feeds: [],
      posts: [],
      ui: {
        readPostsIds: new Set(),
      },
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
        .notOneOf(state.feeds.map((feed) => feed.url));

      urlSchema.validate(str)
        .then((url) => {
          state.form.errors = [];
          fetchData(url, state);
        })
        .catch((e) => {
          state.form.errors = e.errors;
          state.form.state = 'invalid url';
        });
    };

    elements.button.textContent = i18nextInstance.t('addButton');
    elements.modal.button.textContent = i18nextInstance.t('readMoreButton');
    elements.modal.closeButton.textContent = i18nextInstance.t('closeButton');
    elements.header.textContent = i18nextInstance.t('header');
    elements.lead.textContent = i18nextInstance.t('lead');
    elements.example.textContent = i18nextInstance.t('example');
    elements.inputLabel.textContent = i18nextInstance.t('inputPlaceholder');

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const userInput = formData.get('url');
      validateURL(userInput);
    });
  });
};
