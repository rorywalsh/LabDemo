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
        var cameraBox = BABYLON.Mesh.CreateBox("Box1", 1, scene);
        cameraBox.position = new BABYLON.Vector3(0, 2, 1);
        cameraBox.parent = camera;
        cameraBox.isPickable = false;
        camera.speed = 0.1;
        scene.audioPositioningRefreshRate = 100;

        scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
        scene.fogDensity = 0.1;
        scene.fogColor = scene.clearColor;


        // Load the sound and play it automatically once ready
        var footsteps = new BABYLON.Sound("Footsteps", "./build/assets/footsteps.ogg", scene, null, {
            loop: true,
            autoplay: true,
            volume: 0
        });

        // Load the sound and play it automatically once ready
        var bubbles = new BABYLON.Sound("Bubbling", "./build/assets/bubbling.ogg", scene, null, {
            loop: true,
            autoplay: true,
            volume: .5,
            spatialSound: true,
            distanceModel: "exponential",
            rolloffFactor: 3
        });

        bubbles.setPosition(new BABYLON.Vector3(-1.16, 1.74, 1));


        scene.onKeyboardObservable.add((kbInfo) => {
            console.log(kbInfo.type);
            if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN) {
                if (kbInfo.event.keyCode === 'ArrowUp' || kbInfo.event.keyCode == 87) {
                    footsteps.setVolume(1);
                    console.log("KEY DOWN: ", kbInfo.event.key);
                    console.log('Player Position X:', camera.position.x.toFixed(2), 'Y:', camera.position.y.toFixed(2), 'Z:', camera.position.z.toFixed(2));
                }
            } else if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYUP) {
                if (kbInfo.event.keyCode === 'ArrowUp' || kbInfo.event.keyCode == 87) {
                    footsteps.setVolume(0);
                    console.log("KEY UP: ", kbInfo.event.key);
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
        });

    }

};
