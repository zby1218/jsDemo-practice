## JS呈现打字效果

### 项目简介

一个使用HTML，CSS，JS的小demo，模仿出类型打字删除的效果

### 项目所得

- 简单的动画使用
- 打字及删除效果的原理及思路

### 前端页面

- HTML

父级盒子进行了简单的居中，子级设置两个span，一个显示文字，一个作为删除线

```html
  <div class="main">
        <span class="container"></span><span class="delete"></span>
  </div>
```

- CSS

父级设置屏幕居中，对文字大小，间隔，居中进行设置

```css
 .main{
            height: 100px;
            line-height: 100px;
            position: absolute;
            top :50%;
            left: 50%;
            transform: translate(-50%,-50%);
            font-size: 50px;
            letter-spacing: .2em;
           
        }
```

子级进行样式的设置

```js
 .container{
      margin-right: 5px;
  }
 .delete{
     /*删除线样式*/
     border-right: 2px solid black;
     /*定义动画 step-end是动画过渡效果，设置step-end代表不过渡 infinite代表时间无限*/
     animation: blingbling 1s step-end infinite;
  }
```

动画设置

```css
keyframes blingbling{
    /*设置开始及结束时的样式*/
       from,to{
            border-color: transparent;
       }
    /*设置中间时刻的样式*/
       50%{
            border-color: black;
        }
}
```

### 逻辑部分

首先明确我们要实现的效果：

- 将一个字符串一个字一个字打印出来
- 将打印出来的字进行删除
- 将上面的效果不停执行

为了实现不停执行的效果，同时不占用太大的浏览器负荷，我们使用

```js
window.requestAnimationFrame()
```

- 方法介绍

  告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行 

- 参数

  一个回调函数

- 返回值

  一个数字，代表执行内部回调函数时的时间

#### 实现不停调用

外部调用的同时再在回调函数中调用此方法

```js
//回调函数       返回的时间参数
function blink(time){
    //内部再次调用
    window.requestAnimationFrame(blink)
    //其它操作
}
//首先外部调用
window.requestAnimationFrame(blink);
```

#### 思路梳理

实现的思路是：首先记录上一次操作的时间，与传入的time参数求差，计算出距离上次操作的时间差。判断过去了多久，如果可以进行下一步操作，判断是否在删除？是，则将打印的字符串逐渐向小切割，最后开始打印下一个字符串。否，则将字符串从零向大进行切割，字符串全部打印完则进行删除

根据上面的需求，我们初始化以下几个变量

- index  

  数据数组的下标

- strIndex

  数组每一项字符串的下标

- start

  开始的时间或上一刻的时间

- interval

  距离上一次操作的时间

- change

  操作的时间间隔

- isDelete

  是否在删除的判断

#### 代码

```js
function blink(time){
    //这个方法必须在函数内部再调用一次才会无限循环调用
    window.requestAnimationFrame(blink);
    //如果不存在开始的时间，说明是第一次进入函数
    if(!start){
        start = time;
    }
    //计算现在与上次操作时间差了多久
    interval = time - start;
      //如果大于间隔时间，则应该执行新的操作
    if(interval > change){
          //取出数组的某一个字符串
        let str = data[index];
        //不在删除状态
        if(!isDelete){
            //change是时间间隔，使用随机数，模仿不同的打字时间
            change = 500 - Math.random()*400;
            container.innerHTML = str.slice(0,++strIndex);
           
        }
        else{
            container.innerHTML = str.slice(0,strIndex--);
        }
        //当前进行了操作，需要保存当前的时间
        start = time;
        //对字符串进行判断，全部打印后则删除
        if(strIndex == str.length){
            isDelete = true;
            change = 200;
            start = time + 1200;
        }
        //删除后打印下一个
        if(strIndex <0){
            isDelete = false;
            start = time + 200;
            index++;
            
        }
        if(index == data.length){
            index = 0;
        }
    }
}
```

