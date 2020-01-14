const axios = require("axios");
const cheerio = require("cheerio");

const search = async (query, eztv_url) => {
  let search_query = query.split(" ").join("-");
  let search_url = eztv_url + "/search/" + search_query;
  let data_content = {};
  let torrent_content = [];

  try {
    const { data } = await axios.get(search_url, {
      headers: {
        "User-Agent": "request"
      },
      timeout: 10000
    });
    const $ = cheerio.load(data);

    let eztv_link,
      torrent_title,
      torrent_size,
      torrent_seeds,
      torrent_leech,
      date_added;

    $("tr.forum_header_border").each((index, torrent) => {
      eztv_link = $(torrent)
        .find("a.magnet")
        .attr("href");
      torrent_title = $(torrent)
        .find("a.epinfo")
        .text();
      torrent_size = $(torrent)
        .find("a.epinfo")
        .attr("title")
        .match(/\([^)]+\)$/)[0]
        .slice(1, -1);
      torrent_seeds = $("td.forum_thread_post_end", torrent).text();
      torrent_leech = "";
      date_added = $("td.forum_thread_post_end", torrent)
        .prev()
        .text();

      data_content = {
        title: torrent_title,
        category: "",
        seeds: Number(torrent_seeds),
        leechs: torrent_leech,
        size: torrent_size,
        torrent_link: eztv_link,
        date_added: date_added
      };

      torrent_content.push(data_content);
    });
    return torrent_content;
  } catch (err) {
    throw "\u2717 There was a problem loading Eztv";
  }
};

module.exports = { search };
