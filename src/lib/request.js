import axios from "axios";
import * as rax from "retry-axios";

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

export default instance;
