import axios from 'axios';

const getRSS = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  .then((response) => {
    if (response.status === 200) {
      return response;
    }
    throw new Error(`Response to ${url} was not ok.`);
  })
  .then((resp) => {
    // console.log(resp.data.contents);
    const { contents } = resp.data;
    return contents;
  })
  .catch(() => {
    const message = document.querySelector('.feedback');
    message.textContent = 'привет, я ошибка';
    throw new Error();
  });

export default getRSS;
