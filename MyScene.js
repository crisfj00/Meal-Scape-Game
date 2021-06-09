
// Clases de la biblioteca

import * as THREE from './libs/three.module.js'
import * as TWEEN from './libs/tween.esm.js'

// Clases de mi proyecto

import { Burger } from './Burger.js'
import { World } from './World.js'

var dificultadElegida=false;
const vidasMaximas=3;
var dificultad=1;
const caminos=[-8,0,8];
var ayudaMostrada=false;
var pausado=false;
var partidaYaConfigurada=false;

const audioListener = new THREE.AudioListener();
const loader = new THREE.AudioLoader();


class MyScene extends THREE.Scene {
  constructor (myCanvas) {
    super();
    
    this.player = new Burger();
    this.player.name = "JUGADOR";

    this.world = new World(this.player);
    this.world.name = "MUNDO";

    this.add (this.player);
    this.add (this.world);

    this.renderer = this.createRenderer(myCanvas);
    this.createLights ();
    this.createCamera (0,15,-40);

    this.tiempo_luz=new Date();

    this.vidasActuales=vidasMaximas;
    this.estadoLuz="ENCENDER";
  }
  
  createCamera (x,y,z) {

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set (x,y,z); //15 -40 | 80 -30 | 15 80
    var look = new THREE.Vector3 (0,10,0);
    this.camera.lookAt(look);
    this.add (this.camera);
  }

  modifyCamera(x,y,z){
    this.camera.position.set (x,y,z); //15 -40 | 80 -30 | 15 80
    var look = new THREE.Vector3 (0,10,0);
    this.camera.lookAt(look);
  }
  
  createLights () {

    this.ambientLight = new THREE.AmbientLight(0xccddee, 0.5);

    this.bombilla= new THREE.PointLight(0xffffff,1); //Luz puntual que se inserta dentro de la bombilla para encender
    this.bombilla.position.set(0,0,0);
    this.bombilla.visible=false;

    this.spotLight = new THREE.PointLight(0xff0000,0, 8); //Luz puntual que se sitúa dentro del personaje y representa la colisión
    this.spotLight.position.set(0,1.5,0);

    this.focoPrincipal = new THREE.SpotLight( 0xffffff, 0.6 ); //Foco trasero que enfoca hacia delante
    this.focoPrincipal.position.set( 50, 60, -150 ); //0,60, -150
    this.focoPrincipal.target=this.world.paredFrontal;

    this.focoTrasero = new THREE.SpotLight( 0xffffff, 0.6 ); //Foco delantero que enfoca hacia atrás
    this.focoTrasero.position.set( -50, 60, 150 );
    this.focoTrasero.target=this.world.paredTrasera;

    this.focoPrincipal.castShadow=true;
    this.focoPrincipal.shadow.mapSize.width = 512;
    this.focoPrincipal.shadow.mapSize.heigth = 512;
    this.focoPrincipal.shadow.camera.near = 0.5;
    this.focoPrincipal.shadow.camera.far=500;

    this.focoTrasero.castShadow=true;
    this.focoTrasero.shadow.mapSize.width = 512;
    this.focoTrasero.shadow.mapSize.heigth = 512;
    this.focoTrasero.shadow.camera.near = 0.5;
    this.focoTrasero.shadow.camera.far=500;

    this.add (this.ambientLight);
    this.add(this.focoPrincipal);
    this.add(this.focoTrasero);
    this.add (this.spotLight);
    this.add(this.bombilla);

  }

  createRenderer (myCanvas) {
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    $(myCanvas).append(renderer.domElement);
    
    return renderer;  
  }
  
  getCamera () {
    return this.camera;
  }
  
  setCameraAspect (ratio) {
    this.camera.aspect = ratio;
    this.camera.updateProjectionMatrix();
  }
  
  onWindowResize () {
    this.setCameraAspect (window.innerWidth / window.innerHeight);
    this.renderer.setSize (window.innerWidth, window.innerHeight);
  }

  //Reestablecimiento de la partida al completo
  nuevaPartida(){
    this.remove( this.world );

    this.player.reestablecer();

    this.world.reestablecer();

    this.vidasActuales=vidasMaximas;

    if(dificultad==2)
    this.world.aparecerSuelo();
    else
    this.world.desaparecerSuelo();

    this.add (this.world);
  }

  //Musica de fondo
  initAudio(){
    var sonido = new THREE.Audio( audioListener );
    sonido.name="MUSICA-FONDO"
    this.add( sonido );
    loader.load(
  './music/song.mp3',
  
  function ( audioBuffer ) {
    sonido.setBuffer( audioBuffer );
    sonido.setVolume(0.1);
    sonido.setLoop(true);
    sonido.play();
  },null,null);
  }

