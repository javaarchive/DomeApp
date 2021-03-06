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
		let fields = _.defaults(opts, {id:id});
		let extra_meta = await schemeHandler(opts["contentURI"]);
		console.log("Extra data found for song",extra_meta);
		fields = _.defaults(opts, extra_meta);
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
		return idList;
	},
	updatePlaylistList: async function(playlistID, newList){
		let serializedList = JSON.stringify(newList);
		let playlist = await Playlist.findOne({id: playlistID});
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
	refresh: async function(full = false) {
		/*let modelsObjects = Object.values(models);
		for(let i = 0; i < modelsObjects.length; i ++){
			await modelsObjects[i].sync();
		}*/
		await sequelize.sync();
		if(full){
			await sequelize.sync({alter: true});
		}
	}
};
if(require.main == module){
	(async function(){
	console.log("Running CLI")
	const { Command } = require('commander');
	const program = new Command();
	var AsciiTable = require('ascii-table');
	program.version('0.2.1');
	program.requiredOption('-m, --mode <modeparam>', 'execution mode', 'listsongs')
    .option('-n --object-name <objname>', 'specify name for action')
	.option('-a --object-artist <objArtistName>', 'specify artist name for action')
	.option('-c --object-content-uri <objContentURI>', 'specify content uri for action')
	.option('-f, --full', 'Full Refresh on Database (use after scheme change)')
	.option('-i, --object-identifier <objid>',"specify id for an action")
	.parse(process.argv);
	await self.refresh(program.full);
	if(program.mode == "listsongs"){
		console.log("Listing Songs");
		let songs = await self.fetchSongs({limit: 10});
		var table = new AsciiTable('Listing Songs')
		table.setHeading('Name', 'Artist', 'ID','Content URI', 'Duration');
		//table.align(AsciiTable.LEFT, '', 7);
		for(let i = 0; i < songs.length; i ++){
			table.addRow(songs[i].name, songs[i].artist, songs[i].id, songs[i].contentURI, songs[i].duration);
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
	if(program.mode == "getplaylist"){
		let playlistName = program.objectName;
		let action = {}
		action["name"] = playlistName;
		console.log("Getting playlist with args "+JSON.stringify(action));
		if(!action["name"]){
			console.error("Error: You need to specify a name");
			return;
		}
		let t = await self.getTransaction();
		try{
			let playlists = await self.fetchPlaylists(action);
			console.log(playlists);
			if(playlists.length > 1){
				console.warn("Multiple Playlists with the name were found. Printing only the first one. ")
			}else if(playlists.length == 1){
				console.log(playlists[0].contents);
			}else{
				console.log("No playlist with name found");
			}
			await t.commit();
		}catch(ex){
			console.error("Playlist fetch failed "+ex);
			await t.rollback();
		}
	}
	if(program.mode == "appendtoplaylist"){
		let playlistName = program.objectName;
		let action = {}
		action["name"] = playlistName;
		console.log("Modifying playlist with args "+JSON.stringify(action));
		if(!action["name"]){
			console.error("Error: You need to specify a name");
			return;
		}
		let t = await self.getTransaction();
		try{
			let playlists = await self.fetchPlaylists(action);
			//console.log(playlists);
			if(playlists.length > 1){
				console.error("Multiple Playlists with the name were found. Aborting!")
			}else if(playlists.length == 1){
				console.log("before add ", playlists[0].contents);
				let tempPlaylist = JSON.parse(playlists[0].contents);
				tempPlaylist.push(parseInt(program.objectIdentifier));
				await self.updatePlaylistList(playlists.id,tempPlaylist);
				console.log("after add",tempPlaylist);
			}else{
				console.log("No playlist with name found");
			}
			await t.commit();
		}catch(ex){
			console.error("Playlist fetch failed "+ex);
			await t.rollback();
		}
	}
})();
}
module.exports = self;
