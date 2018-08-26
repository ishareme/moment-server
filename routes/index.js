const admin = require('./admin')
const user = require('./user')
const readingArticle = require('./readingArticle')
const musicArticle = require('./musicArticle')
const filmArticle = require('./filmArticle')
const soundArticle = require('./soundArticle')
const imageArticle = require('./imageArticle')
const readingComment = require('./readingComment')
const filmComment = require('./filmComment')
const musicComment = require('./musicComment')
const soundComment = require('./soundComment')
const friendship = require('./friendship')


const MusicApi = require('../controller/neteaseMusic')

const {upToken} = require('../utils/qiniu')
const svgCaptcha = require('svg-captcha');

module.exports = app => {
    //七牛上传
    app.get('/api/uploadToken', (req, res, next) => {
        const token = upToken()
        res.send({
            status: 1,
            message: '上传凭证获取成功',
            upToken: token,
        })
    })

    //网易云音乐api
    app.get('/api/searchMusic', (req, res) => {
        const { vendor } = req.params
        MusicApi.searchSong('all', req.query)
            .then(data => res.json(data))
            .catch(err => res.send(err))
    })

    app.get('/api/getCaptcha', (req, res) => {
        const captcha = Math.random() * 10 > 5 ? svgCaptcha.createMathExpr({
            noise: 2,
        }) : svgCaptcha.create({
            noise: 2,
        });
        res.type('svg');
        res.status(200).send(captcha);
    })

	app.use('/api', admin);

    app.use('/api', user);

    app.use('/api', readingArticle)

    app.use('/api', musicArticle)

    app.use('/api', filmArticle)

    app.use('/api', soundArticle)

    app.use('/api', imageArticle)

    app.use('/api', readingComment)

    app.use('/api', filmComment)

    app.use('/api', musicComment)

    app.use('/api', soundComment)

    app.use('/api', friendship)


}