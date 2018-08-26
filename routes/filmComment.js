'use strict';

const express = require('express')
const FilmComment = require('../controller/comment/filmComment')
const router = express.Router()

//checkToken作为中间件存在
const checkToken = require('../middleware/checkToken.js');


//增加阅读文章评论
router.post('/addFilmComment', checkToken, FilmComment.addFilmComment)
//删除阅读文章评论
router.get('/deleteFilmCommentById', checkToken, FilmComment.deleteFilmCommentById)
//改变阅读文章点赞数
router.post('/changeFilmCommentLikesById', checkToken, FilmComment.changeFilmCommentLikesById)








module.exports = router