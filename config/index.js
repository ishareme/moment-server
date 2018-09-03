'use strict';

module.exports = {
	port: 8888,
	url: 'mongodb://127.0.0.1:27017/moment',

    akismet: {
        key: 'your akismet Key',
        blog: 'your akismet blog site'
    },

	email: {
        account: 'your email address like : admin@momentin.cn',
        password: 'your email password'
	},

	siteInfo: {
        name: 'Moment Manage',
        version: '1.0.0',
        author: 'ShineTomorrow',
        site: 'www.momentin.cn',
        github: '',
        keyword: ['文艺类阅读App', '碎片化阅读']
    },

    qiniu: {
        accessKey: 'your access key',
        secretKey: 'your secret key',
        bucket: 'your bucket name',
        origin: 'your origin name',
        uploadURL: 'https://upload-z0.qiniup.com',  //华东
    }
}