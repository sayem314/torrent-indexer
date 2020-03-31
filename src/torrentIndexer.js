const axios = require("axios");
const { parse } = require("node-html-parser");
const { sources } = require("./config");

const YtsSearch = require("./lib/yts");
const LeetxSearch = require("./lib/1337x");
const EztvSearch = require("./lib/eztv");
const RarbgSearch = require("./lib/rarbg");
const SkySearch = require("./lib/skytorrents");
const ZooqleSearch = require("./lib/zooqle");
const ThePirateBaySearch = require("./lib/thepiratebay");
const LimetorrentsSearch = require("./lib/limetorrents");
const TorrentProjectSearch = require("./lib/torrentproject");

class TorrentIndexer {
  constructor(config = {}) {
    if (config.sources) {
      this.sources = { ...sources, ...config.sources };
    } else {
      this.sources = sources;
    }

    this.YTS = new YtsSearch(this.sources.yts);
    this.LEETX = new LeetxSearch(this.sources.leetx);
    this.EZTV = new EztvSearch(this.sources.eztv);
    this.RARBG = new RarbgSearch(this.sources.rarbg);
    this.SKY = new SkySearch(this.sources.sky);
    this.ZOOQLE = new ZooqleSearch(this.sources.zooqle);
    this.TPB = new ThePirateBaySearch(this.sources.tpb);
    this.LIMETORRENTS = new LimetorrentsSearch(this.sources.limetorrents);
    this.TORRENTPROJECT = new TorrentProjectSearch(this.sources.torrentproject);
  }

  async search(query, type, page = 1) {
    try {
      let results;
      /*eslint-disable */
      switch (type) {
        case "movie":
          results = await Promise.all([
            this.RARBG.search(query, type, page, "movies"),
            this.SKY.search(query, type, page, "movie"),
            this.TPB.search(query, type, page),
            this.TORRENTPROJECT.search(query, type, page),
            this.LEETX.search(query, type, page, "Movies"),
            this.YTS.search(query, type, page),
            this.LIMETORRENTS.search(query, type, page, "movies"),
            this.ZOOQLE.search(query, type, page, "Movies")
          ]);
          break;
        case "series":
          results = await Promise.all([
            this.RARBG.search(query, type, page, "tv"),
            this.SKY.search(query, type, page, "show"),
            this.TPB.search(query, type, page),
            this.TORRENTPROJECT.search(query, type, page),
            this.LEETX.search(query, type, page, "TV"),
            this.EZTV.search(query, type, page),
            this.LIMETORRENTS.search(query, type, page, "tv"),
            this.ZOOQLE.search(query, type, page, "TV")
          ]);
          break;
        case "anime":
          results = await Promise.all([
            this.SKY.search(query, type, page),
            this.TPB.search(query, type, page),
            this.TORRENTPROJECT.search(query, type, page),
            this.LEETX.search(query, type, page, "Anime"),
            this.LIMETORRENTS.search(query, type, page, "anime"),
            this.ZOOQLE.search(query, type, page, "Anime")
          ]);
          break;
        case "music":
          results = await Promise.all([
            this.RARBG.search(query, type, page, "2;23;24;25;26"),
            this.SKY.search(query, type, page),
            this.TPB.search(query, type, page),
            this.TORRENTPROJECT.search(query, type, page),
            this.LEETX.search(query, type, page, "Music"),
            this.LIMETORRENTS.search(query, type, page, "music")
          ]);
          break;
        default:
          results = await Promise.all([
            this.RARBG.search(query, type, page),
            this.SKY.search(query, type, page),
            this.TPB.search(query, type, page),
            this.TORRENTPROJECT.search(query, type, page),
            this.YTS.search(query, type, page),
            this.LEETX.search(query, type, page),
            this.EZTV.search(query, type, page),
            this.LIMETORRENTS.search(query, type, page),
            this.ZOOQLE.search(query, type, page)
          ]);
      }
      /* eslint-enable */
      return [].concat.apply([], results).filter(obj => obj);
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  torrentFromString(data) {
    const root = parse(data);
    return (
      root.querySelector(".torrenthash a").text ||
      root
        .querySelectorAll("a")
        .map(a => {
          const href = a.attributes.href;
          if (href.startsWith("magnet:")) {
            return href;
          }
        })
        .filter(magnet => magnet)[0]
    );
  }

  async torrent(url) {
    try {
      const { data } = await axios.get(url);
      return this.torrentFromString(data);
    } catch (err) {
      throw "There was a problem extracting " + url;
    }
  }
}

module.exports = TorrentIndexer;
