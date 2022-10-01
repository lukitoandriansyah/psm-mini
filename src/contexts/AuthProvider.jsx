import React, {createContext, useState} from "react";

export const AuthContext = React.createContext()

export default function AuthProvider(props){
    const [user, setUser] = useState(getUserData)
    const isLogin = Object.values(user).length>0

    function saveUserData(loginResponse){
        const formatted = JSON.stringify(loginResponse)
        localStorage.setItem("user", formatted)
        setUser(loginResponse)
    }

    function getUserData (){
        const savedData = localStorage.getItem("user")
        if (savedData){
            const parsedData = JSON.parse(savedData)
            return parsedData
        }else {
            return {}
        }
    }

    function removeUserData(){
        localStorage.removeItem("user")
    }

    const contextValue = {
        user,
        setUser,
        isLogin,
        saveUserData
    }

    return<AuthContext.Provider value={contextValue}>
        {props.children}
    </AuthContext.Provider>

}