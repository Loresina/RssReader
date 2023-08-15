import axios from 'axios';

const getRSS = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  .then((response) => {
    if (response.status === 200) {
      return response;
    }
    throw new Error(`Response to ${url} was not ok.`);
  })
  .then((resp) => {
    console.log(resp.data.contents);
    const { contents } = resp.data;
    return contents;
  });

export default getRSS;
