var name = document.getElementById('name').innerHTML;


function doSomething()
{
    alert("The javascript loaded");

}

function init()
{
  
}

var socket = io('http://localhost:8080');

document.getElementById('but').addEventListener('click', function(){
    var mess = document.getElementById('textBox').value;
    
    socket.emit('chat', {
        message: mess,
        handle: name
    })

    document.getElementById('textBox').value = "";
    
    
});

socket.on('recieve', function(msg){

    var para = document.createElement('p');

    para.innerHTML = msg;

    document.getElementById('text').appendChild(para);
    console.log(msg);

    document.getElementById("text").scrollTop = (document.getElementById("text").scrollHeight + 1000);
});

setInterval(function() {
    var elem = document.getElementById('textBox');
    elem.scrollTop = elem.scrollHeight;
  }, 2000);

