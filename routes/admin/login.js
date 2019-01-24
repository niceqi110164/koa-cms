/**Created by xiaoqi on 2018/6/29*/

let router = require('koa-router')(),
    svgCaptcha = require('svg-captcha'), /**验证码模块*/
    tools = require('../../model/tools'),
    DB = require('../../model/db'),
    Config = require('../../model/config');

//登录页面
router.get('/', async (ctx) => {
    await ctx.render('admin/login');
});


//登录权限判断 必须时post提交
router.post('/doLogin', async (ctx) => {
    //request请求
    //console.log(ctx.request.body);
    /**用户名*/
    let username = ctx.request.body.username;
    /**密码*/
    let password = tools.getMd5(ctx.request.body.password);
    /**验证码*/
    let code = ctx.request.body.code;
    //console.log(code);
    /**
     1. 验证用户密码是否合法

     2. 去数据库匹配

     3.成功以后把用户信息写入session
     */

    //判断验证码是否正确 获取的验证码都转为小写
    if (code.toLowerCase() === ctx.session.code.toLowerCase()) {
        //连接查询数据库
        let result = await DB.find('userInfo', {'username': username, 'password': password});
        console.log(result);

        if (result.length > 0) {
            //设置session信息
            ctx.session.userinfo = result[0];

            //更新用户表 改变用户登录时间
            await DB.update('userInfo',{'_id':DB.getObjectID(result[0]._id)},{
                last_time: new Date()
            });

            //页面跳转到/admin
            ctx.redirect(ctx.state.__HOST__ + '/admin');
        } else {
            await ctx.render('admin/error', {
                message: '用户名或密码错误',
                redirect: ctx.state.__HOST__ + '/admin/login'
            });
        }
    } else {
        await ctx.render('admin/error', {
            message: '验证码不正确',
            redirect: ctx.state.__HOST__ + '/admin/login'
        })
    }
});

/**验证码*/
router.get('/code', async (ctx) => {
    /**加法验证码
     let captcha = svgCaptcha.createMathExpr({
        size:6,
        fontSize: 50,
        width: 100,
        height:40,
        background:"#cc9966"
    });*/
    let captcha = svgCaptcha.create({
        size: 4,
        fontSize: 50,
        width: 100,
        height: 34,
        background: "#cc9966"
    });
    //captcha.text 返回的是生成的验证码内容
    //console.log(captcha.text);
    //保存到session中
    ctx.session.code = captcha.text;
    //设置响应头(response) 固定写法
    ctx.response.type = 'image/svg+xml';
    //captcha.data 返回的是一个svg
    ctx.body = captcha.data
});


//退出登录
router.get('/loginOut',async (ctx)=>{
    //ctx.body = 'loginOut'
    ctx.session.userinfo = null;
    ctx.redirect(ctx.state.__HOST__+'/admin/login')
});


module.exports = router.routes();