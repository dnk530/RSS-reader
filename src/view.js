import onChange from 'on-change';

export default (stateInit, elements, i18nextInstance) => {
  const state = onChange(stateInit, (path, value) => {
    const feedbackElement = elements.feedback;
    const inputElement = elements.input;
    const submitButton = elements.button;
    switch (path) {
      case 'form.state':
        if (value === 'invalid') {
          inputElement.classList.add('is-invalid');
        }
        if (value === 'downloading') {
          inputElement.classList.remove('is-invalid');
          feedbackElement.textContent = '';
          inputElement.setAttribute('readonly', true);
          submitButton.setAttribute('disabled', '');
        }
        if (value === 'download successful') {
          inputElement.removeAttribute('readonly');
          inputElement.value = '';
          elements.input.focus();
          submitButton.removeAttribute('disabled');
          feedbackElement.textContent = i18nextInstance.t('successfulDownload');
          feedbackElement.classList.remove('text-danger');
          feedbackElement.classList.add('text-success');
        }
        if (value === 'download error') {
          inputElement.removeAttribute('readonly');
          feedbackElement.classList.remove('text-success');
          feedbackElement.classList.add('text-danger');
          submitButton.removeAttribute('disabled');
          feedbackElement.textContent = i18nextInstance.t('networkError');
        }
        if (value === 'invalid rss') {
          feedbackElement.classList.remove('text-success');
          feedbackElement.classList.add('text-danger');
          feedbackElement.textContent = i18nextInstance.t('invalidRss');
        }
        break;
      case 'form.errors':
        feedbackElement.classList.remove('text-success');
        feedbackElement.classList.add('text-danger');
        feedbackElement.textContent = value.toString();
        break;
      default:
        break;
    }
  });
  return state;
};
