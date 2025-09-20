

# Simulador de Planificación de Procesos

Simulador web interactivo desarrollado con React y Tailwind CSS para visualizar el funcionamiento de diferentes algoritmos de
planificación de procesos del sistema operativo: *FCFS, SJF, SRTF y Round Robin*. Permite a los usuarios añadir procesos
personalizados y observar cómo son gestionados en una cola de espera y ejecutados por la CPU.

### Características

- *Algoritmos Múltiples:* Soporte para FCFS, SJF, SRTF y Round Robin.
- *Creación de Procesos:* Formulario para agregar procesos con nombre, tiempo de ráfaga y tiempo de llegada.
- *Visualización en Tiempo Real:* Muestra el estado actual de la CPU, la cola de procesos listos y el tiempo transcurrido.
- *Historial Completo:* Tabla que registra los procesos completados y sus métricas (tiempo de retorno y tiempo de espera).
- *Interfaz Moderna:* Diseño responsive y elegante implementado con Tailwind CSS.


### Capturas de Pantalla

![Captura 1: Vista principal]
<img width="1352" height="613" alt="image" src="https://github.com/user-attachments/assets/ccb3267c-71a2-4d57-9d18-8884438349f8" />


![Captura 2: Procesos en la cola]
<img width="1352" height="613" alt="image" src="https://github.com/user-attachments/assets/c1e0c4ac-aa6f-41bf-a6eb-b12c35babaa6" />


![Captura 3: Historial de procesos]
<img width="1091" height="280" alt="image" src="https://github.com/user-attachments/assets/1b8ba57b-4080-476a-b571-37c4e67ed55c" />


Tabla de historial mostrando los procesos que han completado su ejecución.

### Tecnologías

- *Frontend:* React.js
- *Estilos:* Tailwind CSS
- *Manejo de Estado:* React Hooks (useState, useEffect)

### Instalación y Uso

Para ejecutar el proyecto en tu máquina local, sigue estos pasos:

1.  Clona el repositorio:

    ```bash
    git clone https://github.com/williRR/Simulador-de-procesos-implementando-Algoritmos-de-Planificaci-n.
    ```
    

3.  Navega al directorio del proyecto:
    
    ```bash
    cd Simulador-de-procesos-implementando-Algoritmos-de-Planificaci-n
    ```

4.  Instala las dependencias:
    
    ```bash
    npm install
    ```

5.  Inicia el servidor de desarrollo:
    
    ```bash
    npm start
    ```

La aplicación se abrirá en tu navegador en http://localhost:3000.

