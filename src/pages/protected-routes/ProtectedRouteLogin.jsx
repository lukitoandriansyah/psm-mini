import {Navigate, Outlet} from "react-router-dom";

export default function ProtectedRouteLogin(){
    const isLogin = localStorage.getItem("user")

    if(isLogin === null){
        return <Navigate to={"/login"}/>
    }

    return <Outlet/>
}