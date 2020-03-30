const axios = require("axios");
const { parse } = require("node-html-parser");

const search = async (query, skytorrents_url, page, category) => {
  const search_query = query.split(" ").join("+");
  const search_url = `${skytorrents_url}/?query=${encodeURIComponent(
    search_query
  )}${category ? "&category=" + category : ""}&page=${page}`;

  try {
    const torrent_content = [];
    const { data } = await axios.get(search_url, { timeout: 10000 });
    const root = parse(data).querySelectorAll(
      "table.table.is-striped.is-narrow tr"
    );
    root.shift();

    for (const element of root) {
      const a = element.querySelectorAll("td a");
      const info = element.querySelectorAll("td");

      torrent_content.push({
        title: a[0].text,
        category: "",
        seeds: Number(info[4].text),
        leechs: Number(info[5].text),
        date_added: info[3].text,
        size: info[1].text,
        torrent_link: a[2].attributes.href
      });
    }

    return torrent_content;
  } catch (err) {
    throw "\u2717 There was a problem loading Sky Torrents";
  }
};

module.exports = { search };
