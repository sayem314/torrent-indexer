const axios = require("./lib/request");
const { parse } = require("node-html-parser");
const { sources } = require("./config");

const YtsSearch = require("./sources/yts");
const LeetxSearch = require("./sources/1337x");
const KickassSearch = require("./sources/kickass");
const EztvSearch = require("./sources/eztv");
const RarbgSearch = require("./sources/rarbg");
const SkySearch = require("./sources/skytorrents");
const ZooqleSearch = require("./sources/zooqle");
const ThePirateBaySearch = require("./sources/thepiratebay");
const LimetorrentsSearch = require("./sources/limetorrents");
const TorrentProjectSearch = require("./sources/torrentproject");

class TorrentIndexer {
  constructor(config = {}) {
    if (config.sources) {
      this.sources = { ...sources, ...config.sources };
    } else {
      this.sources = sources;
    }

    this.YTS = new YtsSearch(this.sources.yts);
    this.LEETX = new LeetxSearch(this.sources.leetx);
    this.KICKASS = new KickassSearch(this.sources.kickass);
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
        case "movies":
          results = await Promise.all([
            this.RARBG.search(query, type, page, "movies"),
            this.SKY.search(query, type, page, "movie"),
            this.TPB.search(query, type, page),
            this.TORRENTPROJECT.search(query, type, page),
            this.LEETX.search(query, type, page, "Movies"),
            this.KICKASS.search(query, type, page),
            this.YTS.search(query, type, page),
            this.LIMETORRENTS.search(query, type, page, "movies"),
            this.ZOOQLE.search(query, type, page, "Movies")
          ]);
          break;
        case "tv":
        case "series":
          results = await Promise.all([
            this.RARBG.search(query, type, page, "tv"),
            this.SKY.search(query, type, page, "show"),
            this.TPB.search(query, type, page),
            this.TORRENTPROJECT.search(query, type, page),
            this.LEETX.search(query, type, page, "TV"),
            this.KICKASS.search(query, type, page),
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
            this.KICKASS.search(query, type, page),
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
            this.KICKASS.search(query, type, page),
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
            this.KICKASS.search(query, type, page),
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

    const hash = root.querySelector(".torrenthash a");
    if (hash) {
      return hash.text;
    }

    const magnet = root
      .querySelectorAll("a")
      .map(a => {
        const href = a.attributes.href;
        if (href.startsWith("magnet:")) {
          return href;
        }
      })
      .filter(magnet => magnet)[0];

    if (magnet) {
      return magnet;
    }

    throw new Error("Unbale to extract hash or magnet");
  }

  async torrent(url) {
    try {
      const { data } = await axios.get(url);
      return this.torrentFromString(data);
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = TorrentIndexer;
