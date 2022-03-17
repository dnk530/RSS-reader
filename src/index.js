import 'bootstrap/dist/css/bootstrap.min.css';
import { string } from 'yup';
import onChange from 'on-change';

const elements = {
  form: document.querySelector('form'),
  input: document.querySelector('#url-input'),
  feedback: document.querySelector('.feedback'),
};

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
      elements.input.classList.remove('is-invalid');
      elements.feedback.textContent = '';
      if (!value) {
        elements.input.classList.add('is-invalid');
        elements.feedback.textContent = watchedState.rssForm.errors.join(' ');
      }
      if (value) {
        elements.input.focus();
        elements.input.value = '';
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

elements.form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const url = formData.get('url');
  validateURL(url);
});
