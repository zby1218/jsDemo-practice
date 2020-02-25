const express = require('express');
const server = express();
const fs = require('fs');
const path = require('path');
//fetch带来cors跨域问题
server.all('*', function(req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "X-Requested-With");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    res.header("X-Powered-By",' 3.2.1')  
    res.header("Content-Type", "application/json;charset=utf-8");  
    next();  
});

server.get('/api/data',(req, res)=>{
   
    
    fs.readFile(path.join(__dirname , './data.json'),'utf-8',(err,result)=>{
        if(err){
            console.log(err);
            return
        }
        res.send(result)
    })
})

server.listen(3000,()=>{
   
    console.log('running');
    
})