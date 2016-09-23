# KyrosView - Registro de cambios
Todos los cambios importantes realizados en este proyecto será documentado en este fichero

## [1.0.1] - 2016-09-21
### Funcionalidades añadidas
- Todas las opciones en menú principal con acceso único.
- Árbol de dispositivos:
	- Al pulsar sobre el botón "Todos" aparece un arbol con todos los dispositivos que puede monitorizar el usuario. 
	- Se pueden seleccionar dispositivos y se mostraran sobre el mapa (su última posición).
- Colocar un punto sobre el mapa. Cuando se pulsa en el mapa se posiciones un punto naranja que permite abrir una nueva ventana popup (donde añadir futuras opciones como cercanía a POIs, a dispositivos, etc).

### Mejoras y funcionalidades menores
- Interfaz más limpia, eliminación de controles de mapa (especialmente en acceso móvil).
- Alojado en mongodb los datos de monitorización de dispositivos.
- Recolocación de controles de mapa (controles de zoom abajo a la izquierda).
- Añadido el campo fecha al pulsar sobre dispositivo.
- Efecto de caida en los puntos de tracking (consulta de histórico).
- Mensaje de aviso cuando no existe puntos de tracking (despues de consulta en histórico)

## 1.0.0 - 2016-09-19
### Funcionalides
- Login y control de sesión.
- i18n (español, ingles).
- Consulta de la última posicion de todos los dispositivos que puede monitorizar el usuario.
- Consulta del histórico de un dispositivo.
- Gráficos.
- Muestra los POIs que puede visualizar el usuario.
- Selección de dispositivo por defecto.
- Cartografía Google.
- Globo terraqueo.
- Configuración de la cuenta del usuario.
- Heatmaps y clustering de posiciones.

[1.0.1]: http://view.kyroslbs.com/