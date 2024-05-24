var w=800;
var h=400;
var jugador;
var fondo;

var bala, balaD=false, nave;
//
var bala2, balaD2=false, nave2;
//
var salto;
var moverDerecha;
var menu;

var velocidadBala;
var despBala;
//
var velocidadBala2;
var despBala2;
//
var estatusAire;
var estatuSuelo;

var nnNetwork , nnEntrenamiento, nnSalida, datosEntrenamiento=[];
var modoAuto = false, eCompleto=false;

var despDerTiempo;
var estatusDerecha;
var estatusIzquierda;

var balas;

var jugadorGolpeado;
var regresandoDer;


var juego = new Phaser.Game(w, h, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render:render});

function preload() {
    juego.load.image('fondo', 'assets/game/fondo.jpg');
    juego.load.spritesheet('mono', 'assets/sprites/altair.png',32 ,48);
    juego.load.image('nave', 'assets/game/ufo.png');
    juego.load.image('bala', 'assets/sprites/purple_ball.png');
    juego.load.image('menu', 'assets/game/menu.png');

}



function create() {

    juego.physics.startSystem(Phaser.Physics.ARCADE);
    juego.physics.arcade.gravity.y = 800;
    juego.time.desiredFps = 30;

    fondo = juego.add.tileSprite(0, 0, w, h, 'fondo');
    nave = juego.add.sprite(w-100, h-70, 'nave');
    bala = juego.add.sprite(w-100, h, 'bala');
    jugador = juego.add.sprite(50, h, 'mono');
    //
    nave2 = juego.add.sprite(20, 10, 'nave');
    bala2 = juego.add.sprite(60, 70, 'bala');
    //

    juego.physics.enable(jugador);
    jugador.body.collideWorldBounds = true;
    var corre = jugador.animations.add('corre',[8,9,10,11]);
    jugador.animations.play('corre', 10, true);

    juego.physics.enable(bala);
    bala.body.collideWorldBounds = true;
    //
    juego.physics.enable(bala2);
    bala2.body.collideWorldBounds = true;
    //

    pausaL = juego.add.text(w - 100, 20, 'Pausa', { font: '20px Arial', fill: '#fff' });
    pausaL.inputEnabled = true;
    pausaL.events.onInputUp.add(pausa, self);
    juego.input.onDown.add(mPausa, self);

    /* salto = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR); */
    salto = juego.input.keyboard.addKeys({
        'space': Phaser.Keyboard.SPACEBAR,
        'up': Phaser.Keyboard.UP
    });
    moverDerecha = juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    
    // nnNetwork =  new synaptic.Architect.Perceptron(2, 6, 6, 2);
    nnNetwork =  new synaptic.Architect.Perceptron(4, 6, 6, 4);
    nnEntrenamiento = new synaptic.Trainer(nnNetwork);

    estatusDerecha = 0;
    estatusIzquierda = 1;
    despDerTiempo = 0;

    balas = juego.add.group();
    balas.add(bala);
    balas.add(bala2);

    jugadorGolpeado = false;
    regresandoDer = false;
}

function enRedNeural(){
    nnEntrenamiento.train(datosEntrenamiento, {rate: 0.0003, iterations: 10000, shuffle: true});
}


function datosDeEntrenamiento(param_entrada){

    console.log("Entrada",param_entrada[0]+" "+param_entrada[1]+" "+param_entrada[2]+" "+param_entrada[3]);
    nnSalida = nnNetwork.activate(param_entrada);
    var aire=Math.round( nnSalida[0]*100 );
    var piso=Math.round( nnSalida[1]*100 );
    var der=Math.round( nnSalida[2]*100 );
    var izq=Math.round( nnSalida[3]*100 );
    console.log("Valor ","En el Aire %: "+ aire + " En el suelo %: " + piso + " En la der %: " + der + " En la izq %: " + izq );
    return nnSalida[0]>=nnSalida[1];
}

function datosDeEntrenamiento2(param_entrada){

    console.log("Entrada",param_entrada[0]+" "+param_entrada[1]+" "+param_entrada[2]+" "+param_entrada[3]);
    nnSalida = nnNetwork.activate(param_entrada);
    var aire=Math.round( nnSalida[0]*100 );
    var piso=Math.round( nnSalida[1]*100 );
    var der=Math.round( nnSalida[2]*100 );
    var izq=Math.round( nnSalida[3]*100 );
    console.log("Valor ","En el Aire %: "+ aire + " En el suelo %: " + piso + " En la der %: " + der );
    return nnSalida[2]>=nnSalida[3];
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
            jugadorGolpeado = false;

        }
    }
}


