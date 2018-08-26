'use strict';

const express = require('express')
const FriendShip = require('../controller/friendship/friendship')
const router = express.Router()

//checkToken作为中间件存在
const checkToken = require('../middleware/checkToken.js');


//获取关注情况
router.post('/getFriendShipById', FriendShip.getFriendShipById)
//修改关注情况
router.post('/changeFriendShipById', checkToken, FriendShip.changeFriendShipById)










module.exports = router