import axios from 'axios';
import parseXML from './parser';
import composeUrl from './utils/urlComposer';

const interval = 5000;

const checkUpdates = (url, state) => {
  axios.get(composeUrl(url))
    .then((res) => {
      const parsedData = parseXML(res.data.contents);
      if (parsedData === null) {
        throw new Error('Invalid RSS');
      }
      const [, items] = parsedData;
      const { feedId } = state.feeds.find((it) => it.url === url);
      const currentPosts = state.posts.filter((post) => post.feedId === feedId);
      const currentTitles = currentPosts.map((post) => post.title);
      const newPosts = items
        .filter((post) => !currentTitles.includes(post.title))
        .map((post) => ({ ...post, feedId }));
      state.posts.unshift(...newPosts);
    })
    .catch(() => {})
    .finally(() => {
      setTimeout(() => checkUpdates(url, state), interval);
    });
};

export default checkUpdates;
