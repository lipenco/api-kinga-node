module.exports = {
  db: {
    url: process.env.MONGOLAB_URI
  },
  storage: {
    name: "storage",
    connector: "loopback-component-storage",
    provider: "filesystem",
    root: "storage"
  }
};
