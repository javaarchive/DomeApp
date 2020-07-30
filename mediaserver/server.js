const express = require("express");
var config = require("./config");
const app = express();
const UIDGenerator = require("uid-generator");
const uidgen = new UIDGenerator();
const bodyParser = require("body-parser");
function pick(arg, def) {
	return (typeof arg == 'undefined' ? def : arg);
 }
 const port = pick(config.PORT,process.env.PORT);
const password = pick("defaultpass",config.password);
//const { set } = require("../config");
if(config.mode == "squelize"){
	const api = require("./api_squelize");
}else if(config.mode == "mongodb"){
	// Other stuff
}
let tokens = new Set();

if (password == "defaultpass") {
	console.warn(
		"You are using the default password. If this server is exposed to the internet you MUST change the password otherwise anyone can crash the server easily."
	);
}
app.get("/", function() {
	res.send("Dome Media Server");
});
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
function formatResponse(data) {
	return {
		status: "ok",
		requesttime: Date.now().getTime(),
		data: data
	};
}
app.post("/auth", async function(req, res) {
	// Give a token if auth correct
	if (req.body.password == password) {
		let token = await uidgen.generate();
		tokens.add(token);
		res.json({token: token, status: "ok"});
	} else {
		res.json({status: "fail"});
	}
});
function checkAuth(req){
	if(tokens.has(req.get("auth-token"))){
		return true;
	}
	return false;
}
app.get("/api/get_song", async (req, res) => {

})
app.listen(port, () =>
	console.log(`Media Server up at http://localhost:${port}`)
);
