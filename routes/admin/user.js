/**Created by xiaoqi on 2018/6/29*/

let router = require('koa-router')();


router.get('/',async (ctx)=>{
    await ctx.render('admin/user/list');
});

router.get('/add',async (ctx)=>{
    await ctx.render('admin/user/add');
});

router.get('/edit',async (ctx)=>{
    ctx.body = '用户编辑';
});

router.get('/delete',async (ctx)=>{
    ctx.body = '用户删除';
});


module.exports = router.routes();