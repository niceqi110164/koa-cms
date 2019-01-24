/**Created by xiaoqi on 2018/6/29*/
let router = require('koa-router')();
let DB = require('../model/db');

router.get('/',async (ctx)=>{
    ctx.body = '这里是api接口';
});

router.get('/cateList',async (ctx)=>{
    let cateList = await DB.find('articleCate',{});
    ctx.body = {
        cateList
    };
});


module.exports = router.routes();