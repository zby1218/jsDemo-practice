const superagent = require('superagent');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');



const url = 'https://ncov.dxy.cn/ncovh5/view/pneumonia';
superagent.get(url).then(data=>{
   
    const $ = cheerio.load(data.text);
    console.log($);
    
    var result = $('#getListByCountryTypeService1').html();
    
    console.log(result);
    var dataObj = {};
    eval(result.replace(/window/g,'dataObj'))
    fs.writeFile(path.join(__dirname,'./data.json'),JSON.stringify(dataObj),(err)=>{
        if(err){
            console.log(err);
            return;
        }
        console.log('文件写入成功');
        
    })

}).catch(err=>{
    throw err;
})