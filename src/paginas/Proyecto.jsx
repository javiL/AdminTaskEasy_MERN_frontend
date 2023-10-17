import { useEffect } from 'react'
import {useParams, Link} from 'react-router-dom'
import useProyectos from '../hooks/useProyectos'
import ModalFormularioTarea from '../components/ModalFormularioTarea'
import ModalEliminarTarea from '../components/ModalEliminarTarea'
import Tarea from '../components/Tarea'
import Colaborador from '../components/Colaborador'
import ModalEliminarColaborador from '../components/ModalEliminarColaborador'
import useAdmin from '../hooks/useAdmin'
import io from 'socket.io-client'
import {useDocumentTitle} from '../hooks/setTitlePagina'

let socket

const Proyecto = () => {
    const params = useParams()
    const {obtenerProyecto, proyecto, cargando, handleModalTarea, alerta, submitTareasProyecto, eliminarTareaProyecto, actualizarTareaProyecto, editEstadoTarea} = useProyectos()
    
    const isAdmin = useAdmin()

    useEffect(() => {
        obtenerProyecto(params.id)
    },[])

    const { nombre } = proyecto
    const [document_title, setDocumentTitle] = useDocumentTitle(`Mi Proyecto: ${nombre}`);

    //TITLE DINAMICO
    useEffect(() => {
        setDocumentTitle(`Mi Proyecto: ${nombre}`)
    },[obtenerProyecto])

    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL)
        socket.emit('abrir proyecto', params.id)

        return () => {
            socket.disconnect()
        }

    },[])

    useEffect(() => {
        if(!proyecto.nombre || cargando) return

        socket.on('tarea agregada', tareaNueva => {
            submitTareasProyecto(tareaNueva)
        })

        socket.on('tarea eliminada', tareaEliminada => {
            eliminarTareaProyecto(tareaEliminada)
        })

        socket.on('tarea actualizada', tareaActualizada => {
            actualizarTareaProyecto(tareaActualizada)
        })

        socket.on('nuevo estado', nuevoEstadoTarea => {
            editEstadoTarea(nuevoEstadoTarea)
        })

        return () => {
            socket.off('tarea agregada')
            socket.off('tarea eliminada')
            socket.off('tarea actualizada')
            socket.off('nuevo estado')
        }
    })

    if(cargando) return 'Cargando...'
    const { msg } = alerta

    
  return  (
        <>
        <div className='flex justify-between'>
            <h1 className='font-black text-4xl'>{nombre}</h1>
            
            
            {isAdmin && (
                <div className='flex items-center text-gray-400 hover:text-black'>
                        <Link
                            to={`/proyectos/editar/${params.id}`}
                            className='uppercase font-bold'
                        >
                            <div className='flex items-start gap-1'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                            
                            Editar
                            </div>
                        </Link>
                </div>
            )}
        </div>
            
        {isAdmin && (
        <button
                onClick={ handleModalTarea }
                type="button"
                className='text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center mt-5 flex gap-2 items-center'
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M6 3a3 3 0 00-3 3v2.25a3 3 0 003 3h2.25a3 3 0 003-3V6a3 3 0 00-3-3H6zM15.75 3a3 3 0 00-3 3v2.25a3 3 0 003 3H18a3 3 0 003-3V6a3 3 0 00-3-3h-2.25zM6 12.75a3 3 0 00-3 3V18a3 3 0 003 3h2.25a3 3 0 003-3v-2.25a3 3 0 00-3-3H6zM17.625 13.5a.75.75 0 00-1.5 0v2.625H13.5a.75.75 0 000 1.5h2.625v2.625a.75.75 0 001.5 0v-2.625h2.625a.75.75 0 000-1.5h-2.625V13.5z" />
                </svg>
                Nueva Tarea
        </button>
        )}

        <p className='font-bold text-xl mt-10'>Tareas del Proyecto</p>
        

        <div className='bg-white shadow mt-10 rounded-lg'>

            {proyecto.tareas?.length ? 
            //Iteración con componentes para mostrar las tareas
            proyecto.tareas?.map (tarea => (
                <Tarea 
                key={tarea._id}
                tarea={tarea}
                />
                
            )) : 
            <p className='text-center my-5 p-10'>No hay tareas en este proyecto</p>}
        </div>
        {isAdmin && (
        <>
            <div className='flex items-center justify-between mt-2'>
                <p className='font-bold text-xl mt-10'>Colaboradores</p>
                <Link
                    to={`/proyectos/nuevo-colaborador/${proyecto._id}`}
                    className='text-gray-400 hover:text-black uppercase font-bold'
                >Añadir</Link>
            </div>

            <div className='bg-white shadow mt-10 rounded-lg'>

                {proyecto.colaboradores?.length ? 
                //Iteración con componentes para mostrar los colaboradores
                proyecto.colaboradores?.map (colaborador => (
                    <Colaborador 
                        key={colaborador._id}
                        colaborador={colaborador}
                    />      
                )) : 
                <p className='text-center my-5 p-10'>No hay colaboradores en este proyecto</p>}
            </div>
        </>
        )}
        

        <ModalFormularioTarea/>
        <ModalEliminarTarea />
        <ModalEliminarColaborador />
    </>
  )
}

export default Proyecto
