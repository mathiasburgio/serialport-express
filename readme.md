# Lector de Puerto Serie RS232 para Windows

Este proyecto es una aplicación de lector de puerto serie RS232 diseñada para Windows. Permite visualizar la lectura de datos en tiempo real y también acceder a los datos de forma remota a través de una API HTTP.

## Características

- **Visualización en Tiempo Real**: Conecta el dispositivo al puerto RS232 correspondiente, y los datos se mostrarán en la parte superior de la interfaz de la aplicación.
- **API para Integración Externa**: Si deseas utilizar la lectura en otro software, puedes acceder a los datos de forma remota en `http://localhost:3505/get-data`.

## Requisitos

- **Sistema Operativo**: Windows
- **Puerto Serie**: RS232

## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/mathiasburgio/serialport-express

2. Navega al directorio del proyecto:  
    ```bash
    cd serialport-express

3. Instala las dependencias necesarias:  
    ```bash
    npm install

3. Ejecuta:  
    ```bash
    npm run start

3. Compila/empaqueta:  
    ```bash
    npm run build

