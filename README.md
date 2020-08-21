# proyecto-final

## Vista previa

https://dlrdj.sse.codesandbox.io/

## Introducción

El objetivo de este proyecto es integrar los conocimientos aprendidos durante el curso de Node.js realizando una demo de aplicación web. Para el front-end se utilizará lo visto para HTML5, CSS3 y ES6. Para el back-end se usará Node.js, Express para el servidor, Handlebars para crear las vistas y MongoDB para almacenar datos.

## Idea de Aplicación Web

Inspirado en una idea de mi hermana y en la interacción dentro del sitio www.SongMeanings.com y www.genius.com, se me ocurrió crear una plataforma para archivar sueños, buscar coincidencias temáticas con otros usuarios, comentar y/o analizar esos sueños y obtener guía sobre los significados de los mismos.

## Estructura y componentes

Para llevar a cabo esta Web App, identifico inicialmente __ componentes escenciales:
1. **_Una página de bienvenida_**. La recepción para todo nuevo visitante. Permite dar un vistazo al sitio y acceder al registro de cuenta.
2. **_Registro e inicio de sesión_**. Los usuarios necesitan ingresar datos mínimos para comenzar a utilizar el sitio. Necesario para llevar registro de los sueños y poder comentar sobre los de otros.
3. **_Home(página principal)_**. Una ves registrado, desde aquí se pueden crear entradas de registro nuevas, modificar el perfil y credenciales, recibir notificaciones sobre nuevos comentarios, etc.
4. **_Exploración y búsqueda_**. Si las entradas de registro son públicas, apareceran aquí.
5. **_Vista de sueño_**. Permite ver la entrada seleccionada e interactuar con la misma (comentar y anotar).

![Design Flowchart](https://github.com/meschinca/proyecto-final/blob/master/prototype/design_flowchart.png "Diseño preliminar de la aplicación")

## Lista de tareas pendientes

- Agregar la opción de público o privado al crear sueños (HECHO)
- Reemplazar formularios por AJAX XHR según corresponda
- Mejorar interfaz de  comentarios y su modelo en DB
- Convetir Home en SPA para el formulario de crear sueños y mostrar los sueños creados
- LLevar la barra de búsqueda al Navbar
- Crear la presentación en tarjetas de los resultados de búsqueda
- Agregar otros métodos de búsqueda
- Implementar el carroussel de tarjetas de sueños en la página de bienvenida
- Crear la página de perfil de usuario y modificar el modelo de usuario en DB
- Mejorar la presentación visual y gráficas
