module.exports = {
  apps: [
    {
      name: "fileServer",
      script: "./fileServer.js",
      watch: true,
      ignore_watch: ["node_modules"],
      watch: true,
    },
    {
      name: "server",
      script: "./server.js",
      watch: true,
      ignore_watch : ["node_modules"],
      watch: true,
    },
  ]
}
