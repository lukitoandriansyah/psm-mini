import {Navigate, Outlet} from "react-router-dom";

export default function ProtectedRouteForAdmin(){
    const isLogin = localStorage.getItem("user")

    function getUserData() {
        const savedDataUser = localStorage.getItem("user")
        if (savedDataUser) {
            return JSON.parse(savedDataUser)
        } else {
            return {}
        }
    }

    if(isLogin === null){
        return <Navigate to={"/login"}/>
    }

    if(getUserData().roleName === "Admin"){
        return <Outlet/>
    }else{
        return <Navigate to={"/user/dashboard"}/>
    }
}