'use strict';

const express = require('express')
const User = require('../controller/user/user')
const router = express.Router()

//checkToken作为中间件存在
const checkToken = require('../middleware/checkToken.js');

//获取用户列表
router.get('/getUserList', checkToken, User.getUserList)
//更新用户是否可用状态
router.post('/updateUserEnable', checkToken, User.updateUserEnable)

//获取验证码
router.post('/getCode', User.getCode)
//注册
router.post('/userRegister', User.userRegister)
//登录
router.post('/userLogin', User.userLogin)
//获取用户信息
router.get('/getUserInfo', User.getUserInfo)
//更新用户信息
router.post('/updateUserInfo', checkToken, User.updateUserInfo)



//需要先检查权限的路由
// router.get('/all', checkToken,Admin.getAllAdmin);
// router.get('/singout', Admin.singout);
// router.get('/count', Admin.getAdminCount);
// router.get('/info', Admin.getAdminInfo);
// router.post('/update/avatar/:admin_id', Admin.updateAvatar);

module.exports = router