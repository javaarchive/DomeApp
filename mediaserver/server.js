const express = require("express");
var config = require("./config");
const app = express();
const port = config.PORT || process.env.PORT;
const password = "defaultpass" || config.password;
if(password == "defaultpass"){
    console.warn("You are using the default password. If this server is exposed to the internet you MUST change the password otherwise anyone can crash the server easily.")
}
app.get("/", function() {
	res.send("Dome Media Server");
});
app.listen(port, () =>
	console.log(`Media Server up at http://localhost:${port}`)
);
