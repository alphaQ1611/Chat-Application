const socket=io()

const $messageForm=document.querySelector('#form')

const $messageFormInput=$messageForm.querySelector('input')

const $messageFormButton =$messageForm.querySelector('button')

const $messages=document.querySelector('#messages')


const sidebartemplate=document.querySelector('#sidebar-template').innerHTML
const messagetemplate=document.querySelector('#message-template').innerHTML

const locationtemplate=document.querySelector('#location-template').innerHTML

const {username,room}= Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll=()=>{

    const $newMessage=$messages.lastElementChild

    const $newMessageStyles=getComputedStyle($newMessage)
    const $newMessageMargin=parseInt($newMessageStyles.marginBottom)
    
    const newMessageHeight=$newMessage.offsetHeight+$newMessageMargin
    const visibleHeight=$messages.offsetHeight
    const containerHeight=$messages.scrollHeight
    const scrollOffset=$messages.scrollTop+visibleHeight
    if(containerHeight-newMessageHeight<=scrollOffset){
        $messages.scrollTop=$messages.scrollHeight
    }

}



socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})


socket.on('roomData',({room,users})=>{

    const html=Mustache.render(sidebartemplate,{
        room,
        users
    })

    document.querySelector('#sidebar').innerHTML=html

})

socket.on('message',(message)=>{
    console.log(message)
    const html=Mustache.render(messagetemplate,{
        message:message.text,
        user:message.user,
        createdAt:moment(message.createdAt).format('hh:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('sendLocationMessage',(message)=>{
    console.log(message)
    const html=Mustache.render(locationtemplate,{
        url:message.url,
        user:message.user,
        createdAt:moment(message.createdAt).format('hh:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()


})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    $messageFormButton.setAttribute('disabled','disabled')

    const message=e.target.elements.message.value
    socket.emit('sendMessage',message)
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value=''
    $messageFormInput.focus()
    
})

document.querySelector('#location').addEventListener('click',(e)=>{
    if(!navigator.geolocation){
       return alert("Your browser does not support geolocation!")
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude    
        })
    })
    
})