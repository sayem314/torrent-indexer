const rax = require("retry-axios");
const axios = require("axios");

const instance = axios.create({
  headers: {
    "user-agent": "node.js"
  },
  timeout: 20000
});

instance.defaults.raxConfig = {
  retry: 3
};

rax.attach(instance);

module.exports = instance;
