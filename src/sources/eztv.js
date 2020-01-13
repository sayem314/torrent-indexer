const TorrentSource = require("./torrentSource");
const eztv = require("../lib/eztv");

class EztvSearch extends TorrentSource {
  constructor(options) {
    super(options.name);
    this.url = options.url;
  }

  async search(searchQuery, type, page = 1) {
    try {
      if (page !== 1) {
        return [];
      }

      const results = await eztv.search(searchQuery, this.url);
      return this.reconstitute(results, searchQuery, type);
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}

module.exports = EztvSearch;
