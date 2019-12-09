const generateMessage =(text,user)=>{
    return {
        text,
        user:user.username,
        createdAt:new Date().getTime()

    }


}

const generateLocationMessage=(url,user)=>{
    return {
        url,
        user:user.username,
        createdAt:new Date().getTime()
    }
}

module.exports={
    generateMessage,
    generateLocationMessage
}
