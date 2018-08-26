'use strict';
const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const friendshipSchema = new Schema({
	from_user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', },
	to_user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', },
    create_time: { type: Date, default: Date.now },
})

friendshipSchema.index({id: 1});

const FriendShip = mongoose.model('FriendShip', friendshipSchema);


module.exports = FriendShip
