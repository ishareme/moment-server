'use strict';

const express = require('express')
const SoundComment = require('../controller/comment/soundComment')
const router = express.Router()

//checkToken作为中间件存在
const checkToken = require('../middleware/checkToken.js');


//增加阅读文章评论
router.post('/addSoundComment', checkToken, SoundComment.addSoundComment)
//删除阅读文章评论
router.get('/deleteSoundCommentById', checkToken, SoundComment.deleteSoundCommentById)
//改变阅读文章点赞数
router.post('/changeSoundCommentLikesById', checkToken, SoundComment.changeSoundCommentLikesById)








module.exports = router