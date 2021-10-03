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
    var fullServers = 0;
    var downServers = 0;
    var upServers = 0;
    servers = [];
    region.each((idx, el) => {
      server = { name: "", status: "" };
      server.name = $(el)
        .children(".ags-ServerStatus-content-responses-response-server-name")
        .text()
        .trim();
      x = $(el).children().children().attr("class");
      if (x.endsWith("up")) {
        server.status = "up";
        upServers++;
      } else if (x.endsWith("full")) {
        server.status = "full";
        fullServers++;
      } else {
        server.status = "down";
        downServers++;
      }
      servers.push(server);
    });

    return [
      lastUpdated,
      `Found ${region.length} servers in ${regions[index]}.`,
      `Up: ${upServers}`,
      `Full: ${fullServers}`,
      `Down: ${downServers}`,
    ];
  } catch (error) {
    console.error(error);
  }
};
