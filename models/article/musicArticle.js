'use strict';
const mongoose = require('mongoose')
const moment = require('moment')

const Schema = mongoose.Schema;

const musicArticleSchema = new Schema({
    title: { type: String, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true},
    author_name: {type: String, required: true},
    abstract: String, // 摘要
    content: {type: String, required: true},
    comment: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    status: { type: Number, default: 0}, // 0: 草稿  1：审核中  2：审核成功  3：审核失败  4、已发布
    is_top: {type: Boolean, default: false}, //是否置顶
    enable: {type: Boolean, default: true}, //是否可用
    pre_release_time: { type: Date, default: Date.now },
    create_time: { type: Date, default: Date.now },
    update_time: { type: Date, default: Date.now},
    cover_url: String,
    music_info: {
        name: {type: String, required: true},
        singer: {type: String, required: true},
        url: {type: String, required: true},
        cover: {type: String, required: true},
        avatar: {type: String, required: true},
    },
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
})

musicArticleSchema.index({id: 1});
musicArticleSchema.path('create_time').get(function (v) {
    return moment(v).format("YYYY-MM-DD HH:mm:ss");
});
musicArticleSchema.path('update_time').get(function (v) {
    return moment(v).format("YYYY-MM-DD HH:mm:ss");
});
musicArticleSchema.path('pre_release_time').get(function (v) {
    return moment(v).format("YYYY-MM-DD HH:mm:ss");
});

const MusicArticle = mongoose.model('MusicArticle', musicArticleSchema);


module.exports = MusicArticle
