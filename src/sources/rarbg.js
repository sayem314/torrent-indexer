const TorrentSource = require("./torrentSource");
const rarbg = require("../lib/rarbg");

class RarbgSearch extends TorrentSource {
  constructor(options) {
    super(options.name);
    this.url = options.url;
  }

  async search(searchQuery, type, page = 1) {
    try {
      if (page !== 1) {
        return [];
      }

      const results = await rarbg.search(searchQuery, this.url);
      return this.reconstitute(results, searchQuery, type);
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}

module.exports = RarbgSearch;
