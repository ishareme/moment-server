const express= require('express')

const db = require('./mongodb/db')

const config = require('./config')
const route = require('./routes')

const bodyParser = require('body-parser')   //请求体数据转成JSON
const history = require('connect-history-api-fallback')

const app = express()



app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use(history());
app.use(express.static('../dist'))


//允许跨域
app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Headers', 'X-Token, Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials','true');   // 新增
    if (req.method == 'OPTIONS') {
        res.send(200); /*让options请求快速返回*/
    }
    else {
        next();
    }
})

route(app)

const server = require('http').createServer(app);
const io = require('socket.io')(server);
global.io = io;
io.on('connection', function (socket) {
    // setTimeout(()=>{
    //     socket.emit('nodeEvent', { hello: 'world' });
    // }, 5000)
    socket.on('login_success', (data) => {
        //使用user_id作为房间号
        socket.join(data.user_id);
        console.log('login_success',data);
    });
});
io.on('disconnect', function (socket) {
    socket.emit('user disconnected');
});


server.listen(config.port, () => {
    console.log(`The server is running at http://localhost:${config.port}`);
});
