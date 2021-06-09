import * as THREE from './libs/three.module.js'
import { MTLLoader } from './libs/MTLLoader.js'
import { OBJLoader } from './libs/OBJLoader.js'

export class Patatas extends THREE.Object3D {
  constructor() {
    super();
    
    var that = this;
    var materialLoader = new MTLLoader();
    
    var modeloLoader = new OBJLoader();

    materialLoader.load('./models/Patatas/Patatas.mtl',
        function(material){
          modeloLoader.setMaterials(material);
          modeloLoader.load('./models/Patatas/Patatas.obj',
              function(obj){
                var modelo = obj;
                modelo.scale.set(3,3,3);
                modelo.position.set(0,2.5,0);

                modelo.castShadow=true;
                modelo.receiveShadow=true;

                modelo.traverse( function ( child ) {
                  if ( child instanceof THREE.Mesh ) {
                      child.castShadow = true;
                  }
              } );
                that.add(modelo);
              },
              null, null);});
              
  }

  update(){
    this.rotation.y += 0.1;
  }

}