const axios = require("axios");
const { parse } = require("node-html-parser");

const search = async (query, limetorrents_url, page, category) => {
  const search_query = query.split(" ").join("-");
  const search_url = `${limetorrents_url}/search/${category}/${search_query}/${page}/`;

  try {
    const torrent_content = [];
    const { data } = await axios.get(search_url, { timeout: 10000 });
    const root = parse(data).querySelectorAll(".table2 tr");
    root.shift();

    for (const element of root) {
      const title = element.querySelectorAll(".tdleft")[0].text;
      const torrent_link = element.querySelectorAll(".tt-name a")[0].attributes
        .href;
      const seeds = element.querySelectorAll("td.tdseed")[0].text;
      const leeches = element.querySelectorAll("td.tdleech")[0].text;
      const info = element.querySelectorAll("td.tdnormal");

      torrent_content.push({
        title,
        category: "",
        seeds: Number(seeds),
        leechs: Number(leeches),
        date_added: info[0].text.split(" -")[0],
        size: info[1].text,
        torrent_link
      });
    }

    return torrent_content;
  } catch (err) {
    throw "\u2717 There was a problem loading Limetorrents";
  }
};

module.exports = { search };
