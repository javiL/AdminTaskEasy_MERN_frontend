import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import Alerta from "../components/Alerta"
import clienteAxios from "../config/clienteAxios"
import useAuth from "../hooks/useAuth"
import {useDocumentTitle} from "../hooks/setTitlePagina"

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [alerta, setAlerta] = useState({})
    const [type, setType] = useState('password');
    const [icon, setIcon] = useState(
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
    );

    const handleToggle = () => {
        if (type==='password'){
           setIcon(
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
           );
           setType('text')
        } else {
           setIcon(
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
           )
           setType('password')
        }
     }

    const {setAuth} = useAuth()

    const navigate = useNavigate()

    const handleSubmit = async e => {
        e.preventDefault()

        if ([email, password].includes('')){
            setAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true,
            })
            return
        }

        

        try {
            const {data} = await clienteAxios.post('/usuarios/login', {email, password})
            setAlerta({})
            localStorage.setItem('token', data.token)
            setAuth(data)
            navigate('/proyectos')
        } catch (error) {
            setAlerta({
                msg:error.response.data.msg,
                error:true,
            })
        }

    }

    const {msg} = alerta

    //TITLE
    const [document_title, setDocumentTitle] = useDocumentTitle("Login - AdminTaskEasy");
  return (
    <>
        <h1 className="text-sky-600 font-black text-5xl capitalize text-center">
            Inicio sesión y administra tus <span className="text-slate-700">proyectos</span>
        </h1>

        {msg && <Alerta alerta={alerta} />}

        <form 
            className="my-10 bg-white shadow rounded-lg p-10"
            onSubmit={handleSubmit}
        >
            <div className="my-5 ">
                <label 
                    className="uppercase text-gray-600 block text-xl font-bold"
                    htmlFor="email"
                    >Email
                </label>
                <input 
                    id="email"
                    type="email"
                    placeholder="Tu email"
                    className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                    value={email}
                    onChange={ e => setEmail(e.target.value)}
                />
            </div>

            <div className="my-5 ">
                <label 
                    className="uppercase text-gray-600 block text-xl font-bold"
                    htmlFor="password"
                    >Password
                </label>
                    <div className="mb-4 flex">
                    <input 
                        id="password"
                        type={type}
                        placeholder="Tu password"
                        className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                        value={password}
                        onChange={ e => setPassword(e.target.value)}
                    />
                    <span className="flex justify-around items-center" onClick={handleToggle}>
                        <span className="absolute mr-14 mt-3">{icon}</span>
                    </span>
                    </div>
                <input 
                    type="submit"
                    value="Iniciar sesión"
                    className="bg-sky-700 mt-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
                />
            </div>
        </form>

        <nav className="lg:flex lg:justify-between">
            <Link
                className="block text-center my-5 text-slate-500 uppercase text-sm"
                to="/registrar"
            >Registrate aquí</Link>
            <Link
                className="block text-center my-5 text-slate-500 uppercase text-sm"
                to="/olvide-password"
            >Has olvidado tu password?</Link>
        </nav>
    </>
  )
}

export default Login
