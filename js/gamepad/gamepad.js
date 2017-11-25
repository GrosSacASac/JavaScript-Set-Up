/*
 * Gamepad API Test
 * Written in 2013 by Ted Mielczarek <ted@mielczarek.org>
 *
 * To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this software to the public domain worldwide. This software is distributed without any warranty.
 *
 * You should have received a copy of the CC0 Public Domain Dedication along with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
 */

const gamePadSupport = (
    "GamepadEvent" in window &&
    window.navigator && window.navigator.getGamepads &&
    window.requestAnimationFrame
);

const customRound = function (x, precision) {
    // can have small errors due to fixed floats precision
    const rest  = x % precision;
    if (rest === 0) {
        return x;
    } else {
        const halfPrecision = precision / 2;
        if (rest > halfPrecision) {
            return x + (precision - rest);
        } else {
            return x - rest;
        }
    }
};

(function () {
    const player = {
        x: 0,
        minX: 0,
        maxX: innerWidth,
        y: 0,
        minY: 0,
        maxY: innerHeight,
        element: document.getElementById("player"),
        speed: 2.5,
        action: undefined
    };
    if (!gamePadSupport) {
        player.element.textContent = "No gamePad support";
        return;
    }
    
    var controllers = {};

    function connecthandler(event) {
        const gamepad = event.gamepad;
        controllers[gamepad.index] = gamepad;
    }

    function disconnecthandler(event) {
      const gamepad = event.gamepad
      delete controllers[gamepad.index];
    }

    function loop() {
      scangamepads();
      let j;
      Object.values(controllers).forEach(function (controller) {
        /*
        for (var i=0; i<controller.buttons.length; i++) {
          
          const {value, pressed} = controller.buttons[i];
        }
        */

        for (var i=0; i<controller.axes.length; i++) {
            let value = controller.axes[i];
            if (Math.abs(value) < 0.15) {
                //deal with somethwhat decalibrated axes
                value = 0;
            }
            value *= player.speed;
            if (i === 0) {
                player.x += value;  
            } else if (i === 1) { 
          
                player.y += value;  
            }
          
        }
      });
      player.element.style.left = `${player.x}px`;
      player.element.style.top = `${player.y}px`;
      requestAnimationFrame(loop);
    }

    function scangamepads() {
      var gamepads = navigator.getGamepads();
      for (var i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
          if (!(gamepads[i].index in controllers)) {
            addgamepad({
                gamepad: gamepads[i]
            });
          } else {
            controllers[gamepads[i].index] = gamepads[i];
          }
        }
      }
    }


    window.addEventListener("gamepadconnected", connecthandler);
    window.addEventListener("gamepaddisconnected", disconnecthandler);

    requestAnimationFrame(loop);
}());
