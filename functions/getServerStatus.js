const axios = require("axios");
const cheerio = require("cheerio");

const url = `https://www.newworld.com/en-us/support/server-status`;

module.exports = async (index) => {
  const regions = {
    0: "US EAST",
    1: "SA EAST",
    2: "EU CENTRAL",
    3: "AP SOUTHEAST",
    4: "US WEST",
  };

  if (index > 5 || index < 0) {
    return;
  }

  try {
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);
    const lastUpdated = $(".ags-ServerStatus-content-lastUpdated")
      .text()
      .trim();
    const region = $(`.ags-js-serverResponse[data-index="${index}"]`).children(
      ".ags-ServerStatus-content-responses-response-server"
    );
    servers = [];
    region.each((idx, el) => {
      server = { name: "", status: "" };
      server.name = $(el)
        .children(".ags-ServerStatus-content-responses-response-server-name")
        .text()
        .trim();
      server.status = $(el).children().children().attr("class").endsWith("up")
        ? true
        : false;
      servers.push(server);
    });
    downServers = servers
      .filter((server) => {
        if (!server.status) {
          return server;
        }
      })
      .map((s) => s.name);
    if (downServers.length === 0) {
      return [`No servers down in ${regions[index]}.`];
    } else if (downServers.length === region.length) {
      // a.k.a. maintainance check
      return [`All ${regions[index]} servers are down.`];
    } else {
      downServers.unshift(
        `Found ${region.length} servers offline.`,
        lastUpdated
      );
      return downServers;
    }
  } catch (error) {
    console.error(error);
  }
};
