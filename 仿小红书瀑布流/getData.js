function getData(dataname , callback){
    var noteData = window[dataname];
    callback(noteData);
}

getData('noteList' , function(res){
    console.log(res); 
})