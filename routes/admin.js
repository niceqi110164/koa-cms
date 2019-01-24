/**Created by xiaoqi on 2018/6/29*/

let router = require('koa-router')();
let url = require('url');
let ueditor = require('koa2-ueditor');

//登录的权限判断
router.use(async (ctx,next)=>{
    /**ctx自带的原生的url不好用 要使用url模块的 url.parse()*/
    //console.log(ctx.url);
    //获取地址并把前面的 '/' 去掉
    let pathname = url.parse(ctx.request.url).pathname.substring(1);

    //console.log(pathname); //admin/manage/add
    // 把地址 按'/'分隔成 数组
   // console.log(pathname.split('/'));
    let urlArr = pathname.split('/');

    //配置全局的__HOST__变量来保存 地址
    ctx.state.__HOST__ = 'http://'+ctx.request.header.host;
    //配置全局的 G 变量来
    ctx.state.G = {
        url : urlArr,//保存路径数组
        userinfo : ctx.session.userinfo, //保存 登录的用户信息
        prevPage : ctx.request.headers['referer'] /**上一页的地址*/
    };
/**
    {
        userinfo:{
            _id: 5b38ac041e6c472e700ce98a,
            username: 'admin',
            password: 'e10adc3949ba59abbe56e057f20f883e'
        }
    }
 */

    if(ctx.session.userinfo){
        await next();
    }else{
        if(pathname === 'admin/login' || pathname === 'admin/login/doLogin' || pathname === 'admin/login/code'){
            await next();
        }else{
            ctx.redirect('/admin/login');
        }
        /**
         * 这个问题是 如果直接定向到login页面是死循环
         * 因为session 为undefined
         * 所以会直接重定向到 login页面 这样就是形成死循环
         *
         * 解决: 在进行判断当 路径为 /admin/login 或 /admin/doLogin 时向下执行
         *       否则 就跳转到登录页面
         *       然后进行登录操作
         * */
    }

});


let login = require('./admin/login');
let index = require('./admin/index');
let user = require('./admin/user');
let manage = require('./admin/manage');
let articleCate = require('./admin/articleCate');
let article = require('./admin/article');
let focus = require('./admin/focus');
let link = require('./admin/link');
let nav = require('./admin/nav');
let setting = require('./admin/setting');


router.use(index);
router.use('/login',login);
router.use('/manage',manage);
router.use('/articleCate',articleCate);
router.use('/article',article);
router.use('/focus',focus);
router.use('/link',link);
router.use('/nav',nav);
router.use('/setting',setting);

// 配置后台图片上传
// 需要传一个数组：静态目录和 UEditor 配置对象
// 比如要修改上传图片的类型、保存路径
router.all('/editor/controller', ueditor(['public', {
    "imageAllowFiles": [".png", ".jpg", ".jpeg"],
    "imagePathFormat": "/upload/ueditor/image/{yyyy}{mm}{dd}/{filename}"  // 保存为原文件名
}]));


module.exports = router.routes();