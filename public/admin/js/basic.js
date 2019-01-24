/**Created by xiaoqi on 2018/7/2*/

//  $(document).ready(function(){})可以简写成$(function(){});
$(function(){
   app.delete();
});

/**这个js文件要放到html当中 点击状态栏时调用*/
let app = {
    /** 定义toggle方法*/
    toggle:function(el,collectionName,attr,id){
        //Ajax get请求
        $.get('/admin/changeStatus',{
            collectionName:collectionName,
            attr:attr,
            id:id
        },function(data){// 返回的数据
            if(data.success){ //判断当 success=true时  ctx.body = {'message':'更新数据库成功',success:true }
                //判断当前属性src当中是否又 'yes'
                if(el.src.indexOf('yes') !== -1){  //这里是要改变图片的路径 所以要判断el.src
                    el.src = '/admin/images/no.gif';
                }else{
                    el.src = '/admin/images/yes.gif';
                }
            }
        })
    },
    /**封装删除提示框*/
    delete(){
        $('.delete').click(function(){
            let flag = confirm('确认要删除数据码?');
            return flag;
        })
    },
    /**封装排序方法*/
    changeSort(el,collectionName,id){
        let sortValue = el.value;
        //Ajax get请求
        $.get('/admin/changeSort',{
            collectionName:collectionName,
            sortValue:sortValue, //获取传入的值
            id:id
        },function(data){// 返回的数据
            console.log(data);
        })
    }
};


// let app = {
//     toggle:function(el,collectionName,attr,id){
//         $.get('/admin/changeStatus',{
//             collectionName:collectionName,
//             attr:attr,
//             id:id
//         },function(data){
//             console.log(data);//请求的结果数据
//             if(data.success){
//                 if(el[attr].indexOf('yes') != -1){
//                     el[attr] = '/admin/images/no.gif';
//                 }else{
//                     el[attr] = '/admin/images/yes.gif';
//                 }
//             }
//         })
//     }
// };