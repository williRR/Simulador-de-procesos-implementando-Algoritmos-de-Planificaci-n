import React, { useState } from 'react';

const HistorialCompleto = ({ historialSimulaciones }) => {
    const [simulacionSeleccionada, setSimulacionSeleccionada] = useState(null);

    if (historialSimulaciones.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Historial de Simulaciones</h2>
                <p className="text-gray-500">No hay simulaciones guardadas aún.</p>
            </div>
        );
    }

    const simulacion = Number.isInteger(simulacionSeleccionada) 
        ? historialSimulaciones[simulacionSeleccionada] 
        : null;

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Historial de Simulaciones</h2>
            
            {/* Selector de simulación */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar Simulación:
                </label>
                <select
                    value={Number.isInteger(simulacionSeleccionada) ? simulacionSeleccionada : ''}
                    onChange={(e) => {
                        const val = e.target.value;
                        setSimulacionSeleccionada(val === '' ? null : parseInt(val, 10));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">-- Seleccione una simulación --</option>
                    {historialSimulaciones.map((sim, index) => (
                        <option key={index} value={index}>
                            {sim.algoritmo} - {new Date(sim.fecha).toLocaleString()} ({sim.procesos.length} procesos)
                        </option>
                    ))}
                </select>
            </div>

            {/* Detalle de la simulación seleccionada */}
            {simulacion && (
                <div>
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <h3 className="font-bold text-lg mb-2">Información de la Simulación</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm text-gray-600">Algoritmo:</span>
                                <span className="block font-semibold">{simulacion.algoritmo}</span>
                            </div>
                            <div>
                                <span className="text-sm text-gray-600">Fecha:</span>
                                <span className="block font-semibold">{new Date(simulacion.fecha).toLocaleString()}</span>
                            </div>
                            <div>
                                <span className="text-sm text-gray-600">Tiempo Total:</span>
                                <span className="block font-semibold">{simulacion.tiempoTotal}</span>
                            </div>
                            <div>
                                <span className="text-sm text-gray-600">Procesos:</span>
                                <span className="block font-semibold">{simulacion.procesos.length}</span>
                            </div>
                            {simulacion.quantum && (
                                <div>
                                    <span className="text-sm text-gray-600">Quantum:</span>
                                    <span className="block font-semibold">{simulacion.quantum}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div className="stat-box p-4 bg-gray-50 rounded-lg shadow">
                            <span className="stat-label block text-sm font-medium text-black-500">Tiempo Espera Promedio:</span>
                            <span className="stat-value block text-xl font-bold text-gray-900">{simulacion.estadisticas.promedioEspera}</span>
                        </div>
                        <div className="stat-box p-4 bg-gray-50 rounded-lg shadow">
                            <span className="stat-label block text-sm font-medium text-black-500">Índice de Servicio Promedio:</span>
                            <span className="stat-value block text-xl font-bold text-gray-900">{simulacion.estadisticas.promedioIndiceServicio}</span>
                        </div>
                    </div>

                    {/* Tabla de procesos */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proceso</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Llegada</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiempo CPU</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Finalización</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Espera</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retorno</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Indice</th>
                                    {simulacion.algoritmo === 'Prioridad' && (
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridad</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {simulacion.procesos.map((proceso, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{proceso.nombre && proceso.nombre.trim() !== '' ? proceso.nombre : `P${index + 1}`}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proceso.llegada}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proceso.rafaga}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proceso.tiempoFinalizacion}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proceso.tiempoEspera}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proceso.tiempoRetorno}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {proceso.tiempoRetorno > 0 ? (proceso.rafaga / proceso.tiempoRetorno).toFixed(2) : '—'}
                                        </td>
                                        {simulacion.algoritmo === 'Prioridad' && (
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proceso.prioridad}</td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HistorialCompleto;