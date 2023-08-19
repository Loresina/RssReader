class ParsingError extends Error {
  constructor() {
    super();
    this.name = 'ParsingError';
  }
}

const parsingRSS = (contents) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(contents, 'application/xml');

  if (doc.querySelector('parsererror')) {
    throw new ParsingError('ParsingError');
  }
  return doc;
};

export default parsingRSS;
