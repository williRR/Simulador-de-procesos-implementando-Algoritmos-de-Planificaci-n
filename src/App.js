import React, { useState, useEffect } from 'react';
import FormularioProceso from './components/FormularioProceso';
import SelectorAlgoritmo from './components/SelectorAlgoritmo';
import ControlSimulacion from './components/ControlSimulacion';
import TablaGantt from './components/TablaGantt';
import ColaProcesos from './components/ColaProcesos';
import HistorialProcesos from './components/HistorialProcesos';
import './css/styles.css';

function App() {
  const [procesos, setProcesos] = useState([]);
  const [algoritmo, setAlgoritmo] = useState('FCFS');
  const [simulando, setSimulando] = useState(false);
  const [tiempoActual, setTiempoActual] = useState(0);
  const [estadosEjecucion, setEstadosEjecucion] = useState({});
  const [procesosFinalizados, setProcesosFinalizados] = useState([]);
  const [quantum, setQuantum] = useState(2);

  // Agregar proceso
  const agregarProceso = (proceso) => {
    const nuevoProceso = {
      ...proceso,
      id: Date.now(),
      tiempoRestante: proceso.rafaga,
      tiempoEspera: 0,
      tiempoRetorno: 0,
      tiempoFinalizacion: 0
    };
    setProcesos([...procesos, nuevoProceso]);
  };

  // Ejecutar simulación
  useEffect(() => {
    if (!simulando || procesos.length === 0) return;

    const intervalo = setInterval(() => {
      ejecutarPasoSimulacion();
    }, 500);

    return () => clearInterval(intervalo);
  }, [simulando, tiempoActual, procesos]);

  const ejecutarPasoSimulacion = () => {
    const procesosActivos = procesos.filter(p => !procesosFinalizados.find(pf => pf.id === p.id));
    
    if (procesosActivos.length === 0) {
      setSimulando(false);
      return;
    }

    let procesoEjecutando = null;

    switch (algoritmo) {
      case 'FCFS':
        procesoEjecutando = procesosActivos
          .filter(p => p.llegada <= tiempoActual)
          .sort((a, b) => a.llegada - b.llegada)[0];
        break;
      
      case 'SJF':
        procesoEjecutando = procesosActivos
          .filter(p => p.llegada <= tiempoActual)
          .sort((a, b) => a.tiempoRestante - b.tiempoRestante)[0];
        break;
      
      case 'Prioridad':
        procesoEjecutando = procesosActivos
          .filter(p => p.llegada <= tiempoActual)
          .sort((a, b) => a.prioridad - b.prioridad)[0];
        break;
      
      case 'Round Robin':
        procesoEjecutando = procesosActivos
          .filter(p => p.llegada <= tiempoActual)[0];
        break;
      
      default:
        procesoEjecutando = procesosActivos[0];
    }

    // Actualizar estados de ejecución
    const nuevoEstado = procesosActivos.map(p => ({
      procesoId: p.id,
      estado: p.id === procesoEjecutando?.id ? 'ejecutando' : 
              (p.llegada <= tiempoActual ? 'esperando' : 'pendiente')
    }));

    setEstadosEjecucion(prev => ({
      ...prev,
      [tiempoActual]: nuevoEstado
    }));

    // Actualizar proceso ejecutando
    if (procesoEjecutando) {
      const procesosActualizados = procesos.map(p => {
        if (p.id === procesoEjecutando.id) {
          const nuevoTiempoRestante = p.tiempoRestante - 1;
          
          if (nuevoTiempoRestante === 0) {
            const procesoFinalizado = {
              ...p,
              tiempoRestante: 0,
              tiempoFinalizacion: tiempoActual + 1,
              tiempoRetorno: (tiempoActual + 1) - p.llegada,
              tiempoEspera: (tiempoActual + 1) - p.llegada - p.rafaga
            };
            setProcesosFinalizados(prev => [...prev, procesoFinalizado]);
          }
          
          return { ...p, tiempoRestante: nuevoTiempoRestante };
        }
        return p;
      });
      
      setProcesos(procesosActualizados);
    }

    setTiempoActual(prev => prev + 1);
  };

  const iniciarSimulacion = () => {
    if (procesos.length === 0) {
      alert('Agrega al menos un proceso');
      return;
    }
    setSimulando(true);
  };

  const pausarSimulacion = () => {
    setSimulando(false);
  };

  const reiniciarSimulacion = () => {
    setSimulando(false);
    setTiempoActual(0);
    setEstadosEjecucion({});
    setProcesosFinalizados([]);
    setProcesos(procesos.map(p => ({
      ...p,
      tiempoRestante: p.rafaga
    })));
  };

  const limpiarProcesos = () => {
    setProcesos([]);
    setTiempoActual(0);
    setEstadosEjecucion({});
    setProcesosFinalizados([]);
    setSimulando(false);
  };

  return (
    <div className="App">
      <header>
        <h1>Simulador de Planificación de Procesos</h1>
      </header>

      <div className="container">
        <div className="panel-izquierdo">
          <SelectorAlgoritmo 
            algoritmo={algoritmo} 
            setAlgoritmo={setAlgoritmo}
            quantum={quantum}
            setQuantum={setQuantum}
          />
          
          <FormularioProceso 
            agregarProceso={agregarProceso} 
            algoritmo={algoritmo}
          />

          <ControlSimulacion
            iniciar={iniciarSimulacion}
            pausar={pausarSimulacion}
            reiniciar={reiniciarSimulacion}
            limpiar={limpiarProcesos}
            simulando={simulando}
          />

          <ColaProcesos procesos={procesos} />
        </div>

        <div className="panel-derecho">
          <TablaGantt
            procesos={procesos}
            tiempoTotal={tiempoActual}
            estadosEjecucion={estadosEjecucion}
          />

          <HistorialProcesos
            procesos={procesosFinalizados}
            tiempoActual={tiempoActual}
          />
        </div>
      </div>
    </div>
  );
}

export default App;