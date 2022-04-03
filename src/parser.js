export default (xmlString) => {
  const parser = new DOMParser();
  const parsedData = parser.parseFromString(xmlString, 'text/xml');
  const errorNode = parsedData.querySelector('parsererror');

  if (errorNode) {
    return null;
  }

  const feedTitle = parsedData.querySelector('channel title').textContent;
  const feedDescription = parsedData.querySelector('channel description').textContent;
  const feedId = String(Date.now());

  const postsElements = parsedData.querySelectorAll('item');
  const posts = new Array(...postsElements).map((item) => {
    const title = item.querySelector('title').textContent;
    const desc = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;
    const postId = String(Date.now() * Math.random());
    return {
      postId,
      title,
      desc,
      link,
      feedId,
    };
  });

  return [{ feedTitle, feedDescription, feedId }, posts];
};
