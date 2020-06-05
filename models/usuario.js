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
    telefone: {
        type: db.Sequelize.STRING
    }
})

// Usuario.sync({force: true})
module.exports = Usuario