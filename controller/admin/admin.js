/*
*
* admin控制器
*
*/
const sha1 = require('sha1');
//下面这两个包用来生成时间
const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');

const AdminModel = require('../../models/admin/admin')
const createToken = require('../../middleware/createToken')

const { sendMail } = require('../../utils/email')

class Admin {
	constructor(){
		this.adminRegister = this.adminRegister.bind(this)

        this.adminLogin = this.adminLogin.bind(this)

        this.getAdminInfo = this.getAdminInfo.bind(this)
	}
	async adminRegister(req, res, next){
        let accountName = req.body.account;
        let password = sha1(req.body.password);

        const newAdmin = new AdminModel({
            username: accountName,
            password: password,
            token: createToken(accountName),
            role: 'admin',
            role_name: '管理员'
        })
        newAdmin.create_time = moment(objectIdToTimestamp(newAdmin._id)).format('YYYY-MM-DD HH:mm:ss')
		await AdminModel.create(newAdmin)
        res.send({
            type: 'success',
            message: '注册成功',
            status: 1,
            data: {
                _id: newAdmin._id,
                username: newAdmin.username,
                token: newAdmin.token,
                avatar: newAdmin.avatar,
                create_time: newAdmin.create_time,
                role: newAdmin.role
            }
        })
	}

	async adminLogin(req, res, next){
        let username = req.body.account ? req.body.account : ``
        let password = req.body.password ? sha1(req.body.password) : ``

        if (!username || !password) {
            let msg = !admin_name ? `用户名错误` : `密码错误`
            res.send({
                type: 'error',
                message: msg,
                status: 0,
            })
            return
        }
        const admin = await AdminModel.findOne({'username': username, 'enable': true})
        if (!admin){
            res.send({
                type: 'error',
                message: '用户不存在',
                status: 0,
            })}
        else {
            if (password.toString() === admin.password.toString()){
                //生成一个新的token,并存到数据库
                let token = createToken(username);
                admin.token = token
                await new Promise((resolve, reject) => {
                    admin.save((error) => {
                        if (error) reject(error)
                        resolve()
                    })
                })
                res.send({
                    type: 'success',
                    message: '登录成功',
                    status: 1,
                    data: {
                        _id: admin._id,
                        username: admin.username,
                        avatar: admin.avatar,
                        create_time: admin.create_time,
                        token: admin.token,
                        role: admin.role,
                        email: admin.email,
                        phone: admin.phone,
                        description: admin.description
                    }
                })
            }
            else {
                res.send({
                    type: 'success',
                    message: '该用户已存在，密码输入错误',
                    status: 0,
                })
            }
        }
    }

    async getAdminInfo(req, res, next){
        let _id = req.query._id
        if (!_id){
            res.send({
                type: 'error',
                message: '用户id错误',
                status: 0,
            })
            next()
        }
        else {
            let admin
	        try {
                admin = await AdminModel.findById(_id).populate({
                    path: 'user_id',
                    select: {
                        password: 0, token: 0
                    },
                    model: 'User',
                    populate: {
                        path: 'image_article collection_image_article collection_reading_article collection_music_article collection_film_article collection_sound_article following_user follower_user',
                    }
                })
                if (!admin){
                    res.send({
                        type: 'error',
                        message: `不存在`,
                        status: 0,
                    })
                }
                else {
                    res.send({
                        type: 'success',
                        message: `查询成功`,
                        status: 1,
                        data: {
                            _id: admin._id,
                            username: admin.username,
                            avatar: admin.avatar,
                            create_time: admin.create_time,
                            token: admin.token,
                            role: admin.role,
                            description: admin.description,
                            phone: admin.phone,
                            email: admin.email,
                            user_id: admin.user_id,
                        }
                    })
                }
            } catch(error){
                console.log(error)
                res.send({
                    type: 'error',
                    message: `查询失败`,
                    status: 0,
                })
            }
        }
    }

    async modifyAdminPassword(req, res, next){
        if (!req.body) {
            res.send({
                type: 'error',
                message: '不存在更新数据',
                status: 0,
            })
            return
        }
        try {
            let user = await AdminModel.findById(req.body._id).and([{ password: sha1(req.body.oldPassword) }])
            if (user.length) {
                res.send({
                    type: 'error',
                    message: '原密码不正确',
                    status: 0,
                })
            }
            else {
                await AdminModel.findByIdAndUpdate(req.body._id, { password: sha1(req.body.newPassword) });
                res.send({
                    type: 'success',
                    message: '密码修改成功',
                    status: 1,
                });
            }

        } catch (err) {
            res.send({
                type: 'error',
                message: '原密码不正确',
                status: 0,
            })
        }
    }

