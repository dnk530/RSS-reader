import axios from 'axios';
import parseXML from './parser';
import startUpdater from './updater';
import composeUrl from './utils/urlComposer';

export default (url, state) => {
  const { form } = state;
  form.state = 'downloading';

  axios.get(composeUrl(url))
    .then((res) => {
      form.state = 'download successful';
      const parsedData = parseXML(res.data.contents);
      if (parsedData === null) {
        throw new Error('Invalid RSS');
      }
      const [feed, items] = parsedData;
      state.feeds.unshift({ ...feed, url });
      state.posts.unshift(...items);
      startUpdater(url, state);
    })
    .catch((e) => {
      if (e.message === 'Network Error') {
        form.state = 'download error';
      }
      if (e.message === 'Invalid RSS') {
        form.state = 'invalid rss';
      }
    });
};
