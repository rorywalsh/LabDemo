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
        triggerSounds.push(new OneShotCollisionSound({ file: "./build/assets/collision1.wav", x: 2, z: 0.5 }));
        triggerSounds.push(new OneShotCollisionSound({ file: "./build/assets/collision1.wav", x: 4.8, z: -3 }));



        var footstepSounds = [];
        footstepSounds.push(new BABYLON.Sound("Footsteps1", "./build/assets/footstep1.ogg", scene, null, {
            loop: false,
            autoplay: false,
            volume: 1
        }));

        footstepSounds.push(new BABYLON.Sound("Footsteps1", "./build/assets/footstep2.ogg", scene, null, {
            loop: false,
            autoplay: false,
            volume: 1
        }));

        footstepSounds.push(new BABYLON.Sound("Footsteps1", "./build/assets/footstep3.ogg", scene, null, {
            loop: false,
            autoplay: false,
            volume: 1
        }));

        footstepSounds.push(new BABYLON.Sound("Footsteps1", "./build/assets/footstep4.ogg", scene, null, {
            loop: false,
            autoplay: false,
            volume: 1
        }));

        footstepSounds.push(new BABYLON.Sound("Footsteps1", "./build/assets/footstep5.ogg", scene, null, {
            loop: false,
            autoplay: false,
            volume: 1
        }));

        footstepSounds.push(new BABYLON.Sound("Footsteps1", "./build/assets/footstep6.ogg", scene, null, {
            loop: false,
            autoplay: false,
            volume: 1
        }));

        footstepSounds.push(new BABYLON.Sound("Footsteps1", "./build/assets/footstep7.ogg", scene, null, {
            loop: false,
            autoplay: false,
            volume: 1
        }));

        let isWalking = false;
        let prevIndex = -1;

        function playFootstepSound() {
            let index = Math.floor(Math.random() * (footstepSounds.length - 1));
            if (index === prevIndex && prevIndex < 6)
                index = prevIndex + 1;
            else if (index === prevIndex && prevIndex == 6)
                index = 0;

            if (isWalking === true) {
                footstepSounds[index].setVolume(Math.random() * .2 + .8);
                footstepSounds[index].play();
                setTimeout(playFootstepSound, Math.random() * 100 + 500);
            }
            prevIndex = index;
        }

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
                        setTimeout(playFootstepSound, 0);
                    isWalking = true;
                }
            } else if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYUP) {
                console.log(kbInfo.event.key);
                if (kbInfo.event.key === 'ArrowUp' || kbInfo.event.keyCode == 87) {
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