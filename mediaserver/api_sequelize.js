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
let models = {"Song": Song, "Album": Album, "Playlist": Playlist};
const validDirections = ["ASC","DESC"];
const schemeHandler = require("./schemehandler");
// console.log(self);
let self = {
	Song: Song, Playlist: Playlist, Album:Album,
	getTransaction: async function(){
		return await sequelize.transaction();
	},
	createSong: async function(opts) {
		let id = await idAutoIncrement();
		let fields = _.defaults(opts, id);
		fields = _.defaults(opts, schemeHandler(opts["contentURI"]));
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
	// Do not use get and update playlist without transaction, it may cause damage if not
	getPlaylistAsList: async function(playlistID){
		let playlist = await Playlist.find({id: playlistID});
		let idList = JSON.parse(playlist.contents);
	},
	updatePlaylistList: async function(playlistID, newList){
		let serializedList = JSON.stringify(newList);
		let playlist = await Playlist.find({id: playlistID});
		playlist.contents = serializedList;
		await playlist.save();
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
	createEmptyPlaylist: async function(name){
		let id = await idAutoIncrement();
		let opts = {}
		opts["id"] = id;
		opts["name"] = name;	
		opts["contents"] = "[]";
		await Playlist.create(opts);
	},
	addSong: async function(albumID, songID) {
		let album = await this.getAlbumByID(albumID);
		let songsList = JSON.stringify(album.contents);
		songsList.push(songID);
		let newList = JSON.stringify(songsList);
		await Playlist.update(
			{ contents: newList },
			{
				where: {
					id: albumID
				}
			}
		);
	},
	fetch: async function(type,opts){
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
		let results = await models[type].findAll(query);
		return results;
	},
	fetchSongs: function(opts){
		return self.fetch("Song",opts);
	},
	fetchPlaylists: function(opts){
		return self.fetch("Playlist",opts);
	},
	refresh: async function() {
		/*let modelsObjects = Object.values(models);
		for(let i = 0; i < modelsObjects.length; i ++){
			await modelsObjects[i].sync();
		}*/
		await sequelize.sync();
		await sequelize.sync({alter: true});
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
  	program.option('-n --object-name <objname>', 'specify name for action');
	program.option('-a --object-artist <objArtistName>', 'specify artist name for action');
	program.option('-c --object-content-uri <objContentURI>', 'specify content uri for action');
	program.parse(process.argv);
	await self.refresh();
	if(program.mode == "listsongs"){
		console.log("Listing Songs");
		let songs = await self.fetchSongs({limit: 10});
		var table = new AsciiTable('Listing Songs')
		table.setHeading('Name', 'Artist', 'ID','Content URI', 'Duration');
		//table.align(AsciiTable.LEFT, '', 7);
		for(let i = 0; i < songs.length; i ++){
			table.addRow(songs[i].name, songs[i].artist, songs[i].id, songs[i].contentURI, songs[0].duration);
		}
		console.log(table.toString());
	}
	if(program.mode == "listplaylists"){
		console.log("Listing Playlists");
		let playlists = await self.fetchPlaylists({limit: 10});
		var table = new AsciiTable('Listing Playlists')
		table.setHeading('Name', 'Playlist Picture', 'ID');
		//table.align(AsciiTable.LEFT, '', 7);
		for(let i = 0; i < playlists.length; i ++){
			table.addRow(playlists[i].name, playlists[i].playlistPicture, playlists[i].id);
		}
		console.log(table.toString());
	}
	if(program.mode == "addsong"){
		let songName = program.objectName;
		let artistName = program.objectArtist;
		let contentURI = program.objectContentUri;
		let action = {}
		action["name"] = songName;
		action["artist"] = artistName;
		action["contentURI"] = contentURI;
		console.log("Creating song with args "+JSON.stringify(action));
		if(!action["name"] || !action["artist"] || !action["contentURI"]){
			console.error("Error: You need the following name, artist, contentURI");
			return;
		}
		let t = await self.getTransaction();
		try{
			
			self.createSong(action);
			await t.commit();
			console.log('Song created successfully');
			
		}catch(ex){
			await t.rollback();
			console.error("Failed to create song")
		}
	}
	if(program.mode == "addplaylist"){
		let playlistName = program.objectName;
		let action = {}
		action["name"] = playlistName;
		console.log("Creating playlist with args "+JSON.stringify(action));
		if(!action["name"]){
			console.error("Error: You need to specify a name");
			return;
		}
		let t = await self.getTransaction();
		try{
			await self.createEmptyPlaylist(action["name"]);
			await t.commit();
			console.log('Playlist created successfully');
		}catch(ex){
			console.error("Playlist creation failed "+ex);
			await t.rollback();
		}
	}
})();
}
module.exports = self;
