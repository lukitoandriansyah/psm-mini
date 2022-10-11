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
    }else{
        if(getUserData().roleName === "Admin"){
            return <Outlet/>
        }else{
            alert("You no permitted to see these page")
            return <Navigate to={history.go(-1)}/>
        }
    }

}