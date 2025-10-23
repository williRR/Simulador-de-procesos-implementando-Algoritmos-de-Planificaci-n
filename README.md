

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

<img width="1350" height="616" alt="image" src="https://github.com/user-attachments/assets/9db8bb3e-8120-46d2-ad57-c28b11a9e936" />

<img width="1350" height="616" alt="image" src="https://github.com/user-attachments/assets/3a314d94-62e7-4894-bd37-0fc34ccb44cf" />

<img width="1350" height="616" alt="image" src="https://github.com/user-attachments/assets/20d27697-dcaf-4595-a09e-9d4610828b85" />



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

