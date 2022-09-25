import * as dat from 'lil-gui';
import generatePoints from '/src/app/generatePoints';
import parameters from '/src/app/parameters';

const initGui = () => {
    const gui = new dat.GUI();

    gui.add(parameters, 'imageSrc').name('image').options(parameters.imageSrcOptions).onFinishChange(generatePoints);
    gui.add(parameters, 'threshold').min(0).max(255).step(1).onFinishChange(generatePoints);
    gui.add(parameters, 'size').min(1).max(20).step(0.5).onFinishChange(generatePoints);
    gui.add(parameters, 'distance').min(10).max(1000).step(1).onFinishChange(generatePoints);
    gui.add(parameters, 'positionRandomness').min(1).max(1000).step(1).onFinishChange(generatePoints);
    gui.add(parameters, 'depthRandomness').min(0.1).max(10).step(0.1).onFinishChange(generatePoints);
    gui.add(parameters, 'grayscale').onFinishChange(generatePoints);
}

export default initGui;