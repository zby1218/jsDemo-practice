const container = document.getElementsByClassName('container')[0];




const data = container.getAttribute('data');
const temp = JSON.parse(data)


console.log(temp);
//数据数组的下标
let index = 0;
//控制每个字符串位数的下标
let strIndex = 0;
//判断是否在删除
let judgeDelete = false;
//开始的时间或上一刻的时间
let start = null;
//进行操作的时间间隔  单位ms
let change = 500;
//根据requestAnimationFrame定义，这是一个回调函数，这个函数会
//传入一个参数，用来表示执行回调函数的时刻
function blink(time){
    //必须在回调函数中使用这个方法才会不停循环
    window.requestAnimationFrame(blink);
    //如果不存在开始的时间，说明是第一个进入函数
    if(!start){
         start = time;
    }
    
    
    //如果存在开始时间，计算现在与上次操作差了多久
    let interval = time - start;
   
    
    //如果大于间隔时间，则应该执行新的操作
    if(interval > change){
        //取出数组的某一个字符串
        let str = temp[index];
      
       
        
        //不在删除
        if(!judgeDelete){
            container.innerHTML = str.slice(0,++strIndex);
            change = 500 - Math.random()*400; 
            
        }
        //在删除的时刻
        else{
            container.innerHTML = str.slice(0,strIndex--);
        }
        start = time;
        
        
        if(strIndex == str.length){
           
            
            judgeDelete = true;
            change = 200;
            start = time + 1200;
            
        }
        if(strIndex < 0){
            judgeDelete = false;
            start = time + 200;
            index++;

        }
        if(index > temp.length - 1){
            index = 0;
        }
    }
    
    
}

window.requestAnimationFrame(blink);
