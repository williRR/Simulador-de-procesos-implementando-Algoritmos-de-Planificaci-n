import React from "react";

const ControlSimulacion = ({ iniciarSimulacion, detenerSimulacion, limpiarHistorial, isRunning }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg p-4 mt-4 flex gap-4">
            <button
                onClick={iniciarSimulacion}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
                disabled={isRunning}
            >
                Iniciar Simulación
            </button>
            <button
                onClick={detenerSimulacion}
                className="bg-gray-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
                disabled={!isRunning}
            >
                Detener Simulación
            </button>
            <button
                onClick={limpiarHistorial}
                className="bg-red-500 text-white px-4 py-2 rounded"
            >
                Limpiar Historial
            </button>
        </div>
    );
};

export default ControlSimulacion;