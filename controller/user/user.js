/*
*
* Music控制器
*
*/
const http = require('http')
const sha1 = require('sha1');
const geoip = require('geoip-lite')
//下面这两个包用来生成时间
const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');

const UserModel = require('../../models/user/user')
const createToken = require('../../middleware/createToken')

const { sendMail } = require('../../utils/email')

const emailTemplate = require('../../email-template')

function queryIpInfo(ip) {
    return new Promise((resolve, reject) =>{
        let dataStr
        http.get(`http://ip.taobao.com/service/getIpInfo.php?ip=119.29.68.45`,function(res){
            res.setEncoding('utf8');
            res.on('data',function(data){
                dataStr += data;
            });
            res.on('end',function(data){
                const ip_location = JSON.parse(dataStr.split('undefined')[1])
                resolve(ip_location.data)
            });
        });
    })
}

function getCode() {
    const char = 'qwertyuiopasdfghjklzxcvbnm1234567890QWERTYUIOPASDFGHJKLZXCVBNM'
    let code = '';
    [1,1,1,1].forEach((item) => {
        code += char.charAt(Math.floor(Math.random() * char.length))
    })
    return code
}

class User {
	constructor(){
	}
    async getUserList(req, res, next){
	    try {
            // const ip = (req.headers['x-forwarded-for'] ||
            //     req.headers['x-real-ip'] ||
            //     req.connection.remoteAddress ||
            //     req.socket.remoteAddress ||
            //     req.connection.socket.remoteAddress ||
            //     req.ip ||
            //     req.ips[0]).replace('::ffff:', '')
            // const newAdmin = new UserModel({
            //     username: '就这样子吧',
            //     password: sha1('hmz5286182'),
            //     token: createToken('就这样子吧'),
            //     email: '651734877@qq.com',
            //     phone: '18203919396',
            //     agent: req.headers['user-agent'],
            //     ip: ip,
            //     ip_location: geoip.lookup(ip)
            // })
            // await UserModel.create(newAdmin)

            let current = req.query.current || 1;
            let pageSize = req.query.pageSize || 10;
            let searchKey = req.query.searchKey

            let userList,totalItems
            if (searchKey){
                let query = {}
                query.username = new RegExp(searchKey)
                userList = await UserModel.find(query, { password: 0 , token: 0, }).sort({
                    create_time: -1
                }).skip(Number(pageSize) * (Number(current) - 1)).limit(Number(pageSize)).exec();
                totalItems = await UserModel.count(query);
            }
            else {
                userList = await UserModel.find({}, { password: 0 , token: 0, }).sort({
                    create_time: -1
                }).skip(Number(pageSize) * (Number(current) - 1)).limit(Number(pageSize)).exec();
                totalItems = await UserModel.count();
            }

            res.send({
                type: 'success',
                message: '查询成功',
                status: 1,
                data: {
                    docs: userList,
                    pageInfo: {
                        totalItems,
                        current: Number(current) || 1,
                        pageSize: Number(pageSize) || 10
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

    async updateUserEnable(req,res,next){
        if (!req.body) {
            res.send({
                type: 'error',
                message: '不存在更新数据',
                status: 0,
            })
            return
        }
        try {
            await UserModel.findByIdAndUpdate(req.body._id, { enable: req.body.enable });
            res.send({
                type: 'success',
                message: '用户状态更新成功',
                status: 1,
            });
        } catch (err) {
            res.send({
                type: 'error',
                message: '用户状态更新失败',
                status: 0,
            })
        }
    }

    async getCode(req, res, next){
        const userObj = {
            email: req.body.email,
            code: getCode(),
            email_time: Date.now()
        }
        try {
            let user = await UserModel.find().or([{ email: userObj.email }])
            if (user.length === 1) {
                if (user[0].is_actived){
                    res.send({
                        type: 'error',
                        message: '邮箱已注册',
                        status: 0,
                    })
                }
                else {
                    let nTime = userObj.email_time - user[0].email_time.getTime()
                    let minute = Math.floor(nTime / 60000);
                    if (minute < 5){
                        res.send({
                            type: 'error',
                            message: '验证码在有效期内',
                            status: 1,
                        })
                    }
                    else {
                        await UserModel.findOneAndUpdate({ email:  userObj.email}, {
                            $set: userObj
                        })
                        sendMail({
                            to: userObj.email,
                            subject: `Moment | Moment 邮箱验证`,
                            text: `啦啦啦，我是卖报的小行家~~ 🤔`,
                            html: emailTemplate.code(userObj)
                        })
                        res.send({
                            type: 'success',
                            message: '邮件发送成功，请查收~',
                            status: 1,
                        })
                    }
                }
            } else {
                const newUser = new UserModel(userObj);
                await UserModel.create(newUser);
                sendMail({
                    to: userObj.email,
                    subject: `Moment | Moment 邮箱验证`,
                    text: `啦啦啦，我是卖报的小行家~~ 🤔`,
                    html: emailTemplate.code(userObj)
                })
                res.send({
                    type: 'success',
                    message: '邮件发送成功，请查收~',
                    status: 1,
                })
            }
        } catch (err) {
            console.log(err)
            res.send({
                type: 'error',
                message: '出错啦',
                status: 0,
            })
        }
    }

    async userRegister(req, res, next){
        let password = sha1(req.body.password);
        const ip = (req.headers['x-forwarded-for'] ||
            req.headers['x-real-ip'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress ||
            req.ip ||
            req.ips[0]).replace('::ffff:', '');
        const ip_location = geoip.lookup(ip);
        const agent = req.headers['user-agent'];
        const userObj = {
            email: req.body.email,  //email唯一性
            username: req.body.username,
            password: password,
            token: createToken(req.body.email),
            is_actived: true,
            ip: ip,
            ip_location: ip_location,
            agent: agent,
            create_time: Date.now(),
            last_login_time: Date.now(),
        }
        try {
            let user = await UserModel.findOne({email: userObj.email, is_actived: false})
            let nTime = Date.now() - user.email_time.getTime()
            let minute = Math.floor(nTime / 60000);
            if (minute < 5){
                if (user.code.toLowerCase() === req.body.code.toLowerCase()){
                    await UserModel.findOneAndUpdate({email: userObj.email, is_actived: false}, {
                        $set: userObj
                    })
                    res.send({
                        type: 'success',
                        message: '注册成功',
                        status: 1,
                        data: {
                            email: req.body.email,  //email唯一性
                            username: req.body.username,
                            token: createToken(req.body.email),
                            is_actived: true,
                            ip: ip,
                            ip_location: ip_location,
                            agent: agent,
                            create_time: Date.now(),
                            last_login_time: Date.now(),
                        }
                    })
                }
                else {
                    res.send({
                        type: 'error',
                        message: '验证码不正确',
                        status: 0,
                    })
                }
            }
            else {
                res.send({
                    type: 'error',
                    message: '验证码已过期',
                    status: 0,
                })
            }
        } catch (err) {
            console.log(err)
            res.send({
                type: 'error',
                message: '注册失败',
                status: 0,
            })
        }
    }

    async userLogin(req, res, next){
        const ip = (req.headers['x-forwarded-for'] ||
            req.headers['x-real-ip'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress ||
            req.ip ||
            req.ips[0]).replace('::ffff:', '');
        const ip_location = geoip.lookup('119.29.68.45');
        const agent = req.headers['user-agent'];
        try {
            const password = sha1(req.body.password)
            const user = await UserModel.findOne({email: req.body.email, is_actived: true})
            if (!user){
                res.send({
                    type: 'error',
                    message: '用户不存在',
                    status: 0,
                })}
            else {
                if (password.toString() === user.password.toString()){
                    //生成一个新的token,并存到数据库
                    const token = createToken(req.body.email)
                    // await UserModel.findOneAndUpdate({email: req.body.email, is_actived: false}, {
                    //     $set: {
                    //         token: token,
                    //         ip: ip,
                    //         ip_location: ip_location,
                    //         agent: agent,
                    //         last_login_time: Date.now(),
                    //     }
                    // })
                    user.token = token
                    user.ip = ip
                    user.ip_location = ip_location
                    user.agent = agent
                    user.last_login_time = Date.now()
                    await new Promise((resolve, reject) => {
                        user.save((error) => {
                            if (error) reject(error)
                            resolve()
                        })
                    })
                    const newUser = await UserModel.findOne({email: req.body.email, is_actived: true}, {password: 0})
                    res.send({
                        type: 'success',
                        message: '登录成功',
                        status: 1,
                        data: newUser
                    })
                }
                else {
                    res.send({
                        type: 'success',
                        message: '密码错误',
                        status: 0,
                    })
                }
            }
        } catch (err) {
            console.log(err)
            res.send({
                type: 'error',
                message: '登录失败',
                status: 0,
            })
        }
    }

    async getUserInfo(req,res,next){
        try {
            const user = await UserModel.findOne({_id: req.query._id, is_actived: true}, {password: 0}).populate({
                path: 'image_article',
                model: 'ImageArticle',
                populate: {
                    path: 'author',
                    model: 'User'
                }
            }).populate({
                path: 'collection_image_article',
                model: 'ImageArticle',
            }).populate({
                path: 'collection_reading_article',
                model: 'ReadingArticle',
            }).populate({
                path: 'collection_music_article',
                model: 'MusicArticle',
            }).populate({
                path: 'collection_film_article',
                model: 'FilmArticle',
            }).populate({
                path: 'collection_sound_article',
                model: 'SoundArticle',
            }).populate({
                path: 'following_user',
                model: 'User',
            }).populate({
                path: 'follower_user',
                model: 'User',
            }).exec();
            if (!user){
                res.send({
                    type: 'error',
                    message: '获取用户信息失败',
                    status: 0,
                })
            }
            else {
                res.send({
                    type: 'success',
                    message: '获取用户信息成功',
                    status: 1,
                    data: user
                })
            }
        } catch (err) {
            console.log(err)
            res.send({
                type: 'error',
                message: '获取用户信息失败',
                status: 0,
            })
        }
    }

    async updateUserInfo(req, res, next){
        if (!req.body) {
            res.send({
                type: 'error',
                message: '不存在更新数据',
                status: 0,
            })
            return
        }
        try {
            if (req.body.item === 'password'){
                let user = await AdminModel.findById(req.body._id).and([{ [req.body.item]: sha1(req.body[req.body.item]) }])
                if (user.length) {
                    res.send({
                        type: 'error',
                        message: '原密码不正确',
                        status: 0,
                    })
                }
                else {
                    const newUser = await UserModel.findByIdAndUpdate(req.body._id, { [req.body.item]: req.body.newPassword });
                    res.send({
                        type: 'success',
                        message: '用户状态更新成功',
                        status: 1,
                        data: newUser
                    });
                }
            }
            else {
                const newUser = await UserModel.findByIdAndUpdate(req.body._id, { [req.body.item]: req.body[req.body.item] });
                res.send({
                    type: 'success',
                    message: '用户状态更新成功',
                    status: 1,
                    data: newUser
                });
            }

        } catch (err) {
            res.send({
                type: 'error',
                message: '用户状态更新失败',
                status: 0,
            })
        }
    }
}

module.exports = new User()