function resetVariables(){
    jugador.body.velocity.x=0;
    jugador.body.velocity.y=0;
    bala.body.velocity.x = 0;
    bala.position.x = w-100;
    jugador.position.x=50;
    balaD=false;
    //
    bala2.body.velocity.y = 0;
    bala2.position.y = 70;
    balaD2=false;
    estatusDerecha = 0;
    estatusIzquierda = 1;
    despDerTiempo = 0;
    jugadorGolpeado = false;
    regresandoDer = false;
    //
}


function saltar(){
    jugador.body.velocity.y = -270;
}

function moverseDer(){
    estatusIzquierda = 0;
    estatusDerecha = 1;
    jugador.position.x += 40;
    //jugador.position.x = Phaser.Math.linear(50, 90, 0.7);
}


function update() {

    fondo.tilePosition.x -= 1; 

    juego.physics.arcade.collide(balas, jugador, colisionH, null, this);

    estatuSuelo = 1;
    estatusAire = 0;

    if(!jugador.body.onFloor()) {
        estatuSuelo = 0;
        estatusAire = 1;
    }
	
    despBala = Math.floor( jugador.position.x - bala.position.x );
    //
    despBala2 = Math.floor( jugador.position.y - bala2.position.y );
    //

    //

    if(modoAuto==false && moverDerecha.isDown && estatusDerecha==0){
        moverseDer();
    }

    if ((despDerTiempo>=12) && (regresandoDer == false) && (estatusDerecha==1)) {
        jugador.position.x = 90;
        regresandoDer = true;
    }

    if(regresandoDer==true && estatusDerecha==1){
    jugador.position.x = Phaser.Math.linear(jugador.position.x, 50, 0.7);
    }

    if ((Math.abs(jugador.position.x - 50) < 1) && (regresandoDer == true) && (estatusDerecha==1)){
        jugador.position.x = 50;
        regresandoDer = false;
        estatusDerecha = 0;
        estatusIzquierda = 1;
        despDerTiempo = 0;
    }

    if(estatusDerecha==1 && regresandoDer == false){
        despDerTiempo++;
    }

    /* if(despDerTiempo>=15){
        estatusDerecha = 0;
        despDerTiempo = 0;
        jugador.position.x = 50;
    } */

    //

    if( modoAuto == true  && bala2.position.y>250 && (estatusDerecha==0)) {

        if( datosDeEntrenamiento2( [despBala , velocidadBala, despBala2 , velocidadBala2] )  ){
            moverseDer();
        }
    }

    if( modoAuto==false && (salto.space.isDown || salto.up.isDown) &&  jugador.body.onFloor() ){
        saltar();
    }
    
    if( modoAuto == true  && bala.position.x>0 && jugador.body.onFloor()) {

        if( datosDeEntrenamiento( [despBala , velocidadBala, despBala2 , velocidadBala2] )  ){
            saltar();
        }
    }

    if( balaD==false ){
        disparo();
    }

    if( balaD2==false ){
        disparo2();
    }

    /* if( bala.position.x <= 0  ){
        resetVariables();
    } */

    /* if( bala2.position.y >= h  ){
        resetVariables();
    } */

    if( bala.position.x <= 0  ){
        bala.body.velocity.x = 0;
        bala.position.x = w-100;
        balaD=false;
    }

    if( bala2.position.y >= (h - 90)  ){
        bala2.body.velocity.y = 0;
        bala2.position.y = 70;
        balaD2=false;
    }
    
    if( modoAuto ==false  && bala.position.x > 0 ){

        datosEntrenamiento.push({
                'input' :  [despBala , velocidadBala, despBala2 , velocidadBala2],
                'output':  [estatusAire , estatuSuelo , estatusDerecha , estatusIzquierda ]
        });

        console.log("Desp Bala1, Vel Bala1, Estatus A, Estatus S, Estatus Der, Estatus Izq: ",
            despBala + " " +velocidadBala + " "+ estatusAire+" "+  estatuSuelo+" "+  estatusDerecha+" "+  estatusIzquierda);
   }

}


function disparo(){
    velocidadBala =  -1 * velocidadRandom(300,800);
    bala.body.velocity.y = 0 ;
    bala.body.velocity.x = velocidadBala ;
    balaD=true;
}

function disparo2(){
    velocidadBala2 =  1 * velocidadRandom(1,2);
    bala2.body.velocity.x = 0 ;
    bala2.body.velocity.y = velocidadBala2 ;
    balaD2=true;
}

function colisionH(){
    if (!jugadorGolpeado) {
        pausa();
        jugadorGolpeado = true;
    }
}

function velocidadRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function render(){

}