  //Perdida de vida
  initLifeLost(){
    var sonido = new THREE.Audio( audioListener );
    sonido.name="SONIDO-VIDA";
    this.add( sonido );
    loader.load(
  './music/life.mp3',
  
  function ( audioBuffer ) {
    sonido.setBuffer( audioBuffer );
    sonido.setVolume(0.5);
  },null,null);
  }

  //Ganancia de vida
  initSlurp(){
    var sonido = new THREE.Audio( audioListener );
    sonido.name="SONIDO-BONIFICACION";
    this.add( sonido );
    loader.load(
  './music/slurp.mp3',
  
  function ( audioBuffer ) {
    sonido.setBuffer( audioBuffer );
    sonido.setVolume(0.5);
  },null,null);
  }

  //Luz apagada
  initCortocircuito(){
    var sonido = new THREE.Audio( audioListener );
    sonido.name="SONIDO-CORTOCIRCUITO";
    this.add( sonido );
    loader.load(
  './music/cortocircuito.mp3',
  
  function ( audioBuffer ) {
    sonido.setBuffer( audioBuffer );
    sonido.setVolume(0.5);
  },null,null);
  }

  //Luz encendida
  initLightsOn(){
    var sonido = new THREE.Audio( audioListener );
    sonido.name="SONIDO-ENCENDIDO";
    this.add( sonido );
    loader.load(
  './music/encendido.mp3',
  
  function ( audioBuffer ) {
    sonido.setBuffer( audioBuffer );
    sonido.setVolume(0.3);
  },null,null);
  }

  //Patatas agarradas
  initCoin(){
  var sonido = new THREE.Audio( audioListener );
  sonido.name="SONIDO-COIN";
  this.add( sonido );
  loader.load(
'./music/coin.mp3',
  
  function ( audioBuffer ) {
    sonido.setBuffer( audioBuffer );
    sonido.setVolume(0.3);
  },null,null);
  }

  update () {
    
    this.player.update();

    this.world.update();

    this.spotLight.position.set(this.player.position.x,this.player.position.y,0); 

    var posicionBombilla  = new THREE.Vector3();
    this.world.bombillaEncender.getWorldPosition(posicionBombilla);

    this.bombilla.position.set(posicionBombilla.x,posicionBombilla.y,posicionBombilla.z);

    var tiempo_actual=new Date();

    //Detección de perdida de vida
    if(this.world.vidas<this.vidasActuales){
      this.vidasActuales--;
      this.spotLight.intensity = 1;
      this.tiempo_luz=tiempo_actual;
      this.getObjectByName('SONIDO-VIDA').play();    
    }
    //Detección de ganancia de vida
    else if(this.world.vidas>this.vidasActuales){
      this.vidasActuales++;
      this.getObjectByName('SONIDO-BONIFICACION').play();    
    }
    
    //Detección de ganancia de puntos
    if(this.world.bonificar){
       this.getObjectByName('SONIDO-COIN').play();
       this.world.bonificar=false;
    }

    //Detección de apagado y encendido de luz
    if(this.world.apagada){
      if(this.estadoLuz=="ENCENDER"){
        this.estadoLuz="APAGAR";      
        this.getObjectByName('SONIDO-CORTOCIRCUITO').play();    
      }
      this.focoPrincipal.intensity = 0.1;
      this.focoTrasero.intensity = 0.1;
      this.ambientLight.intensity = 0.1;
      this.bombilla.visible=true;
    }
    else{
      if(this.estadoLuz=="APAGAR"){
        this.estadoLuz="ENCENDER";      
        this.getObjectByName('SONIDO-ENCENDIDO').play();    
      }
      this.focoPrincipal.intensity = 0.6;
      this.focoTrasero.intensity = 0.6;
      this.ambientLight.intensity = 0.5;
      this.bombilla.visible=false;
    }

    //Apagado por defecto de la luz incrustada en la bombilla
    if(this.world.bombillaDesaparecida)
      this.bombilla.visible=false;

    else
      this.bombilla.visible=true;


    //Encendido de luz de colisión
    if((tiempo_actual-this.tiempo_luz) > 1000) {
      this.spotLight.intensity = 0;
    }

    if(this.world.vidas<=0){
    this.getObjectByName('MUSICA-FONDO').stop();
    }

    this.renderer.render (this, this.getCamera());

    requestAnimationFrame(() => this.update())
  }
}

