const YtsSearch = require("./sources/yts");
const LeetxSearch = require("./sources/1337x");
const Torrentz2Search = require("./sources/torrentz2");
const EztvSearch = require("./sources/eztv");
const RarbgSearch = require("./sources/rarbg");
const SkySearch = require("./sources/skytorrents");
const ZooqleSearch = require("./sources/zooqle");
const ThePirateBaySearch = require("./sources/thepiratebay");
const LimetorrentsSearch = require("./sources/limetorrents");
const TorrentProjectSearch = require("./sources/torrentproject");

const { sources } = require("./config");

const YTS = new YtsSearch(sources.yts);
const LEETX = new LeetxSearch(sources.leetx);
const TORRENTZ2 = new Torrentz2Search(sources.torrentz2);
const EZTV = new EztvSearch(sources.eztv);
const RARBG = new RarbgSearch(sources.rarbg);
const SKY = new SkySearch(sources.sky);
const ZOOQLE = new ZooqleSearch(sources.zooqle);
const TPB = new ThePirateBaySearch(sources.tpb);
const LIMETORRENTS = new LimetorrentsSearch(sources.limetorrents);
const TORRENTPROJECT = new TorrentProjectSearch(sources.torrentproject);

const search = async (query, type, page = 1) => {
  try {
    let results = await Promise.all([
      YTS.search(query, type, page),
      LEETX.search(query, type, page),
      TORRENTZ2.search(query, type, page),
      EZTV.search(query, type, page),
      RARBG.search(query, type, page),
      SKY.search(query, type, page),
      ZOOQLE.search(query, type, page),
      TPB.search(query, type, page),
      LIMETORRENTS.search(query, type, page),
      TORRENTPROJECT.search(query, type, page)
    ]);

    return [].concat.apply([], results).filter(obj => obj);
  } catch (err) {
    console.error(err);
    return [];
  }
};

module.exports = search;
