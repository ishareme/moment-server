'use strict';
const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    content: {type: String},
    type: {type: String}, //collect like comment reply follow
	sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User', },
	receiver: {type: mongoose.Schema.Types.ObjectId, ref: 'User', },
    image_article: {type: mongoose.Schema.Types.ObjectId, ref: 'ImageArticle'},
    reading_article: {type: mongoose.Schema.Types.ObjectId, ref: 'ReadingArticle'},
    film_article: {type: mongoose.Schema.Types.ObjectId, ref: 'FilmArticle'},
    music_article: {type: mongoose.Schema.Types.ObjectId, ref: 'MusicArticle'},
    sound_article: {type: mongoose.Schema.Types.ObjectId, ref: 'SoundArticle'},
	reading_comment: {type: mongoose.Schema.Types.ObjectId, ref: 'ReadingComment'},
    film_comment: {type: mongoose.Schema.Types.ObjectId, ref: 'FilmComment'},
    music_comment: {type: mongoose.Schema.Types.ObjectId, ref: 'MusicComment'},
    sound_comment: {type: mongoose.Schema.Types.ObjectId, ref: 'SoundComment'},
	is_read: {type: Boolean, default: false},
	create_time: { type: Date, default: Date.now },
})

messageSchema.index({id: 1});

const Message = mongoose.model('Message', messageSchema);


module.exports = Message
