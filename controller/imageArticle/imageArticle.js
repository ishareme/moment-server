/*
*
* soundArticle控制器
*
*/
const sha1 = require('sha1');
const geoip = require('geoip-lite')
const filterText = require('../../utils/filter-text')
//下面这两个包用来生成时间
const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');

const ImageArticleModel = require('../../models/article/imageArticle')
const UserModel = require('../../models/user/user')
const MessageModel = require('../../models/message/message')

const createToken = require('../../middleware/createToken')

const { sendMail } = require('../../utils/email')

function removeHtmlTag(str) {
    return str.replace(/<[^>]+>/g,"");//去掉所有的html标记
}



class ImageArticle {
    constructor(){
    }
    async addImageArticle(req,res,next){
        if (!req.body) {
            res.send({
                type: 'error',
                message: '不存在更新数据',
                status: 0,
            })
            return
        }
        const ip = (req.headers['x-forwarded-for'] ||
            req.headers['x-real-ip'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress ||
            req.ip ||
            req.ips[0]).replace('::ffff:', '');
        const ip_location = geoip.lookup('119.29.68.45');
        const content = filterText(req.body.content)
        let user, newImageArticle
        try {
            user = await UserModel.findById(req.body.author_id);
            newImageArticle = new ImageArticleModel({
                author: req.body.author_id,
                content: content,
                image_url: req.body.image_url,
                ip_location: ip_location,
                share_info: {
                    title: `Moment`,
                    description: `${user.username}`,
                    link: ``,
                    imageUrl: req.body.image_url,
                },
            })
            await ImageArticleModel.create(newImageArticle)
            res.send({
                type: 'success',
                message: '添加Moment成功',
                status: 1,
            });
        } catch (err) {
            console.log(err)
            res.send({
                type: 'error',
                message: '添加Moment失败',
                status: 0,
            })
        }
    }

    async getImageArticleList(req, res, next){
        try {
            let current = req.body.current || 1
            let pageSize = req.body.pageSize || 5;
            let imageArticleList = await ImageArticleModel.find({enable: true}).sort({
                create_time: -1
            }).limit(Number(pageSize * current)).populate('author', {password: 0, token: 0}).exec();
            let totalItems = await ImageArticleModel.count()
            res.send({
                type: 'success',
                message: '查询成功',
                status: 1,
                data: {
                    docs: imageArticleList,
                    pageInfo: {
                        totalItems,
                        current: Number(current) || 1,
                        pageSize: Number(pageSize) || 5
                    }
                }
            })
        }
        catch(err) {
            console.log(err)
            res.send({
                type: 'error',
                message: '查询失败',
                status: 0,
            })
        }
    }

    async getImageArticleListByUserId(req, res, next){
        try {
            let imageArticleList = await ImageArticleModel.find({enable: true, author: req.query.user_id}).sort({
                create_time: -1
            }).populate('author', {password: 0, token: 0}).exec();
            res.send({
                type: 'success',
                message: '查询成功',
                status: 1,
                data: {
                    docs: imageArticleList,
                }
            })
        }
        catch(err) {
            console.log(err)
            res.send({
                type: 'error',
                message: '查询失败',
                status: 0,
            })
        }
    }

    async changeImageArticleCollectById(req, res, next){
        try {
            const updateOpt = req.body.to_collect ? {
                '$push': {
                    collect: req.body.user_id
                },
                '$inc': {
                    collect_count: 1,
                    views_count: 1,
                }
            } : {
                '$pull': {
                    collect: req.body.user_id
                },
                '$inc': {
                    collect_count: -1,
                    views_count: 1,
                }
            }
            const newImageArticle = await ImageArticleModel.findByIdAndUpdate(req.body._id, updateOpt, {new: true}).populate('author', {password: 0, token: 0}).exec();
            if (req.body.to_collect){
                await UserModel.findByIdAndUpdate(req.body.user_id, {
                    '$push': {
                        collection_image_article: req.body._id
                    },
                })
                const message = await MessageModel.find({sender: req.body.user_id, receiver: newImageArticle.author._id, image_article: req.body._id, type: 'collect'})
                if (!message.length) {
                    const user = await UserModel.findById(req.body.user_id)
                    const newMessage = new MessageModel({
                        content: `${user.username}收藏了你的图文 《${newImageArticle.content.slice(0,20)}》`,
                        type: 'collect',
                        sender: req.body.user_id,
                        receiver: newImageArticle.author._id,
                        image_article: req.body._id,
                    })
                    await MessageModel.create(newMessage)
                    //推送消息
                    console.log('newImageArticle.author._id',newImageArticle.author._id)
                    io.in(newImageArticle.author._id).emit('receive_message', newMessage);
                }
            }
            else {
                await UserModel.findByIdAndUpdate(req.body.user_id, {
                    '$pull': {
                        collection_image_article: req.body._id
                    },
                })
                await MessageModel.findOneAndRemove({sender: req.body.user_id, receiver: newImageArticle.author._id, image_article: req.body._id, type: 'collect'})
            }
            res.send({
                type: 'success',
                message: req.body.to_collect ? `Moment收藏成功` : `Moment取消收藏成功`,
                status: 1,
                data: newImageArticle
            });
        } catch (err) {
            console.log(err)
            res.send({
                type: 'error',
                message: req.body.to_collect ? 'Moment收藏失败' : `Moment取消收藏失败`,
                status: 0,
            })
        }
    }

    async changeImageArticleLikesById(req, res, next){
        try {
            const updateOpt = req.body.to_like ? {
                '$push': {
                    likes: req.body.user_id
                },
                '$inc': {
                    likes_count: 1,
                    views_count: 1,
                }
            } : {
                '$pull': {
                    likes: req.body.user_id
                },
                '$inc': {
                    likes_count: -1,
                    views_count: 1,
                }
            }
            const newImageArticle = await ImageArticleModel.findByIdAndUpdate(req.body._id, updateOpt, {new: true}).populate('author', {password: 0, token: 0}).exec();
            res.send({
                type: 'success',
                message: `Moment点赞成功`,
                status: 1,
                data: newImageArticle
            });
        } catch (err) {
            res.send({
                type: 'error',
                message: 'Moment点赞失败',
                status: 0,
            })
        }
    }
}

module.exports = new ImageArticle()