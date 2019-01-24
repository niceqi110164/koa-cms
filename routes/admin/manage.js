/**Created by xiaoqi on 2018/6/29*/

let router = require('koa-router')();
let DB = require('../../model/db');
let tools = require('../../model/tools');

/**
 * @管理员列表
 * */
router.get('/', async (ctx) => {
    let result = await DB.find('userInfo', {});
    await ctx.render('admin/manage/list', {
        list: result
    });
});


/**
 * @添加管理员
 * */
router.get('/add', async (ctx) => {
    await ctx.render('admin/manage/add');
});
/**
 * @执行添加管理员操作
 * */
router.post('/doAdd', async (ctx) => {
    //1.获取表单数据
    let json = {
        status:1,
        last_time:new Date()
    };
    json.username = ctx.request.body.username;
    json.password = tools.getMd5(ctx.request.body.password);
    //2.验证表单数据是否合法
    if(!/[a-zA-Z\u4e00-\u9fa5]{4,20}/.test(json.username)){ //[a-zA-Z\u4e00-\u9fa5]{4,20}4~20个字符字母和汉字
        await ctx.render('admin/error', {
            message: '用户名不合法',
            redirect: ctx.state.__HOST__ + '/admin/manage/add'
        });
    }else if(ctx.request.body.password.length<6 ||ctx.request.body.password.length>20 ){
        await ctx.render('admin/error', {
            message: '密码长度为6~20为之间',
            redirect: ctx.state.__HOST__ + '/admin/manage/add'
        });
    }else if(ctx.request.body.password !== ctx.request.body.rpassword){
        await ctx.render('admin/error',{
            message:'两次输入的密码不一致',
            redirect:ctx.state.__HOST__+'/admin/manage/add'
        });
    }else{
        //3.在数据库查询当前要增加的管理员是否存在
        let findResult = await DB.find('userInfo',{'username':json.username});
        if(findResult.length>0){
            await ctx.render('admin/error',{
                message:'用户名已存在',
                redirect:ctx.state.__HOST__+'/admin/manage/add'
            })
        }else{
            //4.增加管理员
            let insertResult = await DB.insert('userInfo',json);
            if(insertResult){
                ctx.redirect(ctx.state.__HOST__+'/admin/manage')
            }
        }

    }
});


/**
 * @编辑管理员
 * */
router.get('/edit', async (ctx) => {
    //获取get请求数据
    //console.log(ctx.query); //{ id: '5b39efcf1e6c472e700ce98d' }
    //查找数据库
    let data = await DB.find('userInfo',{'_id':DB.getObjectID(ctx.query.id)});
    if(data.length>0){
        await ctx.render('admin/manage/edit',{
            list:data[0]
        });
    }
});

/**
 * @执行编辑管理员操作e
 * */
router.post('/doEdit',async (ctx)=>{

    //1.获取表单数据
    // let id = ctx.request.body.id;
    // let password = ctx.request.body.password;
    // let rpassword = ctx.request.body.rpassword;
    //2.验证表单数据是否合法
    if(ctx.request.body.password !== ""){ //当密码部位空的时候向下执行
        if(ctx.request.body.password.length<6 || ctx.request.body.password.length>20 ){
            await ctx.render('admin/error',{
                message:'密码长度为6~20为之间',
                redirect:ctx.state.__HOST__+'/admin/manage/edit'
            })
        }else if(ctx.request.body.password !== ctx.request.body.rpassword){
            await ctx.render('admin/error',{
                message:"两次输入的密码不一致",
                redirect:ctx.state.__HOST__+'/admin/manage/edit'
            })
        }else{
            //更新密码
            DB.update('userInfo',{'_id':DB.getObjectID(ctx.request.body.id)},{'password':tools.getMd5(ctx.request.body.password)});
        }
    }
    //当密码为空的时候直接跳转到管理员用户列表
    ctx.redirect(ctx.state.__HOST__+"/admin/manage");
});


/**
 * @删除管理员
 * */
router.get('/delete', async (ctx) => {
    //获取get请求数据
    //console.log(ctx.query); //{ id: '5b39efcf1e6c472e700ce98d' }
    //删除用户
    let result = await DB.remove('userInfo',{'_id':DB.getObjectID(ctx.query.id)});
    if(result){
        ctx.redirect(ctx.state.__HOST__+'/admin/manage')
    }
});


module.exports = router.routes();