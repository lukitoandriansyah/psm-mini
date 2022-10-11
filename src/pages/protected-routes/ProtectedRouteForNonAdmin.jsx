import {Navigate, Outlet, useParams} from "react-router-dom";

export default function ProtectedRouteForNonAdmin(){
    const isLogin = localStorage.getItem("user")
    const params = useParams()

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
        if (getUserData().roleName === "Admin"){
            return <Outlet/>
        }else {
            if(getUserData().username === params.username){
                return <Outlet/>
            }else{
                alert("You no permitted to see these page")
                return <Navigate to={"/user/dashboard"}/>
            }
        }
    }

}