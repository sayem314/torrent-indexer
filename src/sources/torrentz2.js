const TorrentSource = require("../lib/torrentSource");
// const axios = require("axios");
// const cheerio = require("cheerio");

class Torrentz2 extends TorrentSource {
  constructor(options) {
    super(options.name);
    this.url = options.url;
  }

  async search() {
    // torrentz2 is behind cloudflare
    return [];
  }

  // async search(query, type, page = 1) {
  //   try {
  //     const search_url = `${torrentz2_url}/verifiedN?f=${encodeURIComponent(
  //       query
  //     )}&p=${page - 1}/`;
  //     const torrent_content = [];
  //
  //     const { data } = await axios.get(search_url, { timeout: 10000 });
  //     const $ = cheerio.load(data);
  //
  //     $("div.results > dl").each((index, torrents) => {
  //       let elem = $(torrents).find("span");
  //
  //       let torrent_link = $(torrents)
  //         .find("a")
  //         .attr("href");
  //
  //       if (torrent_link) {
  //         let title = $(torrents)
  //           .find("a")
  //           .text();
  //
  //         let seeds = elem.eq(3).text();
  //         let leechs = elem.eq(4).text();
  //
  //         let size = elem.eq(2).text();
  //         let date_added = elem.eq(1).text();
  //
  //         torrent_content.push({
  //           title: title,
  //           category: "",
  //           seeds: Number(seeds.replace(",", "")),
  //           leechs: Number(leechs),
  //           size: size,
  //           torrent_verified: true,
  //           torrent_link: torrent_link.replace("/", ""),
  //           date_added: date_added
  //         });
  //       }
  //     });
  //
  //     return this.reconstitute(torrent_content, query, type);
  //   } catch (err) {
  //     console.error(err);
  //     return [];
  //   }
  // }
}

module.exports = Torrentz2;
