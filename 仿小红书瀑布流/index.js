var note = {
    NoteList:[],
    init:function(option){
        this.initData(option);
        this.render();
        this.handle();
    },
    initData:function(option){
        
        this.el = option.el;
        console.log(option.el)
        var selthis = this;
        getData('noteList',function(res){
            
            selthis.NoteList = res;
            console.log(selthis.NoteList)
        })
    },
    render:function(){
        this.el.innerHTML = this.renderNoteColumn();
        console.log(this.el.innerHTML);
        this.renderNote(this.NoteList);
    },
    handle:function(){
        var selthis = this;
        var more = document.getElementsByClassName('more')[0];
        more.onclick =  function(){
            getData('noteList',function(res){
                selthis.renderNote(res);
            })
        }
    },
    renderNote:function(NoteList){
        
        var oColumn = this.el.getElementsByClassName('note-column');
        for(var i = 0;i < NoteList.length;i++){
            var note = NoteList[i];
            var oNote = document.createElement('div');
            var minIndex = this.minColumn(); 
           
            var oMinColumn = oColumn[minIndex];
            oMinColumn.append(oNote);
            oNote.outerHTML = this.noteCmp(note);
        }
    },
    noteCmp:function(note){
       
        var template = `
           
            <div class="note">
                
                <div class="note-info">
                    <div class="note-img">
                        <img src="${note.cover.url}"  alt="">
                    
                        
                        ${note.type === 'video' ?'<i class="video"></i>':''}
                    </div>
                    <h3 class="info">${note.title}</h3>
                </div>
                
                <div class="note-user">
                    <div class="user">
                        <div class="user-img">
                            <img src="${note.user.image}" alt="">
                            ${note.user.officialVerified?'<i class="verified"></i>':''}
                            
                        </div>                    
                        <div class="name">${note.user.nickname}</div> 
                    </div>
                
                    <div class="like">
                        <i class="like-img ${note.isLiked ?'heart-liked':''}"></i>
                        <span class="like-num">${note.likes}</span>
                    </div>
                
                </div>
            
            </div>
       
        `
        return template;
    },
    // 初始化五列
    renderNoteColumn:function(){
        var template = '';
        for(var i = 0;i < 5;i++){
            template += '<div class="note-column"></div>'
        }
        console.log(22);
        return template;
    },
    //取最小列函数
    minColumn:function(){
        var column = this.el.getElementsByClassName('note-column');
        var length = column.length;
        var minHeight = column[0].offsetHeight;
        var minIndex = 0;
        for(i = 0;i < length;i++){
            if(column[i].offsetHeight < minHeight){
                minHeight = column[i].offsetHeight;
                minIndex = i;
            }
        }
        return minIndex;
    }
}                                                                                                                                       