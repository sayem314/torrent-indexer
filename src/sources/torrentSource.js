const ptt = require("parse-torrent-title");
const { compareTwoStrings } = require("string-similarity");

// score
ptt.addHandler("score", /\b(BRRip|Blu-?ray)\b/i, { value: 29 });
ptt.addHandler("score", /\bBDRip\b/i, { value: 28 });
ptt.addHandler("score", /\bDVDRip\b/i, { value: 27 });
ptt.addHandler("score", /\bDVD(?:R[0-9])?\b/i, { value: 26 });

ptt.addHandler("score", /\bWEB-?DL\b/i, { value: 25 });
ptt.addHandler("score", /\bWEB-?Rip\b/i, { value: 24 });
ptt.addHandler("score", /HDTV/i, { value: 23 });
ptt.addHandler("score", /\bPPVRip\b/i, { value: 22 });
ptt.addHandler("score", /\bTC\b/, { value: 21 });

ptt.addHandler("score", /\bHD-?Rip\b/i, { value: 20 });
ptt.addHandler("score", /\b(?:HD-?)?TVRip\b/i, { value: 19 });
ptt.addHandler("score", /\bTV-?Rip\b/i, { value: 18 });

ptt.addHandler("score", /\b(?:DL|WEB|BD|BR)MUX\b/i, { value: 17 });
ptt.addHandler("score", /\bDVDscr\b/i, { value: 16 });

class TorrentSource {
  constructor(sourceName) {
    this.sourceName = sourceName;
  }

  reconstitute(searchResults, searchQuery, type) {
    const parsedResults = [];
    searchResults.forEach(searchResult => {
      try {
        const similarity = compareTwoStrings(searchQuery, searchResult.title);
        if (similarity >= 0.2) {
          const torrentData = ptt.parse(searchResult.title);
          torrentData.fileName = searchResult.title;

          if (!torrentData.score) {
            torrentData.score = 0;
          }
          torrentData.score += Number(similarity.toFixed(3));

          if (type) {
            if (!this.isTorrentOfType(torrentData, type)) return;
          }

          if (searchResult.size) torrentData.size = searchResult.size;
          if (searchResult.torrent_verified)
            torrentData.verified = searchResult.torrent_verified;
          if (searchResult.torrent_link)
            torrentData.link = searchResult.torrent_link;

          if (!searchResult.seeds >= 1) return; // return undefined if no seeders
          torrentData.seeders = searchResult.seeds;

          if (searchResult.torrent_site)
            torrentData.site = searchResult.torrent_site;
          if (searchResult.date_added)
            torrentData.uploaded = searchResult.date_added;
          if (this.sourceName) torrentData.sourceName = this.sourceName;

          parsedResults.push(torrentData);
        }
      } catch (err) {
        console.error(err);
      }
    });

    return parsedResults;
  }

  isTorrentOfType(torrent, type) {
    const isSeries =
      torrent.episode !== null &&
      torrent.episode !== undefined &&
      torrent.episode !== "" &&
      torrent.season !== null &&
      torrent.season !== undefined &&
      torrent.season !== "";

    if (type === "series") return isSeries;
    if (type === "movie" || type === "movies") return !isSeries;
    return true;
  }
}

module.exports = TorrentSource;
