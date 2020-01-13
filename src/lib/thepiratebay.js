const axios = require("axios");
const cheerio = require("cheerio");

const search = async (query, thepiratebay_url, page) => {
  let search_url = `${thepiratebay_url}/search/${encodeURIComponent(
    query
  )}/${page - 1}/7/0`;
  let data_content = {};
  let torrent_content = [];

  try {
    const { data } = await axios.get(search_url);
    const $ = cheerio.load(data);

    $("table#searchResult tr").each((index, torrents) => {
      let torrent_title, torrent_link, torrent_verified;

      if (
        $(torrents)
          .find(".detName a")
          .text()
      ) {
        let find_torrent_title = $(torrents).find(".detName a");
        let find_torrent_seed = $(torrents)
          .find("td")
          .next()
          .next()
          .text();
        let find_torrent_leech = $(torrents)
          .find("td")
          .next()
          .next()
          .next()
          .text();
        let find_torrent_size = $(torrents).find(".detDesc");

        torrent_title = find_torrent_title.text();
        let torrent_leech = find_torrent_leech;
        let torrent_seed = find_torrent_seed.split(torrent_leech).join("");

        let matches = find_torrent_size.text().match(/, Size (.*?), ULed/g);
        let torrent_size = matches[0]
          .split(", Size ")
          .join("")
          .split(", ULed")
          .join("");
        let matches2 = find_torrent_size.text().match(/Uploaded (.*?),/g);
        let date_added = matches2[0]
          .split("Uploaded ")
          .join("")
          .split(",")
          .join("");

        let links = $(torrents).find("a");

        $(links).each((i, link) => {
          if (
            $(link)
              .attr("href")
              .indexOf("magnet:?xt=urn:") > -1
          ) {
            torrent_link = $(link).attr("href");
            // var torrent_magnet = $(link).attr('href');
            // var matches = torrent_magnet.match(/magnet:\?xt=urn:btih:(.*)&dn=/g);
            // var hash = matches[0].split('magnet:?xt=urn:btih:').join('').split('&dn=').join('');
            // torrent_link = "http://torcache.net/torrent/" + hash + ".torrent";
          }
        });

        let images = $(torrents).find("a img");

        $(images).each((i, images) => {
          if ($(images).attr("title")) {
            if (
              $(images)
                .attr("title")
                .indexOf("VIP") > -1
            ) {
              torrent_verified = "vip";
            } else if (
              $(images)
                .attr("title")
                .indexOf("Trusted") > -1
            ) {
              torrent_verified = "trusted";
            }
          } else {
            torrent_verified = "";
          }
        });

        data_content = {
          title: torrent_title,
          category: "",
          seeds: Number(torrent_seed),
          leechs: Number(torrent_leech),
          size: torrent_size,
          torrent_verified: torrent_verified,
          torrent_link: torrent_link,
          date_added: date_added
        };

        torrent_content.push(data_content);
      }
    });
    return torrent_content;
  } catch (err) {
    throw "\u2717 There was a problem loading The Pirate Bay";
  }
};

module.exports = { search };
