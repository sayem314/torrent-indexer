const test = require("ava");
const TorrentIndexer = require("./torrentIndexer");
const { expect } = require("chai");

const torrentIndexer = new TorrentIndexer();

test("parse magnet", async () => {
  const magnet = await torrentIndexer.torrent(
    "https://1337x.to/torrent/4383738/Bad-Boys-for-Life-2020-1080p-WEB-DL-x265-HEVC-10bit-AAC-5-1-Q22-Joy-UTR/"
  );
  expect(magnet).to.be.an("string");
  expect(magnet).to.include("magnet:?xt=urn:btih:");
});

test("parse hash", async () => {
  const hash = await torrentIndexer.torrent(
    "https://torrentproject.cc/t3-4382526/Bad-Boys-for-Life-2020-1080p-WEBRip-5-1-YTS-YIFY-torrent.html"
  );
  expect(hash).to.be.an("string");
  expect(hash).to.equal("b17e2c6ce8d901a59b77f68781500640e5c0d917");
});
