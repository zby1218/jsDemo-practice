
var ctx;
var sounds = [130,147,165,175,196,220,246,262,294,330,349,392,440,494,
    523,587,659,698,784,880,988,1047]
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

    if(e.target.tagName == 'SPAN'){
        li = e.target.parentNode
    }
   
    changeColor(li);
    var index = getIndex(li);
    makeSound(index);
}


//这是一个新的用法，未接触过
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
