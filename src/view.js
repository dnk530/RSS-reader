const render = (elements) => (path, value) => {
  const feedbackElement = elements.feedback;
  const inputElement = elements.input;
  switch (path) {
    case 'form.state':
      if (value === 'invalid') {
        inputElement.classList.add('is-invalid');
      }
      if (value === 'downloading') {
        inputElement.classList.remove('is-invalid');
        feedbackElement.textContent = '';
        elements.input.focus();
        inputElement.value = '';
      }
      break;
    case 'form.errors':
      feedbackElement.textContent = value.toString();
      break;
    default:
      break;
  }
};

export default render;
