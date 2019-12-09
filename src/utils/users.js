const users=[]

const addUser= ({ id,username,room})=>{
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()


    if(!username||!room){
        return {
            error:'Username and room are required!'
        }
    }

    const existingUser=users.find((user)=>{
        return user.room===room && user.username===username
    })
    if (existingUser){
        return {
            error:'Username is already taken!'
        }
    }

    const user={id,username,room}

    users.push(user)
    return {user}
}


const removeUser =(id)=>{
    const index=users.findIndex((user)=>{
        return user.id===id
    })

    if(index!=-1){
        return users.splice(index,1)[0]
    }
}

const getUser=(id)=>{
    const index=users.findIndex((user)=>{
        return user.id===id
    })


    return users[index]
}


const getUsersInRoom=(room)=>{
    const usersInRoom=[]
    for(let i=0;i<users.length;i++){
        
        
        if(users[i].room===room.trim().toLowerCase()){
            
        usersInRoom.push(users[i])
        }
    }
    return usersInRoom
}



module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}