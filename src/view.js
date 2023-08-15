import onChange from 'on-change';
import { forEach, isObject } from 'lodash';
import getRSS from './getRSS.js';
import parsingRSS from './parsingRSS.js';

const postsView = (state) => {
  const postsContainer = document.querySelector('.posts');

  const postsColumn = document.createElement('div');
  postsColumn.classList.add('card', 'border-0');

  const postsTitleDiv = document.createElement('div');
  postsTitleDiv.classList.add('card-body');

  const postsTitle = document.createElement('h2');
  postsTitle.classList.add('card-title', 'h4');
  postsTitle.textContent = 'Посты';

  const postsList = document.createElement('ul');
  postsList.classList.add('list-group', 'border-0', 'rounder-0');

  state.contents.titles.forEach((title) => {
    const listLine = document.createElement('li');
    listLine.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const listHref = document.createElement('a');
    listHref.classList.add('fw-bold');

    listHref.textContent = title.name;
    listLine.append(listHref);

    // <a href="https://www.thecipherbrief.com/exclusive-interview-a-sobering-battlefield-assessment-in-ukraine"
    // class="fw-bold" data-id="2" target="_blank" rel="noopener noreferrer">Exclusive Interview: A Sobering Battlefield Assessment in Ukraine</a>

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
    console.log('Я пришел в стейт', current);
    const inputField = document.querySelector('#url-input');
    const errorMessage = document.querySelector('.feedback');

    if (isObject(current)) {
      console.log(current.input);
      getRSS(current.input)
        .then((contents) => parsingRSS(contents))
        .then(() => postsView(state));
      // console.log('Оставим поле белым');
    } else {
      inputField.classList.add('is-invalid');
      errorMessage.textContent = current;
      // console.log('Сделаем поле красным');
    }
  }
});

export default watchedState;
