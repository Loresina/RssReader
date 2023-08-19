import uniqueId from 'lodash/uniqueId.js';
import watchedState from './view.js';
import validate from './validation.js';
import getRSS from './getRSS.js';
import parsingRSS from './parsingRSS.js';

const myWatchState = (mystate, i18nextInstance) => watchedState(mystate, i18nextInstance);

const processErrors = (error, state, i18nextInstance) => {
  if (error.name === 'ValidationError') {
    myWatchState(state, i18nextInstance).inputError = error.message;
  } else if (error.name === 'AxiosError') {
    myWatchState(state, i18nextInstance).inputError = i18nextInstance.t('networkError');
  } else if (error.name === 'ParsingError') {
    myWatchState(state, i18nextInstance).inputError = i18nextInstance.t('badParsing');
  } else {
    console.log(error);
  }
};

const getPosts = (doc, actualId) => {
  const items = doc.querySelectorAll('item');
  const posts = [];

  items.forEach((item) => {
    const name = item.querySelector('title').textContent;
    const link = item.querySelector('link').textContent;
    const description = item.querySelector('description').textContent;
    posts.push({
      name, description, actualId, link, touch: false,
    });
  });

  return posts;
};

const checkNewPosts = (state) => {
  const existingUrls = state.contents.urls;

  const allNewPosts = existingUrls.map((url) => getRSS(url)
    .then((contents) => parsingRSS(contents))
    .then((doc) => {
      const actualFeed = state.contents.feeds.filter((feed) => feed.feedLink === url);
      const actualId = actualFeed[0].feedID;

      const freshData = getPosts(doc, actualId);
      const oldData = state.contents.posts.filter((post) => post.feedID === actualId);

      const newPosts = freshData.filter((freshItem) => oldData
        .every((oldItem) => oldItem.name !== freshItem.name));

      return newPosts;
    }));
  return allNewPosts;
};

const update = (state, i18nextInstance) => {
  setTimeout(() => {
    const allNewPosts = checkNewPosts(state);

    Promise.all(allNewPosts).then((values) => {
      let updateList = [];
      values.map((value) => {
        updateList = [...updateList, ...value];
        return updateList;
      });

      if (updateList.length > 0) {
        myWatchState(state, i18nextInstance)
          .contents.posts = [...updateList, ...state.contents.posts];
      }
    })
      .catch((e) => {
        processErrors(e, state, i18nextInstance);
      });

    update(state, i18nextInstance);
  }, 5000);
};

const app = (i18nextInstance) => {
  const state = {
    inputForm: {
      input: '',
    },
    a: 0,
    inputMessage: {
      response: '',
    },
    contents: {
      urls: [],
      feeds: [],
      posts: [],
    },
  };

  update(state, i18nextInstance);

  const inputForm = document.querySelector('.rss-form');
  inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputValue = formData.get('url');

    myWatchState(state, i18nextInstance).inputForm.input = inputValue.trim();

    validate(state.inputForm, i18nextInstance, state.contents.urls)
      .then(() => getRSS(state.inputForm.input))
      .then((contents) => parsingRSS(contents))
      .then((doc) => {
        state.contents.urls.push(state.inputForm.input);

        const feedName = doc.querySelector('channel title').textContent;
        const feedDescription = doc.querySelector('channel description').textContent;
        const feedLink = state.inputForm.input;
        const feedID = uniqueId('feed');

        const newFeed = {
          feedName, feedID, feedDescription, feedLink,
        };

        const posts = getPosts(doc, feedID);

        myWatchState(state, i18nextInstance).inputError = false;
        myWatchState(state, i18nextInstance).contents.feeds.push(newFeed);
        myWatchState(state, i18nextInstance).contents.posts = [...state.contents.posts, ...posts];
      })
      .catch((error) => {
        processErrors(error, state, i18nextInstance);
      });
  });
};

export default app;
