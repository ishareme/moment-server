'use strict';

const express = require('express')
const ReadingArticle = require('../controller/readingArticle/readingArticle')
const router = express.Router()

//checkToken作为中间件存在
const checkToken = require('../middleware/checkToken.js');

//增加阅读文章
router.post('/addReadingArticle', checkToken, ReadingArticle.addReadingArticle)
//根据id获取某篇阅读文章
router.get('/getReadingArticleById', ReadingArticle.getReadingArticleById)
//获取所有阅读文章列表
router.get('/getReadingArticleList', ReadingArticle.getReadingArticleList)
//更新阅读文章某项数据
router.post('/updateReadingArticleInfo', checkToken, ReadingArticle.updateReadingArticleInfo)

//获取top推送阅读文章
router.get('/getTopReadingArticle', ReadingArticle.getTopReadingArticle)
//增加阅读文章的收藏
router.post('/changeReadingArticleCollectById', checkToken, ReadingArticle.changeReadingArticleCollectById)
//增加阅读文章的点赞
router.post('/changeReadingArticleLikesById', checkToken, ReadingArticle.changeReadingArticleLikesById)
//根据用户id获取所有阅读文章列表
router.get('/getReadingArticleListByUserId', ReadingArticle.getReadingArticleListByUserId)




//需要先检查权限的路由
// router.get('/all', checkToken,Admin.getAllAdmin);
// router.get('/singout', Admin.singout);
// router.get('/count', Admin.getAdminCount);
// router.get('/info', Admin.getAdminInfo);
// router.post('/update/avatar/:admin_id', Admin.updateAvatar);

module.exports = router