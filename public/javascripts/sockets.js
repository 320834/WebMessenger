var windowHeight = window.innerHeight;

document.getElementById('main').style.height = windowHeight;
document.getElementById('chat').style.height = windowHeight - 240;

document.getElementById('sendMessageText').style.width = document.getElementById('chatBoxInner').offsetWidth - 100;
window.addEventListener("resize", function() {
    var windowHeight = window.innerHeight;

    document.getElementById('main').style.height = windowHeight;
    document.getElementById('chat').style.height = windowHeight - 240;

    //Automatically set 
    document.getElementById('sendMessageText').style.width = document.getElementById('chatBoxInner').offsetWidth - 100;
    document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight;

})

document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight;



var name = document.getElementById('name').innerHTML;
var connUser = 0;

var room = 'global';
var roomID = "global";

var userNames = [];
var divUsers = [];
var activeDivArray = [];

function addRight(msg, chatName)
{
    var div = document.createElement('div');
    div.style.textAlign = "right";

    div.innerHTML = msg;

    div.style.margin = "2%";
    

    document.getElementById(chatName).appendChild(div);
    document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight + 1000;
}

function addLeft(msg, chatName)
{
    var div = document.createElement('div');
    
    div.style.textAlign = "left";

    div.innerHTML = msg;

    
    div.style.margin = "2%";
    

    document.getElementById(chatName).appendChild(div);
    document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight + 1000;
}

function createPrivate(name)
{
    var div = document.createElement('div');
    div.id = name;
    div.style.display= "none"

    document.getElementById('chat').appendChild(div);
}

function removePrivate(name)
{
    document.getElementById(name).remove();
}

var socket = io('localhost:8080', {query: {"username": name}, transports: ['websocket'], upgrade: false});





document.getElementById('sendMessageButton').addEventListener('click', function(){
    var mess = document.getElementById('sendMessageText').value;
    
   
    if(mess.length > 0)
    {
        socket.emit('chat', {
            originName: name,
            originSocketID: socket.id,
            destSocketID: roomID,
            destName: room,
            message: mess
        })

        addRight(mess,room);

        document.getElementById('sendMessageText').value = "";
        document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight + 1000;
    }
    
});

function pressCode(event)
{
    if(event.which == 13 || event.keyCode == 13)
    {
        var mess = document.getElementById('sendMessageText').value;
    
   
        if(mess.length > 0)
        {
            socket.emit('chat', {
                originName: name,
                originSocketID: socket.id,
                destSocketID: roomID,
                destName: room,
                message: mess
            })

            addRight(mess,room);

            document.getElementById('sendMessageText').value = "";
            document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight + 1000;
        }
    }
}

socket.on('recieveChatBot', function(msg){
    addLeft(msg.originName + ": " + msg.message, "chatbot");
    document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight + 1000;
});

socket.on('recieve', function(msg){

    var originName = msg.originName;
    var originSocketID = msg.originSocketID; 
    var destSocketID = msg.destSocketID;
    var destName = msg.destName;
    var message = msg.message;

    if(originSocketID !== socket.id)
    {
        if(destSocketID === "global")
        {
            
            addLeft(originName + ": " + message, "global");
            document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight + 1000;
        }
        else
        {
            
            var mess = originName + ": " + message;
            addLeft(mess, originName);
            document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight + 1000;
        }
    }
});

socket.on('updateUsersNumber', function(msg){
    document.getElementById('activeHeader').innerHTML = "There are " + msg + " other users connected";
});

socket.on('updateUsersAdd', function(array){

    //console.log("Add Function\n");

    //console.log('Client data')
    //console.log(divUsers);

    //console.log("Data from server")
    //console.log(array);

    setTimeout(function(){
        addPrivateChats(array);
    },100);


    userNames = array;

    updateList();
})

socket.on('updateUsersRemove', function(array){
    console.log("Remove Function\n");

    //console.log('Client data')
    //console.log(divUsers);

    //console.log("Data from server")
    //console.log(array);

    var name = array[0].username; 

    //console.log("This is the chat id");
    //console.log(document.getElementById(name));
    removePrivate(name);
    for(var i  = 0; i < divUsers.length; i++)
    {
        if(divUsers[i].username === name)
        {
            divUsers.splice(i,1);
        }
    }

    

    for(var j = 0; j < userNames.length; j++)
    {
        if(userNames[j].username === name)
        {
            userNames.splice(j,1);
        }
    }

    updateList();
});

