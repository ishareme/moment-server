'use strict';

const express = require('express')
const MusicArticle = require('../controller/musicArticle/musicArticle')
const router = express.Router()

//checkToken作为中间件存在
const checkToken = require('../middleware/checkToken.js');

//增加音乐文章
router.post('/addMusicArticle', checkToken, MusicArticle.addMusicArticle)
//根据id获取某篇音乐文章
router.get('/getMusicArticleById', MusicArticle.getMusicArticleById)
//获取所有音乐文章列表
router.get('/getMusicArticleList', MusicArticle.getMusicArticleList)
//更新音乐文章某项数据
router.post('/updateMusicArticleInfo', checkToken, MusicArticle.updateMusicArticleInfo)

//获取top推送音乐文章
router.get('/getTopMusicArticle', MusicArticle.getTopMusicArticle)
//增加影视文章的收藏
router.post('/changeMusicArticleCollectById', checkToken, MusicArticle.changeMusicArticleCollectById)
//增加影视文章的喜欢
router.post('/changeMusicArticleLikesById', checkToken, MusicArticle.changeMusicArticleLikesById)
//根据用户id获取所有音乐读文章列表
router.get('/getMusicArticleListByUserId', MusicArticle.getMusicArticleListByUserId)




//需要先检查权限的路由
// router.get('/all', checkToken,Admin.getAllAdmin);
// router.get('/singout', Admin.singout);
// router.get('/count', Admin.getAdminCount);
// router.get('/info', Admin.getAdminInfo);
// router.post('/update/avatar/:admin_id', Admin.updateAvatar);

module.exports = router