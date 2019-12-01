## 原生js实现简易钢琴

----

> js能干什么？控制页面逻辑，完成行为的控制？其实js的api极其丰富，今天我们就用js来做一个简易的钢琴来体会
>
> 一下js的强大之处吧

![](F:\demo练习\前端\简易钢琴\1.png)

### API介绍

首先我们来了解一下下面几个关于音频的API

#### 创建音频上下文

我们需要在页面中创建音频上下文，才可以进行操作

```js
var ctx = new Audiocontext()
```

需要注意：

- 音频上下文不能在页面加载时直接创建
- 上下文创建后自动启动，不可停止
- 上下文创建后相当于一个时间轴，一直向后延伸，我们后续可以通过对象控制发声的时间和频率等，也因此建议只创建一个音频上下文，防止时间轴紊乱
- 属性 ctx.current 代表在当前的时间点标一个点，延伸向未来 

----

#### 获取音量控制对象

获得该对象已控制音量

```js
var g = ctx.createGain()
```

该对象有一个操作：

- 方法 connect

  将该对象连接到制定设备，这里直接连接到上下文的默认扬声器

  ```js
  g.connect(ctx.desination)
  ```

- 属性 gain.value

  控制音量音高 （0 - 1）

- 方法 gain.linearRampToValueAtTime 

  ```js
  g.gain.linearRampToValueAtTime(0.6,ctx.currentTime + 0.01)
  //在0.01s时间内从音量音高从value值变到0.6
  ```

- 方法 .gain.exponentialRampToValueAtTime 

  ```js
  g.gain.exponentialRampToValueAtTime(0.01 , ctx.currentTime + duration)
  //音高在duration时间内由原value变为0.01
  ```

  

----

#### 获取振荡器对象

只获得上下文是无法进行更多操作的，我们还需要获得振荡器对象，来控制音色音高

```js
var osc = ctx.createOscillator();
```
振荡器对象的属性或方法：

- 方法 connect

  获得振荡器后，我们还需要将其连接到音量控制器，不连接不会发声

  ```js
  osc.connect(g)
  ```

- 属性 type

  音频震荡的波形，不同波形产生不同的音色 有下面四个值

  - sine:默认值，正弦波
  - square:方形波
  - sawtooth：锯齿波
  - triangle：三角波

- 属性 frequency.value

  频率越高，声音越高

  按照第一国际高音，标准中音6的频率是440HZ

  这里我们的简易钢琴需要的频率区间是

  以下是按照第一国际高音，从低音1，到高音7的频率（不包含小数）

  [130,147,165,175,196,220,246,262,294,330,349,392,440,494,523,587,659,698,784,880,988,1047]

- 方法 start

  在制定的音频上下文时间播放声音

- 方法 stop

  在制定的音频上下文时间停止播放

  ----

上面的这么多API是不是有些复杂和难记？别急，我们把它封装一下，咱们跟着代码走一遍

首先是创建上下文函数

```js
var ctx;
function setContext(){
	if(!ctx){
		ctx = new AudioContext()
    }
}
```

发声函数

```js
function makeSound(index){				 // 钢琴传入是钢琴的第几个按键
  setContext();							//获得上下文
  var osc = ctx.createOscillator()		  //获得音频振荡器
  var g = ctx.createGain()				 //获得音量控制器
  osc.connect(g)						//连接音量控制器
  osc.type = 'sine'						//设置波形
  osc.frequency.value = sounds[index] 	  //对应钢琴不同键的不同频率
  var duration = 1						//控制时间
  g.connect(ctx.destination)			 //连接扬声器
  g.gain.value = 0						//初始音高为0
  osc.start();							//从当前开始发生
  g.gain.linearRampToValueAtTime(0.6,ctx.currentTime + 0.01)	//从当前时间到0.01s后，音高从0~0.6
  osc.stop(ctx.currentTime + duration);						  //当前时间duration后停止
  g.gain.exponentialRampToValueAtTime(0.01 , ctx.currentTime + duration)	//从0.6~0.01
```

