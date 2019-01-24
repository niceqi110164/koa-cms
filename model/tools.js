/**Created by xiaoqi on 2018/7/1*/

let md5 = require('md5');
let multer = require('koa-multer'); //引入koa-multer模块

let tools = {
    multer(){
        // 配置图片上传 -->在哪里用到配置到哪里
        let storage = multer.diskStorage({
            /**文件保存路径*/
            destination: function (req, file, cb) {
                cb(null, 'public/upload/'); /**文件路径必须存在*/
            },
            filename: function (req, file, cb) {
                //console.log(file);// 对象
                let fileFormat = (file.originalname).split(".");
                //console.log(fileFormat); //[ 'good2', 'jpg' ] 分割后的数组
                cb(null,Date.now()+"."+fileFormat[fileFormat.length-1]);
            }
        });
        let upload = multer({ storage: storage });
        return upload;
    },
    getTime(){
        return new Date();
    },
    getMd5(str){
        return md5(str)
    },
    cateToList(data){
        //1.获取一级标题
        let firstArr = [];
        for(let item of data){
            if(item.pid === "0"){
                firstArr.push(item)
            }
        }
        //2.获取二级标题
        for(let i=0;i<firstArr.length;i++){
            firstArr[i].list = []; //把二级标题保存到一级标题下的数组中
            for(let j=0;j<data.length;j++){
                if(firstArr[i]._id == data[j].pid){
                    firstArr[i].list.push(data[j])
                }
            }
        }
        return firstArr;
    }
};

module.exports = tools;