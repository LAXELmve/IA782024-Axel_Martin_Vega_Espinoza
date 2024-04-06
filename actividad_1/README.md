### Alumno: Axel Martin Vega Espinoza

# Resumen
En esta actividad se desarrollan distintos modelos de reconocimiento de rostros, tanto para detectar las caras de personas como para identificar emociones.     

Los modelos utilizados son los siguientes:     

* EigenFaceRecognizer:
    - Está basado en el análisis de componentes principales (PCA). Utiliza una técnica de reducción de dimensionalidad para extraer características significativas de las imágenes de entrenamiento. Es eficiente y funciona bien en situaciones con suficientes datos de entrenamiento.

* FisherFaceRecognizer:
    - Se basa en el análisis discriminante de Fisher (LDA). Es similar al EigenFaceRecognizer, pero se enfoca en maximizar la separación entre clases (por ejemplo, diferentes personas) en lugar de simplemente reducir la dimensionalidad. Puede ser más robusto que el EigenFaceRecognizer en situaciones con menos datos de entrenamiento.

* LBPHFaceRecognizer (Local Binary Pattern Histogram Face Recognizer):
    - Utiliza el método de patrones binarios locales (LBP) para extraer características locales de la imagen, divide la imagen en celdas y calcula un histograma de patrones binarios locales en cada celda. El resultado es un vector de características que representa la textura local del rostro. A menudo se utiliza para tareas de reconocimiento facial en imágenes con iluminación y condiciones de captura variables.


# Resultados

* **EigenFaceRecognizer**:

    Los resultados con este modelo no fueron satisfactorios para rostros, ya que solo pudo identificar de forma correcta dos de cinco rostros, sin embargo, el modelo no vario demasiado al tratar de identificar cada uno de los rostros. Y para emociones también tuvo problemas para detectar rostros felices.  Este desempeño seguramente se debió a los pocos datos de entrenamiento que se utilizaron (453 imágenes por cada rostro).  

    ### Caras
     ![Resultados con EigenFace](./evidencia/IA_Practica-1%20-%20Eigenface.gif)
    ### Emociones
     ![Resultados con EigenFace](./evidencia/IA_Practica-1-emociones-eigenface.gif)   


* **FisherFaceRecognizer**:

    Los resultados con este modelo también fueron insatisfactorios al momento de identificar rostros, ya que no pudo identificar de forma correcta ninguno de los cinco rostros, y también presentó problemas para detectar rostros tristes. En este caso el modelo sí vario en algunos casos al tratar de identificar cada uno de los rostros y las emociones. Aunque este modelo funciona bien con pocos datos de entrenamiento, este modelo no dio los resultados esperados.

    ### Caras
    ![Resultados con FisherFace](./evidencia/IA_Practica-1%20-%20Fisherface.gif)
    ### Emociones
    ![Resultados con FisherFace](./evidencia/IA_Practica-1-emociones-fisherface.gif)


* **LBPHFaceRecognizer**:

    Considero que este modelo dio los mejores resultados en comparación con los otros dos, tanto para rostros como para  emociones, sin embargo, al tratar de predecir emociones era muy común que cambiara constantemente entre categorías.

    ### Caras
    ![Resultados con LBPHFace](./evidencia/IA_Practica-1%20-%20LBPH.gif)
    ### Emociones
    ![Resultados con LBPHFace](./evidencia/IA_Practica-1-emociones-lbph.gif)
