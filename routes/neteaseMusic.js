'use strict';

const express = require('express')
const NeteaseMusic = require('../controller/neteaseMusic/neteaseMusic')
const router = express.Router()

//checkToken作为中间件存在
const checkToken = require('../middleware/checkToken.js');

//搜索网易云歌曲
router.get('/searchNeteaseMusic', checkToken, NeteaseMusic.searchNeteaseMusic)



//需要先检查权限的路由
// router.get('/all', checkToken,Admin.getAllAdmin);
// router.get('/singout', Admin.singout);
// router.get('/count', Admin.getAdminCount);
// router.get('/info', Admin.getAdminInfo);
// router.post('/update/avatar/:admin_id', Admin.updateAvatar);

module.exports = router