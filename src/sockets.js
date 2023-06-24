module.exports = io => {

    var  line_history = [];

    io.on('connection', socket => {
        console.log("new user conected"); 


    for(let  i in line_history){
        socket.emit('draw_line', {line: line_history[i]});
    }

    

       socket.on('draw_line', data => {
           line_history.push(data.line);
           io.emit('draw_line', data);
       });


 });

 io.on('connection', (socket) => {
    // ...
  
    socket.on('clear_canvas', () => {
      io.emit('clear_canvas');
    });
  
    // ...
  });




}




    