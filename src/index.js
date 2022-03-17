import 'bootstrap/dist/css/bootstrap.min.css';
import { string } from 'yup';
import onChange from 'on-change';

const formElement = document.querySelector('#rss-form');
const feedbackElement = document.querySelector('.feedback');

const watchedState = onChange({
  feedList: [],
  rssForm: {
    url: null,
    isValid: true,
    errors: [],
  },
}, (path, value) => {
  switch (path) {
    case 'rssForm.isValid':
      if (!value) {
        formElement.elements.url.classList.add('is-invalid');
      }
      if (value) {
        formElement.elements.url.classList.remove('is-invalid');
        feedbackElement.textContent = '';
        formElement.elements.url.focus();
        formElement.elements.url.value = '';
      }
      break;
    case 'rssForm.Errors':
      feedbackElement.textContent = value.join(' ');
      break;
    default:
      break;
  }
});

const validateURL = (url) => {
  const urlSchema = string()
    .required()
    .url('Must be valid url')
    .notOneOf(watchedState.feedList, 'This RSS has been already added');
  urlSchema.validate(url)
    .then(() => {
      watchedState.rssForm.isValid = true;
      watchedState.rssForm.errors = [];
      watchedState.feedList.push(url);
    })
    .catch((e) => {
      watchedState.rssForm.isValid = false;
      watchedState.rssForm.errors = e.errors;
      throw new Error(e);
    });
};

formElement.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const url = formData.get('url');
  validateURL(url);
});
