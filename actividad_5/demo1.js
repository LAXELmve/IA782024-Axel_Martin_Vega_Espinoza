var w=800;
var h=400;
var jugador;
var fondo;

var bala, balaD=false;

var arriba;
var abajo;
var izquierda;
var derecha;

var menu;

var estatusInmovil, estatusArriba, estatusAbajo, estatusIzquierda, estatusDerecha;

var velocidadBala;
var despBala;

var nnNetwork , nnEntrenamiento, nnSalida, datosEntrenamiento=[];
var modoAuto = false, eCompleto=false;

var velMov;

var disMax;



var juego = new Phaser.Game(w, h, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render:render});

function preload() {
    juego.load.image('fondo', 'assets/game/fondo_2.jpg');
    juego.load.spritesheet('mono', 'assets/sprites/altair.png',32 ,48);
    juego.load.image('bala', 'assets/sprites/purple_ball.png');
    juego.load.image('menu', 'assets/game/menu.png');

}



function create() {

    juego.physics.startSystem(Phaser.Physics.ARCADE);
    juego.physics.arcade.gravity.y = 0;
    juego.time.desiredFps = 30;

    fondo = juego.add.tileSprite(0, 0, w, h, 'fondo');
    bala = juego.add.sprite(w-100, h, 'bala');
    jugador = juego.add.sprite(w/2, h/2, 'mono');


    juego.physics.enable(jugador);
    jugador.body.gravity.y = 0;
    jugador.body.collideWorldBounds = true;
    var corre = jugador.animations.add('corre',[8,9,10,11]);
    jugador.animations.play('corre', 10, true);

    juego.physics.enable(bala);
    // bala.body.setCircle(8.5);
    bala.body.gravity.y = 0;
    bala.body.collideWorldBounds = true;
    bala.body.bounce.set(1);

    pausaL = juego.add.text(w - 100, 20, 'Pausa', { font: '20px Arial', fill: '#fff' });
    pausaL.inputEnabled = true;
    pausaL.events.onInputUp.add(pausa, self);
    juego.input.onDown.add(mPausa, self);

    arriba = juego.input.keyboard.addKey(Phaser.Keyboard.UP);
    abajo = juego.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    izquierda = juego.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    derecha = juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    
    nnNetwork =  new synaptic.Architect.Perceptron(4, 6, 6, 5);
    nnEntrenamiento = new synaptic.Trainer(nnNetwork);

    ComportamientoBala();

    velMov = 200;

    estatusInmovil = true;
    estatusArriba = false;
    estatusAbajo = false;
    estatusIzquierda = false;
    estatusDerecha = false;

    disMax = 35;
}

function enRedNeural(){
    nnEntrenamiento.train(datosEntrenamiento, {rate: 0.0003, iterations: 10000, shuffle: true});
}

function entrenamientoArriba(param_entrada){

    //console.log("Entrada",param_entrada[0]+" "+param_entrada[1]);
    nnSalida = nnNetwork.activate(param_entrada);
    var vInmovil=Math.round( nnSalida[0]*100 );
    var vArriba=Math.round( nnSalida[1]*100 );
    console.log("Valor ","Arriba %: "+ vArriba + " Inmovil %: " + vInmovil );
    return nnSalida[1]>=nnSalida[0];
}

function entrenamientoAbajo(param_entrada){

    //console.log("Entrada",param_entrada[0]+" "+param_entrada[1]);
    nnSalida = nnNetwork.activate(param_entrada);
    var vInmovil=Math.round( nnSalida[0]*100 );
    var vAbajo=Math.round( nnSalida[2]*100 );
    console.log("Valor ","Abajo %: "+ vAbajo + " Inmovil %: " + vInmovil );
    return nnSalida[2]>=nnSalida[0];
}

