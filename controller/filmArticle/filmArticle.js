/*
*
* filmArticle控制器
*
*/
const sha1 = require('sha1');
const moment = require('moment');


const FilmArticleModel = require('../../models/article/filmArticle')
const AdminModel = require('../../models/admin/admin')
const UserModel = require('../../models/user/user')
const MessageModel = require('../../models/message/message')

const createToken = require('../../middleware/createToken')

const { sendMail } = require('../../utils/email')

function removeHtmlTag(str) {
    return str.replace(/<[^>]+>/g,"");//去掉所有的html标记
}



class FilmArticle {
    constructor(){
    }
    async addFilmArticle(req,res,next){
        if (!req.body) {
            res.send({
                type: 'error',
                message: '不存在更新数据',
                status: 0,
            })
            return
        }
        let admin, newFilmArticle
        try {
            admin = await AdminModel.findOne({'username': req.body.author});
            newFilmArticle = new FilmArticleModel({
                title: req.body.title,
                author: admin._id,
                author_name: req.body.author,
                abstract: req.body.abstract || removeHtmlTag(req.body.content).substring(0,25),
                content: req.body.content,
                cover_url: req.body.cover_url,
                status: req.body.status,
                film_info: {
                    name: req.body.film_info.name,
                    quote: req.body.film_info.quote, //引用
                    film_images: req.body.film_info.film_images
                },
                share_info: {
                    title: `Moment | ${req.body.title}`,
                    description: `Moment | ${req.body.author}`,
                    imageUrl: req.body.cover_url,
                },
            })
            if (req.body.pre_release_time){
                newFilmArticle.pre_release_time = req.body.pre_release_time
            }
            await FilmArticleModel.create(newFilmArticle)
            //已发布
            const emailLink = `www.momentin.cn`
            sendMail({
                to: admin.email,
                subject: `Moment | 你投稿的文章《${newFilmArticle.title}》，${newFilmArticle.status === 0 ? '以保存为草稿哦，还未发布哦~ 😕' : (newFilmArticle.status === 1 ? '正在审核当中，耐心等待哦~ 🤓' : (newFilmArticle.status === 2 ? '审核成功啦，真棒!! 👏 ' : (newFilmArticle.status === 3 ? '不好意思审核失败，可能你的文章还不适合我们，期待下次的合作~ 🤘' : (newFilmArticle.status === 4 ? '发布成功啦，正在 [音乐版块] 上线，去看看吧皮卡丘~ 😍' : '嗯嗯嗯，不知道我从哪来~'))))}`,
                text: `啦啦啦，我是卖报的小行家~~ 🤔`,
                html: `<div>
                               <div>啦啦啦，我是卖报的小行家~~ 🤔 
                               <br><br>
                               <br><br>
                               hello ${admin.author} 同学：
                               <br><br>
                               你投稿的文章《${newFilmArticle.title}》，${newFilmArticle.status === 0 ? '以保存为草稿哦，还未发布哦~ 😕' : (newFilmArticle.status === 1 ? '正在审核当中，耐心等待哦~ 🤓' : (newFilmArticle.status === 2 ? '审核成功啦，真棒!! 👏 ' : (newFilmArticle.status === 3 ? '不好意思审核失败，可能你的文章还不适合我们，期待下次的合作~ 🤘' : (newFilmArticle.status === 4 ? '发布成功啦，正在 [音乐版块] 上线，去看看吧皮卡丘~ 😍' : '嗯嗯嗯，不知道我从哪来~'))))}
                               <br><br>
                               <img src="${newFilmArticle.cover_url}" alt="">
                               <br><br>
                               感谢你对Moment的支持~~ 😀
                               </div>
                           </div>`
            })
            res.send({
                type: 'success',
                message: '添加影视文章成功',
                status: 1,
            });
        } catch (err) {
            console.log(err)
            res.send({
                type: 'error',
                message: '添加影视文章失败',
                status: 0,
            })
        }
    }

