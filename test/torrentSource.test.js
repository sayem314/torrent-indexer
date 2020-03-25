const TorrentIndexer = require("../src/torrentIndexer");
const { expect } = require("chai");

const torrentIndexer = new TorrentIndexer();

describe("verify sources -", () => {
  it("each should have required property", async () => {
    const results = await torrentIndexer.search("agent");
    expect(results.length).to.be.above(10);
    results.map(t => {
      expect(t).to.be.an("object");

      expect(t).to.have.property("fileName");
      expect(t.fileName).to.be.an("string");
      expect(t.fileName.length).to.be.at.least(5);

      expect(t).to.have.property("score");
      expect(t.score).to.be.an("number");
      expect(t.score).to.be.at.least(0.1);

      expect(t).to.have.property("size");
      expect(t.size).to.be.an("string");
      expect(t.size).to.include("B");

      expect(t).to.have.any.keys("link", "site");
      if (t.link) {
        expect(t.link).to.be.an("string");
        expect(t.link).to.include(":");
      } else {
        expect(t.site).to.be.an("string");
        expect(t.site).to.include(":");
      }

      expect(t).to.have.property("seeders");
      expect(t.seeders).to.be.an("number");
      expect(t.seeders).to.be.at.least(0);

      expect(t).to.have.property("leechers");
      expect(t.leechers).to.be.an("number");
      expect(t.leechers).to.be.at.least(0);

      expect(t).to.have.property("sourceName");
      expect(t.sourceName).to.be.an("string");
    });
  }).timeout(25000);
});
