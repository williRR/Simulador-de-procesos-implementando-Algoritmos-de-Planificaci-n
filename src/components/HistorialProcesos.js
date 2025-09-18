import React from "react";

const HistorialProcesos = ({ historial }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg p-4 mt-4">
            <h2 className="text-lg font-bold mb-3">Historial de Procesos</h2>

            {historial.length === 0 ? (
                <p className="text-gray-500">No hay procesos completados aún.</p>
            ) : (
                <table className="table-auto w-full border-collapse border">
                    <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-3 py-1">PID</th>
                        <th className="border px-3 py-1">Nombre</th> {/* Nueva columna para el nombre */}
                        <th className="border px-3 py-1">Llegada</th>
                        <th className="border px-3 py-1">Ráfaga</th>
                        <th className="border px-3 py-1">Inicio</th>
                        <th className="border px-3 py-1">Fin</th>
                        <th className="border px-3 py-1">Retorno</th>
                        <th className="border px-3 py-1">Espera</th>
                    </tr>
                    </thead>
                    <tbody>
                    {historial.map((p, index) => (
                        <tr key={index} className="text-center">
                            <td className="border px-3 py-1">{p.pid}</td>
                            <td className="border px-3 py-1">{p.name}</td> {/* Nueva celda para el nombre */}
                            <td className="border px-3 py-1">{p.arrivalTime}</td>
                            <td className="border px-3 py-1">{p.cpuTime}</td>
                            <td className="border px-3 py-1">{p.startTime}</td>
                            <td className="border px-3 py-1">{p.finishTime}</td>
                            <td className="border px-3 py-1">{p.turnaroundTime}</td>
                            <td className="border px-3 py-1">{p.waitingTime}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default HistorialProcesos;