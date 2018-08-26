/*
*
* readingArticle控制器
*
*/
const sha1 = require('sha1');
//下面这两个包用来生成时间
const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');

const ReadingArticleModel = require('../../models/article/readingArticle')
const AdminModel = require('../../models/admin/admin')
const UserModel = require('../../models/user/user')
const FriendShipModel = require('../../models/friendship/friendship')
const MessageModel = require('../../models/message/message')


const createToken = require('../../middleware/createToken')

const { sendMail } = require('../../utils/email')

function removeHtmlTag(str) {
    return str.replace(/<[^>]+>/g,"");//去掉所有的html标记
}



class ReadingArticle {
    constructor(){
    }
    async addReadingArticle(req,res,next){
        if (!req.body) {
            res.send({
                type: 'error',
                message: '不存在更新数据',
                status: 0,
            })
            return
        }
        let admin, newReadingArticle
        try {
            admin = await AdminModel.findOne({'username': req.body.author});
            newReadingArticle = new ReadingArticleModel({
                title: req.body.title,
                author: admin._id,
                author_name: req.body.author,
                abstract: req.body.abstract || removeHtmlTag(req.body.content).substring(0,25),
                content: req.body.content,
                cover_url: req.body.cover_url,
                status: req.body.status,
                share_info: {
                    title: `Moment | ${req.body.title}`,
                    description: `Moment | ${req.body.author}`,
                    imageUrl: req.body.cover_url,
                },
            })
            if (req.body.pre_release_time){
                newReadingArticle.pre_release_time = req.body.pre_release_time
            }
            await ReadingArticleModel.create(newReadingArticle)
            const emailLink = `www.momentin.cn`
            sendMail({
                to: admin.email,
                subject: `Moment | 你投稿的文章《${newReadingArticle.title}》，${newReadingArticle.status === 0 ? '以保存为草稿哦，还未发布哦~ 😕' : (newReadingArticle.status === 1 ? '正在审核当中，耐心等待哦~ 🤓' : (newReadingArticle.status === 2 ? '审核成功啦，真棒!! 👏 ' : (newReadingArticle.status === 3 ? '不好意思审核失败，可能你的文章还不适合我们，期待下次的合作~ 🤘' : (newReadingArticle.status === 4 ? '发布成功啦，正在 [阅读版块] 上线，去看看吧皮卡丘~ 😍' : '嗯嗯嗯，不知道我从哪来~'))))}`,
                text: `啦啦啦，我是卖报的小行家~~ 🤔`,
                html: `<div>
                               <div>啦啦啦，我是卖报的小行家~~ 🤔 
                               <br><br>
                               <br><br>
                               hello ${admin.author} 同学：
                               <br><br>
                               你投稿的文章《${newReadingArticle.title}》，${newReadingArticle.status === 0 ? '以保存为草稿哦，还未发布哦~ 😕' : (newReadingArticle.status === 1 ? '正在审核当中，耐心等待哦~ 🤓' : (newReadingArticle.status === 2 ? '审核成功啦，真棒!! 👏 ' : (newReadingArticle.status === 3 ? '不好意思审核失败，可能你的文章还不适合我们，期待下次的合作~ 🤘' : (newReadingArticle.status === 4 ? '发布成功啦，正在 [阅读版块] 上线，去看看吧皮卡丘~ 😍' : '嗯嗯嗯，不知道我从哪来~'))))}
                               <br><br>
                               <img src="${newReadingArticle.cover_url}" alt="">
                               <br><br>
                               感谢你对Moment的支持~~ 😀
                               </div>
                           </div>`
            })
            res.send({
                type: 'success',
                message: '添加阅读文章成功',
                status: 1,
            });
        } catch (err) {
            console.log(err)
            res.send({
                type: 'error',
                message: '添加阅读文章失败',
                status: 0,
            })
        }
    }

