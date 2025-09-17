import React from "react";

const ControlSimulador = ({ iniciarSimulacion, limpiarHistorial }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg p-4 mt-4 flex gap-4">
            <button
                onClick={iniciarSimulacion}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Iniciar Simulación
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

export default ControlSimulador;
