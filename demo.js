var demo = {
    scene: "Heart",
    incremental: false,
    binary: false,
    doNotUseCDN: false,
    collisions: true,
    offline: true,
    onload: function () {
        scene.getMeshByName("Labels").setEnabled(false);
        scene.getMeshByName("lums").useVertexColors = false;
        scene.gravity.scaleInPlace(0.5);

        BABYLON.Mesh.checkCollisions = true;
        scene.gravity.scaleInPlace(0.5);
        let camera = scene.activeCamera;
        camera.checkCollisions = true;

        //add a box to the camera. We use this to check for collisions
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

        //simple footsteps loop - set to play from the start. The volume is turned up and down as the player moves
        var footstepSounds = new BABYLON.Sound("Footsteps1", "./build/assets/footsteps.ogg", scene, null, {
            loop: true,
            autoplay: true,
            volume: 0
        });

        //all one-shot trigger sounds should be added to this array...
        let triggerBoxes = [];

        //creates a new sound collision box. x and z set its position, w its size. Set visible to false
        //to remove the mesh from the scene. See audioClasses.js for more options.
        triggerBoxes.push(new OneShotCollisionSound({ file: "./build/assets/3.wav", x: 2, z: 0.5, w: .2, visible: true, color: 'cyan' }));

        //create a new area sound. x: and z: set its position, rolloff sets its size. Set visible to false
        //to remove the mesh from the scene. See audioClasses.js for more options.
        let bubbles = new AreaSound({ file: "./build/assets/bubbling.ogg", x: -1.49, z: -0.41, visible: true, color: 'yellow', rolloff: 8, volume: 1 });

        scene.onKeyboardObservable.add((kbInfo) => {
            if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN) {
                if (kbInfo.event.key === 'ArrowUp' || kbInfo.event.keyCode == 87 ||
                    kbInfo.event.key === 'ArrowDown' || kbInfo.event.keyCode == 83 ||
                    kbInfo.event.key === 'ArrowLeft' || kbInfo.event.keyCode == 65 ||
                    kbInfo.event.key === 'ArrowRight' || kbInfo.event.keyCode == 68) {
                        //every time the user moves, turn up volume of footsteps sample
                        footstepSounds.setVolume(.5, .1);
                }
                else if (kbInfo.event.keyCode == 81) {
                    // user just pressed q 
                }
            } else if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYUP) {
                //every time the user stops moving, turn down volume of footsteps sample
                footstepSounds.setVolume(0, .1);
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

        //this method gets call eah time a frame is rendered
        scene.onBeforeRenderObservable.add(() => {
            textInfo.text = "Player's position X:" + (camera.position.x).toFixed(2) + " Z:" + (camera.position.z).toFixed(2);
            //check if the camera box collides with any of the trigger boxes - if so, play the corresponding sounds
            if (cameraBox) {
                triggerBoxes.forEach(oneShot => {
                    if (cameraBox.intersectsMesh(oneShot.box, false)) {
                        oneShot.play();
                    } else
                        oneShot.canPlay = true;
                });
            }
        });
    }
};