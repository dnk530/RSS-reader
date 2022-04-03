const proxyUrl = 'https://allorigins.hexlet.app/get?disableCache=true&url=';
export default (url) => `${proxyUrl}${encodeURIComponent(url)}`;
