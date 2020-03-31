const TorrentSource = require("./torrentSource");
const axios = require("axios");
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

      const { data } = await axios.get(search_url, { timeout: 10000 });
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

          torrent_content.push({
            title,
            category: "",
            seeds: Number(info[2].text),
            leechs: Number(info[3].text),
            date_added: info[4].text,
            size: info[5].text,
            torrent_verified,
            torrent_link: this.url + torrent_link
          });
        }
      }

      return this.reconstitute(torrent_content, query, type);
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}

module.exports = TorrentProject;
