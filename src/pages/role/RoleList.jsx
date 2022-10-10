import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import {useDebounce} from "use-debounce";

let respStatusDelete = []
let respRoleNameRest =[]
export default function RoleList() {
    const [roles, setRoles] = useState([])
    const [searchKeyword, setSearchKeyword] = useState('')
    const [filteredUsers, setFilteredUsers] = useState([])
    const [searchKeywordDebounced] = useDebounce(searchKeyword, 500)
    const trigger = ("Rest")

    async function getUsers() {
        const keyword = searchKeyword.length > 0
            ? '&q=' + searchKeyword
            : ''
        const res = await fetch("https://be-psm-mini-library-system.herokuapp.com/role/list-role?_expand=role" + keyword,
            {method: "GET"})
        const data = await res.json();
        setRoles(data.sort((a,b)=>a.roleId-b.roleId));
    }

    async function deleteRole(roleId) {
        const res = await fetch("https://be-psm-mini-library-system.herokuapp.com/role/" + roleId, {method:"GET"})
        const resp = await res.json();

        respRoleNameRest.push(resp.data.roleName)

        trigger.toLowerCase() === respRoleNameRest[respRoleNameRest.length-1].toLowerCase() ?
            alert("This Role was set no be deleted")
            :
            axios.delete("https://be-psm-mini-library-system.herokuapp.com/role/delete/" + roleId)
                .then((re) => {respStatusDelete.push(re.data)})
                .then(() => {respStatusDelete[respStatusDelete.length - 1].status.toString() === "false" ?
                    alert("Delete Failed!!!\nThis data was referenced in user list, change them to "+trigger+" before delete this.")
                    :
                    ""})
                .then(() => {getUsers()})
                .catch(err => {alert("Delete Failed!!!\nThis data was referenced in user list, change them to "+trigger+" before delete this.")})

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
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                {/*<div className={"m-0 font-weight-bold text-primary fa fa-arrow-circle-left"} onClick={event => back(event)}>
                    &nbsp;
                    Back
                </div>*/}

                <h6 className="m-0 font-weight-bold text-primary">List Role</h6>

                <form
                    className="d-none d-sm-inline-block form-inline navbar-search">
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

                <Link to={"/roles/add"}>
                    <button className="btn btn-primary">
                        Add Role
                    </button>
                </Link>
            </div>
            <div className="card-body">
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
                                        <button className="btn btn-primary" onClick={()=>alert("This Role was set no be edited")}>Edit</button>
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
            </div>
        </div>
    </>
}