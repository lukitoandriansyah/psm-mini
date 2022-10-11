import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import {useDebounce} from "use-debounce";
import Spinner from "../../components/Spinner/Spinner"

let respStatusDelete = []
let respRoleNameRest =[]
export default function RoleList() {
    const [roles, setRoles] = useState([])
    const [searchKeyword, setSearchKeyword] = useState('')
    const [filteredUsers, setFilteredUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const [searchKeywordDebounced] = useDebounce(searchKeyword, 500)
    const trigger = ("Rest")

    async function getUsers() {
        const keyword = searchKeyword.length > 0
            ? '&q=' + searchKeyword
            : ''
        try {
            const res = await fetch("https://be-psm-mini-library-system.herokuapp.com/role/list-role?_expand=role" + keyword,
                {method: "GET"})
            const data = await res.json();
            setRoles(data.sort((a,b)=>a.roleId-b.roleId));
        }catch (err){
            console.log(err)
            alert("There's something wrong. please try again")
        }finally {
            setIsLoading(false)
        }
    }

    async function deleteRole(roleId) {
        setIsLoading(true)
        const res = await fetch("https://be-psm-mini-library-system.herokuapp.com/role/" + roleId, {method:"GET"})
        const resp = await res.json();

        respRoleNameRest.push(resp.data.roleName)

        if(trigger.toLowerCase() === respRoleNameRest[respRoleNameRest.length-1].toLowerCase()){
            alert("This Role was set no be deleted")
            getUsers()
        }else {
            try {
                const res = await axios.delete("https://be-psm-mini-library-system.herokuapp.com/role/delete/" + roleId)
                const resp = await res.data
                respStatusDelete.push(resp)
                if(respStatusDelete[respStatusDelete.length - 1].status === false){
                    alert("Delete Failed!!!\nThis data was referenced in user list, change them to "+trigger+" before delete this.")
                    getUsers()
                }else {
                    getUsers()
                }
            }catch (err){
                alert("Delete Failed!!!\nThis data was referenced in user list, change them to "+trigger+" before delete this.")
                getUsers()
            }
        }
    }

    function back(event) {
        event.preventDefault()
        history.go(-1)
    }

    useEffect(() => {
        getUsers()
    }, [searchKeywordDebounced])

    useEffect(() => {
        if (searchKeyword.length > 0) {
            const filterResult = roles.filter((role) => {
                const a = role.roleName.toLowerCase().includes(searchKeyword.toLowerCase())
                return a
            })
            setFilteredUsers(filterResult)
        } else {
            setFilteredUsers(roles)
        }
    }, [searchKeyword, roles])

    return <>
        <div className="card shadow mb-4">
            <div className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                <ul className={"navbar-nav mr-auto"}>
                    <h6 className="m-0 font-weight-bold text-primary">List Role</h6>
                </ul>
                <form
                    className="d-none d-sm-inline-block form-inline mr-md-3 ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                    <div className="input-group">
                        <input type="text" className="form-control bg-md-white-auth-end border-0 small" placeholder="find role"
                               aria-label="Search" aria-describedby="basic-addon2" value={searchKeyword}
                               onChange={evt => setSearchKeyword(evt.target.value)}/>
                        <div className="input-group-append">
                            <button className="btn btn-primary" type="button">
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
                                    <input type="text" className="form-control bg-md-white-auth-end border-0 small" placeholder="find role"
                                           aria-label="Search" aria-describedby="basic-addon2" value={searchKeyword}
                                           onChange={evt => setSearchKeyword(evt.target.value)}/>
                                    <div className="input-group-append">
                                        <button className="btn btn-primary" type="button">
                                            <i className="fas fa-search fa-sm"></i>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </ul>

                <ul className={"navbar-nav ml-auto"}>
                    <Link to={"/roles/add"} className="dropdown no-arrow d-sm-none">
                        <button className="btn btn-primary">
                            <strong>+</strong>
                        </button>
                    </Link>
                </ul>

                <Link to={"/roles/add"} className="d-none d-sm-inline-block form-inline mr-0 ml-md-3 my-2 my-md-0 mw-100">
                    <button className="btn btn-primary">
                        Add Role
                    </button>
                </Link>

            </div>

            <div className="card-body">
                {isLoading?
                    <div className="d-flex justify-content-center">
                        <Spinner />
                    </div>
                    :
                    <div className="table-responsive">
                        <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                            <thead>
                            <tr>
                                <th scope="col">No</th>
                                <th scope="col">Role</th>
                                <th scope="col">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredUsers.map((role, index) =>
                                <tr key={role.roleId}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{role.roleName}</td>
                                    <td>{
                                        role.roleName === trigger ?
                                            <button className="btn btn-primary" onClick={()=>{setIsLoading(true); alert("This Role was set no be edited"); getUsers()}}>Edit</button>
                                            :
                                            <Link to={"/roles/" + role.roleId}><button className="btn btn-primary">Edit</button></Link>
                                    }
                                        &nbsp;&nbsp;
                                        <button className="btn btn-danger" onClick={() => deleteRole(role.roleId)}>Delete</button>
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