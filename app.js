require("dotenv").config();
const ngrok = require("ngrok");
const { exec } = require("child_process");
let counter = 0;
let exposeService = async (isExposed) => {
  console.log("Trying to expose service...");
  try {
    await ngrok
      .connect({
        proto: process.env.EXPOSE_PROTO,
        addr: process.env.EXPOSE_PORT,
        authtoken: process.env.NGROK_TOKEN,
      })
      .then(() => (isExposed = true));
  } catch {
    counter++;
    console.log("Failed " + counter + " times \n");
    exposeService(false);
  }

  if (isExposed) {
    console.log("Success!! \n");
    console.log("Updating config vars...");
    const api = ngrok.getApi();
    const tunnels = await api.get("api/tunnels");
    const data = JSON.parse(tunnels);
    let url = data.tunnels[0].public_url;
    const pathname = new URL(url);

    exec(
      `heroku config:set ` +
        `SQL_DATABASE=${process.env.SQL_DATABASE} SQL_PASS=${process.env.SQL_PASS} SQL_USER=${process.env.SQL_USER} ` +
        `NGROK_HOST=${pathname.hostname} NGROK_PORT=${pathname.port} ` +
        `-a ${process.env.HEROKU_APP}`,
      (err, stdout, stderr) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`stdout: \n${stdout}`);
          console.log(`stderr: \n${stderr}`);
        }
      }
    );
  }
};

exposeService();
