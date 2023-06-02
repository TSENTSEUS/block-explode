import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap';

let constraints = null;

const fieldConstraints = {
    x: 0,
    y: 0,
    z: 0,
}

document.getElementById('submit').addEventListener('click', () =>
{
    const x = document.getElementById('X').value;
    const y = document.getElementById('Y').value;
    const z = document.getElementById('Z').value;

    fieldConstraints.x = x;
    fieldConstraints.y = y;
    fieldConstraints.z = z;
    constraints = generateCube();
    scene.add(constraints)
    console.log(fieldConstraints)
})


const canvas = document.querySelector('.webgl');

const scene = new THREE.Scene();

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const textureLoader = new THREE.TextureLoader();
const waterColor = textureLoader.load('/textures/Water/Water_002_COLOR.jpg');
const dirtColor = textureLoader.load('/textures/Dirt/Ground_Dirt_009_BaseColor.jpg');
const lavaColor = textureLoader.load('/textures/Lava/Lava_002_COLOR.png');
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(1,1,2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
    canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));



const randomTexture = () => {
    const textures = [waterColor, lavaColor, dirtColor];
    return textures[Math.floor(Math.random() * 3)]
}
const generateRandomGeometry = () => {
    const geometryType = Math.floor(Math.random() * 3);
    const texture = randomTexture();
    let geometry;
    const material= new THREE.MeshBasicMaterial({
        map: texture,
    });
    if(geometryType === 0) {
        geometry = new THREE.CylinderGeometry(.5, .5, 1,20,32);
    }
    if(geometryType === 1) {
        geometry = new THREE.BoxGeometry(1, 1, 1);
    }
    if(geometryType === 2) {
        geometry = new THREE.SphereGeometry(.5,16,16);
    }
    return new THREE.Mesh(geometry, material);
}
const generateCube = () => {
    const constraints = new THREE.Object3D();
    const {x,y,z} = fieldConstraints;
    const offsetX = (x - 1) * 0.5;
    const offsetY = (y - 1) * 0.5;
    const offsetZ = (z - 1) * 0.5;

    for(let width = 0; width < x; width++){
        for(let height = 0; height < y; height++){
            for(let depth = 0; depth < z; depth++){
                const mesh = generateRandomGeometry();
                mesh.position.set(width - offsetX,height - offsetY,depth - offsetZ);
                constraints.add(mesh)
            }
        }
    }
    return constraints
}

let geometry = new THREE.BoxGeometry(3, 3, 3);
const material = new THREE.MeshBasicMaterial();
material.wireframe = true;
const box = new THREE.Mesh(geometry, material);
scene.add(box);

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


/**
 * Animate
 */

document.getElementById('explode').addEventListener('click', () => {
    explode();
})
const explode = () => {
    // console.log(constraints);
    constraints.children.forEach(function (mesh) {
        gsap.to(mesh.position, {duration: 1, delay: .5, x: (Math.random() - .5) * fieldConstraints.x * 2 })
        gsap.to(mesh.position, {duration: 1, delay: .5, y:  (Math.random() - .5) * fieldConstraints.y * 2 })
        gsap.to(mesh.position, {duration: 1, delay: .5, z:  (Math.random() - .5) * fieldConstraints.z * 2 })

    });
}
const tick = () =>
{

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()