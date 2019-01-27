/**Created by xiaoqi on 2019/1/27*/

let router = require('koa-router')();
let DB = require('../../model/db');
let tools = require('../../model/tools');

/**
 @网站信息列表
 * */

router.get('/', async (ctx) => {
    let siteINfoResult = await DB.find('eynetaAbout',{});
    if(siteINfoResult.length>0){
        await ctx.render('admin/siteInfo/list',{
            list:siteINfoResult[0]
        })
    }
});

router.get('/edit', async (ctx)=>{
    let id = ctx.query.id;
    let result = await DB.find("eynetaAbout",{'_id':DB.getObjectID(id)});
    if(result.length>0){
        await ctx.render('admin/siteInfo/edit',{
            list:result[0]
        })
    }
})
/**
 * @编辑网站信息
 * */
router.post('/doEdit', async (ctx)=>{
    //console.log(ctx.request.body);
    let json = {};
    json.id = ctx.request.body.id;
    json.title = ctx.request.body.title;
    json.content = ctx.request.body.content;

    let updateResult = await DB.update("eynetaAbout",{'_id':DB.getObjectID(json.id)},json);
    ctx.redirect('/admin/siteInfo');
    //console.log(updateResult);
})


module.exports = router.routes();