    async modifyAdminProfile(req, res, next){
        if (!req.body) {
            res.send({
                type: 'error',
                message: '不存在更新数据',
                status: 0,
            })
            return
        }
        let newAdminInfo = {
            username: req.body.username,
            description: req.body.description,
            phone: req.body.phone,
            email: req.body.email,
            avatar: req.body.avatar
        }
        try {
            let user = await AdminModel.findById(req.body._id).or([{ username: newAdminInfo.username }])
            if (user.length) {
                res.send({
                    type: 'error',
                    message: '用户名存在',
                    status: 0,
                })
            }
            else {
                await AdminModel.findByIdAndUpdate(req.body._id, {
                    $set: newAdminInfo
                });
                res.send({
                    type: 'success',
                    message: '更新资料成功',
                    status: 1,
                });
            }

        } catch (err) {
            res.send({
                type: 'error',
                message: '更新资料失败',
                status: 0,
            })
        }
    }

    async updateAdminInfo(req, res, next){
	    if (!req.body) {
            res.send({
                type: 'error',
                message: '不存在更新数据',
                status: 0,
            })
            return
        }
	    let newAdminInfo = {
	        username: req.body.username,
            description: req.body.description,
            phone: req.body.phone,
            email: req.body.email,
            role_name: req.body.role_name,
            role: req.body.role_name === '管理员' ? 'admin' : (req.body.role_name === '作者' ? 'author' : ''),
            enable: req.body.enable,
        }
        try {
            let user = await AdminModel.find({
                _id: {$ne: req.body._id}
            }).or([{ username: newAdminInfo.username }])
            if (user.length) {
                res.send({
                    type: 'error',
                    message: '用户名存在',
                    status: 0,
                })
            }
            else {
                await AdminModel.findOneAndUpdate({
                    _id: req.body._id
                }, {
                    $set: newAdminInfo
                });
                res.send({
                    type: 'success',
                    message: '更新数据成功',
                    status: 1,
                });
            }

        } catch (err) {
            res.send({
                type: 'error',
                message: '更新数据失败',
                status: 0,
            })
        }
    }

    async getAdminList(req, res, next){
	    try {
            let current = req.query.current || 1;
            let pageSize = req.query.pageSize || 10;
            let searchKey = req.query.searchKey

            let adminList,totalItems
            if (searchKey){
                let query = {}
                query.username = new RegExp(searchKey)
                adminList = await AdminModel.find(query, { password: 0 , token: 0, }).sort({
                    create_time: -1
                }).skip(Number(pageSize) * (Number(current) - 1)).limit(Number(pageSize)).exec();
                totalItems = await AdminModel.count(query);
            }
            else {
                adminList = await AdminModel.find({}, { password: 0 , token: 0, }).sort({
                    create_time: -1
                }).skip(Number(pageSize) * (Number(current) - 1)).limit(Number(pageSize)).exec();
                totalItems = await AdminModel.count();
            }

            res.send({
                type: 'success',
                message: '查询成功',
                status: 1,
                data: {
                    docs: adminList,
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

    async addAdmin(req, res, next){
        const adminObj = {
            username: req.body.username,
            password: sha1('i@momentin.cn'),
            description: req.body.description,
            phone: req.body.phone,
            email: req.body.email,
            role_name: req.body.role_name,
            role: req.body.role_name === '管理员' ? 'admin' : (req.body.role_name === '作者' ? 'author' : ''),
            enable: true,
        }
        try {
            let user = await AdminModel.find().or([{ username: adminObj.username }])
            if (user.length) {
                res.send({
                    type: 'error',
                    message: '用户名存在',
                    status: 0,
                })
            } else {
                const newAdmin = new AdminModel(adminObj);
                newAdmin.create_time = moment(objectIdToTimestamp(newAdmin._id)).format('YYYY-MM-DD HH:mm:ss')
                await AdminModel.create(newAdmin);
                const emailLink = `www.momentin.cn`
                sendMail({
                    to: adminObj.email,
                    subject: `Moment为你添加一个管理员账号 👏`,
                    text: `啦啦啦，我是卖报的小行家~~ 🤔`,
                    html: `<div>
                               <div>啦啦啦，我是卖报的小行家~~ 🤔 感谢你对Moment的支持~~~ 😀</div>
                               <p>账号： ${adminObj.username} </p>
                               <p>初始密码为： i@momentin.cn</p>
                               <p>邮箱： ${adminObj.email}</p>
                               <p>手机号： ${adminObj.phone}</p>
                               <p>角色： ${adminObj.role_name}</p>
                           </div>
                           <p>请尽快更换初始密码 (๑•̀ㅂ•́)و✧ 👉 <a href="www.momentin.cn" target="_blank">[ 点击更换 ]</a></p>`
                })
                res.send({
                    type: 'success',
                    message: '添加成功',
                    status: 1,
                })
            }
        } catch (err) {
            res.send({
                type: 'error',
                message: err,
                status: 0,
            })
        }
    }

    async getAllAdmin(req, res, next){
	    let type = req.query.type
        let admin
        try {
	        let filter = {}
	        filter[type] = 1
            admin = await AdminModel.find({}, `${type}`)
            res.send({
                type: 'success',
                message: `查询成功`,
                status: 1,
                data: admin
            })
        } catch(error){
            res.send({
                type: 'error',
                message: `查询失败`,
                status: 0,
            })
        }
    }
}

module.exports = new Admin()