    async getTopFilmArticle(req, res, next){
        try {
            const topFilmArticle = await FilmArticleModel.findOneAndUpdate({is_top: true}, {
                '$inc': {
                    views_count: 1
                }
            },{new: true})
            res.send({
                type: 'success',
                message: `查询成功`,
                status: 1,
                data: topFilmArticle
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

    async getFilmArticleById(req, res, next){
        let _id = req.query._id
        if (!_id){
            res.send({
                type: 'error',
                message: '用户id错误',
                status: 0,
            })
        }
        try {
            const filmArticle = await FilmArticleModel.findByIdAndUpdate(_id, {
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
                model: 'FilmComment',
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
                data: filmArticle
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

    async getFilmArticleListByUserId(req, res, next){
        try {
            let filmArticleList = await FilmArticleModel.find({enable: true, status: 4}).populate({
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
                    docs: filmArticleList,
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

    async getFilmArticleList(req, res, next){
        try {
            if (req.query.isWebApp){
                let current = req.query.current || 1;
                let pageSize = req.query.pageSize || 15;
                let searchKey = req.query.searchKey
                let filmArticleList,totalItems
                if (searchKey){
                    const query = {
                        title: new RegExp(searchKey),
                        status: 4,
                        enable: true,
                        pre_release_time : {
                            $lte: moment().toISOString()
                        }
                    }
                    filmArticleList = await FilmArticleModel.find(query).sort({
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
                    totalItems = await FilmArticleModel.count(query);
                }
                else {
                    const query = {
                        status: 4,
                        enable: true,
                        pre_release_time : {
                            $lte: moment().toISOString()
                        }
                    }
                    filmArticleList = await FilmArticleModel.find(query).sort({
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
                    totalItems = await FilmArticleModel.count(query);
                }
                res.send({
                    type: 'success',
                    message: '查询成功',
                    status: 1,
                    data: {
                        docs: filmArticleList,
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
                let filmArticleList,totalItems
                if (searchKey){
                    let query = {}
                    query.title = new RegExp(searchKey)
                    filmArticleList = await FilmArticleModel.find(query).sort({
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
                    totalItems = await FilmArticleModel.count(query);
                }
                else {
                    const query = !!req.query.authorId ?  {author: req.query.authorId} : {}
                    filmArticleList = await FilmArticleModel.find(query).sort({
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
                    totalItems = !!req.query.authorId ? filmArticleList.length : await FilmArticleModel.count();
                }
                // const admin = await FilmArticleModel.findById(filmArticleList[0]._id).populate('author', {password: 0, token: 0}).exec()
                res.send({
                    type: 'success',
                    message: '查询成功',
                    status: 1,
                    data: {
                        docs: filmArticleList,
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

    async updateFilmArticleInfo(req,res,next){
        console.log('req.body',req.body)
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
                console.log('req.body',req.body)
                await FilmArticleModel.findByIdAndUpdate(req.body._id,{
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
                        film_info: {
                            name: req.body.film_info.name,
                            quote: req.body.film_info.quote, //引用
                            film_images: req.body.film_info.film_images
                        },
                    }
                })
                res.send({
                    type: 'success',
                    message: `影视文章《${req.body.title}》更新成功`,
                    status: 1,
                });
            }
            //更新某项
            else {
                await FilmArticleModel.findByIdAndUpdate(req.body._id, { [req.body.item]: req.body[req.body.item] });
                res.send({
                    type: 'success',
                    message: '影视文章状态更新成功',
                    status: 1,
                });
            }
        } catch (err) {
            console.log(err)
            res.send({
                type: 'error',
                message: '影视文章更新失败',
                status: 0,
            })
        }
    }

    async changeFilmArticleCollectById(req, res, next){
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
            const newFilmArticle = await FilmArticleModel.findByIdAndUpdate(req.body._id, updateOpt, {new: true}).populate({
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
                        collection_film_article: req.body._id
                    },
                })
                const message = await MessageModel.find({sender: req.body.user_id, receiver: newFilmArticle.author.user_id._id, film_article: req.body._id, type: 'collect'})
                if (!message.length) {
                    const user = await UserModel.findById(req.body.user_id)
                    const newMessage = new MessageModel({
                        content: `${user.username}收藏了你的电影文章 《${newFilmArticle.title}》`,
                        type: 'collect',
                        sender: req.body.user_id,
                        receiver: newFilmArticle.author.user_id._id,
                        film_article: req.body._id,
                    })
                    await MessageModel.create(newMessage)
                    //推送消息
                    console.log('newFilmArticle.author.user_id._id',newFilmArticle.author.user_id._id)
                    io.in(newFilmArticle.author.user_id._id).emit('receive_message', newMessage);
                }
            }
            else {
                await UserModel.findByIdAndUpdate(req.body.user_id, {
                    '$pull': {
                        collection_film_article: req.body._id
                    },
                })
                await MessageModel.findOneAndRemove({sender: req.body.user_id, receiver: newFilmArticle.author.user_id._id, film_article: req.body._id, type: 'collect'})
            }
            res.send({
                type: 'success',
                message: `阅读电影收藏成功`,
                status: 1,
                data: newFilmArticle
            });
        } catch (err) {
            console.log(err)
            res.send({
                type: 'error',
                message: '阅读电影收藏失败',
                status: 0,
            })
        }
    }

    async changeFilmArticleLikesById(req, res, next){
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
            const newFilmArticle = await FilmArticleModel.findByIdAndUpdate(req.body._id, updateOpt, {new: true}).populate({
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
                message: `影视文章点赞成功`,
                status: 1,
                data: newFilmArticle
            });
        } catch (err) {
            console.log(err)
            res.send({
                type: 'error',
                message: '影视文章点赞失败',
                status: 0,
            })
        }
    }

}

module.exports = new FilmArticle()