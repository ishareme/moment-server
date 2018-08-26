'use strict';

const express = require('express')
const filmArticle = require('../controller/filmArticle/filmArticle')
const router = express.Router()

//checkToken作为中间件存在
const checkToken = require('../middleware/checkToken.js');

//增加影视文章
router.post('/addFilmArticle', checkToken, filmArticle.addFilmArticle)
//根据id获取某篇影视文章
router.get('/getFilmArticleById', filmArticle.getFilmArticleById)
//获取所有影视文章列表
router.get('/getFilmArticleList', filmArticle.getFilmArticleList)
//更新影视文章某项数据
router.post('/updateFilmArticleInfo', checkToken, filmArticle.updateFilmArticleInfo)

//获取top推送影视文章
router.get('/getTopFilmArticle', filmArticle.getTopFilmArticle)
//增加影视文章的收藏
router.post('/changeFilmArticleCollectById', checkToken, filmArticle.changeFilmArticleCollectById)
//增加影视文章的点赞
router.post('/changeFilmArticleLikesById', checkToken, filmArticle.changeFilmArticleLikesById)
//根据用户id获取所有影视文章列表
router.get('/getFilmArticleListByUserId', filmArticle.getFilmArticleListByUserId)




//需要先检查权限的路由
// router.get('/all', checkToken,Admin.getAllAdmin);
// router.get('/singout', Admin.singout);
// router.get('/count', Admin.getAdminCount);
// router.get('/info', Admin.getAdminInfo);
// router.post('/update/avatar/:admin_id', Admin.updateAvatar);

module.exports = router