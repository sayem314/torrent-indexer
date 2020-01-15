const TestSource = require("./testSource");
const TorrentIndexer = require("../src/torrentIndexer");
const { expect } = require("chai");

const test = new TestSource("testSource");

describe("torrent source -", () => {
  it("should add fileName and sourceName", async () => {
    const results = await test.search([
      { title: "Test Result 2017", seeds: 1 }
    ]);
    expect(results[0].sourceName).to.equal("testSource");
    expect(results[0].fileName).to.equal("Test Result 2017");
  });
});

describe("torrent type -", () => {
  const testResults = [
    { title: "Test Result 2017 s01e06", seeds: 1 },
    { title: "Test Result 2017 1x10", seeds: 1 },
    { title: "Test Result 2017", seeds: 1 }
  ];

  it("should respect type: movie", async () => {
    const results = await test.search(testResults, "movie");
    expect(results.length).to.equal(1);
    expect(Object.keys(results[0])).not.to.include("episode");
    expect(Object.keys(results[0])).not.to.include("season");
  });
  it("should respect type: series", async () => {
    const results = await test.search(testResults, "series");
    expect(results.length).to.equal(2);
    expect(Object.keys(results[0])).to.include("episode");
    expect(Object.keys(results[0])).to.include("season");
    expect(Object.keys(results[1])).to.include("episode");
    expect(Object.keys(results[1])).to.include("season");
  });
  it("should ignore if type is undefined", async () => {
    const results = await test.search(testResults);
    expect(results.length).to.equal(3);
  });
});

describe("seeders and leechers", () => {
  const torrentIndexer = new TorrentIndexer();

  it("should include seeders and leechers property", async () => {
    const results = await torrentIndexer.search("agent");
    expect(results.length).to.be.above(10);
    results.map(t => {
      expect(t).to.have.property("seeders");
      expect(t.seeders).to.be.at.least(0);
    });
  }).timeout(20000);
});