socket.on('typingRecieve', function(msg){
  
    if(msg.originSocketID !== socket.id)
    {
        //Send the request for global only
        if(msg.destSocketID === "global")
        {
            if(msg.destName === room)
            {
                document.getElementById('typingIndicator').innerHTML = "Someone is typing";
            }
            
            
        }
        else
        {
            //Check if the current is in the right room
            if(msg.originName === room)
            {
                var name = msg.originName;
                document.getElementById('typingIndicator').innerHTML = name + " is typing";
            }
        }
    }

   

});



function addPrivateChats(array)
{
    if(divUsers.length === 0)
    {
        //load all content at the start of page
        for(var i = 0; i < array.length; i++)
        {
            divUsers.push(array[i]);
            createPrivate(array[i].username);
        }

    }
    else 
    {
        var n = array.length-1;
        divUsers.push(array[n]);
        createPrivate(array[n].username);
    }
}

function updatePrivateChats(array)
{
    //console.log(divUsers);
    if(divUsers.length === 0)
    {
        //load all content at the start of page
        for(var i = 0; i < array.length; i++)
        {
            divUsers.push(array[i]);
            createPrivate(array[i].username);
        }
    }
    else
    {
        //Find the one that has been added or lost
        //Removed 
        
        var flag = false;
        //console.log(array);
        //console.log(divUsers);
        if(divUsers.length > array.length)
        {
            var pos = 0;
            for(var i = 0; i < array.length; i++)
            {
                if(divUsers[i].username !== array[i].username)
                {
                    //console.log(i);
                    flag = true;
                    pos = i;
                }
            }

            if(!flag)
            {
                pos =  divUsers.length - 1;
            }

            //console.log(pos);
            removePrivate(divUsers[pos].username);
            //console.log(divUsers);
            divUsers.splice(pos,1);
            //console.log(divUsers);
        }
        else
        {
            //console.log("Push To Div Users");
            var n = array.length-1;
            divUsers.push(array[n]);
            createPrivate(array[n].username);
        }
    }
}


function updateList()
{
    //Remove from div
    var divActive = document.getElementById('userList');
    activeDivArray= [];

    while(divActive.firstChild)
    {
        divActive.removeChild(divActive.firstChild);
    }

    for(var i = 0; i < userNames.length; i++)
    {
        var div = document.createElement('button');
        
        div.innerHTML = userNames[i].username;
        div.id = ":"+ userNames[i].username;
        div.style.textAlign = "center";
      
        div.style.marginTop = "3%";

        div.classList.add("btn");
        div.classList.add("btn-primary"); 
        div.classList.add("col-12");         

        activeDivArray.push(div);
        divActive.appendChild(div);


    }

    console.log(activeDivArray);

    for(var j = 0; j < activeDivArray.length; j++)
    {
        (function(){
            activeDivArray[j].addEventListener("click", function(){
                
                var username = this.id.slice(1, this.id.length);
                var pos = findSocketID(username);

                if(pos == -1)
                {
                    alert("Found No Name");
                }
                else if(pos == -2)
                {
                
                    document.getElementById(room).style.display = "none";
                    document.getElementById('global').style.display = "block";

                    document.getElementById('title').innerHTML = "You are in global chat";

                    room = 'global';
                    roomID = 'global';
                }
                else
                {
                    document.getElementById(room).style.display = "none";
                    document.getElementById(username).style.display = "block";

                    document.getElementById('title').innerHTML = "PRIVATE CHAT: " + name + " and " + username;


                    room = userNames[pos].username;
                    roomID = userNames[pos].socketID;

                    //alert(room + " " + roomID);
                    //document.getElementById('dest').innerHTML = userNames[i].socketID;
                }
            });
        }())
    }
    

}

function findSocketID(name)
{
    for(var i = 0; i < userNames.length; i++)
    {
        if(userNames[i].username === name)
        {
            return i;
        }
    }


    if(name === "home")
    {
        return -2;
    }

    return -1;
}


document.getElementById('findUsersButton').addEventListener('click', function(){
    document.getElementById(room).style.display = "none";
    document.getElementById('global').style.display = "block";

    document.getElementById('title').innerHTML = "You are in global chat";

    room = 'global';
    roomID = 'global';

})

//This enables the users to know if the 
document.getElementById('sendMessageText').addEventListener('keyup', function(){
    //console.log('typing');
   socket.emit('typing', {
        originName: name,
        originSocketID: socket.id,
        destSocketID: roomID,
        destName: room,
        });
});

setInterval(function(){
    document.getElementById('typingIndicator').innerHTML = "";
    
}, 900)



