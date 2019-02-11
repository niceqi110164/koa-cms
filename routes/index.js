/**Created by xiaoqi on 2018/6/29*/

let router = require('koa-router')();
let DB = require('../model/db');
let tools = require('../model/tools');
let url = require('url');

//配置路由中间件
router.use(async (ctx, next) => {
    //获取前台路径
    let pathname = url.parse(ctx.request.url).pathname;
    //console.log(pathname);

    //查询导航
    let navResult = await DB.find('nav', {'status': '1'}, {}, {
        sort: {'sort': 1}
    });
    //homeInfo
    let homeInfo = await DB.find('homeInfo',{});
    ctx.state.homeInfo = homeInfo[0];
    //轮播内容
    let focusContent = await DB.find('focus',{});
    ctx.state.focusContent = focusContent;
    //网站设置内容
    let setting = await DB.find('setting',{});
    ctx.state.setting = setting[0];

    //配置全局的nav
    ctx.state.nav = navResult;
    //配置前台路径
    ctx.state.pathname = pathname;
    await next();
});

/**
 * 首页
 * */
router.get('/', async (ctx) => {
    //查询轮播图
    let focusResult = await DB.find('focus', {'status': '1'}, {}, {
        sort: {'sort': 1}
    });
    //友情链接
    let linkResult = await DB.find('link',{});

    //模块about
    let showModelAboutResult = await DB.find('eynetaAbout',{});
    if(showModelAboutResult.length>0){
        showModelAboutResult = showModelAboutResult[0]
    }

    //模块offer
    let showModelOfferResult;
    // 顶级分类 : 成功案例 '_id':'5b4dc4bc5c73de0ef8b694e6'
    // 利用等级分类的'_id' 查找二级分类的'pid' = '_id'
    let caseResult = await DB.find('articleCate',{'pid':'5c4ea11c73d9df58d81b854e','status': '1'},{},{
        sort: {'sort': 1}
    });
    //获取page , pageSize
    let page = ctx.query.page || 1;
    let pageSize = 3;
    let caseResultArrList = "";
    if(caseResult.length>0){
        //利用$in 方法 获取到所用二级分类下的所用子分类文章
        let caseResultArr = [];
        for(let item of caseResult){
            caseResultArr.push(item._id.toString())
        }
        //获取所有二级分类下的文章
        caseResultArrList = await DB.find('article',{'pid':{$in:caseResultArr},'status': '1'},{},{
            page:page,
            pageSize:pageSize
        });
    }else{//没有二级分类
        caseResultArrList = await DB.find('article',{'pid':'5c4ea11c73d9df58d81b854e'})
    }
    showModelOfferResult = caseResultArrList.slice(0,4)

    //模块news
    let showModelNewsResult;
    //在 articleCate 表中查找顶级分类新闻标题下( _id : 5b4dc7b237be91292858ca94 )的二级分类
    let newsResultTitleList = await DB.find('articleCate',{'pid':'5b4dc7b237be91292858ca94','status':'1'});
    //console.log(newsResultTitleList);
    let newsResultTitleListArr = [];
    for(let item of newsResultTitleList){
        newsResultTitleListArr.push(item._id.toString())
    }
    //利用$in方法获取 二级分类下的所用数据
    showModelNewsResult = await DB.find('article',{'pid':{$in:newsResultTitleListArr},'status':'1'},{},{
        // page,
        // pageSize
    });
    let sliceResult = showModelNewsResult.slice(0,4);

    //渲染页面
    await ctx.render('default/index', {
        focus: focusResult,
        link:linkResult,
        showModelOffer:showModelOfferResult,
        showModelNews:sliceResult,
        showModelAbout:showModelAboutResult
    });
});
/**
 * 新闻
 * */
router.get('/news', async (ctx) => {
    //获取顶级分类  新闻列表
    let id = '5b4dc7b237be91292858ca94';
    let result = await DB.find('articleCate',{'_id':DB.getObjectID(id)});

    //查找顶级分类下的文章
    let parentNewsResult = await DB.find('article',{'pid':id,'status':'1'});

    //在 articleCate 表中查找顶级分类新闻标题下( _id : 5b4dc7b237be91292858ca94 )的二级分类
    let newsResultTitleList = await DB.find('articleCate',{'pid':id,'status':'1'});

    //获取
    let newsResultList = '';
    let newsResultNum = '';
    let pageSize = 4;
    let page = ctx.query.page || 1;

    let newsResultTitleListArr = [];
    for(let item of newsResultTitleList){
        newsResultTitleListArr.push(item._id.toString())
    }
    //利用$in方法获取 二级分类下的所用数据
    newsResultList = await DB.find('article',
                                    {'pid':{$in:newsResultTitleListArr},'status':'1','showModel':true},
                                    {},
                                    { page, pageSize }
    );
    //获取数据总条数
    newsResultNum = await DB.count('article',{'pid':{$in:newsResultTitleListArr},'status':'1','showModel':true});

    //渲染
    await ctx.render('default/news',{
        result:result[0],//获取顶级分类
        //titleList:newsResultTitleList, //二级分类标题
        list:newsResultList,
        //cid:cid, //这里要把cid 传到页面上,要不然在页面上没法判断
        totalPages:Math.ceil(newsResultNum/pageSize),
        page:page
    });
});

/**
 * 案例
 * */
