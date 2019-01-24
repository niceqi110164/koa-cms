/**Created by xiaoqi on 2018/6/29*/

let router = require('koa-router')();
let DB = require('../../model/db');
let tools = require('../../model/tools');

/**
 * @轮播图列表
 * */
router.get('/', async (ctx) => {

    //获取数据总的条数
    let countData = await DB.count('focus',{});
    //console.log(countData);
    let page = ctx.query.page || 1; //获取当前页数
    let pageSize = 3;

    let data = await DB.find('focus',{},{},{
        page,
        pageSize,
        sort:{
            add_time:-1
        }
    });

    await ctx.render('admin/focus/list', {
        list: data,
        totalPages : Math.ceil(countData/pageSize), //向上取整:
        currentPage:page
    });
});


/**
 * @添加轮播图
 * */
router.get('/add', async (ctx) => {
     await ctx.render('admin/focus/add');
});
/**
 * @执行添加管理员操作
 * */
router.post('/doAdd',tools.multer().single('pic'), async (ctx) => {
    // 在模板中上传文件件  必须加上 enctype="multipart/form-data"

    // console.log(ctx.req);
    // ctx.body = {
    //     filename:ctx.req.file?ctx.req.file.filename:'',
    //     body:ctx.req.body
    // };
    let json = {};
    if(ctx.req.file){
        json.pic = ctx.req.file.filename;
    }
    json.title = ctx.req.body.title;
    json.url = ctx.req.body.url;
    json.status = ctx.req.body.status;
    json.add_time = tools.getTime();

    //保存到数据库
    let insertResult = await DB.insert('focus',json);

    ctx.redirect(ctx.state.__HOST__+'/admin/focus');
});


/**
 * @编辑管理员
 * */
router.get('/edit', async (ctx) => {
    //获取get请求数据
    //console.log(ctx.query); //{ id: '5b39efcf1e6c472e700ce98d' }
    //查找数据库
    let data = await DB.find('focus',{'_id':DB.getObjectID(ctx.query.id)});
    if(data.length>0){
        await ctx.render('admin/focus/edit',{
            list:data[0],
            prevPage:ctx.state.G.prevPage /**获取保存的上一页地址*/
        });
    }
});

/**
 * @执行编辑管理员操作e
 * */
router.post('/doEdit',tools.multer().single('pic'),async (ctx)=>{


    // ctx.body = {
    //     filename: ctx.req.file ? ctx.req.file.filename : '',
    //     body: ctx.req.body
    // };
    //console.log(ctx.req);
    //获取 post 传值
    let json = {};
    //想要获取prevPage需要前页面传递
    let prevPage = ctx.req.body.prevPage || '';

    json.id = ctx.req.body.id;
    json.url = ctx.req.body.url;
    json.title = ctx.req.body.title;
    json.status = ctx.req.body.status;
    json.add_time = tools.getTime();

    //图片路径
    if(ctx.req.file){
        json.pic = ctx.req.file.filename;
    }
    //console.log(json);

    let result = await DB.update('focus',{'_id':DB.getObjectID(json.id)},json);

    if(prevPage){
        ctx.redirect(prevPage);
    }else{
        ctx.redirect(ctx.state.__HOST__+'/admin/focus')
    }
});



module.exports = router.routes();