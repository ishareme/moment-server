/*
*
* soundComment控制器
*
*/
//下面这两个包用来生成时间
const moment = require('moment');

const SoundCommentModel = require('../../models/comment/soundComment')
const UserModel = require('../../models/user/user')
const MessageModel = require('../../models/message/message')
const SoundArticleModel = require('../../models/article/soundArticle')

const filterText = require('../../utils/filter-text')
const xss = require("xss");

const { sendMail } = require('../../utils/email')
const emailTemplate = require('../../email-template')


function removeHtmlTag(str) {
    return str.replace(/<[^>]+>/g,"");//去掉所有的html标记
}



class SoundComment {
    constructor(){
    }
    async addSoundComment(req,res,next){
        if (!req.body) {
            res.send({
                type: 'error',
                message: '不存在更新数据',
                status: 0,
            })
            return
        }
        //评论过滤
        const content = xss(filterText(req.body.content))
        try {
            const newSoundComment = req.body.reply_to_id ? new SoundCommentModel({
                article_id: req.body.article_id,
                user_id: req.body.user_id,
                content: content,
                create_time: Date.now(),
                reply_to_id: req.body.reply_to_id
            }) : new SoundCommentModel({
                article_id: req.body.article_id,
                user_id: req.body.user_id,
                content: content,
                create_time: Date.now(),
            })
            await SoundCommentModel.create(newSoundComment)
            const newSoundArticle = await SoundArticleModel.findByIdAndUpdate(req.body.article_id, {
                '$push': {
                    comment: newSoundComment._id
                },
            }, {new: true}).populate({
                path: 'comment',
                model: 'SoundComment',
                populate: {
                    path: 'reply_to_id',
                    model: 'SoundComment',
                    populate: {
                        path: 'user_id',
                        select: {
                            password: 0, token: 0
                        },
                        model: 'User'
                    }
                }
            }).populate({
                path: 'author',
                model: 'Admin',
                populate: {
                    path: 'user_id',
                    select: {
                        password: 0, token: 0
                    },
                    model: 'User'
                }
            })
            const sender = await UserModel.findById(req.body.user_id)
            const newMessage = new MessageModel({
                content: req.body.reply_to_id ? `${sender.username}在电台文章《${newSoundArticle.title}》中回复了你` : `${sender.username}评论了你的电台文章 《${newSoundArticle.title}》`,
                type: 'reply',
                sender: sender._id,
                receiver: newSoundArticle.author.user_id._id,
                sound_article: newSoundArticle._id,
            })
            await MessageModel.create(newMessage)
            //推送消息
            io.in(newSoundArticle.author.user_id._id).emit('receive_message', newMessage);
            sendMail({
                to: newSoundArticle.author.user_id.email,
                subject: `Moment | 你有未读消息哦~`,
                text: `啦啦啦，我是卖报的小行家~~ 🤔`,
                html: emailTemplate.comment(sender, newSoundArticle, content, !!req.body.reply_to_id)
            })
            res.send({
                type: 'success',
                message: '添加评论成功',
                status: 1,
                data: newSoundComment
            });
        } catch (err) {
            console.log(err)
            res.send({
                type: 'error',
                message: '添加评论失败',
                status: 0,
            })
        }
    }

    async deleteSoundCommentById(req, res, next){
        try {
            await SoundCommentModel.findByIdAndRemove(req.query._id);
            res.send({
                type: 'success',
                message: '评论删除成功',
                status: 1,
            });
        } catch (err) {
            res.send({
                type: 'error',
                message: '评论删除失败',
                status: 0,
            })
        }
    }

    async changeSoundCommentLikesById(req, res, next){
        try {
            const updateOpt = req.body.to_like ? {
                '$inc': {
                    likes_count: 1,
                }
            } : {
                '$inc': {
                    likes_count: -1,
                }
            }
            await SoundCommentModel.findByIdAndUpdate(req.body._id, updateOpt)
            res.send({
                type: 'success',
                message: `文章点赞数修改成功`,
                status: 1,
            });
        } catch (err) {
            res.send({
                type: 'error',
                message: '文章点赞数修改失败',
                status: 0,
            })
        }
    }

}

module.exports = new SoundComment()