import * as THREE from './libs/three.module.js'
import * as TWEEN from './libs/tween.esm.js'
import { MTLLoader } from './libs/MTLLoader.js'
import { OBJLoader } from './libs/OBJLoader.js'

class Burger extends THREE.Object3D {
  constructor() {
    super();
  
    this.crearPersonaje();

    this.castShadow=true;
    this.receiveShadow=true;

    this.traverseVisible(function(unNodo){
      unNodo.castShadow=true;
      unNodo.receiveShadow=true;
    })
  }

  crearPersonaje(){
    var blanco = new THREE.MeshPhongMaterial( {
      color: 0xffffff,
    });

    var negro = new THREE.MeshPhongMaterial( {
      color: 0x000000,
    });

    var eyeGem=new THREE.SphereBufferGeometry(0.3,20,20);
    this.pupilaI= new THREE.Mesh (eyeGem, negro); 
    this.pupilaD= new THREE.Mesh (eyeGem, negro); 
    this.brilloI= new THREE.Mesh (eyeGem, blanco); 
    this.brilloD= new THREE.Mesh (eyeGem, blanco); 
    this.eyeI = new THREE.Mesh (eyeGem, blanco);  
    this.eyeD = new THREE.Mesh (eyeGem, blanco); 
    this.eyeI.position.set(-1,4,3);
    this.eyeD.position.set(1,4,3);
    this.eyeD.scale.set(3,3.4,0.5);
    this.eyeI.scale.set(3,4,0.5);

    this.pupilaI.position.set(-0.6,4,3.1);
    this.pupilaD.position.set(0.7,4,3.1);
    this.pupilaD.scale.set(1.5,1.5,0.5);
    this.pupilaI.scale.set(1.5,2,0.5);

    this.brilloI.position.set(-0.4,4,3.25);
    this.brilloD.position.set(0.5,4,3.25);
    this.brilloD.scale.set(0.5,0.5,0.1);
    this.brilloI.scale.set(0.5,0.5,0.1);

    var that=this;
    var materialLoader=new MTLLoader();
    var objectLoader=new OBJLoader();
    materialLoader.load('./models/Burger/burger_merged.mtl', function(materials){
      objectLoader.setMaterials(materials);
      objectLoader.load('./models/Burger/burger_merged.obj',function(object){
        var modelo=object;
        modelo.scale.set(3,3,3);
        modelo.castShadow=true;
        modelo.receiveShadow=true;

        modelo.traverse( function ( child ) {
          if ( child instanceof THREE.Mesh ) {
              child.castShadow = true;
              child.receiveShadow=true;
          }
      } );
        
        that.add(modelo);
      },null,null)
    });

    this.brazoIzq=this.crearBrazoIzquierdo();
    this.brazoDcha=this.crearBrazoDerecha();

    this.brazoIzq.position.set(-3.3,2,0);
    this.brazoDcha.position.set(3.3,2,0);
    this.brazoDcha.rotation.z=Math.PI/2;
    this.brazoIzq.rotation.z=-Math.PI/2;

    this.piernaIzq=this.crearPiernaIzquierda();
    this.piernaDcha=this.crearPiernaDerecha();
    this.piernaIzq.position.set(-1.5,0.3,0);
    this.piernaDcha.position.set(1.5,0.3,0);

    this.add(this.brazoIzq);
    this.add(this.brazoDcha);
    this.add(this.piernaIzq);
    this.add(this.piernaDcha);
    this.add(this.eyeI);
    this.add(this.eyeD);
    this.add(this.pupilaI);
    this.add(this.pupilaD);
    this.add(this.brilloI);
    this.add(this.brilloD);

    this.position.set(0,4.2,0);
  }

  //Reestablecimiento de jugador tras reinicio
  reestablecer(){
    this.scale.y=1;
    this.position.set(0,4.2,0);
    this.rotation.z=0;
    this.rotation.y=0
  }

  //Ajuste jugador en estado Game Over
  colocarMuerto(){
    this.scale.y = 0.01;
    this.rotation.z=0;
    this.rotation.y=0
    this.position.y=0;
  }

