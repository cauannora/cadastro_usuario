const db = require('./banco')

const Usuario = db.sequelize.define('usuario', {
    nome: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    username: {
        type: db.Sequelize.STRING
    }
})