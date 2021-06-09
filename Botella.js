import * as THREE from './libs/three.module.js'
import { MTLLoader } from './libs/MTLLoader.js'
import { OBJLoader } from './libs/OBJLoader.js'

export class Botella extends THREE.Object3D {
  constructor() {
    super();
    
    var that = this;
    var materialLoader = new MTLLoader();
    
    var modeloLoader = new OBJLoader();

    materialLoader.load('./models/WaterBottle/model/obj/WaterBottle.mtl',
        function(material){
          modeloLoader.setMaterials(material);
          modeloLoader.load('./models/WaterBottle/model/obj/WaterBottle.obj',
              function(obj){
                var modelo = obj;
                modelo.scale.set(4,4,4);
                modelo.position.set(0,9,0);

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
}
