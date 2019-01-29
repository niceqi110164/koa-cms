/**Created by xiaoqi on 2018/6/29*/

let router = require('koa-router')();
let DB = require('../../model/db');
let tools = require('../../model/tools');


/**
 * @设置列表
 * */
router.get('/', async (ctx) => {

    let data = await DB.find('setting', {});
    //console.log(data);
    if (data.length > 0) {
        await ctx.render('admin/setting/index', {
            list: data[0]
        });
    }

});

router.post('/doEdit', tools.multer().fields([{ name: 'site_logo', maxCount: 1 }, { name: 'siteFooter_logo', maxCount: 1 }]), async (ctx)=>{
    //console.log(ctx.req.files);
    let json = {};
    json.site_title = ctx.req.body.site_title;
    json.site_keywords = ctx.req.body.site_keywords;
    json.site_description = ctx.req.body.site_description;
    json.site_record = ctx.req.body.site_record;
    json.site_email = ctx.req.body.site_email;
    json.site_tel = ctx.req.body.site_tel;
    json.site_address = ctx.req.body.site_address;
    json.site_status = ctx.req.body.site_status;
    json.add_time = tools.getTime();
    //图片
    if(ctx.req.files.site_logo){
        json.site_logo = ctx.req.files.site_logo[0].filename;
    }
    //footer_logo
    if(ctx.req.files.siteFooter_logo){
        json.siteFooter_logo = ctx.req.files.siteFooter_logo[0].filename;
    }
    json.add_time = tools.getTime();
    //console.log(json);
    await DB.update('setting',{},json);

    // ctx.redirect(ctx.state.__HOST__+'/admin/setting');
    ctx.redirect(ctx.state.__HOST__+'/admin');

});


module.exports = router.routes();