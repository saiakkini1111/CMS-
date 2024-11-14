
export const setUserInfo=(user)=>{
    localStorage.setItem('user',JSON.stringify(user));
}

export const getUserInfo = ()=>{
    return JSON.parse(localStorage.getItem('user'));
}

export const removeUserInfo = () =>{
    localStorage.removeItem('user');
}

export const getUserRole = () =>{
    return getUserInfo()?.role || null;
}

export const isOrganizer = () =>{
    console.log((getUserRole()==='organizer'));
    
    return (getUserRole()==='organizer')? true :false;
}

export const isAdmin=()=>{
    return (getUserRole()==='admin')? true : false;
}

export const isOrganizerOrAdmin=()=>{
    return (((getUserRole()==='organizer')||(getUserRole()==='admin'))? true: false);
}