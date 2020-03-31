const test = require("ava");
const { expect } = require("chai");
const TorrentSource = require("./torrentSource");

class TestSource extends TorrentSource {
  constructor(name) {
    super(name);
  }

  async search(results, type) {
    return this.reconstitute(results, results[0].fileName, type);
  }
}

const testSource = new TestSource("testSource");
const testResults = [
  { fileName: "Test Result 2017 s01e06", seeders: 1 },
  { fileName: "Test Result 2017 1x10", seeders: 1 },
  { fileName: "Test Result 2017", seeders: 1 }
];

test("should add fileName and sourceName properly", async () => {
  const results = await testSource.search([
    { fileName: "Test Result 2017", seeders: 1 }
  ]);
  expect(results[0].sourceName).to.equal("testSource");
  expect(results[0].fileName).to.equal("Test Result 2017");
});

test("should respect type: movie", async () => {
  const results = await testSource.search(testResults, "movie");
  expect(results.length).to.equal(1);
  expect(results[0].fileName).to.equal(testResults[2].fileName);
  expect(Object.keys(results[0])).not.to.include("episode");
  expect(Object.keys(results[0])).not.to.include("season");
});

test("should respect type: series", async () => {
  const results = await testSource.search(testResults, "series");
  expect(results.length).to.equal(2);

  for (const item of results) {
    expect(Object.keys(item)).to.include("episode");
    expect(Object.keys(item)).to.include("season");
  }
});

test("should respect if type: undefined", async () => {
  const results = await testSource.search(testResults);
  expect(results.length).to.equal(3);
});
