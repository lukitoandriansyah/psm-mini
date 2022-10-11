import {Link, useNavigate} from "react-router-dom";
import {menuList} from "./menu/MenuList.jsx";
import {useEffect, useState} from "react";


export default function Sidebar() {
    let respLogout= []
    const [statusUserById, setStatusUserById] = useState()
    const [dataUserById, setDataUserById] = useState([])
    const [userUpdated, setUserUpdated] = useState([])
    const [statusUpdated, setStatusUpdated] = useState([])
    const navigate = useNavigate();

    function getUserData() {
        const savedDataUser = localStorage.getItem("user")
        if (savedDataUser) {
            return JSON.parse(savedDataUser)
        } else {
            return {}
        }
    }

    async function getUsersById() {
        try {

            const res = await fetch("https://be-psm-mini-library-system.herokuapp.com/users/profile/byid/"+getUserData().userId,
                {method: "GET"})
            const data = await res.json();
            setStatusUserById(data.status)
            setDataUserById(data.data)
        }catch (err){
            console.log(err)
            alert("There's something wrong. please try again")
        }
    }

    function saveDataTrue(dataUser, statusUser) {
        const formattedDataUserUpdated = JSON.stringify(dataUser)
        const formattedStatusUserUpdated = JSON.stringify(statusUser)

        localStorage.removeItem("user")
        localStorage.removeItem("statusLogin")

        localStorage.setItem("user", formattedDataUserUpdated)
        localStorage.setItem("statusLogin", formattedStatusUserUpdated)

        setUserUpdated(dataUser)
        setStatusUpdated(statusUser)

    }

    function saveDataFalse(dataUser, statusUser) {
        setUserUpdated(dataUser)
        setStatusUpdated(statusUser)
    }

    async function userDeleteScenario(){
        if(statusUserById === true){
            /*console.log("ya data masuk")*/
            const payload = JSON.stringify({
                username: dataUserById.username,
                password: dataUserById.password
            })
            const targetUrl = "https://be-psm-mini-library-system.herokuapp.com/auth/login"
            const method = "POST"
            const res = await fetch(targetUrl, {
                method: method,
                body: payload,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((re) => re.json())

            const respData = res.data
            const respStatus = res.status

            respStatus === true ? saveDataTrue(respData, respStatus)  : saveDataFalse(respData, respStatus)
        }else{
            localStorage.clear()
            navigate("/home")
        }
    }

    const menuProfile = [{title: "Profile", icon: "fa-user", link: "/users/" + getUserData().username,}];
    const menuLogOut = [{title: "Log Out", icon: "fa-power-off",}];

    async function logout() {
        const targetUrl = "https://be-psm-mini-library-system.herokuapp.com/auth/logout/" + getUserData().userId;
        const method = "POST";

        await fetch(targetUrl, {method: method, headers: {"Content-Type": "application/json",},})
            .then((re) => re.json())
            .then((d) => respLogout.push(d));

        if (respLogout[respLogout.length - 1].status.toString() === "true") {
            alert(respLogout[respLogout.length - 1].message.toString());
            localStorage.clear()
            setTimeout(() => {navigate("/")}, 3000, navigate("/end"));
        } else {
            respLogout[respLogout.length - 1].message.toString();
        }
    }

    function scopeAdmin(){
        return<>
            {menuList.map((menu) => <li className="nav-item" key={menu.title}><Link onClick={()=>userDeleteScenario()} className="nav-link" to={menu.link}><i className={"fas fa-fw " + menu.icon}></i>&nbsp;<span>{menu.title}</span></Link></li>)}
        </>
    }

    function scopeNonAdmin(){
        return<>
            <li className="nav-item" key={menuList[0].title}><Link onClick={()=>userDeleteScenario()} className="nav-link" to={"/user/dashboard"}><i className={"fas fa-fw " + menuList[0].icon}></i>&nbsp;<span>{menuList[0].title}</span></Link></li>
            <li className="nav-item" key={menuList[3].title}><Link onClick={()=>userDeleteScenario()} className="nav-link" to={menuList[3].link}><i className={"fas fa-fw " + menuList[3].icon}></i>&nbsp;<span>{menuList[3].title}</span></Link></li>
        </>
    }

    useEffect(()=>{
        getUsersById()
    },[])

    return (
        <>
            <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
                {/* <!-- Sidebar - Brand --> */}
                <a className="sidebar-brand d-flex align-items-center justify-content-center">
                    <div className="sidebar-brand-icon rotate-n-15"><i className="fas fa-book"></i></div>
                    <div className="sidebar-brand-text mx-3">PSM Mini Library</div>
                </a>

                {/* <!-- Divider --> */}
                <hr className="sidebar-divider my-0"/>

                {/* <!-- Nav Item - Dashboard --> */}

                {getUserData().roleName === "Admin" ? scopeAdmin() : scopeNonAdmin()}

                {/* <!-- Divider --> */}
                <hr className="sidebar-divider d-none d-md-block"/>

                {/* <!-- Sidebar Toggler (Sidebar) --> */}
                {/*<div className="text-center d-none d-md-inline">
                    <button
                        className="rounded-circle border-0"
                        id="sidebarToggle"
                    ></button>
                </div>*/}
            </ul>
        </>
    );
}
