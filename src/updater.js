import axios from 'axios';
import parseXML from './parser';

const proxyUrl = 'https://allorigins.hexlet.app/get?disableCache=true&url=';

const checkUpdates = (url, interval, state) => {
  setTimeout(() => {
    axios.get(`${proxyUrl}${encodeURIComponent(url)}`)
      .then((res) => parseXML(res.data.contents))
      .then(([, items]) => {
        const { feedId } = state.feeds.find((it) => it.url === url);
        const currentPosts = state.posts.filter((post) => post.feedId === feedId);
        const currentTitles = currentPosts.map((post) => post.title);
        const newPosts = items
          .filter((post) => !currentTitles.includes(post.title))
          .map((post) => ({ ...post, feedId }));
        state.posts.unshift(...newPosts);
        checkUpdates(url, interval, state);
      });
  }, interval);
};

export default checkUpdates;
