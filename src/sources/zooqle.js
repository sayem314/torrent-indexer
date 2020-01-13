const TorrentSource = require("./torrentSource");
const zooqle = require("../lib/zooqle");

class ZooqleSearch extends TorrentSource {
  constructor(options) {
    super(options.name);
    this.url = options.url;
  }

  async search(searchQuery, type, page = 1) {
    try {
      const results = await zooqle.search(searchQuery, this.url, page);
      return this.reconstitute(results, searchQuery, type);
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}

module.exports = ZooqleSearch;
