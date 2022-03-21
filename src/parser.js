export default (xmlString) => {
  const parser = new DOMParser();
  const parsedData = parser.parseFromString(xmlString, 'text/xml');
  const errorNode = parsedData.querySelector('parsererror');
  return new Promise((resolve, reject) => {
    if (errorNode) {
      reject(new Error('invalidRss'));
    } else {
      const feedTitle = parsedData.querySelector('channel title').textContent;
      const feedDescription = parsedData.querySelector('channel description').textContent;
      const feedId = Date.now();
      const itemElements = parsedData.querySelectorAll('item');
      const items = new Array(...itemElements).map((item) => {
        const title = item.querySelector('title').textContent;
        const desc = item.querySelector('description').textContent;
        const link = item.querySelector('link').textContent;
        return {
          title, desc, link, feedId,
        };
      });
      resolve([{ feedTitle, feedDescription, feedId }, items]);
    }
  });
};
