const TorrentSource = require("./torrentSource");
const leetx = require("../lib/1337x");

class LeetxSearch extends TorrentSource {
  constructor(options) {
    super(options.name);
    this.url = options.url;
  }

  async search(searchQuery, type, page = 1, category) {
    try {
      const results = await leetx.search(searchQuery, this.url, page, category);
      return this.reconstitute(results, searchQuery, type);
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}

module.exports = LeetxSearch;
