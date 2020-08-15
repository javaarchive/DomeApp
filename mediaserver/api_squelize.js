const idAutoIncrement = require("id-auto-increment");
const _ = require("lodash");
const config = require("./config");
const { Sequelize, Op } = require("sequelize");
const assert = require("assert");
let sequelize = new Sequelize(config.database);
// Load models
let Song = require("./models/Song")(sequelize);
let Album = require("./models/Album")(sequelize);
let Playlist = require("./models/Playlist")(sequelize);
const validDirections = ["ASC","DESC"]
let self = {
	Song: Song, Playlist: Playlist, Album:Album,
	createSong: async function(opts) {
		let id = await idAutoIncrement();
		let fields = _.defaults(opts, id);
		let song = await Song.create(fields);
		return song;
	},
	getSongByID: async function(id) {
		return await Song.findOne({ id: id });
	},
	getSongsByName: async function(name) {
		let songs = await Song.findAll({
			name: {
				[Op.like]: name
			}
		});
		return songs;
	},
	getSongsByArtist: async function(name) {
		let songs = await Song.findAll({
			artist: {
				[Op.like]: name
			}
		});
		return songs;
	},
	getSongsByAlbumID: async function(id) {
		let songs = await Song.findAll({
			where: {
				albumID: id
			}
		});
		return songs;
	},
	createAlbum: async function(data) {
		let id = await idAutoIncrement();
		let attributes = _.defaults(data, { id: id, contents: "[]" });
		let album = await Album.create(attributes);
		return album;
	},
	getAlbumByID: async function(albumID) {
		let album = Album.findOne({
			where: { id: albumID }
		});
		return album;
	},
	getAlbumByName: async function(name) {
		let album = Album.findOne({
			where: { name: name }
		});
		return album;
	},
	getAlbumsByName: async function(name) {
		let album = Album.findAll({
			where: {
				name: {
					[Op.like]: name
				}
			}
		});
		return album;
	},
	addSong: async function(albumID, songID) {
		let album = await this.getAlbumByID(albumID);
		let songsList = JSON.stringify(album.contents);
		songsList.push(songID);
		let newList = JSON.stringify(songsList);
		await User.update(
			{ contents: newList },
			{
				where: {
					id: albumID
				}
			}
		);
	},
	fetchSongs: async function(opts){
		let query = {where:{

		}};
		if(opts.name){
			query.where.name = {[Op.like]: opts.name}
		}
		if(opts.id){
			query.where.id = opts.id;
		}
		if(opts.artist){
			query.where.artist = opts.artist;
		}
		if(opts.limit){
			query.limit = opts.limit;
		}
		if(opts.offset){
			query.offset = opts.offset;
		}
		let params = Object.keys(opts);
		for(let i = 0; i < params.length; i ++){
			if(params[i].startsWith("sort_")){
				let orderer = params[i].substr("sort_".length);
				if(validDirections.includes(opts[params[i]])){
					if(!("order" in query)){
						query["order"] = []
					}
					query["order"].push({orderer: opts[params[i]]});
				}
			}
		}
		let results = await Song.findAll(query);
		return results;
	},
	refresh: async function() {
		await sequelize.sync();
	}
};
if(require.main == module){
	(async function(){
	console.log("Running CLI")
	const { Command } = require('commander');
	const program = new Command();
	var AsciiTable = require('ascii-table');
	program.version('0.1.1');
	program
  .requiredOption('-m, --mode <modeparam>', 'execution mode', 'listsongs');
  	program.option('-on --object-name <objname>', 'specify name for action');
  	program.option('-oa --object-artist <objArtistName>', 'specify artist name for action');
	program.parse(process.argv);
	if(program.mode == "listsongs"){
		console.log("Listing Songs");
		let songs = await self.fetchSongs({limit: 10});
		var table = new AsciiTable('Listing Songs')
		table.setHeading('Name', 'Artist', 'ID');
		//table.align(AsciiTable.LEFT, '', 7);
		for(let i = 0; i < songs.length; i ++){
			table.addRow(songs[i].name, songs[i].artist, songs[i].id);
		}
		console.log(table.toString());
	}
	if(program.mode == "addsong"){
		let songName = program.objectName;
		let action = {}
		action["name"] = songName;
		
		//self.createSong({})
	}
})();
}
module.exports = self;
