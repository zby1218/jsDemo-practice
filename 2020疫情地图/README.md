## 疫情地图实现

### 项目简介

模仿丁香园实时疫情图，使用原生js结合Echarts，使用node的框架express爬取网站数据，实现疫情效果展示效果

![效果如图](F:\demo练习\node\2020疫情地图\img\show.png)

> 你在看到这篇文章时，可能接口已经失效，可以尽量去阅读代码而非效果。不过失效这一天，想必疫情已经结束，也是好事！

### 项目应用技术

- 使用ECharts实现中国地图及对应样式
- 使用node中的superagent及cheerio插件爬取网上数据
- 使用fetch实现ajax请求并解决其cors跨域问题

文件的结构为 server文件夹两个文件分别进行数据的爬取及建立服务器，在index.html文件的script标签中写入请求及eCharts操作（有点偷懒，哈哈）
### 爬取网站

https://ncov.dxy.cn/ncovh5/view/pneumonia 

### 数据部分

我们将使用一个简单的爬虫来爬取对应网站上的数据，整个过程分为以下部分

- 向对应网站发送请求，获得返回的数据并进行处理（返回的是什么格式，找到需要的数据）
- 数据进行存放
- 建立服务器，将数据返回
- 读取文件，获得数据

#### 一.准备工作

我们首先需要下载两个必要的包，再引入自带的两个包，共计四个包。

- superagent  客户端请求模块 
  - 下载：node install superagent --save下载
  - 本质上是promise，会返回一个pronise，因此我们可以调用.then方法。
- cheerio 对dom进行操作
  - 下载：node install cheerio --save
  - 本质上是jQuery的实现，能够操作dom元素，但十分轻量化
- fs  node自带模块，操作文件
- path node自带模块，操作路径

#### 二.发送请求并处理数据

**server端**文件处理

- 发送请求

```js
superagent.get(url).then(data=>{
    
}).catch(err=>{
	throw err;
})
```

由于superagent本质上是promise，所以我们在then方法中处理数据

- 处理数据

  我们在返回的data中可以发现需要的数据在data.text中

  cheerio.load可以可以获得对应的html代码

  ```js
  const $ = cheerio.load(data.text);
  var result = $('#getListByCountryTypeService1').html()
  ```

  - 在获得的html代码中我们可以找到我们需要的数据在id名为`getListByCountryTypeService1`中，接下来使用.html()方法获取到dom元素的内容

  - 打印result我们可以看到，数据内容在window的一个对象上，由于node环境中没有window，使用正则匹配，替换window

    ```js
     var dataObj = {};
     eval(result.replace(/window/g,'dataObj'))
    ```

  至此，需要的数据全部存放在dataObj中

#### 三.存放数据

- 将数据存放在一个json文件中，方便存储及读取

  ```js
   fs.writeFile(path.join(__dirname,'./data.json'),JSON.stringify(dataObj),(err)=>{
          if(err){
              console.log(err);
              return;
          }
          console.log('文件写入成功');
          
     })
  ```

#### 四.建立服务器及接口

建立服务器分为以下三个步骤：

- 建立服务器

  ```js
  const express = require('express');
  const server = express();
  
  server.listen(3000,()=>{
  	console.log('running')；
  })
  ```

  

- 读取文件内容，作为接口返回

  ```js
  server.get('/api/data',(req, res)=>{
      
      fs.readFile(path.join(__dirname , './data.json'),'utf-8',(err,result)=>{
          if(err){
              console.log(err);
              return
          }
          res.send(result)
      })
  })
  ```

  

- 解决cors跨域

  我们使用fetch发送请求，但无论cors还是XMLHttpReqest都遵循同源策略，只有想同源服务获取资源时才能成功，我们需要设置正确的cors头部，有两种方法

  一：

  ```js
  server.all('*', function(req, res, next) {  
      res.header("Access-Control-Allow-Origin", "*");  
      res.header("Access-Control-Allow-Headers", "X-Requested-With");  
      res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
      res.header("X-Powered-By",' 3.2.1')  
      res.header("Content-Type", "application/json;charset=utf-8");  
      next();  
  });
  ```

  二：

  ```js
  var cors = require('cors');
  app.use(cors({
      origin:['http://localhost:3000'],
      methods:['GET','POST'],
      alloweHeaders:['Conten-Type', 'Authorization']
  }));
  ```

  - cors需要下载   npm install cors --save

#### 五.请求数据并获得数据

**数据端**文件处理

