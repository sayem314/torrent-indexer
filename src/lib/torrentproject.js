const axios = require("axios");
const cheerio = require("cheerio");

const search = async (query, torrentproject_url, page) => {
  let search_query = query.split(" ").join("+");
  let search_url = `${torrentproject_url}/?t=${search_query}&p=${page - 1}/`;
  let data_content = {};
  let torrent_content = [];

  try {
    const { data } = await axios.get(search_url);
    const $ = cheerio.load(data);

    $("#similarfiles > div")
      .slice(1)
      .each((index, torrents) => {
        let elem = $(torrents).children();

        let torrent_verified = elem.find(".v").text();
        let torrent_site = elem.find("a").attr("href");
        let title = elem
          .eq(0)
          .text()
          .replace("⭐", "")
          .trim();
        let seeds = elem.eq(1).text();
        let leechs = elem.eq(2).text();

        let size = elem.eq(4).text();
        let date_added = elem.eq(3).text();

        data_content = {
          title: title,
          category: "",
          seeds: Number(seeds),
          leechs: Number(leechs),
          size: size,
          torrent_verified: torrent_verified ? true : false,
          torrent_site: torrentproject_url + torrent_site,
          date_added: date_added
        };

        torrent_content.push(data_content);
      });
    return torrent_content;
  } catch (err) {
    throw "\u2717 There was a problem loading TorrentProject";
  }
};

module.exports = { search };
