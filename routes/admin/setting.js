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

router.post('/doEdit', tools.multer().single('site_logo'), async (ctx)=>{

    // ctx.body = {
    //     filename: ctx.req.file ? ctx.req.file.filename : '',
    //     body: ctx.req.body
    // };

    // {
    //     filename: "1531798040954.jpg",
    //         body: {
        //         site_title: "这是一个网站",
        //         site_keywords: "111",
        //         site_description: "2222",
        //         site_record: "3333",
        //         site_qq: "444",
        //         site_tel: "5555",
        //         site_address: "6666",
        //         site_status: "0"
    //     }
    // }

    let json = {};
    json.site_title = ctx.req.body.site_title;
    json.site_keywords = ctx.req.body.site_keywords;
    json.site_description = ctx.req.body.site_description;
    json.site_record = ctx.req.body.site_record;
    json.site_qq = ctx.req.body.site_qq;
    json.site_tel = ctx.req.body.site_tel;
    json.site_address = ctx.req.body.site_address;
    json.site_status = ctx.req.body.site_status;
    json.add_time = tools.getTime();
    //图片
    if(ctx.req.file){
        json.site_logo = ctx.req.file.filename;
    }
    json.add_time = tools.getTime();

    await DB.update('setting',{},json)

    // ctx.redirect(ctx.state.__HOST__+'/admin/setting');
    ctx.redirect(ctx.state.__HOST__+'/admin');

});


module.exports = router.routes();