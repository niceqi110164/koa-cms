/**Created by xiaoqi on 2019/2/15*/

let router = require('koa-router')();
let DB = require('../../model/db');
let tools = require('../../model/tools');

router.get('/', async (ctx)=>{

    //查询 articleCate 数据 获取分类值循环到页面上
    let result = await DB.find('aboutUs',{});
    //console.log(result);
    await ctx.render('admin/aboutUs/list',{
        list:result[0]
    });
});

router.get('/edit',async (ctx)=>{
    //获取get传值
    let id = ctx.query.id;
    let aboutUsResult = await DB.find('aboutUs',{'_id':DB.getObjectID(id)});
    //console.log(aboutUsResult);

    await ctx.render('admin/aboutUs/edit',{
        list:aboutUsResult[0]
    })
});

router.post('/doEdit',
    tools.multer().fields([
        { name: 'aboutP1Img_url', maxCount: 1 },
        { name: 'aboutP2Img_url', maxCount: 1 },
        { name: 'aboutP3Img_url1', maxCount: 1 },
        { name: 'aboutP3Img_url2', maxCount: 1 }
    ]),
    async (ctx)=>{
        //console.log(ctx.req.files);
        //console.log(ctx.req.body);
        let json = {};
        json.aboutP1Title = ctx.req.body.aboutP1Title;
        json.aboutP1Content = ctx.req.body.aboutP1Content;
        json.aboutP2Title = ctx.req.body.aboutP2Title;
        json.aboutP2Content1SubTitle = ctx.req.body.aboutP2Content1SubTitle;
        json.aboutP2Content1 = ctx.req.body.aboutP2Content1;
        json.aboutP2Content2SubTitle = ctx.req.body.aboutP2Content2SubTitle;
        json.aboutP2Content2 = ctx.req.body.aboutP2Content2;
        json.aboutP3Content1SubTitle = ctx.req.body.aboutP3Content1SubTitle;
        json.aboutP3Content1 = ctx.req.body.aboutP3Content1;
        json.aboutP3Content2SubTitle = ctx.req.body.aboutP3Content2SubTitle;
        json.aboutP3Content2 = ctx.req.body.aboutP3Content2;
        //图片
        if(ctx.req.files.aboutP1Img_url){
            json.aboutP1Img_url = ctx.req.files.aboutP1Img_url[0].filename;
        }
        if(ctx.req.files.aboutP2Img_url){
            json.aboutP2Img_url = ctx.req.files.aboutP2Img_url[0].filename;
        }
        if(ctx.req.files.aboutP3Img_url1){
            json.aboutP3Img_url1 = ctx.req.files.aboutP3Img_url1[0].filename;
        }
        if(ctx.req.files.aboutP3Img_url2){
            json.aboutP3Img_url2 = ctx.req.files.aboutP3Img_url2[0].filename;
        }

        await DB.update('aboutUs',{},json);
        //页面重定向到list
        ctx.redirect(ctx.state.__HOST__+'/admin/aboutUs');

    });


module.exports = router.routes();