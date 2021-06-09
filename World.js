import * as THREE from './libs/three.module.js'
import * as TWEEN from './libs/tween.esm.js'
import { Ground } from './Ground.js';
import { Separador } from './separador.js'
import { Charco } from './mancha.js'
import { Botella } from './Botella.js';
import { Refresco } from './Refresco.js';
import { Bombilla } from './Bombilla.js';
import { Cereales } from './cereales.js';
import { Patatas } from './Patatas.js';

const caminos=[-8,0,8]; //Vía derecha, central e izquierda
const posJugadorInicialY=4.2;
const umbralZ1=2;
const umbralZ2=-0.5;
const umbralY=0.3;
const umbralDistancia= 0.6; //Distancia de colisión contra objetos
const tiempoAnimacion=4000;
const vidasMaximas=3;

class World extends THREE.Object3D {
  constructor(jugador) {
    super();

    this.jugador= jugador;
    this.puntuacion= 0;
    this.vidas= vidasMaximas;
    this.haColisionado= false;
    this.aumentarPuntuacion= false;

    var geomBox = new THREE.BoxBufferGeometry(10,30,150,30,30);
    var sueloGeom= new THREE.BoxBufferGeometry(300,1,150,10,10,10);

    var paredGeom= new THREE.BoxBufferGeometry(650,650,1,20,20,20);

    const textureParedFrontal= new THREE.TextureLoader().load(
      './textures/superN.jpg'
    );

    const textureSuelo= new THREE.TextureLoader().load(
      './textures/suelo.jpg'
    );

    const textureLateral= new THREE.TextureLoader().load(
      './textures/lateral.jpg'
    );

    const textureParedTrasero= new THREE.TextureLoader().load(
      'textures/super2.jpg'
    );

    var matParedF= new THREE.MeshStandardMaterial( { map: textureParedFrontal} );

    var matBox = new THREE.MeshStandardMaterial( { map: textureLateral} );

    var matParedT= new THREE.MeshStandardMaterial( { map: textureParedTrasero} );

    var materialSuelo= new THREE.MeshBasicMaterial({ map: textureSuelo });

    //Vista frontal 
    this.paredFrontal=new THREE.Mesh(paredGeom,matParedF);
    this.paredFrontal.position.set(0,25,300);

    //Vista trasera
    this.paredTrasera=new THREE.Mesh(paredGeom,matParedT);
    this.paredTrasera.scale.set(2,1,1);
    this.paredTrasera.position.set(0,125,-600);

    //Suelo visto en DIFICULTAD MODERADA
    this.sueloLateral=new THREE.Mesh(sueloGeom,materialSuelo);
    this.sueloLateral2=new THREE.Mesh(sueloGeom,materialSuelo);

    this.desaparecerSuelo();

    //Laterales de la cinta
    this.lateral = new THREE.Mesh( geomBox, matBox );
    this.lateral2 = new THREE.Mesh( geomBox, matBox );

    this.lateral.position.set(-20,-7,0);
    this.lateral2.position.set(20,-7,0);

    //Cinta transportadora
    this.ground = new Ground();
    this.ground.position.set(0,-300,0);

    this.botella=new Botella();
    this.botella.position.set(0,-30,0);

    this.cereales= new Cereales();
    this.cereales.position.set(0, -30, 0);

    this.patatas= new Patatas();
    this.patatas.position.set(0, -30, 0);

    this.separador = new Separador();
    this.separador.rotation.y=-Math.PI/2;
    this.separador.position.set(0,-30,0);

    this.charco = new Charco();
    this.charco.scale.set(5,5,5);
    this.charco.position.set(0,-30,0);

    this.refresco = new Refresco();
    this.refresco.position.set(0,-30,0);

    this.bombillaApagar=new Bombilla();
    this.bombillaApagar.position.set(0,-30,0);

    this.bombillaEncender=new Bombilla();
    this.bombillaEncender.position.set(0,-2000,0);

    this.add(this.bombillaApagar);
    this.add(this.bombillaEncender);
    this.add(this.charco);
    this.add(this.separador);
    this.add(this.botella);
    this.add(this.cereales);
    this.add(this.patatas);
    
    this.ground.receiveShadow=true;
    this.lateral.receiveShadow=true;
    this.lateral2.receiveShadow=true;

    this.botella.castShadow=true;
    this.separador.castShadow=true;
    this.refresco.castShadow=true;
    this.cereales.castShadow=true;
    this.patatas.castShadow=true;
    
    this.add(this.ground);    
    this.add(this.lateral);
    this.add(this.lateral2);
    this.add(this.sueloLateral);
    this.add(this.sueloLateral2);
    this.add(this.paredFrontal);
    this.add(this.paredTrasera);

    this.caminoActual=1;
    this.obstaculos=[false, false, false];
    this.partida=false;
    this.apagada=false;
    this.pausado=false;
    this.bonificar=false;
    this.bombillaDesaparecida=true;
  }

