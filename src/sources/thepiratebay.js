import { parse } from "node-html-parser";

import axios from "../lib/request.js";
import TorrentSource from "../lib/torrentSource.js";
import unhumanizeSize from "../lib/unhumanizeSize.js";

class ThePirateBay extends TorrentSource {
  constructor(options) {
    super(options.name);
    this.url = options.url;
  }

  async search(query, type, page = 1) {
    try {
      const search_url = `${this.url}/search/${encodeURIComponent(
        query
      )}/${page - 1}/7/0`;
      const torrent_content = [];

      const { data } = await axios.get(search_url);
      const root = parse(data).querySelectorAll("tr");
      root.shift();
      root.pop();

      for (const element of root) {
        const a = element.querySelectorAll("a");
        const info = element.querySelectorAll("td");
        const details = element.querySelector(".detDesc");

        let fileName;
        let seeders;
        let leechers;
        let uploaded;
        let uploader;
        let size;
        let link;

        if (details) {
          const more = details.text.split(" ");
          size = more[3].replace(",", "");
          fileName = a[2].text;
          seeders = Number(info[2].text);
          leechers = Number(info[3].text);
          uploaded = more[1]
            .split(" ")
            .join("-")
            .replace(",", "");
          uploader = more[7];
          link = a[3].attributes.href;
        } else {
          const title = info[1].querySelector("a");
          const magnet = info[3].querySelector("a[href^=\"magnet:\"]");
          const uploaderLink = info[7].querySelector("a");

          fileName = title.text;
          seeders = Number(info[5].text);
          leechers = Number(info[6].text);
          uploaded = info[2].text.split(" ").join("-");
          uploader = uploaderLink ? uploaderLink.text : info[7].text;
          size = info[4].text.split(" ").join(" ");
          link = magnet.attributes.href;
        }

        torrent_content.push({
          fileName,
          seeders,
          leechers,
          uploaded,
          uploader,
          size,
          length: unhumanizeSize(size),
          link
        });
      }

      return super.reconstitute(torrent_content, query, type);
    } catch (err) {
      console.log("\u2717 There was a problem loading " + this.sourceName);
      console.error(err.message);
      return [];
    }
  }
}

export default ThePirateBay;