  correr(){

    this.brazoDcha.rotation.y=Math.PI/2;
    this.brazoIzq.rotation.y=-Math.PI/2;

    var origenP = {p: -3.14};
    var destP = {p: 3.14};

    var that=this;

    //Piernas completas
    var buclePiernas = new TWEEN.Tween(origenP)
    .to(destP, 500)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate(function(){
      that.piernaIzq.rotation.x=origenP.p/3;
      that.piernaDcha.rotation.x=-origenP.p/3;
    })
    .repeat(Infinity)
    .yoyo(true)
    .start();

    var origenG = {p: 0};
    var destG = {p: Math.PI/4};

    //Parte inferior del pie
    var bucleGemelos= new TWEEN.Tween(origenG)
    .to(destG, 500)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate(function(){
      that.gemeloIzq.rotation.x=origenG.p;
      that.gemeloDcho.rotation.x=Math.abs(origenG.p - Math.PI/4);
    })
    .repeat(Infinity)
    .yoyo(true)
    .start();

    var origenB = {p: Math.PI/3};
    var destB = {p: -Math.PI/3};


    //Brazos completos
    var bucleBrazos = new TWEEN.Tween(origenB)
    .to(destB, 500)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate(function(){
      that.brazoDcha.rotation.x=-Math.PI/2 -origenB.p;
      that.brazoIzq.rotation.x=-Math.PI/2+ origenB.p;


    })
    .repeat(Infinity)
    .yoyo(true)
    .start();

    var origenA = {p: 0};
    var destA = {p: Math.PI/4};

    //Parte inferior del brazo
    var bucleAntebrazos= new TWEEN.Tween(origenA)
    .to(destA, 500)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate(function(){
      that.antebrazoIzq.rotation.z=+origenA.p;
      that.antebrazoDcho.rotation.z=-Math.abs(origenA.p - Math.PI/4);

    })
    .repeat(Infinity)
    .yoyo(true)
    .start();
  }


  saltar(){
    if(this.position.y==4.2){

    this.brazoDcha.rotation.y=Math.PI/2;
    this.brazoIzq.rotation.y=-Math.PI/2;
    var origenP = {p: 0};
    var destP = {p: -Math.PI/3};

    var that=this;

    //Encogimiento de pierna
    var buclePiernas = new TWEEN.Tween(origenP)
    .to(destP, 50)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate(function(){
      that.piernaIzq.rotation.x=origenP.p;
      that.piernaDcha.rotation.x=origenP.p;
    })
    .repeat(1)
    .yoyo(true)
    .start();

    var origenG = {p: 0};
    var destG = {p: Math.PI/3};

    //Encogimiento de parte inferior de la pierna
    var bucleGemelos= new TWEEN.Tween(origenG)
    .to(destG, 50)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate(function(){
      that.gemeloIzq.rotation.x=origenG.p;
      that.gemeloDcho.rotation.x=origenG.p;
    })
    .repeat(1)
    .yoyo(true)
    .start();

    var origenB = {p: 0};
    var destB = {p: Math.PI/3};

    //Encogimiento de brazos
    var bucleBrazos = new TWEEN.Tween(origenB)
    .to(destB, 50)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate(function(){
      that.brazoDcha.rotation.x=-Math.PI/2 + origenB.p;
      that.brazoIzq.rotation.x=-Math.PI/2 + origenB.p;
    })
    .repeat(1)
    .yoyo(true)
    .start();

    var origenA = {p: 0};
    var destA = {p: 2.4};


    //Encogimiento de brazo inferior
    var bucleAntebrazos= new TWEEN.Tween(origenA)
    .to(destA, 50)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate(function(){
      that.antebrazoIzq.rotation.z=origenA.p;
      that.antebrazoDcho.rotation.z=-origenA.p;
    })
    .repeat(1)
    .yoyo(true)
    .start();

    var origenPos = {p: 4.2, l:0};
    var destPos = {p: 3.2, l:-2};

    //Bajada en flexión
    var buclePosicionY= new TWEEN.Tween(origenPos)
    .to(destPos, 50)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate(function(){
      that.position.y=origenPos.p;
      that.position.z=origenPos.l;

    })
    .repeat(1)
    .yoyo(true)
    .onComplete(function(){bucleSalto.start();});


    var origenSalto = {p: 4.2, z:Math.PI/2};
    var destSalto = {p: 10, z:0};


    //Salto vertical
    var bucleSalto= new TWEEN.Tween(origenSalto)
    .to(destSalto, 300)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(function(){
      that.position.y=origenSalto.p;
      that.brazoDcha.rotation.y=origenSalto.z;
      that.brazoIzq.rotation.y=-origenSalto.z;

    })
    .onComplete(function(){bucleBajada.start();})
    .onStart(function(){bucleGiro.start();});

    var origenGiro = {y:0};
    var destGiro = {y:Math.PI*2};

    //Giro en salto
    var bucleGiro= new TWEEN.Tween(origenGiro)
    .to(destGiro, 600)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate(function(){
      that.rotation.y=origenGiro.y;
    });

    var origenBajada = {p: 10, z:0};
    var destBajada = {p: 4.2, z:Math.PI/2};

    //Bajada vertical
    var bucleBajada= new TWEEN.Tween(origenBajada)
    .to(destBajada, 300)
    .easing(TWEEN.Easing.Quadratic.In)
    .onUpdate(function(){
      that.position.y=origenBajada.p;
      that.brazoDcha.rotation.y=origenBajada.z;
      that.brazoIzq.rotation.y=-origenBajada.z;
    });

    buclePosicionY.start();
    }
  }



