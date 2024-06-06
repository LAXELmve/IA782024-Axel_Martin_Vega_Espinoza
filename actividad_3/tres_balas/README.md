### Alumno: Axel Martin Vega Espinoza

# Evasión de tres proyectiles (Con modo Manual y Automático)

Para esta versión del juego desarrollado con el entorno de programación Phaser, el jugador se enfrenta al siguiente desafío: evitar ser impactados por tres proyectiles que se mueven en direcciones diferentes. Uno de los proyectiles se desplaza verticalmente, otro lo hace horizontalmente, mientras que el tercero lo hace de manera diagonal. El jugador debe utilizar saltos y movimientos laterales hacia la derecha e izquierda para esquivar los obstáculos y mantenerse con vida.

Pero eso no es todo. El juego también ofrece una opción de juego automático. En esta modalidad, se emplea un Perceptrón, un modelo de aprendizaje automático. El Perceptrón utiliza los datos de la última partida para desarrollar un modelo capaz de jugar de forma independiente. ¡Es fascinante ver cómo la inteligencia artificial se adapta y mejora con cada intento!


## Desarrollo

Para alimentar el modelo se le entregan los siguientes valores:

```Java
datosEntrenamiento.push({
                'input' :  [despBala , velocidadBala, despBala2 , despBala3x, despBala3y],
                'output':  [estatusAire , estatuSuelo , estatusDerecha , estatusNeutral , estatusAtras]
        });
```

Para la información de la bala 1 (horizontal) se utilizan las variables `despBala`; la cual tiene la diferencia entre la posición del jugador y la posición de la bala en el eje X, y `velocidadBala`; que incluye un valor aleatorio entre cierto rango y se utiliza dentro del juego para definir la velocidad que tendrá la bala.   

Para la información de la bala 2 (vertical) se utiliza la variable `despBala2`; la cual tiene la diferencia entre la posición del jugador y la posición de la bala en el eje Y.    

Para la información de la bala 3 (diagonal) se utilizan las variables `despBala3X`; la cual tiene la diferencia entre la posición del jugador y la posición de la bala en el eje X, y `despBala3Y`; la cual tiene la diferencia entre la posición del jugador y la posición de la bala en el eje Y.    

Para este ejercicio, las velocidades de las balas 2 y 3 son la misma durante todo el juego, por lo que ya no se consideró como un dato de entrada viable.

Como variables de salida se utilizan nombres que representan los estatus en el juego, mediante valores booleanos:
* **estatusAire**: con 1 indica que el jugador está en el proceso de salto.
* **estatuSuelo**: con 1 indica que el jugador está en el suelo.
* **estatusDerecha**: con 1 indica que el jugador está en el proceso de desplazarse a la derecha.
* **estatusNeutral**: con 1 indica que el jugador está en el punto inicial.
* **estatusAtras**: con 1 indica que el jugador está en el proceso de desplazarse hacia atrás (o el lado izquierdo).

La red neuronal se crea con el siguiente código

```Java
nnNetwork =  new synaptic.Architect.Perceptron(5, 6, 6, 5);
```

La red Neuronal contiene 5 neuronas en la capa de entrada, 2 capas ocultas de 6 neuronas cada una y una capa de salida con otras 5 neuronas.

En lo que respecta al entrenamiento; se utilizaron los siguientes parámetros:

```Java
nnEntrenamiento.train(datosEntrenamiento, {rate: 0.0003, iterations: 10000, shuffle: true});
```

Se entronó con una tasa de aprendizaje (rate) de 0.0003 unidades, 10000 iteraciones y la opción de barajar los datos del entrenamiento antes de cada iteración.

## Resultados

A continuación se muestra uno de los mejores resultados conseguidos en Modo Auto:

<video src="./evidencia/recorte.mp4" controls ></video>

En este intento se lograron agregar 306 registros para el entrenamiento, lo que resulto en un modelo que replicaba casi de manera aceptable los movimientos del jugador, ya que solo se limitaba a saltar y desplazarse hacia atrás. El desplazamiento hacia adelante (izquierda) se ignoraba, posiblemente por la poca cantidad de registros que lo contenían, y también, por los parámetros de la red neuronal.

Sin embargo, se llegaron a presentar otros casos en los que incluso con unos pocos más registros de entrada el desempeño era peor (véase el último video), por lo que aún no se llega a la mejor configuración posible.

<video src="./evidencia/recorte2.mp4" controls ></video>