var particle_options = {
    maxParticles: 20,
    size: 5,
    sizeRandom: 4,
    speed: 1,
    speedRandom: 1.2,
    // Lifespan in frames
    lifeSpan: 29,
    lifeSpanRandom: 7,
    // Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
    angle: 65,
    angleRandom: 34,
    startColour: [255, 255, 0, 1],
    startColourRandom: [48, 50, 45, 0],
    endColour: [245, 35, 0, 0],
    endColourRandom: [60, 60, 60, 0],
    // Only applies when fastMode is off, specifies how sharp the gradients are drawn
    sharpness: 20,
    sharpnessRandom: 10,
    // Random spread from origin
    spread: 10,
    // How many frames should this last
    duration: 10,
    // Will draw squares instead of circle gradients
    fastMode: true,
    gravity: { x: 0, y: 0.1 },
    // sensible values are 0-3
    jitter: 0
}

var particle_movement = {
     maxParticles: 50,
    size: 5,
    sizeRandom: 4,
    speed: 1,
    speedRandom: 1.2,
    // Lifespan in frames
    lifeSpan: 10,
    lifeSpanRandom: 7,
    // Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
    angle: 65,
    angleRandom: 34,
    startColour: [255, 255, 255, 1],
    startColourRandom: [255, 255, 255, 0],
    endColour: [255, 255, 255, 0],
    endColourRandom: [255, 255, 255, 0],
    // Only applies when fastMode is off, specifies how sharp the gradients are drawn
    sharpness: 20,
    sharpnessRandom: 10,
    // Random spread from origin
    spread: 10,
    // How many frames should this last
    duration: -1,
    // Will draw squares instead of circle gradients
    fastMode: true,
    gravity: { x: 0, y: 0.1 },
    // sensible values are 0-3
    jitter: 0   
}

Crafty.c('Grid', {
	init: function() {
		this.attr({
			w: game.map_grid.tile.width,
			h: game.map_grid.tile.height
		})
	},

	at: function(x, y) {
	   this.attr({
			x: x*game.map_grid.tile.width,
			y: y*game.map_grid.tile.height
		});
		return this;
	},
	setWidth: function(w) {
		this.w = w * game.map_grid.tile.width;
		return this;
	},

	setHeight: function(h) {
		this.h = h * game.map_grid.tile.height;
		return this;
	} 
});

Crafty.c('Actor', {
	init: function() {
		this.requires('2D, Canvas, Grid');
	}
});

Crafty.c('Plataforma', {
    _xi: 0,
    _yi: 0,
    _xf: 0,
    _yf: 0,
    //En pixeles sobre segundos
    _velocidadX: 0,
    _velocidadY: 0,

	init: function() {
		this.requires('Actor, Color')
			.color('black');
	},
    crearMovimiento: function(x, y, velocidadX, velocidadY) {
        this._xi = this._x;
        this._yi = this._y;
        this._xf = x * game.map_grid.tile.width;
        this._yf = y * game.map_grid.tile.height;

        this._velocidadX = velocidadX;
        this._velocidadY = velocidadY;

        this.bind('EnterFrame', function(data) {
            var dt = data.dt;
            var dx = Math.round(this._velocidadX * dt / 1000);
            var dy = Math.round(this._velocidadY * dt / 1000);

            this.x += dx;
            this.y += dy;
            if(this._x > this._xf && this._velocidadX >0 || this._x < this._xi && this._velocidadX<0) {
                this._velocidadX = this._velocidadX * -1;
            }
            if(this._y > this._yf &&  this._velocidadY >0 || this._y < this._yi && this._velocidadY <0) {
                this._velocidadY = this._velocidadY * -1;
            }
        });
        return this;
    }
});

Crafty.c('Trampa', {
    init: function () {
        this.requires('Plataforma, spr_spike')
            .color('#D8D8D8');
    }
});

/*
  Es la misma trampa. La única diferencia es el color y el sprite (un sprite en blanco).
*/
Crafty.c('Pared', {
    init: function() {
        this.requires('Trampa, spr_blank')
        .color('#FF0400');
    }
});