  girar(direccion, movimientos){

    var that=this;

    movimientos.push(direccion);

    var movimiento=0;
    var giro=0;

    //Detección de movimientos según la dirección

    if(direccion=="DERECHA"){
      giro=Math.PI*2;

      if(that.position.x==8)
      movimiento=0;
      else if(that.position.x==0)
      movimiento=-8;
      else if(that.position.x==-8){
        movimiento=that.position.x;
        giro=0;
        }

    }
    else if(direccion=="IZQUIERDA"){
      giro=-Math.PI*2;

      if(that.position.x==-8 )
      movimiento=0;
      else if(that.position.x==0 )
      movimiento=8;
      else if(that.position.x==8){
      movimiento=that.position.x;
      giro=0;
      }
    }

    var origenPos = {p: that.position.x};
    var destPos = {p: movimiento};

    //Movimiento en x en al dirección deseada
    var buclePosicionX= new TWEEN.Tween(origenPos)
    .to(destPos, 300)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate(function(){
      that.position.x=origenPos.p;
    })
    .onComplete(function(){
      var index = movimientos.indexOf(direccion);

      if (index > -1) {
        movimientos.splice(index, 1);
      }


    })
    .start();

    
    var origenGiro = {y:0};
    var destGiro = {y:giro};

    //Giro del personaje
    var bucleGiro= new TWEEN.Tween(origenGiro)
    .to(destGiro, 600)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate(function(){
      that.rotation.z=origenGiro.y;
    })

    .start();
  }


  crearAntebrazo(){
    var mat = new THREE.MeshPhongMaterial( {
      color: 0x4c1919,
  });

    var manoGem=new THREE.SphereBufferGeometry(1,20,20);
    var antebrazoGem= new THREE.CylinderBufferGeometry(1,1,1,20,20);
    antebrazoGem.translate(0,-0.5,0);
    manoGem.translate(0,-2.7,0);

    var mano = new THREE.Mesh (manoGem, mat);    
    var antebrazo = new THREE.Mesh (antebrazoGem, mat);  
    
    antebrazo.scale.set(0.5,2,0.5);


    var antebrazoCompleto = new THREE.Object3D();
    antebrazoCompleto.add(antebrazo);
    antebrazoCompleto.add(mano);
    

    return antebrazoCompleto;
  }

  crearBrazoIzquierdo(){
    var mat = new THREE.MeshPhongMaterial( {
      color: 0x4c1919,
  });
    var codoGem=new THREE.SphereBufferGeometry(1,20,20);
    var humeroGem= new THREE.CylinderBufferGeometry(1,1,1,20,20);
    humeroGem.translate(0,-0.5,0);
    codoGem.translate(0,-4,0);

    var codo = new THREE.Mesh (codoGem, mat);    
    var humero = new THREE.Mesh (humeroGem, mat);  
    
    humero.scale.set(0.5,2,0.5);
    codo.scale.set(0.5,0.5,0.5);

    var brazo = new THREE.Object3D();
    this.antebrazoIzq=this.crearAntebrazo();
    this.antebrazoIzq.position.set(0,-2,0);

    brazo.add(humero);
    brazo.add(codo);
    brazo.add(this.antebrazoIzq);

    var hombrogem=new THREE.SphereBufferGeometry(0.5,20,20);
    var hombro = new THREE.Mesh (hombrogem, mat); 
    brazo.add(hombro);


    return brazo;
  }

