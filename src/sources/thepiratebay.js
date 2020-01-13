const TorrentSource = require("./torrentSource");
const thepiratebay = require("../lib/thepiratebay");

class ThePirateBaySearch extends TorrentSource {
  constructor(options) {
    super(options.name);
    this.url = options.url;
  }

  async search(searchQuery, type, page = 1) {
    try {
      const results = await thepiratebay.search(searchQuery, this.url, page);
      return super.reconstitute(results, searchQuery, type);
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}

module.exports = ThePirateBaySearch;
