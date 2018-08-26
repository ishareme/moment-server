'use strict';

const express = require('express')
const Admin = require('../controller/admin/admin')
const router = express.Router()

//checkToken作为中间件存在
const checkToken = require('../middleware/checkToken.js');

//管理员注册
router.post('/adminRegister', Admin.adminRegister);
//管理员登录
router.post('/adminLogin', Admin.adminLogin);
//根据token获取管理员信息
router.get('/getAdminInfo', Admin.getAdminInfo)
//获取管理员列表
router.get('/getAdminList', checkToken, Admin.getAdminList)
//修改管理员密码
router.post('/modifyAdminPassword', checkToken, Admin.modifyAdminPassword)
//修改管理员(自己)信息
router.post('/modifyAdminProfile', checkToken, Admin.modifyAdminProfile)
//更新其他管理员信息
router.post('/updateAdminInfo', checkToken, Admin.updateAdminInfo)

//增加管理员信息
router.post('/addAdmin', checkToken, Admin.addAdmin)
//获取所有管理员信息
router.get('/getAllAdmin', checkToken, Admin.getAllAdmin)


//需要先检查权限的路由
// router.get('/all', checkToken,Admin.getAllAdmin);
// router.get('/singout', Admin.singout);
// router.get('/count', Admin.getAdminCount);
// router.get('/info', Admin.getAdminInfo);
// router.post('/update/avatar/:admin_id', Admin.updateAvatar);

module.exports = router