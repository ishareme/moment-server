'use strict';

const express = require('express')
const ImageArticle = require('../controller/imageArticle/imageArticle')
const router = express.Router()

//checkToken作为中间件存在
const checkToken = require('../middleware/checkToken.js');

//增加Moment文章
router.post('/addImageArticle', checkToken, ImageArticle.addImageArticle)
//获取Moment文章列表
router.post('/getImageArticleList', ImageArticle.getImageArticleList)
//增加Moment文章的收藏
router.post('/changeImageArticleCollectById', checkToken, ImageArticle.changeImageArticleCollectById)
//增加Moment文章的喜欢
router.post('/changeImageArticleLikesById', checkToken, ImageArticle.changeImageArticleLikesById)
//根据用户id获取文章列表
router.get('/getImageArticleListByUserId', ImageArticle.getImageArticleListByUserId)




module.exports = router