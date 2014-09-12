var game = {

    width: 600,
    height: 800,
    lastFrame: 0,
    dt: 0,

    init: function() {
        game.widthActual = game.width;
        game.heightActual = game.height;
        game.ratio = game.width / game.height;
        game.canvas = document.getElementById('canvas');
        game.canvas.width = game.width;
        game.canvas.height = game.height;
        game.ctx = game.canvas.getContext('2d');
        game.resize();
        lastFrame = game.timestamp();
        game.currentScene = scene1;
        game.main();
    },

    resize: function() {
        game.heightActual = window.innerHeight;
        game.widthActual = game.heightActual * game.ratio;
        game.canvas.style.width = game.widthActual + 'px';
        game.canvas.style.height = game.heightActual + 'px';
    },

    renderToCanvas: function(width, height, render, canvas) {
        canvas = canvas || game.createCanvas(width, height, canvas);
        render(canvas.getContext('2d'));
        return canvas;

    },

    createCanvas: function(width, height) {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    },

    timestamp: function() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    },

    resetLastFrame: function() {
        game.lastFrame = game.timestamp();
    },

    main: function() {
        (function () {
            function main(tFrame) {
                var now = game.timestamp();
                game.dt = (now - game.lastFrame)/1000;
                game.stopMain = requestAnimationFrame(main);
                /*game.update(game.dt);
                game.draw();*/
                game.currentScene.update(game.dt);
                game.currentScene.draw();
                game.lastFrame = now;
            }
            main();
        })();
    },
}

window.addEventListener('resize', game.resize, false);
window.addEventListener('focus', game.resetLastFrame, false);