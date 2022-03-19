import 'bootstrap/dist/css/bootstrap.min.css';
import { string } from 'yup';
import onChange from 'on-change';

const elements = {
  form: document.querySelector('form'),
  input: document.querySelector('#url-input'),
  feedback: document.querySelector('.feedback'),
};

const watchedState = onChange({
  form: {
    state: 'filling',
    errors: [],
  },
  feeds: [],
  posts: [],
}, (path, value) => {
  switch (path) {
    case 'form.state':
      if (value === 'invalid') {
        elements.input.classList.add('is-invalid');
      }
      if (value === 'downloading') {
        elements.input.classList.remove('is-invalid');
        elements.feedback.textContent = '';
        elements.input.focus();
        elements.input.value = '';
      }
      break;
    case 'form.errors':
      elements.feedback.textContent = value.toString();
      break;
    default:
      break;
  }
});

const validateURL = (url) => {
  const urlSchema = string()
    .required()
    .url('Must be valid url')
    .notOneOf(watchedState.feeds, 'This RSS has been already added');

  urlSchema.validate(url)
    .then(() => {
      watchedState.form.errors = [];
      watchedState.feeds.push(url);
      watchedState.form.state = 'downloading';
    })
    .catch((e) => {
      watchedState.form.errors = e.errors;
      watchedState.form.state = 'invalid';
      throw new Error(e);
    });
};

elements.form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const url = formData.get('url');
  validateURL(url);
});