function entrenamientoIzquierda(param_entrada){

    //console.log("Entrada",param_entrada[0]+" "+param_entrada[1]);
    nnSalida = nnNetwork.activate(param_entrada);
    var vInmovil=Math.round( nnSalida[0]*100 );
    var vIzquierda=Math.round( nnSalida[3]*100 );
    console.log("Valor ","Izquierda %: "+ vIzquierda + " Inmovil %: " + vInmovil );
    return nnSalida[3]>=nnSalida[0];
}

function entrenamientoDerecha(param_entrada){

    //console.log("Entrada",param_entrada[0]+" "+param_entrada[1]);
    nnSalida = nnNetwork.activate(param_entrada);
    var vInmovil=Math.round( nnSalida[0]*100 );
    var vDerecha=Math.round( nnSalida[4]*100 );
    console.log("Valor ","Derecha %: "+ vDerecha + " Inmovil %: " + vInmovil );
    return nnSalida[4]>=nnSalida[0];
}

function pausa(){
    juego.paused = true;
    menu = juego.add.sprite(w/2,h/2, 'menu');
    menu.anchor.setTo(0.5, 0.5);
}

function mPausa(event){
    if(juego.paused){
        var menu_x1 = w/2 - 270/2, menu_x2 = w/2 + 270/2,
            menu_y1 = h/2 - 180/2, menu_y2 = h/2 + 180/2;

        var mouse_x = event.x  ,
            mouse_y = event.y  ;

        if(mouse_x > menu_x1 && mouse_x < menu_x2 && mouse_y > menu_y1 && mouse_y < menu_y2 ){
            if(mouse_x >=menu_x1 && mouse_x <=menu_x2 && mouse_y >=menu_y1 && mouse_y <=menu_y1+90){
                eCompleto=false;
                datosEntrenamiento = [];
                modoAuto = false;
            }else if (mouse_x >=menu_x1 && mouse_x <=menu_x2 && mouse_y >=menu_y1+90 && mouse_y <=menu_y2) {
                if(!eCompleto) {
                    console.log("","Entrenamiento "+ datosEntrenamiento.length +" valores" );
                    enRedNeural();
                    eCompleto=true;
                }
                modoAuto = true;
            }

            menu.destroy();
            resetVariables();
            juego.paused = false;

        }
    }
}

function ComportamientoBala(){
    bala.body.velocity.y = 450;
    bala.body.velocity.x = -650;
    //var velBalaX = velocidadRandom(100, 200);
    //var velBalaX = velocidadRandom(100, 200);
    posicionarBalaAleatoriamente();
}

function posicionarBalaAleatoriamente() {
    var x, y;

    // Generar una posición x aleatoria en los rangos 0-300 o 500-800
    if (Math.random() < 0.5) {
        x = Math.random() * 300; // 0-300
    } else {
        x = 500 + Math.random() * 300; // 500-800
    }

    // Generar una posición y aleatoria en los rangos 0-100 o 300-400
    if (Math.random() < 0.5) {
        y = Math.random() * 100; // 0-100
    } else {
        y = 300 + Math.random() * 100; // 300-400
    }

    // Posicionar la bala
    bala.position.x = x;
    bala.position.y = y;
}


function resetVariables(){
    jugador.body.velocity.x=0;
    jugador.body.velocity.y=0;
    /* bala.body.velocity.y = 60;
    bala.body.velocity.x = -200;
    bala.position.x = w-100; */
    ComportamientoBala();
    jugador.position.x=w/2;
    jugador.position.y=h/2;
    balaD=false;

    estatusInmovil = true;
    estatusArriba = false;
    estatusAbajo = false;
    estatusIzquierda = false;
    estatusDerecha = false;
}

function arribaP(){
    estatusInmovil = false;
    estatusArriba = true;
    estatusAbajo = false;
    jugador.body.velocity.y = (-1 * velMov);
}

function abajoP(){
    estatusInmovil = false;
    estatusArriba = false;
    estatusAbajo = true;
    jugador.body.velocity.y = velMov;
}

function izquierdaP(){
    estatusInmovil = false;
    estatusIzquierda = true;
    estatusDerecha = false;
    jugador.body.velocity.x = (-1 * velMov);
}