  //Establece los tiempos al empezar la partida
  comenzar(){
    this.tiempo_borrar = new Date();
    this.tiempo_crear = new Date();
    this.tiempo_choque = new Date();
    this.tiempo_puntuacion=new Date();
    this.tiempo_vida=new Date();
    this.tiempo_bonificacion=new Date();
    this.tiempo_iluminacion=new Date();
  }

  //Reestablece el mundo al reiniciar la partida
  reestablecer(){
    this.puntuacion=0;
    this.vidas=vidasMaximas;
    this.haColisionado= false;
    this.aumentarPuntuacion= false;
    this.obstaculos=[false, false, false];
    this.partida=false;
    this.apagada=false;
    this.tiempo_borrar = new Date();
    this.tiempo_crear = new Date();
    this.tiempo_choque = new Date();
    this.tiempo_puntuacion=new Date();
    this.tiempo_vida=new Date();
    this.tiempo_bonificacion=new Date();
    this.tiempo_iluminacion=new Date();

    this.caminoActual=1;
    this.botella.position.set(0,-30,0);
    this.separador.position.set(0,-30,0);
    this.charco.position.set(0,-30,0);
    this.refresco.position.set(0,-30,0);
    this.cereales.position.set(0,-30,0);
    this.patatas.position.set(0,-30,0);
    this.bombillaApagar.position.set(0,-30,0);
    this.bombillaEncender.position.set(0,-2000,0);
  }

  aparecerSuelo(){
    this.sueloLateral.position.set(175,-1.70,0);
    this.sueloLateral2.position.set(-175,-1.70,0);
  }

  desaparecerSuelo(){
    this.sueloLateral.position.set(0,-100,0);
    this.sueloLateral2.position.set(0,-100,0);
  }
  

  //Elimina el obstáculo seleccionado
  eliminarObstaculo(name) {
    this.obstaculos[name]=false;
    var selectedObject = this.ground.getObjectByName(name);

    this.ground.remove( selectedObject );
  }
  

  //Creación de obstáculos aleatoriamente
  crearObstaculo(camino){

    var fila;
    var tiempo_actual=new Date();

    if(camino==caminos[0])
      fila=0;
    else if(camino==caminos[1])
      fila=1;
    else
      fila=2;

    var rand = Math.random() * (7 - 0) + 0;
    var obstaculo;

    if (rand >= 0 && rand < 1){
      obstaculo = this.botella;
      obstaculo.tipo="NO-SALTABLE";
      obstaculo.position.set(camino,300,0); 

      }
    else if (rand >= 1 && rand < 2){
      obstaculo = this.separador;
      obstaculo.tipo="SALTABLE";
      obstaculo.position.set(camino,300,0); 

    }
    else if (rand >= 3 && rand < 4 && this.vidas<vidasMaximas && (tiempo_actual-this.tiempo_vida) > 10000){
      obstaculo = this.refresco;
      obstaculo.tipo="VIDA";
      obstaculo.position.set(camino,305,0); 
      this.tiempo_vida=tiempo_actual;
    }
    else if (rand >= 4 && rand < 5 && (tiempo_actual-this.tiempo_iluminacion) > 15000){
      if(this.apagada){
      obstaculo = this.bombillaEncender;
      obstaculo.tipo="ENCENDER";
      this.bombillaDesaparecida=false;
      }
      else{
        obstaculo = this.bombillaApagar;
        obstaculo.tipo="APAGAR";
      }
      obstaculo.position.set(camino,305,0); 
    }else if (rand >= 5 && rand < 6){
      obstaculo = this.cereales;
      obstaculo.tipo="NO-SALTABLE";
      obstaculo.position.set(camino,300,0); 

      }else if (rand >= 6 && rand < 7 && (tiempo_actual-this.tiempo_bonificacion) > 7000){
        obstaculo = this.patatas;
        obstaculo.tipo="BONIFICACION";
        obstaculo.position.set(camino,300,0); 
        this.tiempo_bonificacion= tiempo_actual;
      }
    else{
      obstaculo = this.charco;
      obstaculo.tipo="SALTABLE";
      obstaculo.position.set(camino,300,0); 
    }

    if(this.obstaculos[fila]){
      this.eliminarObstaculo(fila);
    }

    this.obstaculos[fila]=true;

    obstaculo.name=fila;
    
    return obstaculo;
  }

