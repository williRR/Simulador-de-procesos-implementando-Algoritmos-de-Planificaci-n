import React from "react";
// Importamos React para poder usar JSX y crear el componente funcional.

// Componente funcional que recibe props:
// iniciarSimulacion → función que arranca la simulación
// detenerSimulacion → función que la detiene
// limpiarHistorial → función que borra el historial de procesos
// isRunning → booleano que indica si la simulación está activa o no
const ControlSimulacion = ({ iniciarSimulacion, detenerSimulacion, limpiarHistorial, isRunning }) => {
    return (
        // Contenedor de los botones con estilos de Tailwind
        <div className="bg-white shadow-lg rounded-lg p-4 mt-4 flex gap-4">

            {/* Botón para iniciar la simulación */}
            <button
                onClick={iniciarSimulacion} // Ejecuta la función iniciarSimulacion al hacer clic
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400" // Estilos
                disabled={isRunning} // Si la simulación ya está corriendo, se deshabilita
            >
                Iniciar Simulación
            </button>

            {/* Botón para detener la simulación */}
            <button
                onClick={detenerSimulacion} // Ejecuta la función detenerSimulacion al hacer clic
                className="bg-gray-500 text-white px-4 py-2 rounded disabled:bg-gray-400" // Estilos
                disabled={!isRunning} // Si la simulación NO está corriendo, se deshabilita
            >
                Detener Simulación
            </button>

            {/* Botón para limpiar el historial */}
            <button
                onClick={limpiarHistorial} // Ejecuta la función limpiarHistorial al hacer clic
                className="bg-red-500 text-white px-4 py-2 rounded" // Estilos
            >
                Limpiar Historial
            </button>
        </div>
    );
};

// Exportamos el componente para usarlo en otros archivos
export default ControlSimulacion;
