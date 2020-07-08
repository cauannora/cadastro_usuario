const db = require('./banco')

const Usuario = db.sequelize.define('usuario', {
    name: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: db.Sequelize.STRING,
        allowNull: false        
    }
})

module.exports = Usuario;