  //Animación de la cinta transportadora y los obstáculos incrustados
  animarSuelo(){
    var that=this;

    var origenA = {p: Math.PI/5};
    var destA = {p: -Math.PI/5};

    var bucle= new TWEEN.Tween(origenA)
    .to(destA, tiempoAnimacion)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate(function(){
      that.ground.rotation.x=origenA.p;
    })
    .repeat(Infinity)
    .start();
  }

  //No se permite que hayan 3 obstáculos a la vez
  comprobarObstaculos(){
    if(this.obstaculos[0] && this.obstaculos[1] && this.obstaculos[2]){
      let fila=Math.floor(Math.random() * 3);
      this.obstaculos[fila]=false;
      this.eliminarObstaculo(fila);
    }
  }

  //Detección de colisiones y bonificaciones
  logicaObstaculos(){
    var obstaculo=this.ground.getObjectByName(this.caminoActual);
    var posicion= new THREE.Vector3(); //Posición del obstáculo
    var posObj= new THREE.Vector3(); //Posición del Jugador
    var nosaltable=false;

    if(obstaculo!=null){
      obstaculo.getWorldPosition(posicion);

    if(((posicion.z>=umbralZ2 && posicion.z<=umbralZ1) || (posicion.y>=-umbralY && posicion.y <=umbralY))){
    posicion.z= 0;
    posicion.y= 0;
    if(obstaculo.tipo =="NO-SALTABLE")
      nosaltable=true;
    }

    this.jugador.getWorldPosition(posObj);
    posObj.y-= posJugadorInicialY;
    var tiempo_actual = new Date (); //Asegura que solo se produce una colisión

    //Colisión con obstáculos
    if((posicion.distanceTo(posObj)<=umbralDistancia || nosaltable ) && obstaculo.tipo!="VIDA" && obstaculo.tipo!="BONIFICACION" && obstaculo.tipo!="APAGAR" && obstaculo.tipo!="ENCENDER" && (tiempo_actual-this.tiempo_choque) > tiempoAnimacion/2){
        this.tiempo_choque=tiempo_actual;
        this.haColisionado= true;
        document.getElementById("vida"+this.vidas.toString()).style.display = "none";
        this.vidas--;
    }
    //Obtención de vida
    else if((posicion.distanceTo(posObj)<= umbralDistancia) && obstaculo.tipo=="VIDA" && (tiempo_actual-this.tiempo_choque) > tiempoAnimacion/2){
      if(this.vidas<vidasMaximas)
        this.vidas++;
      document.getElementById("vida"+this.vidas.toString()).style.display = "block";
      this.tiempo_choque=tiempo_actual;
      this.eliminarObstaculo(this.caminoActual);
      document.getElementById("aumentoVidas").style.visibility = "visible";
      var duration = 1000;
      $({to:0}).animate({to:1}, duration, function() {
        document.getElementById("aumentoVidas").style.visibility = "hidden";
      }) 
      
      //Obtención de puntos
    } else if((posicion.distanceTo(posObj)<= umbralDistancia) && obstaculo.tipo=="BONIFICACION" && (tiempo_actual-this.tiempo_choque) > tiempoAnimacion/2){
        this.aumentarPuntuacion=true;
        this.bonificar=true;
        this.tiempo_choque=tiempo_actual;
        this.eliminarObstaculo(this.caminoActual);
        document.getElementById("aumentoPuntuacion").style.visibility = "visible";
        var duration = 1000;
        $({to:0}).animate({to:1}, duration, function() {
          document.getElementById("aumentoPuntuacion").style.visibility = "hidden";
        })       
    }
    //Choque con bombilla y luz apagada
    else if((posicion.distanceTo(posObj)<=umbralDistancia)&& obstaculo.tipo=="APAGAR" && this.apagada==false){
      this.apagada=true;
      this.tiempo_iluminacion= tiempo_actual;
      this.eliminarObstaculo(this.caminoActual);
    }
    //Choque con bombilla y luz encendida
    else if((posicion.distanceTo(posObj)<=umbralDistancia)&& obstaculo.tipo=="ENCENDER" && this.apagada){
      this.apagada= false;
      this.bombillaDesaparecida= true;
      this.tiempo_iluminacion= tiempo_actual;
      this.eliminarObstaculo(this.caminoActual);
    }
  }
}

