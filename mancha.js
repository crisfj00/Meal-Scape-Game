import * as THREE from './libs/three.module.js'

class Charco extends THREE.Object3D {
  constructor() {
    super();

    var esferaGeo= new THREE.SphereGeometry(0.05,60,60);

    var material = new THREE.MeshLambertMaterial();
    material.opacity= 0.86;
    material.depthTest= true;
    material.color.set(0x4ff1d);
    material.reflectivity= 0.9;
    material.refractionRatio= 0.43;
    material.skinning= true;
    material.needsUpdate = true;
    
    
    this.esfera = new THREE.Mesh(esferaGeo, material);
    this.esfera.scale.y= 23;
    this.esfera.scale.x= 9;
    this.esfera.rotateZ(60.0);

    this.esfera2 = new THREE.Mesh(esferaGeo, material);
    this.esfera2.scale.y= 20;
    this.esfera2.scale.x= 9;
    this.esfera2.rotateZ(170);
    this.esfera2.position.set(0.3,0.5,0);

    var manchaGeo= new THREE.SphereGeometry(0.026,30,30);
    this.mancha = new THREE.Mesh(manchaGeo, material);
    this.mancha.scale.y= 4;
    this.mancha.scale.x= 2;
    this.mancha.rotateZ(Math.PI/6);
    this.mancha.position.set(-0.5,1.3,0);

    this.mancha1 = new THREE.Mesh(manchaGeo, material);
    this.mancha1.scale.y= 2.1;
    this.mancha1.scale.x= 1;
    this.mancha1.rotateZ(170);
    this.mancha1.position.set(-0.4,1.4,0);

    this.mancha2 = new THREE.Mesh(manchaGeo, material);
    this.mancha2.scale.y= 1.4;
    this.mancha2.scale.x= 1.7;
    this.mancha2.rotateZ(Math.PI/3);
    this.mancha2.position.set(0.5,1.3,0);

    this.mancha3 = new THREE.Mesh(manchaGeo, material);
    this.mancha3.scale.y= 3.6;
    this.mancha3.scale.x= 1.6;
    this.mancha3.rotateZ(170);
    this.mancha3.position.set(0.60,1.31,0);

    this.mancha4 = new THREE.Mesh(manchaGeo, material);
    this.mancha4.scale.y= 4.1;
    this.mancha4.scale.x= 2.2;
    this.mancha4.rotateZ(170);
    this.mancha4.position.set(0.75,-0.6,0);

    this.mancha5 = new THREE.Mesh(manchaGeo, material);
    this.mancha5.scale.y= 2;
    this.mancha5.scale.x= 1.1;
    this.mancha5.rotateZ(170);
    this.mancha5.position.set(0.75, -0.8, 0);


    this.mancha6 = new THREE.Mesh(manchaGeo, material);
    this.mancha6.scale.y= 3.5;
    this.mancha6.scale.x= 1.6;
    this.mancha6.rotateZ(170);
    this.mancha6.position.set(0.65,-0.9,0);

    this.mancha7 = new THREE.Mesh(manchaGeo, material);
    this.mancha7.scale.y= 5;
    this.mancha7.scale.x= 2;
    this.mancha7.rotateZ(170);
    this.mancha7.position.set(0.9, -1, 0);

    this.charco= new THREE.Object3D();
    this.charco.add(this.esfera);   
    this.charco.add(this.esfera2);
    this.charco.add(this.mancha);
    this.charco.add(this.mancha1);
    this.charco.add(this.mancha2);
    this.charco.add(this.mancha3);
    this.charco.add(this.mancha4);
    this.charco.add(this.mancha5);
    this.charco.add(this.mancha6);
    this.charco.add(this.mancha7);

    this.charco.rotateX(Math.PI/2);

    this.add(this.charco);

  }
}  
export { Charco }