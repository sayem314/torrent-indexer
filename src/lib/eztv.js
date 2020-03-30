const axios = require("axios");
const { parse } = require("node-html-parser");

const search = async (query, eztv_url) => {
  const search_query = query.split(" ").join("-");
  const search_url = eztv_url + "/search/" + search_query;

  try {
    const torrent_content = [];
    const { data } = await axios.get(search_url, {
      headers: {
        "User-Agent": "request"
      },
      timeout: 10000
    });
    const root = parse(data).querySelectorAll("tr.forum_header_border");

    for (const element of root) {
      const title = element.querySelectorAll("a.epinfo")[0].text;
      const torrent_link = element.querySelectorAll("a.magnet")[0].attributes
        .href;
      const seeds = element.querySelectorAll("td.forum_thread_post_end")[0]
        .text;
      const info = element.querySelectorAll("td.forum_thread_post");

      torrent_content.push({
        title,
        category: "",
        seeds: Number(seeds),
        leechs: "",
        date_added: info[4].text,
        size: info[3].text,
        torrent_link
      });
    }

    return torrent_content;
  } catch (err) {
    throw "\u2717 There was a problem loading Eztv";
  }
};

module.exports = { search };
