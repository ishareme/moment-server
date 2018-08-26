const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment')

const UserSchema = new Schema({
    token: String,
    is_banned: {type: Boolean, default: false}, //是否禁言
    enable: { type: Boolean, default: true }, //用户是否有效
    is_actived: {type: Boolean, default: false}, //邮件激活
    username: String,
    password: String,
    email: String,  //email唯一性
    code: String,
    email_time: {type: Date},
    phone: {type: String},
    description: { type: String, default: "这个人很懒，什么都没有留下..." },
    avatar: { type: String, default: "http://p89inamdb.bkt.clouddn.com/default_avatar.png" },
    bg_url: { type: String, default: "http://p89inamdb.bkt.clouddn.com/FkagpurBWZjB98lDrpSrCL8zeaTU"},
    ip: String,
    ip_location: { type: Object },
    agent: { type: String }, // 用户ua
    last_login_time: { type: Date },
    openid: {
        WeiChat: String,
        WeiBo: String,
        QQ: String,
    },
    create_time: { type: Date },
    // retrieve_time: { type: Number }, // 用户发送激活请求的时间
    image_article: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ImageArticle', }],
    collection_image_article: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ImageArticle', }],
    collection_reading_article: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ReadingArticle', }],
    collection_music_article: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MusicArticle', }],
    collection_film_article: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FilmArticle', }],
    collection_sound_article: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SoundArticle', }],
    following_user: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}], //关注
    follower_user: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}] //粉丝
});

UserSchema.set('toJSON', { getters: true, virtuals: true });
UserSchema.set('toObject', { getters: true, virtuals: true });

UserSchema.path('create_time').get(function (v) {
    return moment(v).format("YYYY-MM-DD HH:mm:ss");
});
UserSchema.path('last_login_time').get(function (v) {
    return moment(v).format("YYYY-MM-DD HH:mm:ss");
});

const User = mongoose.model("User", UserSchema);


module.exports = User;
