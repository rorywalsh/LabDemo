var demo = {
    scene: "Heart",
    incremental: false,
    binary: false,
    doNotUseCDN: false,
    collisions: true,
    offline: true,
    onload: function() {
        scene.getMeshByName("Labels").setEnabled(false);
        scene.getMeshByName("lums").useVertexColors = false;
        scene.gravity.scaleInPlace(0.5);

        BABYLON.Mesh.checkCollisions = true;
        scene.gravity.scaleInPlace(0.5);
        let camera = scene.activeCamera;
        camera.checkCollisions = true;
        var cameraBox = BABYLON.Mesh.CreateBox("CameraBox", .1, scene);
        cameraBox.position = new BABYLON.Vector3(0, 0, 0);
        cameraBox.parent = camera;
        camera.ellipsoid = new BABYLON.Vector3(.4, .8, .4);

        cameraBox.isPickable = false;
        camera.speed = 0.1;
        scene.audioPositioningRefreshRate = 100;
        scene.meshes[0].checkCollisions = true;
        scene.fogMode = BABYLON.Scene.FOGMODE_EXP;;
        scene.fogDensity = 0.1;
        scene.fogColor = scene.clearColor;

        let triggerSounds = [];
        triggerSounds.push(new OneShotCollisionSound({ file: "./build/assets/2.wav", x: 2, z: 0.5, visible:true }));
        triggerSounds.push(new OneShotCollisionSound({ file: "./build/assets/3.wav", x: 4.8, z: -3, visible:true }));
        triggerSounds.push(new OneShotCollisionSound({ file: "./build/assets/4.wav", x: -5, z: -1, visible:true }));



        var footstepSounds = new BABYLON.Sound("Footsteps1", "./build/assets/footsteps.ogg", scene, null, {
            loop: true,
            autoplay: true,
            volume: 1
        });



        let isWalking = false;
        let prevIndex = -1;


        // Load the sound and play it automatically once ready
        var bubbles = new BABYLON.Sound("Bubbling", "./build/assets/bubbling.ogg", scene, null, {
            loop: true,
            autoplay: true,
            volume: .5,
            spatialSound: true,
            distanceModel: "exponential",
            rolloffFactor: 4
        });

        bubbles.setPosition(new BABYLON.Vector3(-1.16, 1, 1.74));

        scene.onKeyboardObservable.add((kbInfo) => {
            if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN) {
                if (kbInfo.event.key === 'ArrowUp' || kbInfo.event.keyCode == 87) {
                    if (isWalking === false)
                    footstepSounds.setVolume(.5);
                    isWalking = true;
                }
            } else if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYUP) {
                console.log(kbInfo.event.key);
                if (kbInfo.event.key === 'ArrowUp' || kbInfo.event.keyCode == 87) {
                    footstepSounds.setVolume(0);
                    isWalking = false;
                }
            }
        });

        // GUI
        let GUIInfo = "Player's position";
        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        var stackPanel = new BABYLON.GUI.StackPanel();
        stackPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        stackPanel.isVertical = true;
        advancedTexture.addControl(stackPanel);

        var textInfo = new BABYLON.GUI.TextBlock();
        textInfo.color = "white";
        textInfo.fontSize = 16;
        textInfo.height = "30px";
        stackPanel.addControl(textInfo);

        scene.onBeforeRenderObservable.add(() => {
            textInfo.text = "Player's position X:" + (camera.position.x).toFixed(2) + " Z:" + (camera.position.z).toFixed(2);

            if (cameraBox) {
                triggerSounds.forEach(oneShot => {
                    if (cameraBox.intersectsMesh(oneShot.box, false)) {
                        oneShot.play();
                    } else
                        oneShot.canPlay = true;
                });
            }





        });

    }

};