module.exports = {
    database: {
        dialect: "sqlite",
        storage: "database.sqlite"
    },
    PORT: 3000,
    mode: "sequelize",
    sessionAuth: false,
    connEndTimeout: 1000
}