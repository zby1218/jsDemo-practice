const data = ["今天是个好日子","Fighting!","저는중국사람입니가"];

const container = document.getElementsByClassName('container')[0];
const Delete = document.getElementsByClassName('delete')[0];
//data数组的下标
let index = 0;
//data数组每一项字符串的下标
let strIndex = 0;
//开始的时间或是上一刻的时间
let start = null;
//上次操作与现在的时间间隔
let interval = 0;
//每次变化的间隔
let change = 500;
//现在是否是删除状态
let isDelete = false;
//根据requestAnimationFrame定义，这是一个回调函数，这个函数会
//传入一个参数，用来表示执行回调函数的时刻
function blink(time){
    //这个方法必须在函数内部再调用一次才会无限循环调用
    window.requestAnimationFrame(blink);
    //如果不存在开始的时间，说明是第一次进入函数
    if(!start){
        start = time;
    }
    //计算现在与上次操作差了多久
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

window.requestAnimationFrame(blink);