'use strict';
const mongoose = require('mongoose')
const moment = require('moment')

const Schema = mongoose.Schema;

const imageArticleSchema = new Schema({
    image_url: {type: String, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    content: {type: String, default: 'What are you thinking about this moment?'},
    enable: {type: Boolean, default: true}, //是否可用
    create_time: { type: Date, default: Date.now },
    views_count: {type: Number, default: 0},
    likes_count: {type: Number, default: 0},
    collect_count: {type: Number, default: 0},
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    collect: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    share_info: {
        title: String,
        description: String,
        link: String,
        imageUrl: String,
    },
    ip_location: { type: Object },
})

imageArticleSchema.index({id: 1});

imageArticleSchema.path('create_time').get(function (v) {
    return moment(v).format("YYYY-MM-DD HH:mm:ss");
});

const ImageArticle = mongoose.model('ImageArticle', imageArticleSchema);


module.exports = ImageArticle
