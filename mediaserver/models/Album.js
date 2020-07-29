const { DataTypes } = require("sequelize");
module.exports = function(sequelize) {
	const Album= sequelize.define(
		"Album",
		{
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            contents:{
                type: DataTypes.STRING,
                allowNull: false
            },albumPicture: {
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
