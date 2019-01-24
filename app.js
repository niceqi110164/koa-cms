/**Created by xiaoqi on 2018/6/29*/

// 引入koa模块
let Koa = require('koa'),
    render = require('koa-art-template'), /** 模板引擎模块*/
    path = require('path'), /** path模块*/
    session = require('koa-session'),
    bodyParser = require('koa-bodyparser'),
    jsonp = require('koa-jsonp'),
    sd = require('silly-datetime'), /**art-template 自定义日期管道*/
    serve = require('koa-static'), /** 静态目录模块*/
    api = require('./routes/api'), /** api模块*/
    index = require('./routes/index'), /** 前台首页模块*/
    admin = require('./routes/admin'), /** 后台管理模块*/
    cors = require('koa2-cors'), /**后台跨域模块*/
    router = require('koa-router')();
/** 引入实例化路由 **推荐*/

// 实例化
let app = new Koa();

//配置后台跨域模块
app.use(cors());

//配置jsonp
app.use(jsonp());

//koa-bodyparser
app.use(bodyParser());

//配置session
app.keys = ['some secret hurr'];

const CONFIG = {
    key: 'koa:sess',
    maxAge: 86400000,
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: true,
    renew: false,
};
app.use(session(CONFIG, app));

//配置koa-art-template模板引擎
render(app, {
    root: path.join(__dirname, 'views'), /**视图位置*/
    extname: '.html', /**后缀名*/
    debug: process.env.NODE_ENV !== 'production',
    dateFormat:dateFormat=function(value){
        return sd.format(value, 'YYYY-MM-DD HH:mm');
    } /*扩展模板里面的方法*/
});

//配置静态文件  http://127.0.0.1:3000/static/css/basic.css
app.use(serve(__dirname + '/public'));
//配置图片静态目录 http://127.0.0.1:3000/upload/1531048505427.jpg
app.use(serve(__dirname + '/public/upload'));
//配置轮播图的静态文件地址
app.use(serve(__dirname + '/public/focus'));

//配置中间件  设置全局数据
router.use(async (ctx,next)=>{

    //console.log(ctx.request.header.host);
    ctx.state.__HOST__ = 'http://'+ctx.request.header.host;
    await next();
});


// 当输入 /api 时,调用 /api子路由
router.use('/api', api);

// 当输入 /admin 时,调用 /admin子路由
router.use('/admin', admin);

// 当输入 / 时,调用 /index子路由
router.use(index);


router.get('/', async (ctx) => {
    ctx.body = '首页'
});


app.use(router.routes());
app.use(router.allowedMethods());
// 监听端口
app.listen(3000, () => {
    console.log('http://127.0.0.1:3000');
});