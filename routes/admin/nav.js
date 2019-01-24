/**Created by xiaoqi on 2018/6/29*/

let router = require('koa-router')();
let DB = require('../../model/db');
let tools = require('../../model/tools');


/**
 * @导航列表
 * */
router.get('/', async (ctx) => {

    let data = await DB.find('nav', {});
    await ctx.render('admin/nav/list', {
        list: data
    });
});


/**
 * @添加导航
 * */
router.get('/add', async (ctx) => {

    await ctx.render('admin/nav/add');
});


/**
 * @执行操作添加导航
 * */
router.post('/doAdd', async (ctx) => {

    // console.log(ctx.request.body);
    let json = {};
    json.title = ctx.request.body.title;
    json.url = ctx.request.body.url;
    json.sort = ctx.request.body.sort;
    json.status = ctx.request.body.status;
    json.add_time = tools.getTime();
    //await ctx.render('admin/nav/add');
    await DB.insert('nav', json);
    ctx.redirect(ctx.state.__HOST__ + '/admin/nav');
});


router.get('/edit', async (ctx) => {
    //console.log(ctx.query);
    let id = ctx.query.id;
    let data = await DB.find('nav', {'_id': DB.getObjectID(id)});
    if (data.length > 0) {
        await ctx.render('admin/nav/edit', {
            list: data[0],
            prevPage:ctx.state.G.prevPage /*获取上一页的地址*/
        });
    }
});


router.post('/doEdit', async (ctx) => {
    //console.log(ctx.request.body);

    let json = {};
    //想要获取prevPage需要前页面传递
    let prevPage = ctx.request.body.prevPage || '';

    json.id = ctx.request.body.id;
    json.url = ctx.request.body.url;
    json.title = ctx.request.body.title;
    json.status = ctx.request.body.status;
    json.sort = ctx.request.body.sort;
    json.add_time = tools.getTime();

    await DB.update('nav', {'_id': DB.getObjectID(json.id)},json);

    if(prevPage){
        ctx.redirect(prevPage);
    }else{
        ctx.redirect(ctx.state.__HOST__+'/admin/nav')
    }
});

module.exports = router.routes();