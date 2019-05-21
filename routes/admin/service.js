/**Created by xiaoqi on 2018/6/29*/

let router = require('koa-router')();
let DB = require('../../model/db');
let tools = require('../../model/tools');


/**
 * @导航列表
 * */
router.get('/', async (ctx) => {

    let data = await DB.find('service', {});
    await ctx.render('admin/service/list', {
        list: data
    });
});

/**
 *subList
 */
router.get('/subList', async (ctx) => {
    let data = await DB.find('serviceSec', {});
    await ctx.render('admin/service/subList', {
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
    let data = await DB.find('service', {'_id': DB.getObjectID(id)});
    if (data.length > 0) {
        await ctx.render('admin/service/edit', {
            list: data[0],
            prevPage:ctx.state.G.prevPage /*获取上一页的地址*/
        });
    }
});

/**
 * service下半部分
 * */
router.get('/subEdit', async (ctx) => {
    //console.log(ctx.query);
    let id = ctx.query.id;
    let data = await DB.find('serviceSec', {'_id': DB.getObjectID(id)});
    if (data.length > 0) {
        await ctx.render('admin/service/subEdit', {
            list: data[0],
            prevPage:ctx.state.G.prevPage /*获取上一页的地址*/
        });
    }
});


router.post('/doEdit',tools.multer().single('category_img'), async (ctx) => {
    // console.log(ctx.req);
    // console.log(ctx.req.file);
    let json = {};
    //想要获取prevPage需要前页面传递
    let prevPage = ctx.request.body.prevPage || '';

    json.id = ctx.req.body.id;
    json.category_title = ctx.req.body.category_title;
    json.category_desc = ctx.req.body.category_desc;
    json.status = ctx.req.body.status;
    json.sort = ctx.req.body.sort;
    json.add_time = tools.getTime();
    //图片路径
    if(ctx.req.file){
        json.category_img = ctx.req.file.filename
    }
    //console.log(json);
    await DB.update('service',{'_id':DB.getObjectID(json.id)},json);

    if(prevPage){
        ctx.redirect(prevPage);
    }else{
        ctx.redirect(ctx.state.__HOST__+'/admin/service/list')
    }
});

router.post('/doSubEdit',tools.multer().single('category_img'), async (ctx) => {
    // console.log(ctx.req);
    // console.log(ctx.req.file);
    let json = {};
    //想要获取prevPage需要前页面传递
    let prevPage = ctx.request.body.prevPage || '';

    json.id = ctx.req.body.id;
    json.title = ctx.req.body.title;
    json.sub_title = ctx.req.body.sub_title;
    json.content = ctx.req.body.content;
    json.status = ctx.req.body.status;
    json.sort = ctx.req.body.sort;
    json.add_time = tools.getTime();

    //console.log(json);
    await DB.update('serviceSec',{'_id':DB.getObjectID(json.id)},json);

    if(prevPage){
        ctx.redirect(prevPage);
    }else{
        ctx.redirect(ctx.state.__HOST__+'/admin/service/subList')
    }
});

module.exports = router.routes();