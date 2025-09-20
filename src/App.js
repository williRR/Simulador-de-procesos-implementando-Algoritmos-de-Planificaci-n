import React, { useState, useEffect, useRef } from 'react';
import FormularioProceso from './components/FormularioProceso';
import SelectorAlgoritmo from './components/SelectorAlgoritmo';
import ColaProcesos from './components/ColaProcesos';
import HistorialProcesos from './components/HistorialProcesos';
import ControlSimulacion from './components/ControlSimulacion';

// Duración de 1 unidad de tiempo en ms (ajusta si quieres ver más lento)
const TIME_UNIT_MS = 1000;

function App() {
  // Estados
  const [processes, setProcesses] = useState([]);
  const [queue, setQueue] = useState([]);
  const [history, setHistory] = useState([]);
  const [currentProcess, setCurrentProcess] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('FCFS');
  const [pidCounter, setPidCounter] = useState(1);

  // Refs para evitar re-ejecuciones internas del efecto
  const processesRef = useRef(processes);
  const queueRef = useRef(queue);
  const historyRef = useRef(history);
  const currentProcessRef = useRef(currentProcess);

  useEffect(() => { processesRef.current = processes; }, [processes]);
  useEffect(() => { queueRef.current = queue; }, [queue]);
  useEffect(() => { historyRef.current = history; }, [history]);
  useEffect(() => { currentProcessRef.current = currentProcess; }, [currentProcess]);

  // Añadir proceso desde FormularioProceso
  const addProcess = (newProcess) => {
    setProcesses(prev => [
      ...prev,
      {
        ...newProcess,
        pid: pidCounter,
        quantumCount: 0,
        remainingTime: Number(newProcess.cpuTime),
        cpuTime: Number(newProcess.cpuTime),
        arrivalTime: Number(newProcess.arrivalTime),
        quantum: newProcess.quantum ? Number(newProcess.quantum) : 2,
        startTime: -1,
      }
    ]);
    setPidCounter(c => c + 1);
  };

  // Tick del reloj
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => setCurrentTime(t => t + 1), TIME_UNIT_MS);
    return () => clearInterval(interval);
  }, [isRunning]);

  // Lógica principal
  useEffect(() => {
    if (!isRunning) return;

    let newProcesses = [...processesRef.current];
    let newQueue = [...queueRef.current];
    let newHistory = [...historyRef.current];
    let newCurrentProcess = currentProcessRef.current ? { ...currentProcessRef.current } : null;

    //Añade procesos a la cola
    const arrivals = newProcesses.filter(p => p.arrivalTime === currentTime);
    if (arrivals.length > 0) {
      newQueue = [...newQueue, ...arrivals];
      newProcesses = newProcesses.filter(p => p.arrivalTime !== currentTime);
    }

    //Ejeceuta el proceso actual reduciendo su tiempo en CPU
    //Si es Round Robin incrementa el contador de quantum
    if (newCurrentProcess) {
      newCurrentProcess.remainingTime -= 1;
      if (selectedAlgorithm === 'RoundRobin') {
        newCurrentProcess.quantumCount = (newCurrentProcess.quantumCount || 0) + 1;
      }
    }

    //Verifica si el proceso termino para añadirlo al historial
    if (newCurrentProcess && newCurrentProcess.remainingTime <= 0) {
      const finishTime = currentTime;
      const turnaroundTime = finishTime - newCurrentProcess.arrivalTime;
      const waitingTime = turnaroundTime - newCurrentProcess.cpuTime;
      newHistory.push({
        ...newCurrentProcess,
        finishTime,
        turnaroundTime,
        waitingTime,
      });
      newCurrentProcess = null;
    }
    //Para Round Robin si se termina el quantum devualve el proceso a cola
    else if (newCurrentProcess && selectedAlgorithm === 'RoundRobin' && newCurrentProcess.quantumCount >= newCurrentProcess.quantum) {
      newQueue.push({ ...newCurrentProcess, quantumCount: 0 });
      newCurrentProcess = null;
    }
    //Compara procesos para determinar el mas corto y enviar a cola el mas largo
    else if (newCurrentProcess && selectedAlgorithm === 'SRTF') {
      const allReady = [...newQueue, newCurrentProcess];
      if (allReady.length > 0) {
        const shortest = allReady.sort((a,b) => a.remainingTime - b.remainingTime)[0];
        if (shortest && shortest.pid !== newCurrentProcess.pid) {
          newQueue.push(newCurrentProcess);
          newCurrentProcess = null;
        }
      }
    }

    //Verifica si la CPU esta libre y ordena la cola segun el algoritmo y envia el primer proceso a la CPU
    if (!newCurrentProcess && newQueue.length > 0) {
      switch (selectedAlgorithm) {
        case 'FCFS':
          newQueue.sort((a, b) => a.arrivalTime - b.arrivalTime);
          newCurrentProcess = newQueue.shift();
          break;
        case 'SJF':
          newQueue.sort((a, b) => a.cpuTime - b.cpuTime);
          newCurrentProcess = newQueue.shift();
          break;
        case 'RoundRobin':
          newCurrentProcess = newQueue.shift();
          break;
        case 'SRTF':
          newQueue.sort((a, b) => a.remainingTime - b.remainingTime);
          newCurrentProcess = newQueue.shift();
          break;
        default:
          newCurrentProcess = newQueue.shift();
      }
      if (newCurrentProcess && newCurrentProcess.startTime === -1) {
        newCurrentProcess.startTime = currentTime;
      }
    }

    //Actualiza los estados UNA SOLA VEZ al final del tick
    setProcesses(newProcesses);
    setQueue(newQueue);
    setHistory(newHistory);
    setCurrentProcess(newCurrentProcess);

    //Al limitar las dependencias, este efecto sólo se ejecuta por cada cambio de tiempo (tick)
  }, [currentTime, isRunning, selectedAlgorithm]);

  //Funciones de los botones en pantalla
  const handleStartSimulation = () => setIsRunning(true);
  const handleStopSimulation = () => setIsRunning(false);
  const handleCleanHistory = () => {
    setHistory([]);
    setCurrentTime(0);
    setProcesses([]);
    setQueue([]);
    setCurrentProcess(null);
    setPidCounter(1);
    setIsRunning(false);
  };
  const handleSelectAlgorithm = (algo) => {
    setSelectedAlgorithm(algo);
    setIsRunning(false);
  };

  //Define la estructura HTML 
  return (
    <div className="p-6 md:p-12 gradient-bg">
      <div className="max-w-6xl mx-auto card-bg-gradient p-6 md:p-10 rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.2)]">
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-2">Simulador de Planificación de Procesos</h1>
          <p className="text-gray-600 text-lg">FCFS, SJF, SRTF, Round Robin</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <FormularioProceso addProcess={addProcess} />
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Configuración de Simulación</h2>
            <div className="mb-4">
              <label htmlFor="algorithm" className="block text-gray-600 mb-2">Algoritmo de Planificación</label>
              <SelectorAlgoritmo onSelectAlgorithm={handleSelectAlgorithm} selectedAlgorithm={selectedAlgorithm} />
            </div>
            <ControlSimulacion
              iniciarSimulacion={handleStartSimulation}
              detenerSimulacion={handleStopSimulation}
              limpiarHistorial={handleCleanHistory}
              isRunning={isRunning}
            />
            <div className="mt-6 text-center">
              <p className="text-lg font-bold mt-2">Tiempo actual: <span id="currentTimeDisplay">{currentTime}</span></p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Cola de Procesos Listos</h2>
              <ColaProcesos queue={queue} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Estado de la CPU</h2>
              <div id="cpuStatusContainer" className="min-h-[100px] bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center justify-center">
                {currentProcess ? (
                  <div>
                    <p><strong>{currentProcess.name}</strong> (PID: {currentProcess.pid})</p>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                      <div className="bg-blue-600 h-3 rounded-full transition-all duration-500" style={{ width: `${((currentProcess.cpuTime - currentProcess.remainingTime) / currentProcess.cpuTime) * 100}%` }}></div>
                    </div>
                    <p className="text-sm mt-1">Restante: {currentProcess.remainingTime}</p>
                  </div>
                ) : (
                  <p className="text-gray-400 italic">CPU inactiva</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <HistorialProcesos historial={history} />
      </div>
    </div>
  );
}

export default App;