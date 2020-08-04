const express = require("express");
var config = require("./config");
require('dotenv').config()
const app = express();
const UIDGenerator = require("uid-generator");
const uidgen = new UIDGenerator();
const bodyParser = require("body-parser");
function pick(arg, def) {
	return (typeof arg == 'undefined' ? def : arg);
 }
 //console.log(config.PORT);
 const port = pick(config.PORT,process.env.PORT);
const password = pick("defaultpass",config.password);
//const { set } = require("../config");
var api;
if(config.mode == "sequelize"){
	console.log("Loading sequelize");
	api = require("./api_squelize");
}else if(config.mode == "mongodb"){
	// Other stuff
}
api.refresh();
let tokens = new Set();

if (password == "defaultpass") {
	console.warn(
		"You are using the default password. If this server is exposed to the internet you MUST change the password otherwise anyone can crash the server easily."
	);
}
app.get("/", function(req, res) {
	res.send("Dome Media Server");
});
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
function formatResponse(data) {
	return {
		status: "ok",
		requesttime: Date.now(),
		data: data
	};
}

if(config.sessionAuth){
	var session = require("express-session");
	//app.set('trust proxy', 1) // trust first proxy
app.use(express.static('public'))
app.use(session({
  secret:process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));
}
function checkAuth(req){
	if(tokens.has(req.get("auth-token"))){
		return true;
	}
	if(config.sessionAuth){
		if(req.session){
			//console.log(req.session);
			if(tokens.has(req.session.token)){
				return true;
			}
		}
	}
	return false;
}
app.post("/auth", async function(req, res) {
	// Give a token if auth correct
	if (req.body.password == password) {
		let token = await uidgen.generate();
		tokens.add(token);
		if(config.sessionAuth){
			//console.log("Set token via session");
			req.session.token = token;
		}
		res.json({token: token, status: "ok"});
	} else {
		res.json({status: "fail"});
	}
});
app.get("/api/authstatus",async (req, res)=>{
	res.send("You are authorized "+checkAuth(req));
});
app.get("/api/get_song", async (req, res) => {
	let resp = await api.getSongByID(req.query.id);
	if(resp){
		res.json(formatResponse(resp));
	}else{
		res.json({status: "fail"});
	}
})
app.get("/api/get_album", async (req, res) => {
	let resp = await api.getSongByID(req.query.id);
	if(resp){
		res.json(formatResponse(resp));
	}else{
		res.json({status: "fail"});
	}
})
app.get("/api/get_album_by_name", async (req, res) => {
	let resp = await api.getAlbumByName(req.query.name);
	if(resp){
		res.json(formatResponse(resp));
	}else{
		res.json({status: "fail"});
	}
})
app.get("/api/search_albums_by_name", async (req, res) => {
	let resp = await api.getAlbumsByName(req.query.name);
	if(resp){
		res.json(formatResponse(resp));
	}else{
		res.json({status: "fail"});
	}
})
app.get("/api/fetch_songs", async (req, res) => {
	let resp = await api.fetchSongs(req.query);
	if(resp){
		res.json(formatResponse(resp));
	}else{
		res.json({status: "fail"});
	}
})
app.listen(port, () =>
	console.log(`Media Server up at http://localhost:${port}`)
);
