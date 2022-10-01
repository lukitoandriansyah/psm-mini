import {useContext} from "react";
import {AuthContext} from "./contexts/AuthProvider.jsx";
import {Navigate, Outlet} from "react-router-dom";

export default function ProtectedRoute(){
    const isLogin = localStorage.getItem("uId")
    if(isLogin === null){
        return <Navigate to={"/login"}/>
    }
    return <Outlet/>
}