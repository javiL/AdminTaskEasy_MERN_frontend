import { useState, useEffect } from "react"
import useProyectos from "../hooks/useProyectos"
import { useParams } from "react-router-dom"
import Alerta from './Alerta'

const FormularioProyecto = () => {

    const params = useParams()

    //PROVIDER
    const {mostrarAlerta, alerta, submitProyecto, proyecto} = useProyectos()

    //States del formulario
    const [nombre, setNombre] = useState(params.id ? proyecto.nombre : '')     
    const [descripcion, setDescripcion] = useState(params.id ? proyecto.descripcion : '')     
    const [fechaEntrega, setFechaEntrega] = useState(params.id ? proyecto.fechaEntrega?.slice(0, 10) : '')     
    const [cliente, setCliente] = useState(params.id ? proyecto.cliente : '')

    const [id, setId] = useState(params.id ? proyecto._id : null)


    //Función para manejar el SUBMIT
    const handleSubmit = async e => {
        e.preventDefault()

        if([nombre, descripcion, fechaEntrega, cliente].includes('')) {
            mostrarAlerta({
                msg: "Todos los campos son obligatorios",
                error: true
            })

            return
        }

        // Pasar datos hacia Provider
        await submitProyecto({id, nombre, descripcion, fechaEntrega, cliente})

        setId(null)
        setNombre('')
        setDescripcion('')
        setFechaEntrega('')
        setCliente('')
    }

    const {msg} = alerta

  return (
    <form className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow"
        onSubmit={handleSubmit}
    >

        {msg && <Alerta alerta={alerta} />}

        <div className="mb-5">
            <label
                className="text-gray-700 uppercase font-bold text-sm"
                htmlFor="nombre"
            >
            Nombre Proyecto
            </label>

            <input
                id="nombre"
                type="text"
                className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                placeholder="Nombre del proyecto"
                value={nombre}
                onChange={ e => setNombre(e.target.value)}
            />
        </div>

        <div className="mb-5">
            <label
                className="text-gray-700 uppercase font-bold text-sm"
                htmlFor="descripcion"
            >
            Descripción
            </label>

            <textarea
                id="descripcion"
                type="text"
                className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                placeholder="Descripción del proyecto"
                value={descripcion}
                onChange={ e => setDescripcion(e.target.value)}
            />
        </div>

        <div className="mb-5">
            <label
                className="text-gray-700 uppercase font-bold text-sm"
                htmlFor="fecha-entrega"
            >
            Fecha Entrega
            </label>

            <input
                id="fecha-entrega"
                type="date"
                className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                value={fechaEntrega}
                onChange={ e => setFechaEntrega(e.target.value)}
            />
        </div>

        <div className="mb-5">
            <label
                className="text-gray-700 uppercase font-bold text-sm"
                htmlFor="cliente"
            >
            Nombre Cliente
            </label>

            <input
                id="cliente"
                type="text"
                className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                placeholder="Nombre del cliente"
                value={cliente}
                onChange={ e => setCliente(e.target.value)}
            />
        </div>

            <input
                type="submit"
                value={id ? 'Actualizar Proyecto' : 'Crear Proyecto'}
                className="bg-sky-600 w-full p-3 uppercase font-bold text-white cursor-pointer hover:bg-sky-700 transition-colors"
            />
    </form>
  )
}

export default FormularioProyecto