    async getTopReadingArticle(req, res, next){
        try {
            const topReadingArticle = await ReadingArticleModel.findOneAndUpdate({is_top: true}, {
                '$inc': {
                    views_count: 1
                }
            },{new: true})
            res.send({
                type: 'success',
                message: `查询成功`,
                status: 1,
                data: topReadingArticle
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

    async getReadingArticleById(req, res, next){
        let _id = req.query._id
        if (!_id){
            res.send({
                type: 'error',
                message: '文章id错误',
                status: 0,
            })
        }
        try {
            const readingArticle = await ReadingArticleModel.findByIdAndUpdate(_id, {
                '$inc': {
                    views_count: 1
                }
            },{new: true}).populate({
                path: 'author',
                model: 'Admin',
                populate: {
                    path: 'user_id',
                    select: {
                        password: 0, token: 0
                    },
                    model: 'User'
                }
            }).populate({
                path: 'comment',
                model: 'ReadingComment',
                populate: {
                    path: 'user_id reply_to_id',
                    select: {
                        password: 0, token: 0
                    },
                    populate: {
                        path: 'user_id',
                        select: {
                            password: 0, token: 0
                        },
                        model: 'User'
                    }
                },
            }).sort({'create_time': -1}).exec();
            res.send({
                type: 'success',
                message: `查询成功`,
                status: 1,
                data: readingArticle,
                // friendship:
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

    async getReadingArticleList(req, res, next){
        try {
            if (req.query.isWebApp){
                let current = req.query.current || 1;
                let pageSize = req.query.pageSize || 15;
                let searchKey = req.query.searchKey
                let readingArticleList,totalItems
                if (searchKey){
                    const query = {
                        title: new RegExp(searchKey),
                        status: 4,
                        enable: true,
                        pre_release_time : {
                            $lte: moment().toISOString()
                        }
                    }
                    readingArticleList = await ReadingArticleModel.find(query).sort({
                        update_time: -1
                    }).skip(Number(pageSize) * (Number(current) - 1)).limit(Number(pageSize)).populate({
                        path: 'author',
                        model: 'Admin',
                        populate: {
                            path: 'user_id',
                            select: {
                                password: 0, token: 0
                            },
                            model: 'User'
                        }
                    }).exec();
                    totalItems = await ReadingArticleModel.count(query);
                }
                else {
                    const query = {
                        status: 4,
                        enable: true,
                        pre_release_time : {
                            $lte: moment().toISOString()
                        }
                    }
                    readingArticleList = await ReadingArticleModel.find(query).sort({
                        update_time: -1
                    }).skip(Number(pageSize) * (Number(current) - 1)).limit(Number(pageSize)).populate({
                        path: 'author',
                        model: 'Admin',
                        populate: {
                            path: 'user_id',
                            select: {
                                password: 0, token: 0
                            },
                            model: 'User'
                        }
                    }).exec();
                    totalItems = await ReadingArticleModel.count(query);
                }
                res.send({
                    type: 'success',
                    message: '查询成功',
                    status: 1,
                    data: {
                        docs: readingArticleList,
                        pageInfo: {
                            totalItems,
                            current: Number(current) || 1,
                            pageSize: Number(pageSize) || 10
                        }
                    }
                })
            }
            else {
                let current = req.query.current || 1;
                let pageSize = req.query.pageSize || 10;
                let searchKey = req.query.searchKey
                let readingArticleList,totalItems
                if (searchKey){
                    let query = {}
                    query.title = new RegExp(searchKey)
                    readingArticleList = await ReadingArticleModel.find(query).sort({
                        create_time: -1
                    }).skip(Number(pageSize) * (Number(current) - 1)).limit(Number(pageSize)).populate({
                        path: 'author',
                        model: 'Admin',
                        populate: {
                            path: 'user_id',
                            select: {
                                password: 0, token: 0
                            },
                            model: 'User'
                        }
                    }).exec();
                    totalItems = await ReadingArticleModel.count(query);
                }
                else {
                    const query = !!req.query.authorId ?  {author: req.query.authorId} : {}
                    readingArticleList = await ReadingArticleModel.find(query).sort({
                        create_time: -1
                    }).skip(Number(pageSize) * (Number(current) - 1)).limit(Number(pageSize)).populate({
                        path: 'author',
                        model: 'Admin',
                        populate: {
                            path: 'user_id',
                            select: {
                                password: 0, token: 0
                            },
                            model: 'User'
                        }
                    }).exec();
                    totalItems = !!req.query.authorId ? readingArticleList.length : await ReadingArticleModel.count();
                }
                // const admin = await ReadingArticleModel.findById(readingArticleList[0]._id).populate('author', {password: 0, token: 0}).exec()
                res.send({
                    type: 'success',
                    message: '查询成功',
                    status: 1,
                    data: {
                        docs: readingArticleList,
                        pageInfo: {
                            totalItems,
                            current: Number(current) || 1,
                            pageSize: Number(pageSize) || 10
                        }
                    }
                })
            }
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

    async getReadingArticleListByUserId(req, res, next){
        try {
            let readingArticleList = await ReadingArticleModel.find({enable: true, status: 4}).populate({
                path: 'author',
                model: 'Admin',
                populate: {
                    path: 'user_id',
                    select: {
                        password: 0, token: 0
                    },
                    match: {
                        _id: req.query.user_id
                    },
                    model: 'User'
                }
            }).sort({
                create_time: -1
            }).exec();
            res.send({
                type: 'success',
                message: '查询成功',
                status: 1,
                data: {
                    docs: readingArticleList,
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

    async updateReadingArticleInfo(req,res,next){
        if (!req.body) {
            res.send({
                type: 'error',
                message: '不存在更新数据',
                status: 0,
            })
            return
        }
        try {
            //更新所有内容
            if (req.body.item === 'all'){
                let admin = await AdminModel.findOne({'username': req.body.author});
                await ReadingArticleModel.findByIdAndUpdate(req.body._id,{
                    $set: {
                        title: req.body.title,
                        author: admin._id,
                        author_name: req.body.author,
                        abstract: req.body.abstract || removeHtmlTag(req.body.content).substring(0,25),
                        content: req.body.content,
                        cover_url: req.body.cover_url,
                        status: req.body.status,
                        pre_release_time: req.body.pre_release_time || Date.now(),
                        update_time: Date.now(),
                        share_info: {
                            title: `Moment | ${req.body.title}`,
                            description: `Moment | ${req.body.author}`,
                            imageUrl: req.body.cover_url,
                        },
                    }
                })
                res.send({
                    type: 'success',
                    message: `阅读文章《${req.body.title}》更新成功`,
                    status: 1,
                });
            }
            //更新某项
            else {
                await ReadingArticleModel.findByIdAndUpdate(req.body._id, { [req.body.item]: req.body[req.body.item] });
                res.send({
                    type: 'success',
                    message: '阅读文章状态更新成功',
                    status: 1,
                });
            }

        } catch (err) {
            res.send({
                type: 'error',
                message: '阅读文章更新失败',
                status: 0,
            })
        }
    }

    async changeReadingArticleCollectById(req, res, next){
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
            const newReadingArticle = await ReadingArticleModel.findByIdAndUpdate(req.body._id, updateOpt, {new: true}).populate({
                path: 'author',
                model: 'Admin',
                populate: {
                    path: 'user_id',
                    select: {
                        password: 0, token: 0
                    },
                    model: 'User'
                }
            }).exec();
            if (req.body.to_collect){
                await UserModel.findByIdAndUpdate(req.body.user_id, {
                    '$push': {
                        collection_reading_article: req.body._id
                    },
                })
                const message = await MessageModel.find({sender: req.body.user_id, receiver: newReadingArticle.author.user_id._id, reading_article: req.body._id, type: 'collect'})
                if (!message.length) {
                    const user = await UserModel.findById(req.body.user_id)
                    const newMessage = new MessageModel({
                        content: `${user.username}收藏了你的阅读文章 《${newReadingArticle.title}》`,
                        type: 'collect',
                        sender: req.body.user_id,
                        receiver: newReadingArticle.author.user_id._id,
                        reading_article: req.body._id,
                    })
                    await MessageModel.create(newMessage)
                    //推送消息
                    console.log('newReadingArticle.author.user_id._id',newReadingArticle.author.user_id._id)
                    io.in(newReadingArticle.author.user_id._id).emit('receive_message', newMessage);
                }
            }
            else {
                await UserModel.findByIdAndUpdate(req.body.user_id, {
                    '$pull': {
                        collection_reading_article: req.body._id
                    },
                })
                await MessageModel.findOneAndRemove({sender: req.body.user_id, receiver: newReadingArticle.author.user_id._id, reading_article: req.body._id, type: 'collect'})
            }
            res.send({
                type: 'success',
                message: `阅读文章收藏修改成功`,
                status: 1,
                data: newReadingArticle
            });
        } catch (err) {
            console.log(err)
            res.send({
                type: 'error',
                message: '阅读文章收藏修改失败',
                status: 0,
            })
        }
    }

    async changeReadingArticleLikesById(req, res, next){
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
            const newReadingArticle = await ReadingArticleModel.findByIdAndUpdate(req.body._id, updateOpt, {new: true}).populate({
                path: 'author',
                model: 'Admin',
                populate: {
                    path: 'user_id',
                    select: {
                        password: 0, token: 0
                    },
                    model: 'User'
                }
            }).exec();
            res.send({
                type: 'success',
                message: `阅读文章点赞成功`,
                status: 1,
                data: newReadingArticle
            });
        } catch (err) {
            res.send({
                type: 'error',
                message: '阅读文章点赞成功',
                status: 0,
            })
        }
    }

}

module.exports = new ReadingArticle()