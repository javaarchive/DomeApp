const idAutoIncrement = require("id-auto-increment");
const _ = require("lodash");
const config = require("./config");
const { Sequelize } = require("sequelize");
const assert = require("assert");
let sequelize = new Sequelize(config.database);
// Load models
let Song = require("./models/Song")(sequelize);
let Album = require("./models/Album")(sequelize);
let Playlist = require("./models/Playlist")(sequelize);
let self = {
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
			albumID: id
        });
        return songs;
    },
    createAlbum: async function(data){
        let id = await idAutoIncrement();
        let attributes = _.defaults(data, {id: id, contents: "[]"});
        let album = await Album.create(attributes);
        return album;
    },
    getAlbumByID: async function(albumID){
        let album = Album.findOne({id: albumID});
        return album;
    },
    addSong: async function(albumID, songID){
        let album = await this.getAlbumByID(albumID);
        let songsList = JSON.stringify(album.contents);
        songsList.push(songID);
        let newList = JSON.stringify(songsList);
        await User.update({ contents: newList }, {
            where: {
              id: albumID
            }
          });
    },
	refresh: async function() {
		await sequelize.sync();
	}
};

module.exports = self;