router.get('/case', async (ctx) => {
    // 顶级分类 : 成功案例 '_id':'5b4dc4bc5c73de0ef8b694e6'
    let id = '5c4ea11c73d9df58d81b854e';
    let result = await DB.find('articleCate',{'_id':DB.getObjectID(id)});

    // 利用等级分类的'_id' 查找二级分类的'pid' = '_id'
    let caseResult = await DB.find('articleCate',{'pid':id,'status': '1'},{},{
        sort: {'sort': 1}
    });

    //获取page , pageSize
    let page = ctx.query.page || 1;
    let pageSize = 4;
    let caseResultArrList = "";
    let caseResultArrNum = ""; //总数量
    if(caseResult.length>0){
        //利用$in 方法 获取到所用二级分类下的所用子分类文章
        let caseResultArr = [];
        for(let item of caseResult){
            caseResultArr.push(item._id.toString())
        }
        //获取所有二级分类下的文章
        caseResultArrList = await DB.find('article',{'pid':{$in:caseResultArr},'status': '1','showModel':true},{},{
            page:page,
            pageSize:pageSize
        });
        caseResultArrNum = await DB.count('article',{'pid':{$in:caseResultArr},'status': '1','showModel':true});
    }else{
        caseResultArrList = await DB.find('article',{'pid':id,'showModel':true},{},{page, pageSize });
        //获取数据总条数
        caseResultArrNum = await DB.count('article',{'pid':id,'status':'1','showModel':true});
    }

    await ctx.render('default/case',{
        result:result[0],
        list:caseResult,
        caseList:caseResultArrList,
        totalPages:Math.ceil(caseResultArrNum/pageSize),//向上取整来显示总页数
        page:page
    });
});

/**
 * 服务
 * */
router.get('/service', async (ctx) => {
    let id = '5c4fbb50a69c360c9aa34a87';
    let result = await DB.find('articleCate',{'_id':DB.getObjectID(id)});
    //console.log(result);
    // 顶级分类 : 开发服务---'_id':'5b4dc68537be91292858ca8d'
    // 利用等级分类的'_id' 查找二级分类的'pid' = '_id'

    let serviceResult = await DB.find('articleCate', {'pid': id, 'status': '1'}, {}, {
        sort: {'sort': 1}
    });

    let page = ctx.query.page || 1; //获取当前第几页
    let pageSize = 3;//每一页显示的条数
    let serviceResultList = '';
    let serviceResultNum = ''; //获取总条数
    //获取分类cid
    let cid = ctx.query.cid;
    if(cid){
        serviceResultList = await DB.find('article',{'pid':cid},{},{
            page,
            pageSize
        });
        serviceResultNum = await DB.count('article',{'pid':cid}); //查询总条数
        //console.log(serviceResultNum);
    }else{
        //利用$in 方法 获取到所用二级分类下的所用子分类文章
        let serviceResultArr = [];
        for(let item of serviceResult){
            serviceResultArr.push(item._id.toString())
        }

        //获取所有二级分类下的文章
        serviceResultList = await DB.find('article',{'pid':{$in:serviceResultArr},'status': '1'},{},{
            page,
            pageSize
        });
        serviceResultNum = await DB.count('article',{'pid':{$in:serviceResultArr},'status': '1'});
        //console.log(serviceResultNum);
    }

    await ctx.render('default/service', {
        list: serviceResult,
        result:result[0],
        serviceList:serviceResultList,
        cid:cid,
        totalPages:Math.ceil(serviceResultNum/pageSize),
        page:page
    });
});

/**
 * case详情路由
 * */
router.get('/offer-details/:id', async (ctx)=>{
    //获取动态路由的传值
    //console.log(ctx.params);//{ id: '123456' }
    let id = ctx.params.id;
    let offerResult = await DB.find('article',{'_id':DB.getObjectID(id)});
    if(offerResult.length>0){
        offerResult = offerResult[0]
    }
    //console.log(offerResult);
    await ctx.render('default/case-details',{
        list:offerResult
    })
});

/**
 * news详情页面路由
 * */
router.get('/news-details/:id',async (ctx)=>{
    //获取动态路由的传值
    //console.log(ctx.params);//{ id: '123456' }
    let id = ctx.params.id;
    //查找当前_id:id的数据
    let newsDetailsResult = await DB.find('article',{'_id':DB.getObjectID(id)});
    if(newsDetailsResult.length>0){
        newsDetailsResult = newsDetailsResult[0]
    }
    //console.log(newsDetailsResult);
    /**
     1.获取文章详情的分类信息

     2.通过分类信息的 pid = 上级分类的 _id 查找 二级分类 或顶级分类
       根据文章的分类信息，去导航表里面查找当前分类信息的url

     3.把 url 赋值给 pathname
     * */
    await ctx.render('default/news-details',{
        list:newsDetailsResult
    })
});

/**
 * 关于我们
 * */
router.get('/about', async (ctx) => {
    // 关于我们_id
    let id = '5b3c6ca4244a6214a80ebb8b';
    //查询关于我们分类
    let result = await DB.find('articleCate',{'_id':DB.getObjectID(id)});

    // //利用二级分类 pid 等于 顶级分类(关于我们)的 _id 来查找二级分类
    // let aboutResult = await DB.find('articleCate',{'pid':id});
    //
    // //公司简介
    // let comResult = await DB.find('articleCate',{'_id':DB.getObjectID(aboutResult[0]._id)});

    await ctx.render('default/about',{
        result:result[0], //获取顶级分类
        //aboutResult:aboutResult,
        //comResult:comResult //公司介绍
    });


});
/**
 * 联系我们
 * */
router.get('/contact', async (ctx) => {
    await ctx.render('default/contact');
});


module.exports = router.routes();