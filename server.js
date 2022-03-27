const express = require("express");
const app = express();
const port = 8000;

app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );

const todos = [{
    nombre:'aprender programacion',
    status:'En Progreso',
    id:123
},
{
    nombre:'aprender eventos en react',
    status:'Completado',
    id:456
}];

app.get( '/api/todos', ( request, response )=>{
    return response.status( 200 ).json({mensaje:'exito get', todos:todos} );
})

// //// TIPO QUERY /////////////////////////////////
app.get( '/api/todo/buscar',( request, response )=>{
    
    const { id } = request.query;
    const todoEncontrado = todos.find((todo)=>todo.id===Number(id));

    if( todoEncontrado ) {
        return response.status(200).json(todoEncontrado)
    }else{
        response.statusMessage = `Todo no encontrado con id ${id}`;
        return response.status(404).end();
    }
})
// //// TIPO PARAM /////////////////////////////////////
app.get( '/api/todo/buscar/:id', (request, response)=>{
    const { id } = request.params;
    const todoEncontrado = todos.find((todo)=>todo.id===Number(id));

    if( todoEncontrado ) {
        return response.status(200).json(todoEncontrado)
    }else{
        response.statusMessage = `Todo no encontrado con id ${id}`;
        return response.status(404).end();
    }
})
// //// POST ////////////////////////////////////////////////////
app.post ( '/api/todo/nuevo', ( request,response ) => {
    const {id, nombre, status } = request.body;
    if (!id || !nombre || !status) {
        response.statusMessage = "para crear un nuevo todo es necesario enviar los campos"
        return response.status(406).end();
    }else{
        const todoEncontrado = todos.find((todo) => todo.id===id);
        if (todoEncontrado) {
            response.statusMessage = `el id ${id} ya se encuentra en la lista utilizar otro diferente`;
            return response.status(406).end();
        }else{
            const todoNuevo = {
                id,nombre,status
            };
            todos.push(todoNuevo);
            return response.status(201).json();
        }
    }
})
app.put( '/api/todo/actualizar', (request,response)=>{
    const { id, status, nombre } = request.body;

    const todoEncontrado = todos.find((todo)=>todo.id===id);
    const indiceTodo = todos.findIndex((todo)=>todo.id===id);

    if ( todoEncontrado ) {
        todos[ indiceTodo ] = {
            id:id,
            status: (status)?status:todos[indiceTodo].status,
            nombre: (nombre)?nombre:todos[indiceTodo].nombre
        }

        return response.status(200).json(todos[indiceTodo])
    }else{
        response.statusMessage(`Todo no encontrado con id ${id}`);
        return response.status(404).end();
    }
});

app.delete( '/api/todo/eliminar/:id', (request,response)=>{
    const {id} = request.params;
    const indiceTodo = todos.findIndex((todo)=>todo.id===Number(id));
    if (indiceTodo===-1) {
        response.statusMessage=`todo no encontrado con id ${id}`;
        return response.status(404).end();
    }else{
        todos.splice(indiceTodo,1)
        return response.status(204).end();
    }
});
app.listen( port, () => console.log(`Listening on port: ${port}`) );