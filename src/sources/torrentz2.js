const TorrentSource = require("./torrentSource");
// const torrentz2 = require("../lib/torrentz2");

class Torrentz2Search extends TorrentSource {
  constructor(options) {
    super(options.name);
    this.url = options.url;
  }

  async search() {
    // torrentz2 is behind cloudflare
    return [];
  }

  // async search(searchQuery, type, page = 1) {
  //   try {
  //     const results = await torrentz2.search(searchQuery, this.url, page);
  //     return this.reconstitute(results, searchQuery, type);
  //   } catch (err) {
  //     console.error(err);
  //     return [];
  //   }
  // }
}

module.exports = Torrentz2Search;
