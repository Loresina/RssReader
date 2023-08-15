import uniqueId from 'lodash/uniqueId.js';
import { state } from './index.js';

const parsingRSS = (contents) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(contents, 'application/xml');
  // doc.querySelectorAll('item title').forEach((el) => console.log(el.innerHTML));
  const titles = doc.querySelectorAll('item title');
  const links = doc.querySelectorAll('item link');

  titles.forEach((title) => {
    const titleID = uniqueId();
    state.contents.titles.push({ id: `${titleID}`, name: `${title.textContent}` });
  });

  // links.forEach((link) => {
  //   const titleID = uniqueId();
  //   state.titles.push({ id: `${titleID}`, name: `${title}` });
  // });

//   return titles;
};

export default parsingRSS;
