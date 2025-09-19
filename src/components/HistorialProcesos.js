import React from "react";
// Importamos React para poder usar JSX y crear el componente funcional.

// Componente funcional que recibe como prop:
// historial → un array de objetos que contiene los procesos completados.
const HistorialProcesos = ({ historial }) => {
    return (
        // Contenedor principal con estilos (fondo blanco, bordes, sombra, etc.)
        <div className="mt-10 bg-white p-6 rounded-2xl border border-gray-200 shadow-xl">

            {/* Título de la sección */}
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Historial de Procesos Completados
            </h2>

            {/* Contenedor con scroll horizontal para la tabla */}
            <div id="historyTableContainer" className="overflow-x-auto">

                {/* Si el historial está vacío, mostramos un mensaje */}
                {historial.length === 0 ? (
                    <p
                        id="historyPlaceholder"
                        className="text-center text-gray-400 italic mt-4"
                    >
                        No hay procesos completados.
                    </p>
                ) : (
                    // Si hay datos en historial, mostramos la tabla
                    <table className="min-w-full divide-y divide-gray-200">

                        {/* Encabezado de la tabla */}
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Llegada</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ejecución</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Finalización</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiempo de Retorno</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiempo de Espera</th>
                        </tr>
                        </thead>

                        {/* Cuerpo de la tabla */}
                        <tbody id="historyTableBody" className="bg-white divide-y divide-gray-200">
                        {historial.map((p, index) => (
                            // Cada fila representa un proceso completado
                            <tr key={index}>
                                {/* Se muestran las propiedades del proceso */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.pid}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.arrivalTime}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.cpuTime}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.finishTime}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.turnaroundTime}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.waitingTime}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

// Exportamos el componente para usarlo en otros archivos
export default HistorialProcesos;