function setupKeyLogger() {
  document.onkeydown = function(e) {
    console.log(e);
  }
}

$(function () {
  var scene = new MyScene("#WebGL-output");


  var jug = scene.getObjectByName('JUGADOR');
  var worl = scene.getObjectByName('MUNDO');
  var movimientos = [];  //Almacenará las animaciones en curso del personaje

  function onDocumentKeyDown(event) {
 
    var keyCode = event.which;

    if(!dificultadElegida){
      if (keyCode == 49) { //PULSA 1
        scene.modifyCamera(0,15,-40); //DIFICULTAD PRINCIPIANTE
        worl.desaparecerSuelo();
        dificultadElegida=true;
        dificultad=1;
        document.getElementById("dificultad").innerHTML="Dificultad: Principiante";

      }else if (keyCode == 50) {//PULSA 2
        scene.modifyCamera(0,80,-30); //DIFICULTAD MODERADA
        worl.aparecerSuelo();

        dificultadElegida=true;
        dificultad=2;
        document.getElementById("dificultad").innerHTML="Dificultad: Moderado";

      }else if (keyCode == 51) {//PULSA 3
        scene.modifyCamera(0,15,80); //DIFICULTAD DIFÍCIL
        worl.desaparecerSuelo();

        dificultadElegida=true;
        dificultad=3;
        document.getElementById("dificultad").innerHTML="Dificultad: Dificil";

      }

      if(dificultadElegida){
        document.getElementById("dificultad").style.display = "block";   
        document.getElementById("inicio").style.display = "none";
        document.getElementById("comienzo").style.display = "block";
      }

      if (keyCode == 72) { //PULSA H (HELP)
        if(ayudaMostrada){
        document.getElementById("ayuda").style.display = "none";
        ayudaMostrada=false;
        }
        else{
        document.getElementById("ayuda").style.display = "block";
        ayudaMostrada=true;
        }
      }
    }
    
    //Primer inicio de partida
    else if(!worl.partida && worl.vidas==vidasMaximas){
      if (keyCode == 32) { //PULSA ESPACIO
        
        if(!partidaYaConfigurada){
        scene.camera.add( audioListener );
        scene.initAudio();
        scene.initLifeLost();
        scene.initSlurp();
        scene.initCoin();
        scene.initCortocircuito();
        scene.initLightsOn();

        partidaYaConfigurada=true;
        }
        else
        scene.getObjectByName('MUSICA-FONDO').play();

        jug.correr();
        worl.animarSuelo();
        worl.partida=true;
        worl.comenzar();

        document.getElementById("imagenFondo").style.display = "none";
        document.getElementById("WebGL-output").style.display = "block";
        document.getElementById("inicio").style.display = "none";
        document.getElementById("vidas").style.display = "flex";
        document.getElementById("comienzo").style.display = "none";
        document.getElementById("titulo").style.display = "none";
        document.getElementById("final").style.display = "none";
        document.getElementById("puntuacion").style.display="block";
        document.getElementById("ayuda").style.display = "none";
        document.getElementById("textoAyuda").style.display = "none";   
        document.getElementById("dificultad").style.display = "none";   

        ayudaMostrada=false;
      }

      else if (keyCode == 27) { //PULSA ESCAPE
        dificultadElegida=false;

        document.getElementById("inicio").style.display = "block";
        document.getElementById("comienzo").style.display = "none";
        document.getElementById("titulo").style.display = "flex";
      }

      else if (keyCode == 72) { //PULSA H (HELP)
        if(ayudaMostrada){
          document.getElementById("ayuda").style.display = "none";
          ayudaMostrada=false;
          }
          else{
          document.getElementById("ayuda").style.display = "block";
          ayudaMostrada=true;
          }
      }

    }
    //Reinicio de partida tras Game Over
    else if(!worl.partida && worl.vidas<=0){

      if (keyCode == 32 && dificultadElegida) { //PULSA ESPACIO
        scene.getObjectByName('MUSICA-FONDO').play();
        movimientos = [];
        scene.nuevaPartida();
        jug.correr();
        worl.animarSuelo();
        worl.partida=true;
        worl.comenzar();

        document.getElementById("puntuacion").innerHTML="Score: 0";
        document.getElementById("inicio").style.display = "none";
        document.getElementById("comienzo").style.display = "none";
        document.getElementById("titulo").style.display = "none";
        document.getElementById("final").style.display = "none";
        document.getElementById("puntuacion").style.display="block";
        document.getElementById("vida1").style.display="block";
        document.getElementById("vida2").style.display="block";
        document.getElementById("vida3").style.display="block";
        document.getElementById("ayuda").style.display = "none";
        document.getElementById("textoAyuda").style.display = "none";   
        document.getElementById("dificultad").style.display = "none";   
 
        
        ayudaMostrada=false;

      }
      else if (keyCode == 27) { //PULSA ESCAPE
        dificultadElegida=false;
        document.getElementById("inicio").style.display = "block";
        document.getElementById("comienzo").style.display = "none";
        document.getElementById("titulo").style.display = "flex";
        document.getElementById("final").style.display = "none";
        document.getElementById("dificultad").style.display = "block";   

      }

      else if (keyCode == 72) { //PULSA H (HELP)
        if(ayudaMostrada){
          document.getElementById("ayuda").style.display = "none";
          ayudaMostrada=false;
          }
          else{
          document.getElementById("ayuda").style.display = "block";
          ayudaMostrada=true;
          }
      }
    }

    //Detección de animaciones del personaje
    else{
    if ((keyCode == 87 || keyCode == 38) && !pausado) { //PULSA FLECHA ARRIBA | W
      jug.saltar(movimientos);
    } 
    else if ((keyCode == 65 || keyCode == 37) && !movimientos.includes("IZQUIERDA") && !pausado) { //PULSA FLECHA IZQUIERDA | A
      jug.girar("IZQUIERDA", movimientos);

    } else if ((keyCode == 68|| keyCode == 39) && !movimientos.includes("DERECHA") && !pausado){ //PULSA FLECHA DERECHA | D
        jug.girar("DERECHA", movimientos);

    }

    else if ((keyCode == 27)){ //PULSA ESCAPE PARA PAUSAR
      if(pausado){
        pausado=false;
        document.getElementById("pausa").style.display = "none";
        document.getElementById("ayuda").style.display = "none";
        ayudaMostrada=false;

        worl.reanudar();
        scene.getObjectByName('MUSICA-FONDO').play();

      }
      else{
        pausado=true;
        document.getElementById("pausa").style.display = "block";

        worl.pausar();
        scene.getObjectByName('MUSICA-FONDO').pause();
      }
    }

    //Menú de pausA
    if(pausado){
      if (keyCode == 32 && dificultadElegida) { //PULSA ESPACIO
        worl.reanudar();
        TWEEN.removeAll();
        pausado=false;
        scene.getObjectByName('MUSICA-FONDO').stop();
        scene.getObjectByName('MUSICA-FONDO').play();
        movimientos = [];
        scene.nuevaPartida();
        worl.eliminarObstaculo(0);
        worl.eliminarObstaculo(1);
        worl.eliminarObstaculo(2);

        jug.correr();
        worl.animarSuelo();
        worl.partida=true;
        worl.comenzar();

        document.getElementById("puntuacion").innerHTML="Score: 0";
        document.getElementById("vida1").style.display="block";
        document.getElementById("vida2").style.display="block";
        document.getElementById("vida3").style.display="block";
        document.getElementById("pausa").style.display="none";
        document.getElementById("ayuda").style.display = "none";
        ayudaMostrada=false;

      }

      else if (keyCode == 13) { //PULSA ENTER
        worl.reanudar();
        TWEEN.removeAll();
        pausado=false;
        dificultadElegida=false;
        scene.getObjectByName('MUSICA-FONDO').stop();
        movimientos = [];
        scene.nuevaPartida();
        worl.eliminarObstaculo(0);
        worl.eliminarObstaculo(1);
        worl.eliminarObstaculo(2);
        worl.partida=false;
        document.getElementById("imagenFondo").style.display = "block";
        document.getElementById("WebGL-output").style.display = "none";
        document.getElementById("inicio").style.display = "block";
        document.getElementById("vidas").style.display = "none";
        document.getElementById("comienzo").style.display = "none";
        document.getElementById("titulo").style.display = "block";
        document.getElementById("final").style.display = "none";
        document.getElementById("puntuacion").style.display="none";
        document.getElementById("ayuda").style.display = "none";
        document.getElementById("textoAyuda").style.display = "block";    
        document.getElementById("pausa").style.display = "none";
        ayudaMostrada=false;
      }

      else if (keyCode == 72) { //PULSA H (HELP)
        if(ayudaMostrada){
          document.getElementById("ayuda").style.display = "none";
          ayudaMostrada=false;
          }
          else{
          document.getElementById("ayuda").style.display = "block";
          ayudaMostrada=true;
          }
      }
    }

    }

  }
  
  window.addEventListener ("resize", () => scene.onWindowResize());
  document.addEventListener("keydown", onDocumentKeyDown, false);
  scene.update();
});
