/**Created by xiaoqi on 2019/1/27*/

let router = require('koa-router')();
let DB = require('../../model/db');
let tools = require('../../model/tools');

/**
 @网站信息列表
 * */

router.get('/', async (ctx) => {
    let homeINfoResult = await DB.find('homeInfo',{});
    //console.log(homeINfoResult);
    if(homeINfoResult.length>0){
        await ctx.render('admin/homeInfo/edit',{
            list:homeINfoResult[0]
        })
    }
});

/*
router.get('/edit', async (ctx)=>{
    let id = ctx.query.id;
    let result = await DB.find("homeInfo",{'_id':DB.getObjectID(id)});
    if(result.length>0){
        await ctx.render('admin/homeInfo/edit',{
            list:result[0]
        })
    }
})*/


/**
 * @编辑home信息
 * */
router.post('/doEdit', async (ctx)=>{
    //console.log(ctx.request.body);
    let json = {};
    json.id = ctx.request.body.id;
    json.homeStaticTitle = ctx.request.body.homeStaticTitle;
    json.homeDynamicTitle = ctx.request.body.homeDynamicTitle;
    json.homeSubTitle = ctx.request.body.homeSubTitle;

    let updateResult = await DB.update("homeInfo",{'_id':DB.getObjectID(json.id)},json);
    //更新成功
    if(updateResult.result.n === 1){
        ctx.redirect(ctx.state.__HOST__+'/admin');
    }else{
        await ctx.render('admin/error', {
            message: '更新失败',
            redirect: ctx.state.__HOST__ + '/admin/homeInfo'
        })
    }
});


module.exports = router.routes();