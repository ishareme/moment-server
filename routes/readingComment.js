'use strict';

const express = require('express')
const ReadingComment = require('../controller/comment/readingComment')
const router = express.Router()

//checkToken作为中间件存在
const checkToken = require('../middleware/checkToken.js');


//增加阅读文章评论
router.post('/addReadingComment', checkToken, ReadingComment.addReadingComment)
//删除阅读文章评论
router.get('/deleteReadingCommentById', checkToken, ReadingComment.deleteReadingCommentById)
//改变阅读文章点赞数
router.post('/changeReadingCommentLikesById', checkToken, ReadingComment.changeReadingCommentLikesById)








module.exports = router