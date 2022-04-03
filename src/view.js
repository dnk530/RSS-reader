import onChange from 'on-change';

const createCardElement = (title) => {
  const cardElement = document.createElement('div');
  cardElement.classList.add('card', 'border-0');
  cardElement.innerHTML = `<div class="card-body">
      <h2 class="card-title h4">${title}</h2></div>`;
  return cardElement;
};

const createPostsList = (value, viewButtonCaption) => {
  const ulElement = document.createElement('ul');
  ulElement.classList.add('list-group', 'border-0', 'rounded-0');

  const liElements = value.map(({ postId, link, title }) => {
    const liElement = document.createElement('li');
    liElement.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0');
    liElement.innerHTML = `
          <a href="${link}" class="fw-bold" data-post-id="${postId}" target="_blank" rel="noopener noreferrer">${title}</a>
          <button type="button" class="btn btn-outline-primary btn-sm" data-post-id="${postId}" data-bs-toggle="modal" data-bs-target="#modal">${viewButtonCaption}</button>`;
    return liElement;
  });
  ulElement.append(...liElements);
  return ulElement;
};

const createFeedsList = (value) => {
  const liElements = value.map(({ feedTitle, feedDescription }) => {
    const liElement = document.createElement('li');
    liElement.classList.add('list-group-item', 'border-0');
    liElement.innerHTML = `<h3 class="h6 m-0">${feedTitle}</h3>
    <p class="m-0 small text-black-50">${feedDescription}</p>`;
    return liElement;
  });

  const ulElement = document.createElement('ul');
  ulElement.classList.add('list-group', 'border-0', 'rounded-0');
  ulElement.append(...liElements);
  return ulElement;
};

const updateModal = (modal, title, description, link) => {
  const { title: titleElement, body: bodyElement, button: fullArticleButton } = modal;
  titleElement.textContent = title;
  bodyElement.textContent = description;
  fullArticleButton.href = link;
};

const updateReadPosts = (postsElement, readIds) => {
  const links = new Array(...postsElement.querySelectorAll('a'))
    .filter((link) => readIds.has(link.dataset.postId));
  links.forEach((link) => link.classList.remove('fw-bold'));
  links.forEach((link) => link.classList.add('fw-normal', 'link-secondary'));
};

export default (stateInit, elements, i18nextInstance) => {
  const state = onChange(stateInit, (path, value) => {
    const feedbackElement = elements.feedback;
    const inputElement = elements.input;
    const submitButton = elements.button;
    const feedsElement = elements.feeds;
    const postsElement = elements.posts;
    const { modal } = elements;
    switch (path) {
      case 'form.state':
        if (value === 'invalid url') {
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
        if (value !== undefined && value.length > 0) {
          feedbackElement.classList.remove('text-success');
          feedbackElement.classList.add('text-danger');
          feedbackElement.textContent = value.toString();
        }
        break;
      case 'feeds': {
        feedsElement.innerHTML = '';
        const feedsListElement = createFeedsList(value);
        const cardElement = createCardElement(i18nextInstance.t('feedsTitle'));
        cardElement.appendChild(feedsListElement);
        feedsElement.appendChild(cardElement);
        break;
      }
      case 'posts': {
        postsElement.innerHTML = '';
        const cardElement = createCardElement(i18nextInstance.t('postsTitle'));
        const postsListElement = createPostsList(value, i18nextInstance.t('viewButton'));

        postsListElement.addEventListener('click', (e) => {
          if (e.target.nodeName === 'BUTTON' || e.target.nodeName === 'A') {
            const targetId = (e.target.dataset.postId);
            state.ui.readPostsIds.add(targetId);
            const { title, desc, link } = state.posts.find((post) => post.postId === targetId);
            updateModal(modal, title, desc, link);
          }
        });
        cardElement.appendChild(postsListElement);
        postsElement.appendChild(cardElement);
        updateReadPosts(postsElement, state.ui.readPostsIds);
        break;
      }
      case 'ui.readPostsIds': {
        updateReadPosts(postsElement, value);
        break;
      }
      default:
        break;
    }
  });
  return state;
};
