const jsonServer = require("json-server");
const fs = require("node:fs");
const path = require("node:path");

require("@next/env").loadEnvConfig(process.cwd());

const dbPath = path.join(__dirname, "db.runtime.json");
const seedPath = path.join(__dirname, "db.json");

// Restore initial database whenever the server starts
fs.copyFileSync(seedPath, dbPath);

const server = jsonServer.create();
const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Protect all database endpoints with an API key
server.use((req, res, next) => {
  const apiKey = req.headers["x-demo-api-key"];

  if (!process.env.DEMO_API_KEY || apiKey !== process.env.DEMO_API_KEY) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  next();
});

server.use(router);

const PORT = process.env.PORT || 4000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
