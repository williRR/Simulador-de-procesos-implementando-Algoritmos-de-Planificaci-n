import React, { useState, useEffect } from 'react';
import FormularioProceso from './components/FormularioProceso';
import SelectorAlgoritmo from './components/SelectorAlgoritmo';
import ColaProcesos from './components/ColaProcesos';
import HistorialProcesos from './components/HistorialProcesos';
import ControlSimulacion from './components/ControlSimulacion';

// Asegúrate de que tu `index.css` de Tailwind esté importado en `index.js`
// También necesitas un `tailwind.config.js` bien configurado.

const TIME_UNIT_MS = 1000;

function App() {
  const [processes, setProcesses] = useState([]);
  const [queue, setQueue] = useState([]);
  const [history, setHistory] = useState([]);
  const [currentProcess, setCurrentProcess] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('FCFS');
  const [pidCounter, setPidCounter] = useState(1);

  const addProcess = (newProcess) => {
    setProcesses((prevProcesses) => [
      ...prevProcesses,
      {
        ...newProcess,
        pid: pidCounter,
        quantumCount: 0,
        remainingTime: Number(newProcess.cpuTime),
        cpuTime: Number(newProcess.cpuTime),
        arrivalTime: Number(newProcess.arrivalTime),
        quantum: newProcess.quantum ? Number(newProcess.quantum) : 2,
        startTime: -1,
      },
    ]);
    setPidCounter((prevCounter) => prevCounter + 1);
  };

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setCurrentTime((prevTime) => prevTime + 1);
    }, TIME_UNIT_MS);
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning) return;

    let newCurrentProcess = currentProcess ? { ...currentProcess } : null;
    let newQueue = [...queue];
    let newHistory = [...history];

    const newArrivals = processes.filter((p) => p.arrivalTime === currentTime);
    if (newArrivals.length > 0) {
      newQueue = [...newQueue, ...newArrivals];
      setProcesses((prevProcesses) => prevProcesses.filter((p) => p.arrivalTime !== currentTime));
    }

    if (newCurrentProcess) {
      newCurrentProcess.remainingTime--;
      if (selectedAlgorithm === 'RoundRobin') {
        newCurrentProcess.quantumCount++;
      }
    }

    if (newCurrentProcess && newCurrentProcess.remainingTime <= 0) {
      const finishTime = currentTime;
      const turnaroundTime = finishTime - newCurrentProcess.arrivalTime;
      const waitingTime = turnaroundTime - newCurrentProcess.cpuTime;

      newHistory.push({
        ...newCurrentProcess,
        finishTime: finishTime,
        turnaroundTime: turnaroundTime,
        waitingTime: waitingTime,
      });
      newCurrentProcess = null;
    } else if (newCurrentProcess && selectedAlgorithm === 'RoundRobin' && newCurrentProcess.quantumCount >= newCurrentProcess.quantum) {
      newQueue.push({ ...newCurrentProcess, quantumCount: 0 });
      newCurrentProcess = null;
    } else if (newCurrentProcess && selectedAlgorithm === 'SRTF') {
      const allReadyProcesses = [...newQueue, ...(newCurrentProcess ? [newCurrentProcess] : [])];
      const shortestInQueue = allReadyProcesses.length > 0 ? [...allReadyProcesses].sort((a, b) => a.remainingTime - b.remainingTime)[0] : null;
      if (shortestInQueue && newCurrentProcess && shortestInQueue.pid !== newCurrentProcess.pid) {
        newQueue.push(newCurrentProcess);
        newCurrentProcess = null;
      }
    }

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
          break;
      }
      if (newCurrentProcess && newCurrentProcess.startTime === -1) {
        newCurrentProcess.startTime = currentTime;
      }
    }

    setCurrentProcess(newCurrentProcess);
    setQueue(newQueue);
    setHistory(newHistory);
  }, [currentTime, isRunning, processes, selectedAlgorithm, currentProcess, queue, history]);

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