import React from "react";

// Componente funcional que recibe como prop:
// historial → un array de objetos que contiene los procesos completados.
const HistorialProcesos = ({ procesos, tiempoActual }) => {
    const calcularPromedios = () => {
        if (procesos.length === 0) return { espera: 0, indiceServicio: 0 };

        const totalEspera = procesos.reduce((sum, p) => sum + p.tiempoEspera, 0);

        // Promedio de índice de servicio = promedio de (rafaga / tiempoRetorno)
        const indices = procesos
            .filter(p => p.tiempoRetorno > 0)
            .map(p => p.rafaga / p.tiempoRetorno);

        const promedioIndiceServicio = indices.length > 0
            ? indices.reduce((a, b) => a + b, 0) / indices.length
            : 0;

        return {
            espera: (totalEspera / procesos.length).toFixed(2),
            indiceServicio: promedioIndiceServicio.toFixed(2)
        };
    };

    const promedios = calcularPromedios();

    return (
        // Contenedor principal con estilos (fondo blanco, bordes, sombra, etc.)
        <div className="mt-10 bg-white p-6 rounded-2xl border border-gray-200 shadow-xl">

            {/* Título de la sección */}
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Resumen de Procesos Completados
            </h2>

            <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Estadísticas de Procesos
            </h3>

            <div className="estadisticas-generales grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="stat-box p-4 bg-gray-50 rounded-lg shadow">
                    <span className="stat-label block text-sm font-medium text-black-500">Tiempo Total:</span>
                    <span className="stat-value block text-xl font-bold text-gray-900">{tiempoActual}</span>
                </div>
                <div className="stat-box p-4 bg-gray-50 rounded-lg shadow">
                    <span className="stat-label block text-sm font-medium text-black-500">Procesos Finalizados:</span>
                    <span className="stat-value block text-xl font-bold text-gray-900">{procesos.length}</span>
                </div>
                <div className="stat-box p-4 bg-gray-50 rounded-lg shadow">
                    <span className="stat-label block text-sm font-medium text-black-500">Tiempo Espera Promedio:</span>
                    <span className="stat-value block text-xl font-bold text-gray-900">{promedios.espera}</span>
                </div>
                <div className="stat-box p-4 bg-gray-50 rounded-lg shadow">
                    <span className="stat-label block text-sm font-medium text-black-500">Indice de Servicio Promedio:</span>
                    <span className="stat-value block text-xl font-bold text-gray-900">{promedios.indiceServicio}</span>
                </div>
            </div>

            {/* Contenedor con scroll horizontal para la tabla */}
            <div id="historyTableContainer" className="overflow-x-auto">

                {/* Si el historial está vacío, mostramos un mensaje */}
                {procesos.length === 0 ? (
                    <p
                        id="historyPlaceholder"
                        className="text-center text-gray-400 italic mt-4"
                    >
                        No hay procesos completados.
                    </p>
                ) : (
                    // Si hay datos en historial, mostramos la tabla
                    <div className="tabla-estadisticas">
                        <table className="min-w-full divide-y divide-gray-200">

                            {/* Encabezado de la tabla */}
                            <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proceso</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instante de Llegada</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiempo de CPU</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instante de Finalización</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiempo de Espera</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiempo de Retorno</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Indice de Servicio</th>
                            </tr>
                            </thead>

                            {/* Cuerpo de la tabla */}
                            <tbody id="historyTableBody" className="bg-white divide-y divide-gray-200">
                            {procesos.map((proceso, index) => (
                                // Cada fila representa un proceso completado
                                <tr key={proceso.id}>
                                    {/* Se muestran las propiedades del proceso */}
                                    {/* Mostrar id real si existe (permite ver P0); si no usar índice */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{proceso.nombre && proceso.nombre.trim() !== '' ? proceso.nombre : `P${proceso.id !== undefined ? proceso.id : index}`}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proceso.llegada}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proceso.rafaga}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proceso.tiempoFinalizacion}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proceso.tiempoEspera}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proceso.tiempoRetorno}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {proceso.tiempoRetorno > 0 ? (proceso.rafaga / proceso.tiempoRetorno).toFixed(2) : '—'}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

// Exportamos el componente para usarlo en otros archivos
export default HistorialProcesos;
