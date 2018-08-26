'use strict';

const express = require('express')
const SoundArticle = require('../controller/soundArticle/soundArticle')
const router = express.Router()

//checkToken作为中间件存在
const checkToken = require('../middleware/checkToken.js');

//增加电台文章
router.post('/addSoundArticle', checkToken, SoundArticle.addSoundArticle)
//根据id获取某篇电台文章
router.get('/getSoundArticleById', SoundArticle.getSoundArticleById)
//获取所有电台文章列表
router.get('/getSoundArticleList', SoundArticle.getSoundArticleList)
//更新电台文章某项数据
router.post('/updateSoundArticleInfo', checkToken, SoundArticle.updateSoundArticleInfo)

//获取top推送电台文章
router.get('/getTopSoundArticle', SoundArticle.getTopSoundArticle)
//增加电台文章章的收藏
router.post('/changeSoundArticleCollectById', checkToken, SoundArticle.changeSoundArticleCollectById)
//增加电台文章的点赞
router.post('/changeSoundArticleLikesById', checkToken, SoundArticle.changeSoundArticleLikesById)
//根据用户id获取所有电台读文章列表
router.get('/getSoundArticleListByUserId', SoundArticle.getSoundArticleListByUserId)




//需要先检查权限的路由
// router.get('/all', checkToken,Admin.getAllAdmin);
// router.get('/singout', Admin.singout);
// router.get('/count', Admin.getAdminCount);
// router.get('/info', Admin.getAdminInfo);
// router.post('/update/avatar/:admin_id', Admin.updateAvatar);

module.exports = router