import {createContext, useState} from "react";

export const LoginContext = createContext()
export default function LoginProvider(props){
    const [hasLogin, setHasLogin]=useState("Yes, Has Login")

    const contextValue = {
        hasLogin,
        setHasLogin
    }

    return<LoginContext.Provider value={contextValue}>
        {props.children}
    </LoginContext.Provider>
}