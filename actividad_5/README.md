### Alumno: Axel Martin Vega Espinoza

# Evasión de proyectil rebotante (Con modo Manual y Automático)

Para esta versión del juego desarrollado con el entorno de programación Phaser, el jugador se enfrenta al siguiente desafío: evitar ser impactados por un proyectil que tiene la capacidad de rebotar en los bordes del escenario y por ende moverse en direcciones diferentes. Uno de los proyectiles se desplaza verticalmente. El jugador debe utilizar las teclas de dirección (arriba, abajo, izquierda y derecha) para esquivar el proyectil y mantenerse con vida.

Pero eso no es todo. El juego también ofrece una opción de juego automático. En esta modalidad, se emplea un Perceptrón, un modelo de aprendizaje automático. El Perceptrón utiliza los datos de la última partida para desarrollar un modelo capaz de jugar de forma independiente.


## Desarrollo

Para alimentar el modelo se le entregan los siguientes valores:

```Java
datosEntrenamiento.push({
        'input' :  [jugador.position.x , jugador.position.y, bala.position.x, bala.position.y],
        'output':  [estatusInmovil, estatusArriba, estatusAbajo, estatusIzquierda, estatusDerecha]  
});
```

Para la información de entrada se utilizan dos variables relacionadas con el jugador: `jugador.position.x`para conocer la ubicación del jugador en el eje horizontal y `jugador.position.y`para conocer la ubicación del jugador en el eje vertical. Las otras dos variables de entrada restantes son:  `bala.position.x`para conocer la ubicación del proyectil en el eje horizontal y `bala.position.y`para conocer la ubicación del proyectil en el eje vertical.

Como variables de salida se utilizan nombres que representan los estatus en el juego, mediante valores booleanos:
* **estatusInmovil**: con 1 indica que el jugador presenta ausencia de movimiento.
* **estatusArriba**: con 1 indica que el jugador está desplazandose hacia arriba.
* **estatusAbajo**: con 1 indica que el jugador está desplazandose hacia abajo.
* **estatusIzquierda**: con 1 indica que el jugador está desplazandose hacia la izquierda.
* **estatusDerecha**: con 1 indica que el jugador está desplazandose hacia la derecha.

La red neuronal se crea con el siguiente código

```Java
nnNetwork =  new synaptic.Architect.Perceptron(4, 6, 6, 5);
```

La red Neuronal contiene 5 neuronas en la capa de entrada, 2 capas ocultas de 6 neuronas cada una y una capa de salida con otras 5 neuronas.

En lo que respecta al entrenamiento; se utilizaron los siguientes parámetros:

```Java
nnEntrenamiento.train(datosEntrenamiento, {rate: 0.0003, iterations: 10000, shuffle: true});
```

Se entronó con una tasa de aprendizaje (rate) de 0.0003 unidades, 10000 iteraciones y la opción de barajar los datos del entrenamiento antes de cada iteración.

## Resultados

A continuación se muestra uno de los mejores resultados conseguidos en Modo Auto:

https://github.com/LAXELmve/IA782024-Axel_Martin_Vega_Espinoza/assets/111810619/ade0c66c-729d-49be-83d9-31d82dbb24b2

En este intento se lograron agregar 354 registros para el entrenamiento, lo que resulto en un modelo que replicaba, de manera algo cuestionable, los movimientos del jugador. El gran detalle radica en que, como muchos otros intentos, tiende a desplazarse insistentemente hacia la izquierda.

Hay otros casos en los que lo único que logra aprender es a desplazarse hacia el lado izquierdo, lo cual se puede apreciar en el siguiente video.

https://github.com/LAXELmve/IA782024-Axel_Martin_Vega_Espinoza/assets/111810619/84f451c7-005a-480e-bb0a-94b6ea8ba58a

Esto último deja muy en claro que aún no se llega a la mejor configuración posible para la red neuronal.
