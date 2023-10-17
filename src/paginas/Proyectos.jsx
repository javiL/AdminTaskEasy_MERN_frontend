import useProyectos from "../hooks/useProyectos"
import PreviewProyecto from "../components/PreviewProyecto"
import Alerta from "../components/Alerta"
import {useDocumentTitle} from "../hooks/setTitlePagina"

const Proyectos = () => {

  const { proyectos, alerta } = useProyectos()

  const {msg} = alerta

  //TITLE
  const [document_title, setDocumentTitle] = useDocumentTitle("Mis Proyectos - AdminTaskEasy");
  return (
    <>
      <h1 className='text-4xl font-black'>Proyectos</h1>

      {msg && <Alerta alerta={alerta} />}

      <div className="bg-white shadow mt-10 rounded-lg">
        {proyectos.length ? 
          proyectos.map(proyecto => (
              <PreviewProyecto
                key={proyecto._id}
                proyecto={proyecto}
              />
          ))
         : <p className="text-center text-gray-600 uppercase p-5">No hay proyectos aun </p>}
      </div>
    </>
  )
}

export default Proyectos
