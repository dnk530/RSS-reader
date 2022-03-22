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
      const postsElements = parsedData.querySelectorAll('item');
      const posts = new Array(...postsElements).map((item) => {
        const title = item.querySelector('title').textContent;
        const desc = item.querySelector('description').textContent;
        const link = item.querySelector('link').textContent;
        const postId = Date.now() * Math.random();
        return {
          postId, title, desc, link, feedId,
        };
      });
      resolve([{ feedTitle, feedDescription, feedId }, posts]);
    }
  });
};
