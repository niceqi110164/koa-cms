/**Created by xiaoqi on 2018/7/4*/

let router = require('koa-router')();
let DB = require('../../model/db');
let tools = require('../../model/tools');

/**
 * 列表
 * */
router.get('/',async (ctx)=>{
    let data = await DB.find('articleCate',{});
    //console.log(data);
    //console.log(tools.cateToList(data));
    await ctx.render('admin/articleCate/index',{
        list:tools.cateToList(data)
    });
});

/**
 * 添加列表
 * */
router.get('/add',async (ctx)=>{
    let data = await DB.find('articleCate',{'pid':'0'});
    //console.log(data);
    await ctx.render('admin/articleCate/add',{
        articleCateList:data
    });
});
/**
 * 操作添加列表
 * */
router.post('/doAdd',async (ctx)=>{

    console.log(ctx.request.body);
    let json = ctx.request.body;
    let result = await DB.insert('articleCate',json);

    ctx.redirect(ctx.state.__HOST__+'/admin/articleCate');
});

/**
 * 操作列表
 * */
router.get('/edit',async (ctx)=>{
    let id = ctx.query.id;

    let result = await DB.find('articleCate',{'pid':'0'});
    //console.log(result);
    let  data = await DB.find('articleCate',{'_id':DB.getObjectID(id)});
    //console.log(data);
    await ctx.render('admin/articleCate/edit',{
        articleCateList:data[0],
        list:result
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

router.post('/doEdit',async (ctx)=>{
    console.log(ctx.request.body);
    let id = ctx.request.body.id;
    let json = {};
    json.title = ctx.request.body.title;
    json.pid = ctx.request.body.pid;
    json.keywords = ctx.request.body.keywords;
    json.status = ctx.request.body.status;
    json.description = ctx.request.body.description;
    let updateResult = await DB.update('articleCate',{'_id':DB.getObjectID(id)},json);
    if(updateResult){
        ctx.redirect(ctx.state.__HOST__+'/admin/articleCate');
    }

});


module.exports = router.routes();