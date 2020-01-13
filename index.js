const torrentIndexer = require("./src/torrentIndexer");
const cheerio = require("cheerio");
const axios = require("axios");

const info = async url => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    return (
      $("a[href^=magnet]")
        .eq(0)
        .attr("href") ||
      $(".torrenthash")
        .find("a")
        .text()
    );
  } catch (err) {
    throw "There was a problem extracting " + url;
  }
};

module.exports = { search: torrentIndexer, torrent: info };
