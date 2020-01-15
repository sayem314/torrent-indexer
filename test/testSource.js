const TorrentSource = require("./../src/sources/torrentSource");

class TestSource extends TorrentSource {
  constructor(name) {
    super(name);
  }
  async search(results, type) {
    results = results.map(t => {
      t.seeds = 1;
      return t;
    });
    return super.reconstitute(results, results[0].title, type);
  }
}

module.exports = TestSource;
