<script>
    import * as THREE from 'three';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
    import generatePoints from '/src/app/generatePoints';
    import initGui from '/src/app/initGui';
    import Stats from 'stats-js';
    import { onMount, onDestroy } from 'svelte';
    import { scene } from '/src/app/stores/scene';
    

    let canvas, clock, camera, renderer, stats, controls, points;




    const sizes = {
        width: 2,
        height: 2
    };



    let aspectRatio = sizes.width / sizes.height;
    $: aspectRatio = sizes.width / sizes.height;

    const resize = () => {
        // update sizes
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        // update camera
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();

        // update renderer
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
    



        
    onMount(async () => {

        initGui();

        stats = new Stats();
        stats.showPanel(0);
        window.document.body.appendChild(stats.dom);



        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        

        // Scene
        $scene = new THREE.Scene();

        // Points
        points = await generatePoints();

        // Camera
        const cameraGroup = new THREE.Group();
        camera = new THREE.PerspectiveCamera(15, aspectRatio, 0.1, 1000);
        camera.position.set(0, 300, 300);
        //camera.lookAt(points.position);
        cameraGroup.add(camera);
        $scene.add(cameraGroup);

        // Controls
        controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;

        // Clock
        clock = new THREE.Clock();

        // Renderer
        renderer = new THREE.WebGLRenderer({ 
            canvas,
            antialias: false,
        });
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        
        
        tick();
    });

    onDestroy(() => {
        if(!$scene?.remove) return;
        $scene.remove(camera, points);
        if(renderer) renderer.dispose();
    });

    

    const tick = () => {
        const et = clock.getElapsedTime();

        controls.update();

        //points.rotation.x += et / 1000;

        stats.begin();
        renderer.render($scene, camera);
        stats.end();

        window.requestAnimationFrame(tick);
    }
        

</script>

<svelte:window 
    on:resize={resize}
/>

<canvas 
    bind:this={canvas} 
    
    width={sizes.width} 
    height={sizes.height} 
>

</canvas>

<style>
    :global(html) {
        background-color: #000;
    }

    :global(body) {
        margin: 0px;
    }

    canvas {
        outline: none;
    }
</style>