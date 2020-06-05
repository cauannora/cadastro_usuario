const {Sequelize, Model , DataTypes} = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize(
  process.env.DATABASE, 
  process.env.USUARIO_DB, 
  process.env.SENHA_DB,{
    host: process.env.HOST,
    dialect: 'mysql'
})
sequelize
  .authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso!.');
  })
  .catch(err => {
    console.error('Erro ao autênticar com o banco:', err);
  });


module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}