'use strict';

const mongoose = require('mongoose')
const chalk = require('chalk')
const config = require('../config')

mongoose.connect(config.url);

// mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.on('open', () => {
    console.log(chalk.green(`数据库连接成功 --- ${config.url}`))
});

db.on('error', (error) => {
    console.error(chalk.red(`Error in MongoDB connection: ${error}`))
});

db.on('close', () =>{
    console.log(chalk.red('数据库断开，重新连接数据库'));
    mongoose.connect(config.url, {server:{auto_reconnect:true}})
});

module.exports = db;