import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {useDebounce} from "use-debounce";
import Spinner from "../../components/Spinner/Spinner.jsx";
import {Url} from "../../partials/url-BE/Url.jsx";

export default function UserList() {
    const [users, setUsers] = useState([])
    const [userBooks, setUserBooks] = useState([])
    const [searchKeyword, setSearchKeyword] = useState('')
    const [filteredUsers, setFilteredUsers] = useState([])
    const [statusUserById, setStatusUserById] = useState()
    const [dataUserById, setDataUserById] = useState([])
    const [userUpdated, setUserUpdated] = useState([])
    const [statusUpdated, setStatusUpdated] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchKeywordDebounced] = useDebounce(searchKeyword, 500)
    const navigate =  useNavigate()


    async function getUsers() {
        const keyword = searchKeyword.length > 0
            ? '&q=' + searchKeyword
            : ''
        try {
            const res = await fetch(Url+"/users/list-user?_expand=user" + keyword,
                {method: "GET"})
            const data = await res.json();
            setUsers(data.sort((a,b)=>a.userId-b.userId));
        }catch (err){
            alert("There's something wrong. please try again")
        }finally {
            setIsLoading(false)
        }
    }

    async function getUserBooks() {
        /*        setIsLoading(true)*/
        try {
            const res = await fetch(Url+"/userbook/list-userbook",
                {method: "GET"})
            const data = await res.json();
            setUserBooks(data.sort((a,b)=>a.userbookId-b.userbookId));
        }catch (err){
            console.log(err)
            alert("There's something wrong. please try again")
        }finally {
            setIsLoading(false)
        }
    }

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

            const res = await fetch(Url+"/users/profile/byid/"+getUserData().userId,
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
            const targetUrl = Url+"/auth/login"
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

    async function deleteData(userId) {
        /*        setIsLoading(true)*/
        userDeleteScenario()
        try {
            const res = await axios.delete(Url+"/users/delete/" + userId)
            const resp = res.data
            if( resp.status === false ){
                alert("Delete Failed!!!\nThis data was referenced in user book list, delete them before delete this.")
                getUsers()
            }else {
                getUsers()
            }
        }catch (err){
            alert("Delete Failed!!!\nThis data was referenced in user book list, delete them before delete this.")
            getUsers()
        }
    }

    function back(event) {
        event.preventDefault()
        history.go(-1)
    }

    useEffect(()=>{
        getUsersById()
    },[])

    useEffect(() => {
        getUsers()
        getUserBooks()
    }, [searchKeywordDebounced])

    useEffect(() => {
        /*        setIsLoading(true)*/
        if (searchKeyword.length > 0) {
            const filterResult = users.filter((user) => {
                function params(){
                    const a = user.roleName.toLowerCase().includes(searchKeyword.toLowerCase())
                    const b = user.name.toLowerCase().includes(searchKeyword.toLowerCase())
                    const c = user.username.toLowerCase().includes(searchKeyword.toLowerCase())
                    if(a){return a}
                    if(b){return b}
                    if(c){return c}
                }
                return params()

            })
            setFilteredUsers(filterResult)
        } else {
            setFilteredUsers(users)
        }
    }, [searchKeyword, users])

    return <>
        <div className="card shadow mb-4">
            <div className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                <ul className={"navbar-nav mr-auto"}>
                    <h6 className="m-0 font-weight-bold text-primary">List User</h6>
                </ul>
                <form
                    className="d-none d-sm-inline-block form-inline mr-md-3 ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                    <div className="input-group">
                        <input type="text" className="form-control bg-md-white-auth-end border-0 small" placeholder="find user"
                               aria-label="Search" aria-describedby="basic-addon2" value={searchKeyword}
                               onChange={evt => setSearchKeyword(evt.target.value)}/>
                        <div className="input-group-append">
                            <button className="btn btn-primary" type="button" onClick={()=>userDeleteScenario()}>
                                <i className="fas fa-search fa-sm"></i>
                            </button>
                        </div>
                    </div>
                </form>

                <ul className="navbar-nav md-center">
                    <div className="dropdown no-arrow d-sm-none">
                        <a className="dropdown-toggle" href="#" id="searchDropdown" role="button"
                           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="fas fa-search fa-fw"></i>
                        </a>
                        <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                             aria-labelledby="searchDropdown">
                            <form className="form-inline mr-auto w-100 navbar-search">
                                <div className="input-group">
                                    <input type="text" className="form-control bg-light border-0 small"
                                           placeholder="find user" aria-label="Search"
                                           aria-describedby="basic-addon2" value={searchKeyword}
                                           onChange={evt => setSearchKeyword(evt.target.value)}/>
                                    <div className="input-group-append">
                                        <button className="btn btn-primary" type="button" onClick={()=>userDeleteScenario()}>
                                            <i className="fas fa-search fa-sm"></i>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </ul>

                <ul className={"navbar-nav ml-auto"}>
                    <Link onClick={()=>userDeleteScenario()} to="/register" className="dropdown no-arrow d-sm-none">
                        <button className="btn btn-primary">
                            <strong>+</strong>
                        </button>
                    </Link>
                </ul>

                <Link onClick={()=>userDeleteScenario()} to="/register" className="d-none d-sm-inline-block form-inline mr-0 ml-md-3 my-2 my-md-0 mw-100">
                    <button className="btn btn-primary">
                        Add User
                    </button>
                </Link>

            </div>

            <div className="card-body">
                {isLoading?
                    <div className="d-flex justify-content-center">
                        <Spinner />
                    </div>
                    :
                    <div className={"table-responsive"}>
                        <table className="table table-bordered"
                               id="dataTable"
                               width="100%"
                               cellSpacing="0">
                            <thead>
                            <tr>
                                <th scope="col">No</th>
                                <th scope="col">Name</th>
                                <th scope="col">Username</th>
                                <th scope="col">Role</th>
                                <th scope="col">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredUsers.map((user, index) =>
                                <tr key={user.userId}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{user.name}</td>
                                    <td>{user.username}</td>
                                    <td>{user.roleName}</td>
                                    <td>
                                        <Link onClick={()=>userDeleteScenario()} to={"/users/" + user.username}>
                                            <button className="btn btn-primary">view</button>
                                        </Link>
                                        &nbsp;&nbsp;
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => deleteData(user.userId)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                }
            </div>
        </div>
    </>
}