### HTML CSS

```html
<body>
    <ul class="container">
        <li key='1' class="low"><span>1</span></li>
        <li key='2' class="low"><span>2</span></li>
        <li key='3' class="low"><span>3</span></li>
        <li key='4' class="low"><span>4</span></li>
        <li key='5' class="low"><span>5</span></li>
        <li key='6' class="low"><span>6</span></li>
        <li key='7' class="low"><span>7</span></li>
        <li key='q'><span>1</span></li>
        <li key='w'><span>2</span></li>
        <li key='e'><span>3</span></li>
        <li key='r'><span>4</span></li>
        <li key='t'><span>5</span></li>
        <li key='y'><span>6</span></li>
        <li key='u'><span>7</span></li>
        <li key='a' class="high"><span>1</span></li>
        <li key='s' class="high"><span>2</span></li>
        <li key='d' class="high"><span>3</span></li>
        <li key='f' class="high"><span>4</span></li>
        <li key='g' class="high"><span>5</span></li>
        <li key='h' class="high"><span>6</span></li>
        <li key='j' class="high"><span>7</span></li>
    </ul>
</body>
```

```css
body{
    width: 100%;
    height: 100%;
    background: url(img/img.jpg) no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
    user-select: none;
}

.container{
    text-align: center;
    margin: 200px auto;
}

li{
    position: relative;
    display: inline-block;
    width:50px;
    height: 200px;
    background-color: #fff;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1.5em;
    box-shadow: 0  0  5px 3px rgba(0, 0, 0, 0.5);
}

li span{
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 20px;
}

.low::after{
    content: '.';
    position: absolute;
    left: 0;
    bottom: 10px;
    width: 100%;

}

.high::after{
    content: '.';
    position: absolute;
    left: 0;
    bottom: 45px;
    width: 100%;
}
```

### 剩余javaScript逻辑

```js

var ctx;
var sounds = [130,147,165,175,196,220,246,262,294,330,349,392,440,494,
    523,587,659,698,784,880,988,1047]
//点击钢琴样式改变
function changeColor(li){
    
    li.style.background = '#ccc';
    setTimeout(function(){
        li.style.background = '#fff';
    } , 100)
}

var container = document.getElementsByClassName('container')[0];

//函数控制钢琴键点击事件钢琴键样式的改变
container.onclick = function(e){

    if(e.target.tagName === 'UL'){
        return;
    }

    li = e.target;
	//点击到SPAN要控制父级变色
    if(e.target.tagName == 'SPAN'){
        li = e.target.parentNode
    }
   
    changeColor(li);
    //获得钢琴是第几键
    var index = getIndex(li);
    makeSound(index);
}


window.onkeydown = function(e){
    //属性选择器
    var selector = "li[key=\"" + e.key + "\"]"  
   
    var li = document.querySelector(selector);
    
    if(li){
        this.changeColor(li);
        var index = getIndex(li);
        makeSound(index);
    }
}


function setContent(){
    if(!ctx){
        ctx = new AudioContext()
    }
}

function getIndex(li){
    var ul = li.parentNode;
    //Array.from（类数组）返回真数组
    var children = Array.from(ul.children)
    return children.indexOf(li);
}

function makeSound(index){
    // 获得音频上下文
    setContent();
    //得到音频振荡器
    var osc = ctx.createOscillator();
    //得到音量控制对象
    var g = ctx.createGain();

    // 连接振荡器和音量控制对象
    osc.connect(g);
    osc.type = 'sine';
    osc.frequency.value = sounds[index];

    var duration = 1;

    g.connect(ctx.destination);
    g.gain.value = 0;
    osc.start();
    g.gain.linearRampToValueAtTime(0.6,ctx.currentTime + 0.01)
    
    osc.stop(ctx.currentTime + duration);
    g.gain.exponentialRampToValueAtTime(0.01 , ctx.currentTime + duration)

    
}

```

