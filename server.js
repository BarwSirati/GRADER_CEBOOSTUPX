const coreTotal = require("os").cpus().length;
const cluster = require("cluster");
const dotenv = require("dotenv");
dotenv.config();
if (cluster.isMaster) {
  for (let i = 0; i < coreTotal; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  const http = require("http");
  const app = require("./app");
  const server = http.createServer(app);
  const port = process.env.PORT;
  server.listen(port, () => {
    console.log(`server run on port ${port}`);
  });
}
