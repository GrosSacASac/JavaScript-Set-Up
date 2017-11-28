/* demo, inspired by https://github.com/luser/gamepadtest
 */

const gamePadSupport = (
    /*"Gamepad" in window &&*/
    "GamepadEvent" in window &&
    window.navigator &&
    window.navigator.getGamepads
);


const playerElement = document.getElementById("player");

(function () {
    if (!gamePadSupport) {
        playerElement.textContent = "No gamePad support";
        return;
    }
    playerElement.textContent = "Plug in a gamepad and press any button";
    
    const SETTINGS = {
        /* Must be in range 0.0 to 1.0
        The closer to value to 0, the better it is for precision
        The closer to value to 1, the better it is for GamePads
        that are slightly de-calibrated or old */
        MIN_AXES_VALUE : 0.20,
        MAX_CONTROLLERS: 16
    };
    
    const lastInput = {
        anyControllerEverPluggedIn: false,
        controllers: Array(SETTINGS.MAX_CONTROLLERS)
    };
    
    const player = {
        x: 0,
        minX: 0,
        maxX: innerWidth - 100 /* leave space for object width */,
        y: 0,
        minY: 0,
        maxY: innerHeight - 100 /* leave space for object height */,
        speed: 8,
        action: undefined,
        element: playerElement
    };
    
    const controllers = {}; // todo make this more like lastInput.controllers

    const scanGamepadsChrome = function () {
        // required for chrome
        // in chrome the gamepad object is only a snapshot (frozen)
        // to get the last value we have to navigator.getGamepads()
        // in ff this should have no observable effect
        const gamepads = navigator.getGamepads();
        for (let i = 0; i < gamepads.length; i += 1) {
            if (gamepads[i]) {
                controllers[gamepads[i].index] = gamepads[i];
            }
        }
    };

    const getLastInput = function () {
        // updates lastInput, with normalized input
        scanGamepadsChrome();
        Object.values(controllers).forEach(function (controller) {
            // console.log(controller.hapticActuators); // array
            // https://developer.mozilla.org/en-US/docs/Web/API/GamepadHapticActuator/type
            // controller.hapticActuators[0].type
            // https://developer.mozilla.org/en-US/docs/Web/API/GamepadHapticActuator/pulse
            // controller.hapticActuators[0].pulse(value, duration) // value between 0 and 1
            const axes = [];  
            for (let i = 0; i < controller.axes.length; i += 1) {
                let value = controller.axes[i]; /* -1.0 to +1.0 */
                if (Math.abs(value) < SETTINGS.MIN_AXES_VALUE) {
                    value = 0;
                }
                axes.push(value);
            }
            lastInput.controllers[controller.index] = {
                buttons: controller.buttons,
                axes
            };
        });
    };
    
    const updateGameState = function () {
        // reads lastInput and updates the game state
        const controllerPlayer1 = lastInput.controllers[0];
        player.action = undefined;
        for (let i = 0; i < controllerPlayer1.buttons.length; i += 1) {
            const {value, pressed} = controllerPlayer1.buttons[i];
            if (pressed) {
                if (player.action) {
                    player.action += ` and ${i}`;
                } else {
                    player.action = `Pressed button ${i}`;
                }
            }
        }

        for (let i = 0; i < controllerPlayer1.axes.length; i += 1) {
            const distance = controllerPlayer1.axes[i] * player.speed;
            if (i === 0) {
                player.x += distance;
                // clamp x
                player.x = Math.min(Math.max(player.x, player.minX), player.maxX);
            } else if (i === 1) { 
                player.y += distance;
                // clamp y
                player.y = Math.min(Math.max(player.y, player.minY), player.maxY);
            }
        }
    };
    
    const updateDisplay = function () {
        // reads the game state and updates the display
        player.element.style.left = `${player.x}px`;
        player.element.style.top = `${player.y}px`;
        if (player.action) {
            player.element.textContent = player.action;
        }
    };
    
    function loop() {

        getLastInput();
        updateGameState();
        updateDisplay();
        requestAnimationFrame(loop);
    }

    window.addEventListener("gamepadconnected", function connecthandler(event) {
        const gamepad = event.gamepad;
        controllers[gamepad.index] = gamepad;
        if (!lastInput.anyControllerEverPluggedIn) {
            lastInput.anyControllerEverPluggedIn = true;
            player.element.textContent = "Move me";
            requestAnimationFrame(loop);
        }
    });
    
    window.addEventListener("gamepaddisconnected", function (event) {
        const gamepad = event.gamepad
        delete controllers[gamepad.index];
    });

}());
