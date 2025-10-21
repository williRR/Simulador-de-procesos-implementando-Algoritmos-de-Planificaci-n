import React from "react";
//pruba
// Componente funcional que recibe props:
// iniciar → función que arranca la simulación
// pausar → función que pausa la simulación
// reiniciar → función que reinicia la simulación
// limpiar → función que borra el historial de procesos
// simulando → booleano que indica si la simulación está activa o no
const ControlSimulacion = ({ iniciar, pausar, reiniciar, limpiar, simulando }) => {
    return (
        // Contenedor de los botones con estilos de Tailwind
        <div className="control-simulacion bg-white shadow-lg rounded-lg p-4 mt-4 flex flex-col gap-4">

            {/* Título del panel de control */}
            <h3 className="text-lg font-semibold">Control de Simulación</h3>

            {/* Botón para iniciar o continuar la simulación */}
            <button
                onClick={iniciar} // Ejecuta la función iniciar al hacer clic
                className="btn-iniciar bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400" // Estilos
                disabled={simulando} // Si la simulación ya está corriendo, se deshabilita
            >
                {simulando ? '▶ Ejecutando...' : '▶ Iniciar Simulación'}
            </button>

            {/* Botón para pausar la simulación */}
            <button
                onClick={pausar} // Ejecuta la función pausar al hacer clic
                className="btn-pausar bg-yellow-500 text-white px-4 py-2 rounded disabled:bg-gray-400" // Estilos
                disabled={!simulando} // Si la simulación NO está corriendo, se deshabilita
            >
                ⏸ Pausar
            </button>

            {/* Botón para reiniciar la simulación */}
            <button
                onClick={reiniciar} // Ejecuta la función reiniciar al hacer clic
                className="btn-reiniciar bg-green-500 text-white px-4 py-2 rounded" // Estilos
            >
                ↻ Reiniciar
            </button>

            {/* Botón para limpiar el historial */}
            <button
                onClick={limpiar} // Ejecuta la función limpiar al hacer clic
                className="btn-limpiar bg-red-500 text-white px-4 py-2 rounded" // Estilos
            >
                🗑 Limpiar Todo
            </button>
        </div>
    );
};

// Exportamos el componente para usarlo en otros archivos
export default ControlSimulacion;
