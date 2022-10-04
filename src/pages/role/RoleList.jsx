import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";

let responses = []
export default function RoleList() {
    const [roles, setRoles] = useState([])

    async function getUsers() {
        const res = await fetch("https://be-psm-mini-library-system.herokuapp.com/role/list-role",
            {method: "GET"})
        const data = await res.json();
        setRoles(data);
    }

    function deleteRole(roleId) {
        axios
            .delete("https://be-psm-mini-library-system.herokuapp.com/role/delete/" + roleId)
            .then((re) => {
                responses.push(re.data)
            })
            .then(() => {
                responses[responses.length - 1].status.toString() === "false" ?
                    alert(responses[responses.length - 1].message.toString())
                    :
                    ""
            })
            .then(() => {
                getUsers()
            })
            .catch(err => {
                console.log(err)
                alert('Ada masalah saat memproses data')
            })

    }

    function back(event) {
        event.preventDefault()
        history.go(-1)
    }

    useEffect(() => {
        getUsers()
    }, [])

    return <>
        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <div className={"m-0 font-weight-bold text-primary fa fa-arrow-circle-left"}
                     onClick={event => back(event)}>
                    &nbsp;
                    Back
                </div>

                <h6 className="m-0 font-weight-bold text-primary">Daftar Role</h6>

                <Link to={"/roles/add"}>
                    <button className="btn btn-primary">
                        Create New Role
                    </button>
                </Link>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-bordered"
                           id="dataTable"
                           width="100%"
                           cellSpacing="0">
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Rolename</th>
                            <th scope="col">Role Id</th>
                            <th scope="col">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {roles.map((role, index) =>
                            <tr key={role.roleId}>
                                <th scope="row">{index + 1}</th>
                                <td>{role.roleName}</td>
                                <td>{role.roleId}</td>
                                <td>
                                    <Link to={"/roles/" + role.roleId}>
                                        <button className="btn btn-primary">Edit</button>
                                    </Link>
                                    &nbsp;&nbsp;

                                    <button
                                        className="btn btn-danger"
                                        onClick={() => deleteRole(role.roleId)}>
                                        Delete
                                    </button>
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