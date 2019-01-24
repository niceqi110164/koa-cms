/**Created by xiaoqi on 2018/6/27*/

let MongoClient= require('mongodb').MongoClient;

let ObjectID = require('mongodb').ObjectID;
let Config = require('./config');


class Db {
    static getInstance(){ //单例模式 解决多次实例化不共享的问题
        if(!Db.instance){
            Db.instance = new Db();
        }
        return  Db.instance;
    }
    constructor(){
        this.dbClient = ""; //属性 存放db对象
        this.connect(); //实例化的时候就连接数据库
    }

    connect(){
        return new Promise((resolve,reject)=>{
            let that = this;
            if(!that.dbClient){
                MongoClient.connect(Config.dbUrl,{useNewUrlParser:true},(err,client)=>{
                    if(err){
                        reject(err);
                    }else{
                        that.dbClient = client.db(Config.dbName);
                        resolve(that.dbClient);
                    }
                })
            }else{
                resolve(that.dbClient);
            }
        })
    }

    find(collectionName,json,json1,json2){
        let attr='';
        let pageSize = 0;
        let slipNum = 0;
        let jsonSort = '';
        //查询数据库的时候判断传入的参数个数对应的处理不同的逻辑
        if(arguments.length === 2){ //传递的参数为两个
             attr={};
             pageSize = 0;
             slipNum = 0;

        }else if(arguments.length === 3){//传递的参数为三个
             attr= json1;
             pageSize = 0;
             slipNum = 0;

        }else if(arguments.length === 4){//传递的参数为四个
             attr= json1;
             let page = json2.page || 1;
             pageSize = json2.pageSize || 20;
             slipNum = (page-1)*pageSize;

            //排序操作
            if(json2.sort){
                jsonSort = json2.sort;
            }else{
                jsonSort = {};
            }

        }else{ //否则
            console.log('参数不正确');
        }

        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                //let result = db.collection(collectionName).find(json); //排序用sort()方法
                let result = db.collection(collectionName).find(json,{fields:attr}).skip(slipNum).limit(pageSize).sort(jsonSort);
                result.toArray((err,docs)=>{
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(docs)
                })
            })
        });
    }

    update(collectionName,json1,json2){
        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                db.collection(collectionName).updateOne(json1,{$set:json2},(err,data)=>{
                    if(err){
                        reject(err)
                    }
                    resolve(data)
                })
            })
        })
    }

    remove(collectionName,json){
        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                db.collection(collectionName).removeOne(json,(err,data)=>{
                    if(err){
                        reject(err)
                    }
                    resolve(data)
                })
            })
        });
    }

    insert(collectionName,json){
        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                db.collection(collectionName).insertOne(json,(err,data)=>{
                    if(err){
                       reject(err)
                    }
                    resolve(data)
                })
            })
        });
    }

    getObjectID(id){
        return new ObjectID(id)
    }

    //获取数据个数
    count(collectionName,json){

        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                db.collection(collectionName).count(json,(err,data)=>{
                    if(err){
                        reject(err)
                    }
                    resolve(data)
                });
            })
        })
    }
}

module.exports = Db.getInstance();