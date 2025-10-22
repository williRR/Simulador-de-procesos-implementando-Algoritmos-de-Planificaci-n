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

  // RR minimal
  const [rrQueue, setRrQueue] = useState([]);   // IDs en FIFO
  const [rrCurrentId, setRrCurrentId] = useState(null);
  const [rrSlice, setRrSlice] = useState(0);

  // Agregar proceso
  const agregarProceso = (proceso) => {
    const nuevo = {
      ...proceso,
      id: Date.now(),
      tiempoRestante: proceso.rafaga,
      tiempoFinalizacion: 0,
      tiempoRetorno: 0,
      tiempoEspera: 0,
    };
    setProcesos(prev => [...prev, nuevo]);
  };

  useEffect(() => {
    if (!simulando || procesos.length === 0) return;
    const intv = setInterval(() => ejecutarPaso(), 500);
    return () => clearInterval(intv);
  }, [simulando, procesos, algoritmo, quantum, rrQueue, rrCurrentId, rrSlice, tiempoActual]);

  const activosNoFin = () =>
      procesos.filter(p => !procesosFinalizados.some(f => f.id === p.id));

  const finalizar = (p, tFin) => {
    const fin = {
      ...p,
      tiempoRestante: 0,
      tiempoFinalizacion: tFin,
      tiempoRetorno: tFin - p.llegada,
      tiempoEspera: tFin - p.llegada - p.rafaga,
    };
    setProcesosFinalizados(prev => [...prev, fin]);
  };

  const ejecutarPaso = () => {
    const activos = activosNoFin();
    if (activos.length === 0) { setSimulando(false); return; }

    // ========== ROUND ROBIN BÁSICO ==========
    if (algoritmo === 'Round Robin') {
      // encolar llegados (y no duplicar)
      const llegados = activos
          .filter(p => p.llegada <= tiempoActual && p.tiempoRestante > 0)
          .map(p => p.id);
      setRrQueue(prev => {
        const nueva = [...prev];
        for (const id of llegados) if (!nueva.includes(id) && id !== rrCurrentId) nueva.push(id);
        return nueva;
      });

      // elegir actual
      let currentId = rrCurrentId;
      if (!currentId) {
        if (rrQueue.length > 0) {
          currentId = rrQueue[0];
          setRrQueue(prev => prev.slice(1));
          setRrCurrentId(currentId);
          setRrSlice(0);
        } else {
          // ocioso: registrar y avanzar
          setEstadosEjecucion(prev => ({
            ...prev,
            [tiempoActual]: activos.map(p => ({
              procesoId: p.id,
              estado: p.llegada <= tiempoActual ? 'esperando' : 'pendiente'
            }))
          }));
          setTiempoActual(t => t + 1);
          return;
        }
      }

      const actual = procesos.find(p => p.id === currentId);
      if (!actual || actual.tiempoRestante <= 0) {
        setRrCurrentId(null); setRrSlice(0);
        setTiempoActual(t => t + 1);
        return;
      }

      // 1) Registrar estado EN el tiempo actual (columna 0 incluida)
      const estado = activos.map(p => ({
        procesoId: p.id,
        estado:
            p.id === currentId ? 'ejecutando' :
                (p.llegada <= tiempoActual ? 'esperando' : 'pendiente')
      }));
      setEstadosEjecucion(prev => ({ ...prev, [tiempoActual]: estado }));

      // 2) Ejecutar 1 unidad
      setProcesos(prev => prev.map(p =>
          p.id === actual.id ? { ...p, tiempoRestante: Math.max(0, p.tiempoRestante - 1) } : p
      ));

      const termina = actual.tiempoRestante - 1 === 0;
      if (termina) {
        finalizar(actual, tiempoActual + 1);
        setRrCurrentId(null); setRrSlice(0);
      } else {
        if (rrSlice + 1 >= quantum) {
          setRrQueue(prev => [...prev, currentId]); // al final
          setRrCurrentId(null); setRrSlice(0);
        } else {
          setRrSlice(s => s + 1);
        }
      }

      // 3) Avanzar reloj
      setTiempoActual(t => t + 1);
      return;
    }

    // ========== FCFS / SJF / PRIORIDAD ==========
    let ejecutando = null;
    switch (algoritmo) {
      case 'FCFS':
        ejecutando = activos.filter(p => p.llegada <= tiempoActual)
            .sort((a,b) => a.llegada - b.llegada)[0];
        break;
      case 'SJF':
        ejecutando = activos.filter(p => p.llegada <= tiempoActual)
            .sort((a,b) => a.tiempoRestante - b.tiempoRestante)[0];
        break;
      case 'Prioridad':
        ejecutando = activos.filter(p => p.llegada <= tiempoActual)
            .sort((a,b) => a.prioridad - b.prioridad || a.llegada - b.llegada)[0];
        break;
      default:
        ejecutando = activos[0];
    }

    // 1) Registrar estado en el tiempo actual
    const estado = activos.map(p => ({
      procesoId: p.id,
      estado:
          p.id === ejecutando?.id ? 'ejecutando' :
              (p.llegada <= tiempoActual ? 'esperando' : 'pendiente')
    }));
    setEstadosEjecucion(prev => ({ ...prev, [tiempoActual]: estado }));

    // 2) Ejecutar 1 unidad
    if (ejecutando) {
      setProcesos(prev => prev.map(p => {
        if (p.id !== ejecutando.id) return p;
        const rest = p.tiempoRestante - 1;
        if (rest === 0) finalizar(p, tiempoActual + 1);
        return { ...p, tiempoRestante: rest };
      }));
    }

    // 3) Avanzar reloj
    setTiempoActual(t => t + 1);
  };

  // ===== Controles =====
  const iniciarSimulacion = () => {
    if (procesos.length === 0) { alert('Agrega al menos un proceso'); return; }

    // reset total y estado inicial en t=0 (para que el Gantt muestre la columna 0)
    setTiempoActual(0);
    setEstadosEjecucion({});
    setProcesosFinalizados([]);
    setProcesos(prev => prev.map(p => ({ ...p, tiempoRestante: p.rafaga })));
    setRrQueue([]); setRrCurrentId(null); setRrSlice(0);

    // opcional: estado visual de t=0 (si nadie llega en 0, quedará todo "pendiente")
    const estado0 = procesos.map(p => ({
      procesoId: p.id,
      estado: p.llegada <= 0 ? 'esperando' : 'pendiente'
    }));
    setEstadosEjecucion({ 0: estado0 });

    setSimulando(true);
  };

  const pausarSimulacion = () => setSimulando(false);

  const reiniciarSimulacion = () => {
    setSimulando(false);
    setTiempoActual(0);
    setEstadosEjecucion({});
    setProcesosFinalizados([]);
    setProcesos(prev => prev.map(p => ({ ...p, tiempoRestante: p.rafaga })));
    setRrQueue([]); setRrCurrentId(null); setRrSlice(0);
  };

  const limpiarProcesos = () => {
    setSimulando(false);
    setProcesos([]);
    setProcesosFinalizados([]);
    setEstadosEjecucion({});
    setTiempoActual(0);
    setRrQueue([]); setRrCurrentId(null); setRrSlice(0);
  };

  return (
      <div className="App">
        <header><h1>Simulador de Planificación de Procesos</h1></header>

        <div className="container">
          <div className="panel-izquierdo">
            <SelectorAlgoritmo
                algoritmo={algoritmo}
                setAlgoritmo={setAlgoritmo}
                quantum={quantum}
                setQuantum={setQuantum}
            />
            <FormularioProceso agregarProceso={agregarProceso} algoritmo={algoritmo} />
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
            <HistorialProcesos procesos={procesosFinalizados} tiempoActual={tiempoActual} />
          </div>
        </div>
      </div>
  );
}

export default App;








