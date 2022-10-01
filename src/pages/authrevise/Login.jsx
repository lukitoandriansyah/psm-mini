/*
import axios from "axios"
import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import {AuthContext} from "../../contexts/AuthProvider.jsx";

export default function Login () {
	const navigate = useNavigate()
	const authCtx = useContext(uthContext)

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	async function handleLogin (evt) {
		evt.preventDefault()

		const res = await axios.post('https://be-library-mini-system.herokuapp.com/auth/login', {
			username,
			password,
		})

		authCtx.saveUserData(res.data.data)
	}

	return <>
		<form onSubmit={handleLogin}>
			<label>
				Username: <br />
				<input
					type="text"
					required
					value={username}
					onChange={evt => setUsername(evt.target.value)} />
			</label>

			<br /><br />

			<label>
				Password: <br />
				<input
					type="password"
					required
					value={password}
					onChange={evt => setPassword(evt.target.value)} />
			</label>

			<br /><br />

			<button>
				Login
			</button>
		</form>

		<br /><hr /><br />

		<h3>Data yg udah masuk</h3>

		<p>userId: {authCtx?.userData?.userId}</p>
		<p>nama: {authCtx?.userData?.name}</p>
		<p>role: {authCtx?.userData?.roleName}</p>
	</>


 */