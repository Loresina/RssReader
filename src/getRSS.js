import axios from 'axios';

const getRSS = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  .then((resp) => {
    // console.log(resp.data.contents);
    const { contents } = resp.data;
    return contents;
  });

export default getRSS;