function derechaP(){
    estatusInmovil = false;
    estatusIzquierda = false;
    estatusDerecha = true;
    jugador.body.velocity.x = velMov;
}

function update() {

    fondo.tilePosition.x -= 1; 

    /* if (jugador.position.x < disMax || jugador.position.x > (w-disMax) || jugador.position.y < disMax || jugador.position.y > (h-disMax)) {
        // Mover al jugador al centro
        jugador.x = w / 2;
        jugador.y = h / 2;
    } */

    if ((jugador.position.x < disMax && jugador.position.y < disMax) || // Esquina superior izquierda
    (jugador.position.x > (w-disMax) && jugador.position.y < disMax) || // Esquina superior derecha
    (jugador.position.x < disMax && jugador.position.y > (h-disMax-20)) || // Esquina inferior izquierda
    (jugador.position.x > (w-disMax) && jugador.position.y > (h-disMax-20))) { // Esquina inferior derecha
        // Mover al jugador al centro
        jugador.x = w / 2;
        jugador.y = h / 2;
    }

    juego.physics.arcade.collide(bala, jugador, colisionH, null, this);

    if (modoAuto == false && !izquierda.isDown && !derecha.isDown && !arriba.isDown && !abajo.isDown) {
        estatusInmovil = true;
    }

    if (modoAuto == false && (arriba.isDown && abajo.isDown)) {
        estatusArriba = false;
        estatusAbajo = false;
        jugador.body.velocity.y=0;
    } else if (modoAuto == false && arriba.isDown) {
        arribaP();
    } else if (modoAuto == false && abajo.isDown) {
        abajoP();
    } else {
        estatusArriba = false;
        estatusAbajo = false;
        jugador.body.velocity.y=0;
    }


    if (modoAuto == false && (izquierda.isDown && derecha.isDown)) {
        estatusIzquierda = false;
        estatusDerecha = false;
        jugador.body.velocity.x=0;
    } else if (modoAuto == false && izquierda.isDown) {
        izquierdaP();
    } else if (modoAuto == false && derecha.isDown) {
        derechaP();
    } else {
        estatusIzquierda = false;
        estatusDerecha = false;
        jugador.body.velocity.x=0;
    }

    if (modoAuto == true) {
        if (jugador.body.velocity.x == 0 && jugador.body.velocity.y == 0) {
            estatusInmovil = true;
        }

        if (entrenamientoArriba([jugador.position.x , jugador.position.y, bala.position.x, bala.position.y])) {
            arribaP();
        } else if (entrenamientoAbajo([jugador.position.x , jugador.position.y, bala.position.x, bala.position.y])) {
            abajoP();
        } else {
            estatusArriba = false;
            estatusAbajo = false;
            jugador.body.velocity.y=0;
        }

        if (entrenamientoIzquierda([jugador.position.x , jugador.position.y, bala.position.x, bala.position.y])) {
            izquierdaP();
        } else if (entrenamientoDerecha([jugador.position.x , jugador.position.y, bala.position.x, bala.position.y])) {
            derechaP();
        } else {
            estatusIzquierda = false;
            estatusDerecha = false;
            jugador.body.velocity.x=0;
        }
    }

    if( modoAuto ==false ){

        datosEntrenamiento.push({
                'input' :  [jugador.position.x , jugador.position.y, bala.position.x, bala.position.y],
                'output':  [estatusInmovil, estatusArriba, estatusAbajo, estatusIzquierda, estatusDerecha]  
        });

        console.log("jugador X, Y, bala X, Y: ",jugador.position.x , jugador.position.y, bala.position.x, bala.position.y);

        console.log("Estatus Inmovil, Arriba, Abajo, Izquierda, Derecha: ",
            estatusInmovil, estatusArriba, estatusAbajo, estatusIzquierda, estatusDerecha);

        //console.log("Velocidad Bala X, Y: ", bala.body.velocity.x, bala.body.velocity.y);
   }

}

function colisionH(){
    pausa();
}

function velocidadRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function render(){

}
