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

  reconstitute(searchResults, query, type) {
    const parsedResults = [];
    searchResults.forEach(searchResult => {
      try {
        if (!searchResult.seeders >= 1) return; // return undefined if no seeders

        const similarity = compareTwoStrings(query, searchResult.fileName);
        if (similarity >= 0.2) {
          const torrentData = ptt.parse(searchResult.fileName);
          if (type && !this.isTorrentOfType(torrentData, type)) return;

          if (!torrentData.score) torrentData.score = 0;
          torrentData.score += Number(similarity.toFixed(3));

          // add source site name
          torrentData.sourceName = this.sourceName;

          parsedResults.push({ ...searchResult, ...torrentData });
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
