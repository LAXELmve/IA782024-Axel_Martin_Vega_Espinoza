### Alumno: Axel Martin Vega Espinoza

# Evasión de dos proyectiles (Con modo Manual y Automático)

Para esta versión del juego desarrollado con el entorno de programación Phaser, el jugador se enfrenta al siguiente desafío: evitar ser impactados por dos proyectiles que se mueven en direcciones diferentes. Uno de los proyectiles se desplaza verticalmente, mientras que el otro lo hace horizontalmente. El jugador debe utilizar saltos y movimientos laterales hacia la derecha para esquivar los obstáculos y mantenerse con vida.

Pero eso no es todo. El juego también ofrece una opción de juego automático. En esta modalidad, se emplea un Perceptrón, un modelo de aprendizaje automático. El Perceptrón utiliza los datos de la última partida para desarrollar un modelo capaz de jugar de forma independiente. ¡Es fascinante ver cómo la inteligencia artificial se adapta y mejora con cada intento!


## Desarrollo

Para alimentar el modelo se le entregan los siguientes valores:

```Java
datosEntrenamiento.push({
                'input' :  [despBala , velocidadBala, despBala2 , velocidadBala2],
                'output':  [estatusAire , estatuSuelo , estatusDerecha , estatusIzquierda ]
        });
```

Para la información de la bala 1 (horizontal) se utilizan las variables `despBala`; la cual tiene la diferencia entre la posición del jugador y la posición de la bala en el eje X, y `velocidadBala`; que incluye un valor aleatorio entre cierto rango y se utiliza dentro del juego para definir la velocidad que tendrá la bala.    

Para la información de la bala 2 (vertical) se utilizan las variables `despBala2`; la cual tiene la diferencia entre la posición del jugador y la posición de la bala en el eje Y, y `velocidadBala2`; que incluye un valor aleatorio entre cierto rango y se utiliza dentro del juego para definir la velocidad que tendrá la bala. 

Como variables de salida se utilizan nombres que representan los estatus en el juego, mediante valores booleanos:
* **estatusAire**: con 1 indica que el jugador está en el proceso de salto.
* **estatuSuelo**: con 1 indica que el jugador está en el suelo.
* **estatusDerecha**: con 1 indica que el jugador está en el proceso de desplazarse a la derecha.
* **estatusIzquierda**: con 1 indica que el jugador está en el proceso de regresar a su posición inicial.

La red neuronal se crea con el siguiente código

```Java
nnNetwork =  new synaptic.Architect.Perceptron(4, 6, 6, 4);
```

La red Neuronal contiene 4 neuronas en la capa de entrada, 2 capas ocultas de 6 neuronas cada una y una capa de salida con otras cuatro neuronas.

En lo que respecta al entrenamiento; se utilizaron los siguientes parámetros:

```Java
 nnEntrenamiento.train(datosEntrenamiento, {rate: 0.0003, iterations: 10000, shuffle: true});
```

Se entronó con una tasa de aprendizaje (rate) de 0.0003 unidades, 10000 iteraciones y la opción de barajar los datos del entrenamiento antes de cada iteración.

## Resultados

A continuación se muestra uno de los mejores resultados conseguidos en Modo Auto:

https://github.com/LAXELmve/IA782024-Axel_Martin_Vega_Espinoza/assets/111810619/3623188e-d83f-4071-a1f6-deb83c5510d3

Se logró conseguir alrededor de 400 entradas de datos, lo que resulto en un modelo que replicaba de buena manera los movimientos del jugador, y de hecho, lograba sobrevivir mucho más tiempo que el logrado de manera manual.
