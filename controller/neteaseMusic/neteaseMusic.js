/*
*
* neteaseMusic控制器
*
*/
const NeteseMusic = require('simple-netease-cloud-music');


const neteseMusic = new NeteseMusic();

class Music {
    constructor(){
    }
    searchNeteaseMusic(req, res, next){
        const key = req.query.key
        console.log('key', key)
        // neteseMusic.search(key).then(data1 => {
        //     neteseMusic.url('479403027', 128).then(data2 => {
        //         res.send({
        //             type: 'success',
        //             message: '查询歌曲成功',
        //             status: 1,
        //             data1: data1,
        //             data2:data2,
        //         })
        //
        //     })
        //
        // }).catch((error) => {
        //     console.log(error)
        // })
        MusicApi.getSong()
    }
}

module.exports = new Music()
