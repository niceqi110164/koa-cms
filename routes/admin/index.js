/**Created by xiaoqi on 2018/7/2*/
let router = require('koa-router')();
let DB = require('../../model/db');

router.get('/',async (ctx)=>{
    await ctx.render('admin/index');
});

//改变排序ajax接口 changeSort
router.get('/changeSort',async (ctx)=>{
    /**
     * 注意: 失败原因
     *  1.因为渲染页面的时候用的 sort ; 而我更新数据库的时候更新的是 sortValue
     *  2.渲染页面时用的 sort 要和 后端 数据库 更新的属性名 要一致
     * */

    //获取get传值的数据
    let json = ctx.query;
    //console.log(ctx.query);
    let updateResult = await DB.update(json.collectionName,{'_id':DB.getObjectID(json.id)},{'sort':json.sortValue});

    //判断是否更新数据库成功
    if(updateResult){
        ctx.body = {'message':'更新数据库成功',success:true }
    }else{
        //更新失败
        ctx.body = {'message':'更新数据库失败',success:false }
    }
});

router.get('/changeStatus',async (ctx)=>{
    //jsonp 是一种非正式协议，
    //就是script标签的src属性去拿别人服务器上的数据。拿到是js代码
    //ctx.body = {username:123,age:20} //url请求之后返回数据

    //http://127.0.0.1:3000/admin/changeStatus?callback=xxx
    /**
    ;xxx( { username: 123, age: 20 } )
     */

    //console.log(ctx.query); //获取前端ajax get 提交的数据
    /**
    { collectionName: 'userInfo',
        attr: 'src',
        id: '5b39efcf1e6c472e700ce98d' }
     */
    //获取get传值的数据
    let json = ctx.query;
    //console.log(ctx.query);
    //连接数据库 promise异步获取数据
    let data = await DB.find(json.collectionName,{'_id':DB.getObjectID(json.id)});
    //console.log(data);
    //定义一个json对象保存修改数据
    let json1 = {};
    if(data.length>0){
        if(data[0][json.attr] ==='1' ){
            json1[json.attr] = '0';
        }else{
            json1[json.attr] = '1';
        }
        //更新数据库
        let updateResult = await DB.update(json.collectionName,{'_id':DB.getObjectID(json.id)},json1);
        //判断是否更新数据库成功
        if(updateResult){
            ctx.body = {'message':'更新数据库成功',success:true }
        }else{
            //更新失败
            ctx.body = {'message':'更新数据库失败',success:false }
        }
    }else{
        //连接数据库失败
        ctx.body = {'message':'连接数据库失败,参数错误',success:false}
    }


    // //把获取到的数据赋值给json
    // let json = ctx.query;
    // //数据库查找
    // let data = await DB.find(json.collectionName,{'_id':DB.getObjectID(json.id)});
    // //console.log(data);
    // let json1 = {};
    // if(data.length>0){ //length>0 说明连接数据库成功
    //     if(data[0].status === 1){
    //         json1.status = 0
    //     }else{
    //         json1.status = 1
    //     }
    //     //数据库更新
    //     let updateResult = await DB.update(json.collectionName,{'_id':DB.getObjectID(json.id)},json1);
    //     //console.log('updateResult',updateResult);
    //     //判断数据库更新结果
    //     if(updateResult){
    //         ctx.body = {"message":'更新成功',"success":true};
    //     }else{
    //         ctx.body = {"message":"更新失败","success":false};
    //     }
    // }else{
    //     ctx.body = {"message":'更新失败,参数错误',"success":false};
    // }
});


/**公共的删除*/
router.get('/remove',async (ctx)=>{
    //console.log(ctx.query);
    let id = ctx.query.id;
    let collectionName = ctx.query.collectionName;

    let result = await DB.remove(collectionName,{'_id':DB.getObjectID(id)});
    //执行删除之后 页面跳转
    ctx.redirect(ctx.state.G.prevPage) //要返回上一页

});


module.exports = router.routes();