  //Asigna un camino según la posición del jugador
  comprobarPosicionJugador(){
    var posObj= new THREE.Vector3();
    this.jugador.getWorldPosition(posObj);

    if(posObj.x<=-3.3 && posObj.x>=-10)
      this.caminoActual=0;
    else if(posObj.x>-3.3 && posObj.x<=3.3)
      this.caminoActual=1;
    else if(posObj.x>3.3 && posObj.x<=10)
      this.caminoActual=2;

  }

  //Estado del juego en Game Over
  morir(){
    if (this.vidas<=0){
      this.partida=false;
      this.jugador.colocarMuerto();
      document.getElementById("final").style.display = "block";
      document.getElementById("titulo").style.display = "block";
      document.getElementById("puntuacion").style.display = "none";
      document.getElementById("textoAyuda").style.display = "block";    
      document.getElementById("final").innerHTML = "<p>Game Over<br>Tu puntuacion es: " + this.puntuacion.toString() + "<br><br>Pulsa espacio para reiniciar<br>Pulsa escape para elegir dificultad</p>";
      this.eliminarObstaculo(0);
      this.eliminarObstaculo(1);
      this.eliminarObstaculo(2);
      TWEEN.removeAll();
    }
  }

  pausar(){
    this.pausado=true;
  }

  reanudar(){
    this.pausado=false;
  }


  update () {
    if(this.partida && !this.pausado){
      TWEEN.update();
      this.refresco.update();
      this.patatas.update();

    var tiempo_actual = new Date ();

      if((tiempo_actual-this.tiempo_puntuacion) > tiempoAnimacion/2){ //La puntuación se suma cada 2 segundos
        if(this.haColisionado){
          this.puntuacion-=5;
          this.haColisionado=false;
        }else if(this.aumentarPuntuacion){
          this.puntuacion+= 10;
          this.aumentarPuntuacion= false;
        }
        else
          this.puntuacion+=1;

          if(this.puntuacion<0)
          this.puntuacion=0;
          this.tiempo_puntuacion = new Date();
          document.getElementById("puntuacion").innerHTML="Score: " + this.puntuacion.toString();
          this.morir();

    }

      if((tiempo_actual-this.tiempo_crear) > tiempoAnimacion) { //Los objetos cambian cada 4 segundos

            this.tiempo_crear = new Date();
            var tipo_linea = Math.random() * (3 - 0) + 0;
            var obstac;

            if (tipo_linea >= 0 && tipo_linea < 1 ){
                obstac = this.crearObstaculo(caminos[0]);
                this.obstaculos[0]=true;
            }
            else if (tipo_linea >= 1 && tipo_linea < 2 ){
              obstac = this.crearObstaculo(caminos[1]);
              this.obstaculos[1]=true;
            }
            else {
              obstac = this.crearObstaculo(caminos[2]);
              this.obstaculos[2]=true;
            }

            this.ground.add(obstac);
            this.comprobarObstaculos();

        }

        this.comprobarPosicionJugador();
        this.logicaObstaculos();
  }
}
}


export { World };