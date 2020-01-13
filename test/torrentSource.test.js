const TestSource = require("./testSource");
const { expect } = require("chai");

const test = new TestSource("testSource");

describe("torrentSource -", () => {
  it("should add fileName, sourceName", async () => {
    const results = await test.search([{ title: "Test Result 2017" }]);
    expect(results[0].sourceName).to.equal("testSource");
    expect(results[0].fileName).to.equal("Test Result 2017");
  });

  describe("torrent type -", () => {
    const testResults = [
      { title: "Test Result 2017 s01e06" },
      { title: "Test Result 2017 1x10" },
      { title: "Test Result 2017" }
    ];

    it("should return type: movie", async () => {
      const results = await test.search(testResults, "movie");
      expect(results.length).to.equal(1);
      expect(Object.keys(results[0])).not.to.include("episode");
      expect(Object.keys(results[0])).not.to.include("season");
    });
    it("should return type: series", async () => {
      const results = await test.search(testResults, "series");
      expect(results.length).to.equal(2);
      expect(Object.keys(results[0])).to.include("episode");
      expect(Object.keys(results[0])).to.include("season");
      expect(Object.keys(results[1])).to.include("episode");
      expect(Object.keys(results[1])).to.include("season");
    });
    it("should ignore if type is null", async () => {
      const results = await test.search(testResults);
      expect(results.length).to.equal(3);
    });
  });
});
