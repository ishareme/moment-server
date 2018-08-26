'use strict';

const express = require('express')
const MusicComment = require('../controller/comment/musicComment')
const router = express.Router()

//checkToken作为中间件存在
const checkToken = require('../middleware/checkToken.js');


//增加阅读文章评论
router.post('/addMusicComment', checkToken, MusicComment.addMusicComment)
//删除阅读文章评论
router.get('/deleteMusicCommentById', checkToken, MusicComment.deleteMusicCommentById)
//改变阅读文章点赞数
router.post('/changeMusicCommentLikesById', checkToken, MusicComment.changeMusicCommentLikesById)








module.exports = router