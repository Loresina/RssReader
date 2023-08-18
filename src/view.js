import onChange from 'on-change';
import { isObject } from 'lodash';
import i18nextInstance from './index.js';

const readingView = (post) => {
  const readingButton = document.querySelector('.modal-footer .btn-primary');
  readingButton.setAttribute('href', post.link);
};

const closeModal = (body, backdrop) => {
  const closeButton = document.querySelector('.modal-footer .btn-secondary');
  const closeCross = document.querySelector('.btn-close');

  [closeButton, closeCross].forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = document.querySelector('#modal');
      modal.classList.remove('show');
      modal.removeAttribute('style', 'display: block;');

      body.classList.remove('modal-open');
      body.removeAttribute('data-new-gr-c-s-check-loaded', '8.906.0');
      body.removeAttribute('data-gr-ext-installed', '');
      body.removeAttribute('style', 'overflow: hidden; padding-right: 13px;');

      backdrop.remove();
    });
  });
};

const buttonlView = (post, listHref) => {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  button.setAttribute('data-id', '204');
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#modal');
  button.textContent = 'Просмотр';

  button.addEventListener('click', (e) => {
    e.preventDefault();

    post.touch = true;

    console.log(post);
    const body = document.querySelector('body');
    body.classList.add('modal-open');
    body.setAttribute('data-new-gr-c-s-check-loaded', '8.906.0');
    body.setAttribute('data-gr-ext-installed', '');
    body.setAttribute('style', 'overflow: hidden; padding-right: 13px;');

    const backdrop = document.createElement('div');
    backdrop.classList.add('modal-backdrop', 'fade', 'show');
    body.append(backdrop);

    listHref.classList.remove('fw-bold');
    listHref.classList.add('fw-normal', 'link-secondary');

    const modal = document.querySelector('#modal');
    modal.classList.add('show');
    modal.setAttribute('style', 'display: block;');

    const modalTitle = document.querySelector('.modal-title');
    modalTitle.textContent = post.name;

    const modalDescription = document.querySelector('.modal-body');
    modalDescription.textContent = post.description;

    readingView(post);
    closeModal(body, backdrop);
  });
  return button;
};

const feedsView = (state) => {
  const feedsContainer = document.querySelector('.feeds');
  feedsContainer.textContent = '';

  const feedsColumn = document.createElement('div');
  feedsColumn.classList.add('card', 'border-0');

  const feedsTitleDiv = document.createElement('div');
  feedsTitleDiv.classList.add('card-body');

  const feedsTitle = document.createElement('h2');
  feedsTitle.classList.add('card-title', 'h4');
  feedsTitle.textContent = 'Фиды';

  const feedsList = document.createElement('ul');
  feedsList.classList.add('list-group', 'border-0', 'rounder-0');

  state.contents.feeds.forEach((feed) => {
    const listLine = document.createElement('li');
    listLine.classList.add('list-group-item', 'border-0', 'border-end-0');

    const name = document.createElement('h3');
    name.classList.add('h6', 'm-0');
    name.textContent = feed.feedName;

    const description = document.createElement('p');
    description.classList.add('m-0', 'small', 'text-black-50');
    description.textContent = feed.feedDescription;

    listLine.append(name);
    listLine.append(description);
    feedsList.append(listLine);
  });

  feedsTitleDiv.append(feedsTitle);
  feedsColumn.append(feedsTitleDiv);
  feedsColumn.append(feedsList);

  feedsContainer.append(feedsColumn);
};

const postsView = (state) => {
  const postsContainer = document.querySelector('.posts');

  // фильтровать ссылки с измененными классами,
  // скадывать в переменную, и отрисовывыть с фильтром этого списка

  postsContainer.textContent = '';

  const postsColumn = document.createElement('div');
  postsColumn.classList.add('card', 'border-0');

  const postsTitleDiv = document.createElement('div');
  postsTitleDiv.classList.add('card-body');

  const postsTitle = document.createElement('h2');
  postsTitle.classList.add('card-title', 'h4');
  postsTitle.textContent = 'Посты';

  const postsList = document.createElement('ul');
  postsList.classList.add('list-group', 'border-0', 'rounder-0');

  state.contents.posts.forEach((post) => {
    const listLine = document.createElement('li');
    listLine.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const listHref = document.createElement('a');

    if (post.touch === true) {
      console.log('Я отрисовал прочитанную ссылку');
      listHref.classList.add('fw-normal', 'link-secondary');
    } else if (post.touch === false) {
      console.log('Я отрисовал не прочитанную ссылку');
      listHref.classList.add('fw-bold');
    }

    listHref.setAttribute('href', post.link);
    listHref.setAttribute('data-id', '2');
    listHref.setAttribute('target', 'blank');
    listHref.setAttribute('rel', 'noopener', 'noreferrer');
    listHref.textContent = post.name;

    listHref.addEventListener('click', () => {
      post.touch = true;
      listHref.classList.remove('fw-bold');
      listHref.classList.add('fw-normal', 'link-secondary');
    });

    const button = buttonlView(post, listHref);

    listLine.append(listHref);
    listLine.append(button);
    postsList.append(listLine);
  });

  postsTitleDiv.append(postsTitle);
  postsColumn.append(postsTitleDiv);
  postsColumn.append(postsList);

  postsContainer.append(postsColumn);
};

const watchedState = (state) => onChange(state, (path, current, previous) => {
  // console.log(path);

  // if (path === 'inputForm.input') {
  //   console.log('Проверяем есть ли этот адрес в фидах. Действуем по итогу');
  // }

  if (path === 'validInput.response') {
    const inputField = document.querySelector('#url-input');
    const message = document.querySelector('.feedback');

    if (isObject(current)) {
      inputField.classList.remove('is-invalid');
      message.classList.remove('text-danger');
      message.classList.add('text-success');
      message.textContent = i18nextInstance.t('isValid');
    } else {
      message.classList.remove('text-success');
      message.classList.add('text-danger');
      inputField.classList.add('is-invalid');
      message.textContent = current;
    }
  }

  if (path === 'contents.posts') {
    postsView(state);
  }

  if (path === 'contents.feeds') {
    feedsView(state);
  }
});

export default watchedState;
