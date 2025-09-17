import React, { useState, useEffect } from 'react';
import FormularioProceso from './components/FormularioProceso';
import SelectorAlgoritmo from './components/SelectorAlgoritmo';
import ColaProcesos from './components/ColaProcesos';
import HistorialProcesos from './components/HistorialProcesos';
import ControlSimulacion from './components/ControlSimulacion'; // Corrected import name

const TIME_UNIT_MS = 5000; // 5 segundos

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
      { ...newProcess, pid: pidCounter, quantumCount: 0, remainingTime: newProcess.cpuTime },
    ]);
    setPidCounter((prevCounter) => prevCounter + 1);
  };

  // Main simulation loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setCurrentTime((prevTime) => prevTime + 1);
    }, TIME_UNIT_MS);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Logic for scheduling and execution
  useEffect(() => {
    // 1. Check for new arrivals at the current time
    const newArrivals = processes.filter((p) => p.arrivalTime === currentTime);
    if (newArrivals.length > 0) {
      setQueue((prevQueue) => [...prevQueue, ...newArrivals]);
      setProcesses((prevProcesses) => prevProcesses.filter((p) => p.arrivalTime !== currentTime));
    }

    // 2. Main scheduling and execution logic
    if (isRunning) {
      // Logic for preemption and process completion
      let nextProcess = null;
      let updatedQueue = [...queue];

      // Handle process completion or preemption first
      if (currentProcess) {
        if (currentProcess.remainingTime <= 0) {
          setHistory((prevHistory) => [
            ...prevHistory,
            { ...currentProcess, finishTime: currentTime, waitingTime: currentTime - currentProcess.arrivalTime - currentProcess.cpuTime },
          ]);
          nextProcess = null;
        } else if (selectedAlgorithm === 'RoundRobin' && currentProcess.quantumCount >= currentProcess.quantum) {
          // Preempt for Round Robin
          updatedQueue.push({ ...currentProcess, quantumCount: 0 }); // Reset quantum and add to end of queue
          nextProcess = null;
        } else if (selectedAlgorithm === 'SRTF') {
          // Check for a new process with a shorter remaining time
          const shortestInQueue = updatedQueue.sort((a, b) => a.remainingTime - b.remainingTime)[0];
          if (shortestInQueue && shortestInQueue.remainingTime < currentProcess.remainingTime) {
            updatedQueue.push(currentProcess);
            nextProcess = null;
          } else {
            nextProcess = currentProcess;
          }
        } else {
          // For FCFS and SJF, the process runs until completion
          nextProcess = currentProcess;
        }
      }

      // If no process is running or a new one needs to be selected
      if (!nextProcess && updatedQueue.length > 0) {
        switch (selectedAlgorithm) {
          case 'FCFS':
            nextProcess = updatedQueue.shift();
            break;
          case 'SJF':
          case 'SRTF':
            updatedQueue.sort((a, b) => a.remainingTime - b.remainingTime);
            nextProcess = updatedQueue.shift();
            break;
          case 'RoundRobin':
            nextProcess = updatedQueue.shift();
            break;
          default:
            nextProcess = updatedQueue.shift();
            break;
        }
      }

      // Update state for the next time unit
      if (nextProcess) {
        setCurrentProcess({
          ...nextProcess,
          remainingTime: nextProcess.remainingTime - 1,
          quantumCount: nextProcess.quantumCount + 1,
        });
      } else {
        setCurrentProcess(null); // No process to run
      }
      setQueue(updatedQueue);
    }
  }, [currentTime, isRunning, processes, queue, currentProcess, selectedAlgorithm]);

  const handleStartSimulation = () => {
    setIsRunning(true);
  };

  const handleStopSimulation = () => {
    setIsRunning(false);
  };

  const handleSelectAlgorithm = (algo) => {
    setSelectedAlgorithm(algo);
    setIsRunning(false);
  };

  return (
    <div className="app-container">
      <h1>Simulador de Planificación de Procesos</h1>
      <div className="controls-section">
        <FormularioProceso addProcess={addProcess} />
        <SelectorAlgoritmo onSelectAlgorithm={handleSelectAlgorithm} selectedAlgorithm={selectedAlgorithm} />
        <ControlSimulacion onStart={handleStartSimulation} onStop={handleStopSimulation} isRunning={isRunning} />
      </div>
      <div className="simulation-status-section">
        <p>Tiempo actual: {currentTime} unidad(es)</p>
        <p>Proceso en CPU: {currentProcess ? `${currentProcess.name} (ID: ${currentProcess.pid}, T. Restante: ${currentProcess.remainingTime})` : 'Ninguno'}</p>
        <ColaProcesos queue={queue} />
        <HistorialProcesos historial={history} />
      </div>
    </div>
  );
}

export default App;