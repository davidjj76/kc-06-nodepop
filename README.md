# Nodepop API

Ejercicio de la práctica del módulo de Node, Express y Mongo.


## Instrucciones para ponerlo en marcha

Una vez clonado el repositorio, seguir los siguientes pasos:

1) Cambiamos al directorio del proyecto:

```
$ cd kc-06-nodeapi
```

2) Instalamos las dependencias del proyecto:

```
$ npm install
```

3) Instalamos las dependencias del proyecto de documentación:

```
$ npm run installDocs
```

4) Añadimos unos usuarios y unos anuncios a la base de datos con el siguiente script (requiere tener un servidor MongoDB corriendo en el puerto 27017 de la máquina, aunque se puede modificar la url de la base de datos en el fichero *localConfig.js*):

```
$ npm run installDB
```

5) Iniciamos los servidores del API y de documentación (en diferentes terminales):

- API:

```
$ npm start
```

O en desarrollo, se puede arrancar un servidor *nodemon*, mediante:

```
$ npm run dev
```

- Documentación:

```
$ npm run docs
```

6) Los endpoints del API estarán disponibles a partir de http://localhost:3000/apiv1. Entra en la url de documentación http://localhost:3001 para más info y  probar los diferentes endpoints del API.

Para modificar el idioma de las peticiones se puede hacer en el fichero *./doc/public/data/nodepop.json* (en headers:Accept-Language) o bien realizar las peticiones con *Postman* y modificar la cabecera "Accept-Language".

En estos momentos sólo se aceptan Inglés y Español (en este orden de prioridad). Para añadir más, simplemente añadir la clave del lenguaje a la sección *languages* del fichero *localConfig.js* y añadir un archivo con los mensajes en el directorio *./lib/messages*.

7) Se dispone de un linter de código mediante *ESLint* que sigue la guía de *Airbnb*. Se puede ejecutar con:

```
$ npm run lint
```

o en desarrollo con un *watcher*, para tener el código a punto a cada modificación:

```
$ npm run watch:lint
```