Crafty.c('Meta', {
    init: function() {
        this.requires('Trampa, spr_coin')
            .setWidth(1).setHeight(1);
    }
});

Crafty.c('Particula', {
  init: function() {
      this.requires('Actor, Particles');
  }
});

Crafty.c('PlayerCharacter', {
    //En pixeles/segundos
	velocidadMov: 350,
	velocidadSalto: 0,
    velocidadISalto: 400,
    _aceleracionSalto: 10,
	_flotando: false,
	_padre: null,
    _primerpadre: null,
    _rotacion: 0,
    //Offset con respecto a la propiedad x del padre
    _offsetX: 0,
    //Offset con respecto a la propiedad y del padre
    _offsetY: 0,
    _ubicacion: 1,
    _coordenada: {
        ARRIBA: 1,
        ABAJO: 2,
        IZQUIERDA: 3,
        DERECHA: 4
    },

	init: function() {
		this.requires('Actor, Color, Collision, Particles')
			.color('white')
            .onHit('Trampa', this.destruir)
            .origin('center')
			.bind("EnterFrame", this._mover)
			.bind('KeyDown', function(e) {
                if(e.key === Crafty.keys.ESC){
                    Crafty.pause();
                }
  				if(!this._saltando) {
    				if(e.key === Crafty.keys.SPACE) {
    					this._saltando = true;
                        Crafty.e('Particula').particles(particle_options).at(this._x/game.map_grid.tile.width, this._y/game.map_grid.tile.height);
                        Crafty.audio.play('jump');
                        this.velocidadSalto = this.velocidadISalto;
    					this.unbind('EnterFrame', this._mover);
    					this.bind('EnterFrame', this._saltar);
    				}
    			}
			});
        this.particles(particle_movement);
    },

    setPadre: function(padre) {
        if(!this._padre) {
          this._primerpadre = padre;
        }
        if(padre.has('Plataforma')) {
            this._padre = padre;
        }
        this._offsetX = this._x - this._padre._x;
        this._offsetY = this._y - this._padre._y;
        return this;
    },

    _mover: function(data) {
        var coordAnterior;
        var dt = data.dt;
        var dx = Math.round((this.velocidadMov*dt)/1000);

        this.rotation = this._rotation + 1*dt;

        if (this._rotation >= 360) {
          this.rotation = 0;
        }

        if(this._ubicacion === this._coordenada.ARRIBA || this._ubicacion === this._coordenada.ABAJO) {
            this._offsetX += dx;
            this.x = this._offsetX + this._padre._x;
            if(this._ubicacion === this._coordenada.ARRIBA) {
                this.y = this._padre._y - this._h;
            }
            else {
                this.y = this._padre._y + this._padre._h;
            }
        }
        else {
            this._offsetY += dx;
            this.y = this._offsetY + this._padre._y;
            if(this._ubicacion === this._coordenada.IZQUIERDA) {
                this.x = this._padre._x - this._w;
            }
            else {
                this.x = this._padre._x + this._padre._w;
            }
        }

        coordAnterior = this._ubicacion;
            if((this.velocidadMov > 0 && (
                ((this._offsetX >= this._padre._w) && ((this._ubicacion === this._coordenada.ARRIBA) || (this._ubicacion === this._coordenada.ABAJO))) 
                || ((this._offsetY >= this._padre._h) && ((this._ubicacion === this._coordenada.DERECHA) || (this._ubicacion === this._coordenada.IZQUIERDA))) 
                ))
            ||(this.velocidadMov < 0 && (
                ((this._offsetX <= - this._w) && ((this._ubicacion === this._coordenada.ARRIBA) || (this._ubicacion === this._coordenada.ABAJO)))
                || ((this._offsetY <= - this._h) && ((this._ubicacion === this._coordenada.DERECHA) || (this._ubicacion === this._coordenada.IZQUIERDA)))   
            ))) {
                this._flotando = true;
            }

        if(this._flotando) {
            if(this._ubicacion === this._coordenada.ARRIBA || this._ubicacion === this._coordenada.ABAJO) {
                if(this.velocidadMov > 0) {
                    this._ubicacion = this._coordenada.DERECHA;
                    this.x -= this._offsetX - this._padre._w;                     
                }
                else {
                    this._ubicacion = this._coordenada.IZQUIERDA;       
                    this.x += - this._w - this._offsetX;        
                }
            }
            else {
                if(this.velocidadMov > 0) {
                    this._ubicacion = this._coordenada.ABAJO;
                    this.y -= this._offsetY - this._padre._h;                     
                }
                else {
                    this._ubicacion = this._coordenada.ARRIBA;       
                    this.y += - this._h - this._offsetY;        
                }
            }
            if((((coordAnterior === this._coordenada.ARRIBA) || coordAnterior === this._coordenada.IZQUIERDA) && (this.velocidadMov < 0)) 
                || (((coordAnterior === this._coordenada.ABAJO)|| coordAnterior === this._coordenada.DERECHA) && (this.velocidadMov > 0))) {
                    this.velocidadMov = this.velocidadMov * -1;
            }
            this._flotando = false;
        }
    },

    _saltar: function(data) {
        var dt = data.dt;
        var dx = 0; 
        this._flotando = false;
        this.velocidadSalto += this._aceleracionSalto;
        dx = this.velocidadSalto * dt / 1000;
    	if(this._ubicacion === this._coordenada.ARRIBA || this._ubicacion === this._coordenada.ABAJO) {
    		if(this._y < this._padre._y) {
    			this.y -= dx;
    		}
    		else {
    			this.y += dx;
    		}
    	}
    	else {
    		if(this._x < this._padre._x) {
    			this.x -= dx;
    		}
    		else {
    			this.x += dx;
    		}
    	}

        var hit = this._buscarColision('Plataforma');
    	if(hit) {
      		this._saltando = false;
            this._detener(hit);
    	}
    },

    _detener: function(data) {
        this.setPadre(data);
        switch(this._ubicacion) { 
            case this._coordenada.ARRIBA:
                this._ubicacion = this._coordenada.ABAJO;
                this.y = this._padre._y + this._padre._h;
                break;
            case this._coordenada.ABAJO:
                this._ubicacion = this._coordenada.ARRIBA;
                this.y = this._padre._y - this._h;
                break;
            case this._coordenada.IZQUIERDA:
                this._ubicacion = this._coordenada.DERECHA;
                this.x = this._padre._x + this._padre._w;
                break;
            case this._coordenada.DERECHA:
                this._ubicacion = this._coordenada.IZQUIERDA;
                this._x = this._padre._x - this._w;
                break;
        }
        if(data.has('Trampa')) {
            this.destruir();
            return;
        }
        this._offsetX = this._x - this._padre._x;
        this._offsetY = this._y - this._padre._y;
		this.unbind('EnterFrame', this._saltar);
    	this.bind('EnterFrame', this._mover);
    },

    _buscarColision: function(componente) {
        var obj, hit = false,
            pos = this.pos(),
            q;

        //Aumentar en 1 para asegurar que map.search() encuentree la plataforma
        switch(this._ubicacion) {
            case this._coordenada.ARRIBA:
                pos._y++;
                break;
            case this._coordenada.ABAJO:
                pos._y--;
                break;
            case this._coordenada.DERECHA:
                pos._x--;
                break;
            case this._coordenada.IZQUIERDA:
                pos._x++;
        }

        pos.x = pos._x;
        pos.y = pos._y;
        pos.w = pos._w;
        pos.h = pos._h;

        q = Crafty.map.search(pos);
        obj = q[0];
        if (obj !== this && obj.has('Plataforma') && obj.intersect(pos)) {
            hit = obj;           
        }

        return hit;
    },
    destruir : function() {
        /*
          Y hacemos respawn... (No sé si será lo más eficiente)
        */
        this._visible = false;
        this._x = 30 * game.map_grid.tile.width +1;
        this._y = 30 * game.map_grid.tile.height +1;
        this.timeout(function() {
          this._x = 2 * game.map_grid.tile.width +1;
          this._y = 11 * game.map_grid.tile.height +1;
          this.setPadre(this._primerpadre);
          this.velocidadMov = Math.abs(this.velocidadMov);
          this._visible = true;
        }, 500);
    }
})