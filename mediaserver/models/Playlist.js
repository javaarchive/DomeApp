const { DataTypes } = require("sequelize");
module.exports = function(sequelize) {
	const Playlist= sequelize.define(
		"Playlist",
		{
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            contents:{
                type: DataTypes.STRING,
                allowNull: false
            },playlistPicture: {
                type: DataTypes.STRING,
                defaultValue: "static/BlankAlbum.png"
            },id:{
                type: DataTypes.BIGINT,
                allowNull: false
            }
		},
		{
			// Other model options go here
		}
	);
};
