import uniqueId from 'lodash/uniqueId.js';
import watchedState from './view.js';
import validate from './validation.js';
import getRSS from './getRSS.js';
import parsingRSS from './parsingRSS.js';

const app = (i18nextInstance) => {
  const state = {
    inputForm: {
      input: '',
    },
    a: 0,
    validInput: {
      response: '',
    },
    contents: {
      urls: [],
      feeds: [],
      posts: [],
    },
  };

  const update = () => {
    setTimeout(() => {
      const existingUrls = state.contents.urls;

      const allNewPosts = existingUrls.map((url) => getRSS(url)
        .then((contents) => parsingRSS(contents))
        .then((doc) => {
          const items = doc.querySelectorAll('item');

          const actualFeed = state.contents.feeds.filter((feed) => feed.feedLink === url);
          const actualId = actualFeed[0].feedID;

          const freshData = [];
          items.forEach((item) => {
            const name = item.querySelector('title').textContent;
            const link = item.querySelector('link').textContent;
            const description = item.querySelector('description').textContent;
            freshData.push({
              name, description, actualId, link,
            });
          });

          const oldData = state.contents.posts.filter((post) => post.feedID === actualId);

          const newPosts = freshData.filter((freshItem) => oldData
            .every((oldItem) => oldItem.name !== freshItem.name));
          return newPosts;
        }));

      Promise.all(allNewPosts).then((values) => {
        let updateList = [];
        values.map((value) => {
          updateList = [...updateList, ...value];
          return updateList;
        });

        if (updateList.length > 0) {
          watchedState(state).contents.posts = [...updateList, ...state.contents.posts];
        }
        // console.log(updateList);
      });

      update();
    }, 5000);
  };

  update();

  const inputForm = document.querySelector('.rss-form');
  inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputValue = formData.get('url');

    watchedState(state).inputForm.input = inputValue;

    // validate(state.inputForm, i18nextInstance)
    //   .then((goodValidation) => console.log('ХОРОШАЯ ВАЛИДАЦИЯ', goodValidation))
    //   .catch((badValidation) => console.log('ПЛОХАЯ ВАЛИДАЦИЯ', badValidation));

    validate(state.inputForm, i18nextInstance, state.contents.urls)
      .then((goodValidation) => {
        watchedState(state).validInput.response = goodValidation;
        state.contents.urls.push(state.inputForm.input);
        return getRSS(state.inputForm.input);
      })
      .then((contents) => parsingRSS(contents))
      .then((doc) => {
        const items = doc.querySelectorAll('item');
        const feedName = doc.querySelector('channel title').textContent;
        const feedDescription = doc.querySelector('channel description').textContent;
        const feedLink = state.inputForm.input;
        const feedID = uniqueId('feed');

        const posts = [];
        const newFeed = {
          feedName, feedID, feedDescription, feedLink,
        };

        items.forEach((item) => {
          const name = item.querySelector('title').textContent;
          const link = item.querySelector('link').textContent;
          const description = item.querySelector('description').textContent;

          posts.push({
            name, description, feedID, link, touch: false,
          });
        });

        watchedState(state).contents.feeds.push(newFeed);
        watchedState(state).contents.posts = [...state.contents.posts, ...posts];
      })
      .catch((badValidation) => {
        watchedState(state).validInput.response = badValidation.message;
      });
  });
};

export default app;
