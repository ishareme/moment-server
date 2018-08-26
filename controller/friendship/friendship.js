/*
*
* readingArticle控制器
*
*/
//下面这两个包用来生成时间
const moment = require('moment');

const FriendShipModel = require('../../models/friendship/friendship')
const UserModel = require('../../models/user/user')
const MessageModel = require('../../models/message/message')


const { sendMail } = require('../../utils/email')

class FriendShip {
    constructor(){
    }

    async getFriendShipById(req, res, next){
        if (!req.body) {
            res.send({
                type: 'error',
                message: '不存在查询数据',
                status: 0,
            })
            return
        }
        try {
            const friendship = await FriendShipModel.findOne({from_user: req.body.from_user, to_user: req.body.to_user})
            res.send({
                type: 'success',
                message: `查询关注情况成功`,
                status: 1,
                data: {
                    isFollowed: friendship ? true : false,
                }
            });

        } catch (err) {
            console.log(err)
            res.send({
                type: 'error',
                message: '查询关注情况失败',
                status: 0,
            })
        }
    }

    async changeFriendShipById(req, res, next){
        if (!req.body) {
            res.send({
                type: 'error',
                message: '不存在查询数据',
                status: 0,
            })
            return
        }
        try {
            if (req.body.to_follow){
                //关注
                const newFriendShip = new FriendShipModel({
                    from_user: req.body.from_user,
                    to_user: req.body.to_user,
                })
                await FriendShipModel.create(newFriendShip)
                //自己关注的
                const from_user = await UserModel.findByIdAndUpdate(req.body.from_user, {
                    '$push': {
                        following_user: req.body.to_user
                    },
                }, {new: true})
                //被关注的
                const to_user = await UserModel.findByIdAndUpdate(req.body.to_user, {
                    '$push': {
                        follower_user: req.body.from_user
                    },
                }, {new: true})
                const message = await MessageModel.find({sender: req.body.from_user, receiver: req.body.to_user, type: 'follow'})
                if (!message.length) {
                    const newMessage = new MessageModel({
                        content: `${from_user.username}关注了你`,
                        type: 'follow',
                        sender: req.body.from_user,
                        receiver: req.body.to_user,
                    })
                    await MessageModel.create(newMessage)
                    //推送消息
                    io.in(req.body.to_user).emit('receive_message', newMessage);
                }
            }
            else {
                //取消关注
                await FriendShipModel.findOneAndRemove({from_user: req.body.from_user, to_user: req.body.to_user})
                await UserModel.findByIdAndUpdate(req.body.from_user, {
                    '$pull': {
                        following_user: req.body.to_user
                    },
                })
                await UserModel.findByIdAndUpdate(req.body.to_user, {
                    '$pull': {
                        follower_user: req.body.from_user
                    },
                })
                await MessageModel.findOneAndRemove({sender: req.body.from_user, receiver: req.body.to_user, type: 'follow'})
            }
            res.send({
                type: 'success',
                message: `查询关注情况成功`,
                status: 1,
                data: {
                    isFollowed: req.body.to_follow ? true : false,
                }
            });

        } catch (err) {
            console.log(err)
            res.send({
                type: 'error',
                message: '查询关注情况失败',
                status: 0,
            })
        }
    }


}

module.exports = new FriendShip()