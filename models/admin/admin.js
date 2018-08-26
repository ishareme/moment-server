'use strict';
const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    token: String,
    // id: String,
	username: String,
	user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
	password: String,
	email: String,
	phone: String,
    avatar: {type: String, default: 'http://p89inamdb.bkt.clouddn.com/default_avatar.png'},
    description: {type: String, default: 'take a moment'},
	create_time: String,
	role: {type: String, default: 'admin'},
	role_name: {type: String, default: '管理员'},
	enable: {type: Boolean, default: true},
})

adminSchema.index({id: 1});

const Admin = mongoose.model('Admin', adminSchema);


module.exports = Admin
