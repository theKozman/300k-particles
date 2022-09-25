import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';
import parameters from '/src/app/parameters';
import getImageData from './getImageData';
import { browser } from '$app/environment';
import { scene } from '/src/app/stores/scene';
import { get } from 'svelte/store';

let points = null,
    geometry = null,
    material = null,
    originalColors = [],
    colors = [],
    sizes = [],
    positions = [];

const storedScene = scene;

if(browser) {
    

}


const generatePoints = async () => {

    const scene = get(storedScene);

    if (
        geometry !== null || 
        material !== null || 
        points !== null
    ) {
        geometry.dispose();
        material.dispose();
        scene.remove(points);
        positions = null;
        colors = null;
        sizes = null;
        originalColors = null;
    }

    // Get image pixels
    const imageData = await getImageData();
    originalColors = Float32Array.from(imageData.data);

    


    
    // Texture
    const loader = new THREE.TextureLoader();

    const pointsTexture = loader.load('textures/1.png');
    
    // Points

    
    const pixelsNumber = imageData.width * imageData.height;
    positions = new Float32Array(pixelsNumber * 3);
    colors = new Float32Array(pixelsNumber * 3);
    sizes = new Float32Array(pixelsNumber);
    geometry = new THREE.BufferGeometry();
   
    material = new THREE.ShaderMaterial({
        uniforms: {
            color: { value: new THREE.Color( 0xaaaaaa ) },
            pointTexture: { value: pointsTexture }
        },
        vertexShader: await (await fetch('/shaders/vert.glsl')).text(),
        fragmentShader: await (await fetch('/shaders/frag.glsl')).text(),

        alphaTest: 0.001,
        transparent: true,
    });


    for(let i = 0, j = 0; i < pixelsNumber * 3; i++) {
        let j3 = j * 3;
        let i4 = i * 4;

        if (originalColors[i4 + 3] < parameters.threshold) continue;
        
        // Normalize coords
        let x = (i % imageData.width) / imageData.width;
        let y = Math.trunc(i / imageData.width) / imageData.height;

        positions[j3    ] = ((x - 0.5) + ((Math.random() - 0.5) / (1000 - parameters.positionRandomness))) * parameters.distance;
        positions[j3 + 1] = Math.log(Math.pow((Math.random() * 1.5), parameters.depthRandomness), 1000) * (Math.random() < 0.5 ? -1 : 1);
        positions[j3 + 2] = ((y - 0.5) + ((Math.random() - 0.5) / (1000 - parameters.positionRandomness))) * parameters.distance;

        // Colors

        // normalize and translate to grayscale
        const r = (originalColors[i4 + 0] / 255),
              g = (originalColors[i4 + 1] / 255),
              b = (originalColors[i4 + 2] / 255);
        
        const grayscale = r * 0.21 + g * 0.71 + b * 0.07;

        colors[j3    ] = parameters.grayscale ? grayscale : r;
        colors[j3 + 1] = parameters.grayscale ? grayscale : g;
        colors[j3 + 2] = parameters.grayscale ? grayscale : b;

        // Size

        // size is based on brightness
        sizes[i] = Math.pow(Math.max(grayscale, 0.15) * parameters.size, 1.01);


        j++
    }

    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    );

    //TODO: find a way to correctly use vertice merging
    geometry = BufferGeometryUtils.mergeVertices(geometry);

    geometry.setAttribute(
        'customColor',
        new THREE.BufferAttribute(colors, 3)
    );

    geometry.setAttribute(
        'size',
        new THREE.BufferAttribute(sizes, 1)
    );
    
 
    
    points = new THREE.Points(geometry, material);
    points.rotateY(Math.PI);
    scene.add(points);
    return points;
}


export default generatePoints;