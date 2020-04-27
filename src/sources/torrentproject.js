const TorrentSource = require("../lib/torrentSource");
const axios = require("../lib/request");
const unhumanizeSize = require("../lib/unhumanizeSize");
const { parse } = require("node-html-parser");

class TorrentProject extends TorrentSource {
  constructor(options) {
    super(options.name);
    this.url = options.url;
  }

  async search(query, type, page = 1) {
    try {
      const search_query = query.split(" ").join("+");
      const search_url = `${this.url}/?t=${search_query}&p=${page - 1}/`;
      const torrent_content = [];

      const { data } = await axios.get(search_url);
      const root = parse(data).querySelectorAll("div");

      for (const element of root) {
        const info = element.querySelectorAll("span");

        if (info.length === 6 || info.length === 7) {
          const title = info[0].text.replace("⭐", "").trim();
          const torrent_link = element.querySelectorAll("a")[0].attributes.href;
          const torrent_verified = element.querySelectorAll(".v").length === 1;
          if (torrent_verified) {
            info.shift();
          }
          const size = info[5].text;

          torrent_content.push({
            fileName: title,
            seeders: Number(info[2].text),
            leechers: Number(info[3].text),
            uploaded: info[4].text,
            size,
            length: unhumanizeSize(size),
            verified: torrent_verified,
            link: this.url + torrent_link
          });
        }
      }

      return this.reconstitute(torrent_content, query, type);
    } catch (err) {
      console.log("\u2717 There was a problem loading " + this.sourceName);
      console.error(err.message);
      return [];
    }
  }
}

module.exports = TorrentProject;
