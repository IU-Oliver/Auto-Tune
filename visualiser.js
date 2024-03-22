import * as THREE from 'three'
import { OrbitControls } from '/Libs/three.js/examples/jsm/controls/OrbitControls.js'
import Stats from '/Libs/three.js/examples/jsm/libs/stats.module.js'

const visualiser = document.querySelector("#visualiser");


const scene = new THREE.Scene()

const light = new THREE.AmbientLight()
scene.add(light)

//const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const camera = new THREE.PerspectiveCamera(75, visualiser.clientWidth / visualiser.clientHeight, 0.1, 1000)
camera.position.x = 0//7
camera.position.y = 2//.75
camera.position.z = -10

const renderer = new THREE.WebGLRenderer()
//renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setSize(visualiser.clientWidth, visualiser.clientHeight)
visualiser.appendChild(renderer.domElement)
//document.body.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

const canvas = document.createElement('canvas')
canvas.width = 256
canvas.height = 512

const ctx = canvas.getContext('2d')


const displacementMap = new THREE.Texture(canvas)
displacementMap.minFilter = THREE.LinearFilter
displacementMap.magFilter = THREE.LinearFilter

const texture = new THREE.Texture(canvas)
texture.minFilter = THREE.LinearFilter
texture.magFilter = THREE.LinearFilter

//const texture = new THREE.TextureLoader().load('Images/px_25.jpg')
/*
const material = new THREE.MeshBasicMaterial();
*/
const material = new THREE.MeshPhongMaterial({
    //wireframe: true,
    //color: new THREE.Color(0x00ff00),
    displacementMap: displacementMap,
    displacementScale: 10,
    map: texture
});
/*
const envTexture = new THREE.CubeTextureLoader().load([
    'Images/px_25.jpg',
    'Images/nx_25.jpg',
    'Images/py_25.jpg',
    'Images/ny_25.jpg',
    'Images/pz_25.jpg',
    'Images/nz_25.jpg',
])
envTexture.mapping = THREE.CubeReflectionMapping
//envTexture.mapping = THREE.CubeRefractionMapping
material.envMap = envTexture
*/

const plane = new THREE.Mesh(new THREE.PlaneGeometry(20, 20, 256, 256), material);

plane.rotateX(-Math.PI / 2)
scene.add(plane)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    //camera.aspect = window.innerWidth / window.innerHeight
    camera.aspect = visualiser.clientWidth / visualiser.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(visualiser.clientWidth, visualiser.clientHeight)
    render()
}

let context
let analyser
let mediaSource
let imageData
/*
function getUserMedia(dictionary, callback) {
    try {
        navigator.getUserMedia =
            navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
        navigator.getUserMedia(dictionary, callback, (e) => {
            console.dir(e)
        })
    } catch (e) {
        alert('getUserMedia threw exception :' + e)
    }
}
*/
function connectAudioAPI() {
    analyser = document.querySelector("analyser-node").be;
    animate();

    console.log("analyser");
    console.log(analyser);

   /*
    try {
        //context = new AudioContext()
        context = document.querySelector("audio-context").be;
        analyser = context.createAnalyser();
        analyser.fftSize = 2048;

        biquadFilterNode = document.querySelector("biquad-filter-node").be;
        mediaSource.connect(analyser);

        navigator.mediaDevices
            .getUserMedia({ audio: true, video: false })
            .then(function (stream) {
                mediaSource = context.createMediaStreamSource(stream)
                mediaSource.connect(analyser)
                animate()
                context.resume()
            })
            .catch(function (err) {
                alert(err)
            })
    } catch (e) {
        alert(e)
    }
    */
    
}

function updateFFT() {
    let timeData = new Uint8Array(analyser.frequencyBinCount)

    analyser.getByteFrequencyData(timeData)



    imageData = ctx.getImageData(0, 1, 256, 511)
    ctx.putImageData(imageData, 0, 0, 0, 0, 256, 512)

    for (let x = 0; x < 256; x++) {
        var td = timeData[x];
        if (x > 100 && x < 156) td = td / 10;
        var tdh = td / 2;
        var tdt = td / 3;
        var r = 0;
        var g = 0;
        var b = 0;

        switch (true) {
            case td < 37:
                r = td;
                break;
            case td < 73:
                g = td;
                break;
            case td < 109:
                b = td;
                break;
            case td < 146:
                r = tdh;
                g = tdh;
                break;
            case td < 182:
                r = tdh;
                b = tdh;
                break;
            case td < 219:
                g = tdh;
                b = tdh;
                break;
            default:
                r = tdt;
                g = tdt;
                b = tdt;
        }

        ctx.fillStyle = 'rgb(' + r + ', ' + g + ', ' + b + ') ';
        ctx.fillRect(x, 510, 2, 2)
    }

    displacementMap.needsUpdate = true;
    texture.needsUpdate = true;
}

const stats = new Stats()
document.body.appendChild(stats.domElement)

function animate() {
    requestAnimationFrame(animate)

    updateFFT()

    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

window.onload = function () {
    connectAudioAPI()
}
