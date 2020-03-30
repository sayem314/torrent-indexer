const axios = require("axios");
const { parse } = require("node-html-parser");

const search = async (query, leetx_url, page, category) => {
  const search_query = query.split(" ").join("+");
  const search_url = `${leetx_url}/${
    category ? "category-search" : "search"
  }/${search_query}/${category ? category + "/" : "/"}${page}/`;

  try {
    const torrent_content = [];
    const { data } = await axios.get(search_url, { timeout: 10000 });
    const root = parse(data).querySelectorAll(".table-list tbody tr");

    for (const element of root) {
      const a = element.querySelectorAll(".name a")[1];
      const seeds = element.querySelectorAll(".seeds")[0].text;
      const leeches = element.querySelectorAll(".leeches")[0].text;
      const size = element.querySelectorAll("td.coll-4")[0].childNodes[0].text;
      const date_added = element.querySelectorAll("td.coll-date")[0].text;

      torrent_content.push({
        title: a.text.replace("⭐", "").trim(),
        category: "",
        seeds: Number(seeds),
        leechs: Number(leeches),
        date_added,
        size,
        torrent_site: leetx_url + a.attributes.href
      });
    }

    return torrent_content;
  } catch (err) {
    throw "\u2717 There was a problem loading 1337x";
  }
};

module.exports = { search };