- 请求数据

  ```js
    fetch(url).then(result=>
                  result.json()                       
          ).then((result)=>{
       			//操作数据 	
       });
              
  ```

  - 使用fetch请求数据，与superagent相同，fetch同样使用了promise，我们使用then方法处理数据 
  - fetch请求返回是数据是数据流，我们将其转换为json格式
  - 第一层箭头函数没有括号，没有括号的箭头函数默认有返回值，有括号的则没有返回值

- 数据处理

  ```js
  var dataArr = [];  
  const data = result.getListByCountryTypeService1;        
              data.forEach(element => {
                  dataArr.push({
                      name:element.provinceShortName,
                      value:element.confirmedCount - element.curedCount,//确诊-治愈=现存确诊人数
                      deadCount:element.deadCount,
                      curedCount:element.curedCount
                  })
              });
  ```

  - 打印result我们可以发现我们需要的数据在属性getListByCountryTypeService1中
  - 定义一个对象数组，方便对echsrts提供参数。我们遍历数据的每一项，提取出必要的数据统一到一个对象中。

以上是数据处理部分的代码，**注意**接下来对echarts的操作仍在数据操作层进行，即第二个then方法中

### 界面部分

> <https://echarts.apache.org>     推荐前往官网主页学习使用教程

使用echart需要以下几个步骤

- 下载eCharts并引入，方法见官网教程。
- 创建eCharts实例
- 操作eCharts实例

#### 引入

- echarts.min.js：引入此文件，创建echart实例
- china.js：引入此文件，引入中国地图
- **tips：**在引入echarts,in.js时便已获得echarts变量（注意，不是echarts实例）

#### 创建实例

- 构建一个容器，即一个div

引入了**echarts.min.js**便获得了echats变量，调用变量上的方法创建实例

```js
const div = document.getElementsByClassName('demo')[0];
const myChart = echarts.init(div);
```

myChart就是echarts实例

#### 操作eCharts实例

```js
myChart.setOption({
    //操作
})
```

在setOption中传入一个参数对象，对eCharts进行设置

在开始之前，首先我们需要明确需求，地图都要什么效果？

- 标题及简介
- 各省份划分，名称显示
- 点击出现各省确诊，治愈，死亡数量
- 根据人数对应不同的地图颜色

#### 一.标题及简介

```js
  title:{
                text:'nCov-2019全国实时疫情数据分布图',//主标题
                subtext:'战斗进行时---他们还在努力',	//副标题            
                left:'center'					   //位置控制
            },
```

#### 各省份划分，名称显示

```js
 series:[{
                type:'map',	//eCharts类型
                map:'china',	//地图类型
                label:{
                    show:true
                },
                //向echart传入的数据
                data:dataArr
            }
        ]
```

- 地图中默认不显示省市名称，我们在label中进行改变

#### 点击出现各省确诊，治愈，死亡数量

```js
  tooltip:{
                //信息出现的方式
                triggerOn:'click',
                formatter:function(param){  
          //南海诸岛需要处理，那个地方没有数据会报错              //判断是否有值没有则设置为0
                    return `地区:${param.name }<br/>现存确诊:${param?.value || 0}<br/>治愈:${param.data?.curedCount || 0}<br/>死亡:${param.data?.deadCount || 0}`
                }
            },
```

- 在series.data属性中传入过data，则formatter中的param会自动将其作为参数
- 返回值需要对南海诸岛进行处理，因为南海诸岛作为省市名出现，但接口中不存在其数据

#### 根据人数对应不同的地图颜色

```js
 visualMap:[
                {
                    type:'piecewise',	//颜色形式
                    pieces:[	//设置颜色
                        {gt:9999},
                        {gt:999,lte:9999},
                        {gt:99,lte:999},
                        {gt:9,lte:99},
                        {gt:0,lte:9},
                        {lte:0}
                    ],
                    inRange:{//具体颜色值
                        color:['rgb(255,255,255)','rgb(253,235,207)','rgb(229,90,78)','rgb(203,42,47)','rgb(129,28,36)','rgb(79,7,13)']
                    }
                } ]
```

- gt代表>
- lte代表<=

通过以上代码就可以完成全部echarts的部分了。由于本人的代码能力问题，上文请求获取的数据存在作用域问题，在外部访问会有问题，我就将eCharts部分放入了then方法中。

#### 以上就是疫情地图的全部代码，如果需要完整代码可以访问github：<https://github.com/zby1218/jsDemo-practice/tree/master/2020%E7%96%AB%E6%83%85%E5%9C%B0%E5%9B%BE> 

谢谢你的观看！