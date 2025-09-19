import React from "react";

const HistorialProcesos = ({ historial }) => {
    return (
        <div className="mt-10 bg-white p-6 rounded-2xl border border-gray-200 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Historial de Procesos Completados</h2>
            <div id="historyTableContainer" className="overflow-x-auto">
                {historial.length === 0 ? (
                    <p id="historyPlaceholder" className="text-center text-gray-400 italic mt-4">No hay procesos completados.</p>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
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
                        <tbody id="historyTableBody" className="bg-white divide-y divide-gray-200">
                        {historial.map((p, index) => (
                            <tr key={index}>
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

export default HistorialProcesos;