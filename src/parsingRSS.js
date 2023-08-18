// import uniqueId from 'lodash/uniqueId.js';
// import { state } from './index.js';

const parsingRSS = (contents) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(contents, 'application/xml');

  if (doc.querySelector('parsererror')) {
    throw new Error('ParsingError');
  }

  return doc;
};

export default parsingRSS;
