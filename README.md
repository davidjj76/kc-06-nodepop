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

3) Instalamos las dependencias del proyecto de documentacion:

```
$ npm run installDocs
```

4) Añadimos unos usuarios y unos anuncios a la base de datos con el siguiente script (requiere tener un servidor MongoDB corriendo en el puerto 27017 de la máquina, aunque se puede modificar la url de la base de datos en el fichero localConfig.js):

```
$ npm run installDB
```

5) Iniciamos los servidores del API y de documentación (en diferentes terminales):

API:

```
$ npm start
```

O en desarrollo, se puede arrancar un servidor nodemon, mediante:

```
$ npm run dev
```

Documentación:

```
$ npm run docs
```

6) Los endpoints del API estarán disponibles a partir de http://localhost:3000/apiv1. Entra en la url de documentación http://localhost:3001 para más info y  probar los diferentes endpoints del API.

7) Se dispone de un linter de código mediante ESLint que sigue la guía de estilo de Airbnb. Se puede ejecutar con:

```
$ npm run lint
```

o en desarrollo con un watcher, para tener el codigo a punto a cada modificación:

```
$ npm run watch:lint
```