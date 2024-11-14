import React from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getUserRole, removeUserInfo } from '../../services/localStorageInfo';

function AllUsersProtectedRoute() {
    const roles =['admin','attendee','organizer']; 
    const existingRole = getUserRole();
    const attendeeUrl = '/all-users/myevents';
    const organizerUrls = ['/all-users/events/new','/all-users/events/edit/:eventId','/all-users/attendee-management'];
    const admin = '/all-users/users';

    const navigate = useNavigate();
    const location = useLocation();

    console.log(location);
    const navigateToLogin = () =>{
        removeUserInfo();
        navigate('/login');
    }

    if(!existingRole){
        navigate('/');
    }

    if(location.pathname === attendeeUrl){
        return ('attendee' === existingRole)? <Outlet /> : navigateToLogin();
    }else if (location.pathname === admin) {
        return ('admin' === existingRole)? <Outlet /> : navigateToLogin();
    }else if (organizerUrls.includes(location.pathname)) {
        return ('organizer' === existingRole)? <Outlet /> : navigateToLogin();
    }else{
        return (roles.includes(existingRole))?  <Outlet /> :  navigateToLogin();
    }
  
}

export default AllUsersProtectedRoute