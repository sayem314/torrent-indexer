const rax = require("retry-axios");
const instance = require("axios");

// set default timeout and headers
Object.assign(instance.defaults, {
  headers: {
    "user-agent": "node.js"
  },
  timeout: 20000
});

// retry request up to 3 times
rax.attach(instance);

module.exports = instance;
