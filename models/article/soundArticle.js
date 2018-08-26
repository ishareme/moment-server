'use strict';
const mongoose = require('mongoose')
const moment = require('moment')

const Schema = mongoose.Schema;

const soundArticleSchema = new Schema({
    title: { type: String, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true},
    author_name: {type: String, required: true},
    content: {type: String, required: true},
    comment: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    status: { type: Number, default: 0}, // 0: 草稿  1：审核中  2：审核成功  3：审核失败  4、已发布
    is_top: {type: Boolean, default: false}, //是否置顶
    enable: {type: Boolean, default: true}, //是否可用
    pre_release_time: { type: Date, default: Date.now },
    create_time: { type: Date, default: Date.now },
    update_time: { type: Date, default: Date.now},
    cover_url: String,
    sound_url: {type: String, required: true},
    views_count: {type: Number, default: 0},
    likes_count: {type: Number, default: 0},
    collect_count: {type: Number, default: 0},
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    collect: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
    share_info: {
        title: String,
        description: String,
        link: String,
        imageUrl: String,
    },
})

soundArticleSchema.index({id: 1});
soundArticleSchema.path('create_time').get(function (v) {
    return moment(v).format("YYYY-MM-DD HH:mm:ss");
});
soundArticleSchema.path('update_time').get(function (v) {
    return moment(v).format("YYYY-MM-DD HH:mm:ss");
});
soundArticleSchema.path('pre_release_time').get(function (v) {
    return moment(v).format("YYYY-MM-DD HH:mm:ss");
});


const SoundArticle = mongoose.model('SoundArticle', soundArticleSchema);


module.exports = SoundArticle
