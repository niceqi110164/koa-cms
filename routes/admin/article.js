/**Created by xiaoqi on 2018/7/4*/

let router = require('koa-router')();
let DB = require('../../model/db');
let tools = require('../../model/tools');


/**
 * 列表
 * */
router.get('/',async (ctx)=>{

    //获取数据总的条数
    let countData = await DB.count('article',{});
    //console.log(countData); 7


    let page = ctx.query.page || 1; //获取当前页数
    let pageSize = 7;
    let data = await DB.find('article',{},{},{
        page,
        pageSize,
        sort:{
            'add_time':-1
        }
    });
    //console.log(data);
    //console.log(Math.ceil(countData / pageSize)); 3
    //console.log(tools.cateToList(data));
    await ctx.render('admin/article/index',{
        list:data,
        totalPages : Math.ceil(countData/pageSize), //向上取整:
        currentPage:page
    });
});

/**
 * 添加内容列表
 * */
router.get('/add',async (ctx)=>{
    //当执行添加操作的时候 查询数据库
    let data = await DB.find('articleCate',{});
    //console.log(data);
    //渲染页面并传数据
    //console.log(tools.cateToList(data));
// 循环数据到页面上
await ctx.render('admin/article/add',{
    //这里要处理以下数据 让顶级分类包含子分类
    list:tools.cateToList(data)
});
});

/**
 * 操作添加内容
 * */
router.post('/doAdd',tools.multer().single('img_url'),async (ctx)=>{
    //获取post传值
    let json = {};
    json.catename = ctx.req.body.catename;
    json.pid = ctx.req.body.pid;
    json.title = ctx.req.body.title;
    json.author = ctx.req.body.author;
    json.status = ctx.req.body.status;
    json.keywords = ctx.req.body.keywords;
    json.description = ctx.req.body.description;
    json.content = ctx.req.body.content;
    json.add_time = tools.getTime();
    if(ctx.req.body.is_best){
        json.is_best = ctx.req.body.is_best;
    }else{
        json.is_best = '0';
    }
    if(ctx.req.body.is_hot){
        json.is_best = ctx.req.body.is_hot;
    }else{
        json.is_hot = '0';
    }
    if(ctx.req.body.is_new){
        json.is_best = ctx.req.body.is_new;
    }else{
        json.is_new = '0';
    }
    //图片路径
    if(ctx.req.file){
        json.img_url = ctx.req.file.filename
    }
    //console.log(json);
    //把数据添加到数据库
    let result = await DB.insert('article',json);
    if(result){
        ctx.redirect(ctx.state.__HOST__+'/admin/article');
    }

});



/**
 * 操作列表
 * */
router.get('/edit',async (ctx)=>{
    //获取get传值
    let id = ctx.query.id;
    //查询 articleCate 数据 获取分类值循环到页面上
    let result = await DB.find('articleCate',{});
    //console.log(result);
    //查询当前get获取到的 id 对应的数据 渲染带页面上
    let  data = await DB.find('article',{'_id':DB.getObjectID(id)});
    //console.log(data);
    await ctx.render('admin/article/edit',{
        articleCateList:tools.cateToList(result),
        list:data[0],
        prevPage:ctx.state.G.prevPage /**获取保存的上一页地址*/
    });

    /**
     *   {{each list}} // 循环顶级分类
     *       <option value="{{@$value._id}}" {{if articleCateList.pid == $value._id }} selected {{/if}}>
     *           {{$value.title}}
     *       </option>
     *   {{/each}}
     *
     *   articleCateList: 为当前选中要编辑的项
     *
     *   注意: 选中编辑的 pid 如果等于 等级分类的 _id 就当 当前选项选中
     * */
});

router.post('/doEdit',tools.multer().single('img_url'),async (ctx)=>{
    //获取 post 传值
    let json = {};

    let prevPage = ctx.req.body.prevPage || '';

    json.id = ctx.req.body.id;
    json.catename = ctx.req.body.catename;
    json.pid = ctx.req.body.pid;
    json.title = ctx.req.body.title;
    json.author = ctx.req.body.author;
    json.status = ctx.req.body.status;
    json.keywords = ctx.req.body.keywords;
    json.description = ctx.req.body.description;
    json.content = ctx.req.body.content;
    if(ctx.req.body.is_best){
        json.is_best = ctx.req.body.is_best;
    }else{
        json.is_best = '0';
    }
    if(ctx.req.body.is_hot){
        json.is_best = ctx.req.body.is_hot;
    }else{
        json.is_hot = '0';
    }
    if(ctx.req.body.is_new){
        json.is_best = ctx.req.body.is_new;
    }else{
        json.is_new = '0';
    }

    //图片路径
    if(ctx.req.file){
        json.img_url = ctx.req.file.filename
    }
    //console.log(json);

    let result = await DB.update('article',{'_id':DB.getObjectID(json.id)},json);

    if(prevPage){
        ctx.redirect(prevPage);
    }else{
        ctx.redirect(ctx.state.__HOST__+'/admin/article')
    }

});


module.exports = router.routes();