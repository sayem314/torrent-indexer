const TorrentSource = require("./torrentSource");
const limetorrents = require("../lib/limetorrents");

class LimetorrentsSearch extends TorrentSource {
  constructor(options) {
    super(options.name);
    this.url = options.url;
  }

  async search(searchQuery, type, page = 1) {
    try {
      const results = await limetorrents.search(searchQuery, this.url, page);
      return this.reconstitute(results, searchQuery, type);
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}

module.exports = LimetorrentsSearch;
