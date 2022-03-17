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
        feedbackElement.textContent = watchedState.rssForm.errors.join(' ');
      }
      if (value) {
        formElement.elements.url.classList.remove('is-invalid');
        feedbackElement.textContent = '';
        formElement.elements.url.focus();
        formElement.elements.url.value = '';
      }
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
      watchedState.rssForm.errors = [];
      watchedState.rssForm.isValid = true;
      watchedState.feedList.push(url);
    })
    .catch((e) => {
      watchedState.rssForm.errors = e.errors;
      watchedState.rssForm.isValid = false;
      throw new Error(e);
    });
};

formElement.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const url = formData.get('url');
  validateURL(url);
});
