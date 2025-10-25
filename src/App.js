import React, { useState, useEffect } from 'react';
import FormularioProceso from './components/FormularioProceso';
import SelectorAlgoritmo from './components/SelectorAlgoritmo';
import ControlSimulacion from './components/ControlSimulacion';
import TablaGantt from './components/TablaGantt';
import ColaProcesos from './components/ColaProcesos';
import HistorialProcesos from './components/HistorialProcesos';
import HistorialCompleto from './components/HistorialCompleto';
import './css/styles.css';

function App() {
  const [procesos, setProcesos] = useState([]);
  const [algoritmo, setAlgoritmo] = useState('FCFS');
  const [simulando, setSimulando] = useState(false);
  const [tiempoActual, setTiempoActual] = useState(0);
  const [estadosEjecucion, setEstadosEjecucion] = useState({});
  const [procesosFinalizados, setProcesosFinalizados] = useState([]);
  const [quantum, setQuantum] = useState(2);
  const [historialSimulaciones, setHistorialSimulaciones] = useState([]);
  const tiempo = 3000;

  // Round Robin
  const [rrQueue, setRrQueue] = useState([]);
  const [rrCurrentId, setRrCurrentId] = useState(null);
  const [rrSlice, setRrSlice] = useState(0);

  // Persistencia de historial (restaurado a como lo tenías)
  useEffect(() => {
    const storedHistory = localStorage.getItem('historialSimulaciones');
    if (storedHistory) {
      setHistorialSimulaciones(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('historialSimulaciones', JSON.stringify(historialSimulaciones));
  }, [historialSimulaciones]);

  // Agregar proceso
  const agregarProceso = (proceso) => {
    const nuevoProceso = {
      ...proceso,
      id: (procesos.length + 1 ).toString(),
      tiempoRestante: proceso.rafaga,
      tiempoEspera: 0,
      tiempoRetorno: 0,
      tiempoFinalizacion: 0
    };
    setProcesos(prev => [...prev, nuevoProceso]);
  };

  // useEffect para ejecutar pasos
  useEffect(() => {
    if (!simulando || procesos.length === 0) return;
    const intervalo = setInterval(() => ejecutarPasoSimulacion(), tiempo);
    return () => clearInterval(intervalo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulando, procesos, algoritmo, quantum, rrQueue, rrCurrentId, rrSlice, tiempoActual]);

  // Filtrar procesos activos
  const procesosNoFinalizados = () =>
      procesos.filter(p => !procesosFinalizados.find(pf => pf.id === p.id));

  // Finalizar proceso
// Finalizar proceso - CORRECCIÓN CLAVE CONTRA DUPLICADOS
const finalizarProceso = (p, tFin) => {
  setProcesosFinalizados(prev => {
      // ⭐️ LÍNEA CLAVE: Verifica si el proceso ya ha sido finalizado. Si ya existe, retorna el estado anterior para evitar duplicación.
      if (prev.find(pf => pf.id === p.id)) {
          return prev; 
      }

      const fin = {
          ...p,
          tiempoRestante: 0,
          tiempoFinalizacion: tFin,
          tiempoRetorno: tFin - p.llegada,
          tiempoEspera: tFin - p.llegada - p.rafaga
      };
      // Si no existe, añade el proceso finalizado
      return [...prev, fin]; 
  });
};

  // --- EJECUCIÓN DE UN PASO DE SIMULACIÓN (sin cambios) ---
  const ejecutarPasoSimulacion = () => {
    const activos = procesosNoFinalizados();
    if (activos.length === 0) {
      setSimulando(false);
      // Guardar simulación en el historial cuando termine
      guardarSimulacion();
      return;
    }

    // === ROUND ROBIN ===
    if (algoritmo === 'Round Robin') {
      const llegados = activos
          .filter(p => p.llegada <= tiempoActual && p.tiempoRestante > 0)
          .map(p => p.id);

      // Construir cola combinada (estado actual + recién llegados) de forma síncrona,
      // para poder seleccionar y ejecutar un proceso que llega en el mismo instante.
      const combined = [...rrQueue];
      const seen = new Set(combined);
      for (const id of llegados) {
        if (id !== rrCurrentId && !seen.has(id)) {
          combined.push(id);
          seen.add(id);
        }
      }

      let currentId = rrCurrentId;
      if (currentId == null) {
        if (combined.length > 0) {
          // Tomar el primer elemento de la cola combinada como current
          currentId = combined.shift();
          setRrQueue(combined);
          setRrCurrentId(currentId);
          setRrSlice(0);
        } else {
          // CPU ociosa (no hay procesos llegados todavía)
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
      } else {
        // Si ya había current y añadimos llegadas, actualizar la cola
        if (combined.length !== rrQueue.length) {
          setRrQueue(combined);
        }
      }

      const actual = procesos.find(p => p.id === currentId);
      if (!actual || actual.tiempoRestante <= 0) {
        setRrCurrentId(null);
        setRrSlice(0);
        setTiempoActual(t => t + 1);
        return;
      }

      // 👇 Registrar estado ANTES de avanzar el tiempo
      const nuevoEstado = activos.map(p => ({
        procesoId: p.id,
        estado:
            p.id === currentId
                ? 'ejecutando'
                : p.llegada <= tiempoActual
                    ? 'esperando'
                    : 'pendiente'
      }));
      setEstadosEjecucion(prev => ({
        ...prev,
        [tiempoActual]: nuevoEstado
      }));

      // Ejecutar una unidad
      setProcesos(prev =>
          prev.map(p =>
              p.id === actual.id
                  ? { ...p, tiempoRestante: Math.max(0, p.tiempoRestante - 1) }
                  : p
          )
      );

      const terminara = actual.tiempoRestante - 1 === 0;

      if (terminara) {
        finalizarProceso(actual, tiempoActual + 1);
        setRrCurrentId(null);
        setRrSlice(0);
      } else {
        if (rrSlice + 1 >= quantum) {
          setRrQueue(prev => [...prev, currentId]);
          setRrCurrentId(null);
          setRrSlice(0);
        } else {
          setRrSlice(s => s + 1);
        }
      }

      setTiempoActual(t => t + 1);
      return;
    }

    // === FCFS / SJF / PRIORIDAD ===
    let procesoEjecutando = null;
    switch (algoritmo) {
      case 'FCFS':
        procesoEjecutando = activos
            .filter(p => p.llegada <= tiempoActual)
            .sort((a, b) => a.llegada - b.llegada)[0];
        break;
      case 'SJF':
        procesoEjecutando = activos
            .filter(p => p.llegada <= tiempoActual)
            .sort((a, b) => a.tiempoRestante - b.tiempoRestante)[0];
        break;
      case 'Prioridad':
        procesoEjecutando = activos
            .filter(p => p.llegada <= tiempoActual)
            .sort((a, b) => a.prioridad - b.prioridad)[0];
        break;
      default:
        procesoEjecutando = activos[0];
    }

    // 👇 Registrar estado ANTES de avanzar tiempo
    const nuevoEstado = activos.map(p => ({
      procesoId: p.id,
      estado:
          p.id === procesoEjecutando?.id
              ? 'ejecutando'
              : p.llegada <= tiempoActual
                  ? 'esperando'
                  : 'pendiente'
    }));
    setEstadosEjecucion(prev => ({
      ...prev,
      [tiempoActual]: nuevoEstado
    }));

    if (procesoEjecutando) {
      setProcesos(prev =>
          prev.map(p => {
            if (p.id !== procesoEjecutando.id) return p;
            const nuevoRestante = p.tiempoRestante - 1;
            if (nuevoRestante === 0) {
              finalizarProceso(p, tiempoActual + 1);
            }
            return { ...p, tiempoRestante: nuevoRestante };
          })
      );
    }

    setTiempoActual(prev => prev + 1);
  };


  // --- GUARDAR SIMULACIÓN EN EL HISTORIAL (sin cambios) ---
  const guardarSimulacion = () => {
    if (procesosFinalizados.length === 0) return;

    // Calcular estadísticas
    const totalEspera = procesosFinalizados.reduce((sum, p) => sum + p.tiempoEspera, 0);
    const promedioEspera = (totalEspera / procesosFinalizados.length).toFixed(2);

    const indices = procesosFinalizados
      .filter(p => p.tiempoRetorno > 0)
      .map(p => p.rafaga / p.tiempoRetorno);
    
    const promedioIndiceServicio = indices.length > 0
      ? (indices.reduce((a, b) => a + b, 0) / indices.length).toFixed(2)
      : '0.00';

    const nuevaSimulacion = {
      fecha: new Date().toISOString(),
      algoritmo: algoritmo,
      quantum: algoritmo === 'Round Robin' ? quantum : null,
      tiempoTotal: tiempoActual,
      procesos: [...procesosFinalizados],
      estadisticas: {
        promedioEspera,
        promedioIndiceServicio
      }
    };

    setHistorialSimulaciones(prev => [...prev, nuevaSimulacion]);
  };

  // --- INICIAR, PAUSAR, REINICIAR, LIMPIAR ---
  const iniciarSimulacion = () => {
    if (procesos.length === 0) {
      alert('Agrega al menos un proceso');
      return;
    }

    // 🔥 CORRECCIÓN MÍNIMA: Resetear el estado de los procesos principales a CERO.
    setProcesos(prev => prev.map(p => ({ 
        ...p, 
        tiempoRestante: p.rafaga, // Restaurar ráfaga
        tiempoEspera: 0,
        tiempoRetorno: 0,
        tiempoFinalizacion: 0
    })));

    // Reiniciar valores de la corrida
    setTiempoActual(0);
    setEstadosEjecucion({});
    setProcesosFinalizados([]); // Limpia la tabla de resumen
    setRrQueue([]);
    setRrCurrentId(null);
    setRrSlice(0);

    // Línea comentada
    // ejecutarPasoSimulacion();

    setSimulando(true);
  };
  
  const pausarSimulacion = () => setSimulando(false);

  const reiniciarSimulacion = () => {
    setSimulando(false);
    setTiempoActual(0);
    setEstadosEjecucion({});
    setProcesosFinalizados([]); // Limpia la tabla de resumen

    // 🔥 CORRECCIÓN MÍNIMA: Resetear el estado de los procesos principales a CERO.
    setProcesos(prev => prev.map(p => ({ 
        ...p, 
        tiempoRestante: p.rafaga, // Restaurar ráfaga
        tiempoEspera: 0,
        tiempoRetorno: 0,
        tiempoFinalizacion: 0
    })));
    
    setRrQueue([]);
    setRrCurrentId(null);
    setRrSlice(0);
  };

  const limpiarProcesos = () => {
    setProcesos([]);
    setTiempoActual(0);
    setEstadosEjecucion({});
    setProcesosFinalizados([]);
    setSimulando(false);
    setRrQueue([]);
    setRrCurrentId(null);
    setRrSlice(0);
  };

  // --- RENDER ---
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
            {/* Historial Completo justo debajo del resumen de procesos completados */}
            <HistorialCompleto historialSimulaciones={historialSimulaciones} />
          </div>
        </div>
      </div>
  );
}

export default App;