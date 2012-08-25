function Building(options){
	Object2D.call(this, options);
}
Building.prototype = new Object2D();

Building.prototype.dealDamage = function (dmg, murderer){
	murderer = murderer === undefined ? this : murderer;
	this.health -= dmg;
	// třísky
	var vlevo = (this.position.x > murderer.position.x) ? 1 : 0;
	game.links.particlesystem.emit(Particle, 10, {
		position: new Vector2().copy(this.position),
		gravity: new Vector2(0,0.1),
		width: 5, height: 5,
		shrink: 0.98,
		spin: 0.1,
		// fade: 0.017,
	}, {
		color: [new Color(0xFF8C3B), new Color(0xFFCB3B), new Color(0xFFF83B)],
		velocity: {
			x: {min: -2, max: 2},
			y: {min: -2, max: -1.5}
		},
		rotation: { min: 0, max: Math.PI }
	});

	this.die(murderer);
};

Building.prototype.die = function( murderer ) {
	// console.log(murderer)
	murderer.unfreeze();
	if(this.health <= 0){
		game.remove(this);
	}
};
