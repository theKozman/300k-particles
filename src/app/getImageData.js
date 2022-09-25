import * as THREE from 'three';
import parameters from '/src/app/parameters';

const getImageData = async () => {
    const loader = new THREE.TextureLoader();
    let imageTexture;
    await new Promise((resolve, reject) => {
        loader.load(parameters.imageSrc, (texture) => {
            imageTexture = texture;
            imageTexture.minFilter = THREE.LinearFilter;
            imageTexture.magFilter = THREE.LinearFilter;
            imageTexture.format = THREE.RGBFormat;

            imageTexture.width = texture.image.width;
            imageTexture.height = texture.image.height;
            resolve();
        });
    });
    const img = imageTexture.image;
    const imageCanvas = document.createElement('canvas');
    const ctx = imageCanvas.getContext('2d');


    imageCanvas.width = imageTexture.width;
    imageCanvas.height = imageTexture.height;
    ctx.scale(1, -1); // flip y
    ctx.drawImage(img, 0, 0, imageTexture.width, imageTexture.height * -1);
    const imageData = ctx.getImageData(0, 0, imageCanvas.width, imageCanvas.height);

    return imageData;
}

export default getImageData;