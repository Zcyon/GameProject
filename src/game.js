var game = {

    width: 600,
    height: 800,
    pos: 100,
    lastFrame: 0,
    velocidad: 350,
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
        game.main();
    },

    resize: function() {
        game.heightActual = window.innerHeight;
        game.widthActual = game.heightActual * game.ratio;

        game.canvas.style.width = game.widthActual + 'px';
        game.canvas.style.height = game.heightActual + 'px';
    },

    renderToCanvas: function(width, height, render, canvas) {
        canvas = canvas || createCanvas(width, height, canvas);
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
                game.update(game.dt);
                game.draw();
                game.lastFrame = now;
            }
            main();
        })();
    },

    update: function(dt) {
        var dx; 
        if(game.velocidad > 0) {
            dx = Math.floor(game.velocidad * dt);
        }
        else {
            dx = Math.ceil(game.velocidad * dt);            
        }
        game.pos += dx;
        if((game.pos < 100 && game.velocidad < 0 )|| (game.pos > 500 && game.velocidad > 0)) {
            game.velocidad = game.velocidad * -1;
        }
    },

    draw: function() {
        game.ctx.clearRect(0, 0, game.width, game.height);
        game.ctx.fillStyle = 'rgb(200,200,20)';
        game.ctx.beginPath();
        game.ctx.arc(game.pos, 100, 20, 0, Math.PI * 2, true );
        game.ctx.closePath();
        game.ctx.fill();

    }
}

window.addEventListener('resize', game.resize, false);
window.addEventListener('focus', game.resetLastFrame, false);