  crearBrazoDerecha(){
    var mat = new THREE.MeshPhongMaterial( {
      color: 0x4c1919,
  });
    var codoGem=new THREE.SphereBufferGeometry(1,20,20);
    var humeroGem= new THREE.CylinderBufferGeometry(1,1,1,20,20);
    humeroGem.translate(0,-0.5,0);
    codoGem.translate(0,-4,0);

    var codo = new THREE.Mesh (codoGem, mat);    
    var humero = new THREE.Mesh (humeroGem, mat);  
    
    humero.scale.set(0.5,2,0.5);
    codo.scale.set(0.5,0.5,0.5);

    var brazo = new THREE.Object3D();
    this.antebrazoDcho=this.crearAntebrazo();
    this.antebrazoDcho.position.set(0,-2,0);
    brazo.add(humero);
    brazo.add(codo);
    brazo.add(this.antebrazoDcho);

    var hombrogem=new THREE.SphereBufferGeometry(0.5,20,20);
    var hombro = new THREE.Mesh (hombrogem, mat); 
    brazo.add(hombro);


    return brazo;
  }

  crearGemelo(){
    var mat = new THREE.MeshPhongMaterial( {
      color: 0xcc7f33,
  });
    var pieGem=new THREE.CylinderBufferGeometry(1,1,2,20,20);
    var gemeloGem= new THREE.CylinderBufferGeometry(1,1,1,20,20);
    gemeloGem.translate(0,-0.5,0);
    pieGem.translate(0,-0.5,-4);

    var pie = new THREE.Mesh (pieGem, mat);    
    var gemelo = new THREE.Mesh (gemeloGem, mat);  
    
    gemelo.scale.set(0.5,2,0.5);
    pie.scale.set(0.5,1,0.5)
    pie.rotateX(-Math.PI/2);

    var gemeloCompleto = new THREE.Object3D();
    gemeloCompleto.add(gemelo);
    gemeloCompleto.add(pie);

    return gemeloCompleto;
  }

  crearPiernaIzquierda(){
    var mat = new THREE.MeshPhongMaterial( {
      color: 0xcc7f33,
  });
    var rodillaGem=new THREE.SphereBufferGeometry(1,20,20);
    var musloGem= new THREE.CylinderBufferGeometry(1,1,1,20,20);
    musloGem.translate(0,-0.5,0);
    rodillaGem.translate(0,-4,0);

    var rodilla = new THREE.Mesh (rodillaGem, mat);    
    var muslo = new THREE.Mesh (musloGem, mat);  
    
    muslo.scale.set(0.5,2,0.5);
    rodilla.scale.set(0.5,0.5,0.5);

    var pierna = new THREE.Object3D();
    this.gemeloIzq=this.crearGemelo();
    this.gemeloIzq.position.set(0,-2,0);
    pierna.add(muslo);
    pierna.add(rodilla);
    pierna.add(this.gemeloIzq);

    return pierna;
  }

  crearPiernaDerecha(){
    var mat = new THREE.MeshPhongMaterial( {
      color: 0xcc7f33,
  });
    var rodillaGem=new THREE.SphereBufferGeometry(1,20,20);
    var musloGem= new THREE.CylinderBufferGeometry(1,1,1,20,20);
    musloGem.translate(0,-0.5,0);
    rodillaGem.translate(0,-4,0);

    var rodilla = new THREE.Mesh (rodillaGem, mat);    
    var muslo = new THREE.Mesh (musloGem, mat);  
    
    muslo.scale.set(0.5,2,0.5);
    rodilla.scale.set(0.5,0.5,0.5);

    var pierna = new THREE.Object3D();
    this.gemeloDcho=this.crearGemelo();
    this.gemeloDcho.position.set(0,-2,0);
    pierna.add(muslo);
    pierna.add(rodilla);
    pierna.add(this.gemeloDcho);

    return pierna;
  }

  update () {
  }
}


export { Burger };