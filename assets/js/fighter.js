function Fighter(options){
	Object2D.call(this, options);

	this.width = 240;
	this.height = 300;
	this.jumping = false;

	this.think = false;

	this.attacks = {
		kick: {
			range: 250,
			damage: 10
		},
		punch: {
			range: 220,
			damage: 5
		}
	};

	this.charge = 0;

	this.combo = [];

	this.finish_him_played = false;

	this.coverShield = 5;
	this.shield = 0;

	this.maxHealth = 100;
	this.health = this.maxHealth;
	this.name = options.name;

	this.velocity = new Vector2();
	this.gravity = new Vector2();

	this.refreshHealth();
}
Fighter.prototype = new Object2D();

Fighter.prototype.jump = function(force) {
	if(!this.jumping){
		this.velocity.addSelf(force);
		this.jumping = true;
		this.gravity.set(0,0.2);
	}
};
Fighter.prototype.go = function(vec) {
	this.uncover();
	this.texture.switchAnimation("walking");
	this.velocity.x = vec.x;
};
Fighter.prototype.stop = function() {
	this.texture.switchAnimation("standing");
	if(!this.jumping)
		this.velocity.set(0,0);
};
Fighter.prototype.tryLand = function() {
	if(this.position.y + this.velocity.y*15 > game.zem){
		this.position.y = game.zem - this.height/2;
		this.velocity.set(0,0);
		this.gravity.set(0,0);
		this.jumping = false;
	}
};

Fighter.prototype.attack = function(type) {
	if(this.name == "god" && this.charge > 0)
		return;

	this.charge = 36;
	this.texture.switchAnimation(type);
	for(var i in game.children){
		var obj = game.children[i];
		if(obj instanceof Fighter && obj != this){
			if(this.name == "god"){
				if( obj.position.x >= this.position.x && obj.position.x <= this.position.x + this.attacks[type].range )
					obj.dealDamage(this.attacks[type].damage, this);
			}
			else {
				if( obj.position.x <= this.position.x && obj.position.x >= this.position.x - this.attacks[type].range )
					obj.dealDamage(this.attacks[type].damage, this);
			}
		}
	}
};

Fighter.prototype.cover = function() {
	if(this.shield != this.coverShield){
		this.shield = this.coverShield;
		this.texture.switchAnimation("cover")
	}
};
Fighter.prototype.uncover = function() {
	this.shield = 0;
	this.texture.switchAnimation("standing")
};

Fighter.prototype.tick = function() {
	if(!this.playing)
		return
	if(this.charge > 0){
		this.charge--;
	}
	
	this.velocity.addSelf( this.gravity )
	this.tryLand();
	this.position.addSelf( this.velocity );
	if(!(this.position.x > 0 && this.position.x < game.width))
		this.position.subSelf( this.velocity );
};

Fighter.prototype.dealDamage = function(dmg, murderer) {
	var _this = this;
	this.health -= dmg - this.shield;

	// krev
	var vlevo = (this.position.x < murderer.position.x) ? 1 : 0;
	game.links.particlesystem.emit(Particle, 100, {
		position: new Vector2().add(this.position, new Vector2((this.width/2)*Math.random() - this.width/4 ,(this.height/2)*Math.random() - this.height/4)),
		gravity: new Vector2(0,0.1),
		width: 5, height: 5,
		spin: 0.1,
		fade: 0.01,
		life: 3000
	}, {
		color: [new Color(0xFF0000), new Color(0xF23B16), new Color(0xB50000)],
		velocity: {
			x: {min: -10*(Math.random()-0.5), max: 10*(Math.random()-0.5)},
			y: {min: -3, max: -5}
		},
		rotation: { min: 0, max: Math.PI }
	});

	this.die(murderer);

	this.refreshHealth();
};

Fighter.prototype.refreshHealth = function() {
	if(this.name == "darwin")
		game.gui.links.hp_player.set( this.health/this.maxHealth );
	else
		game.gui.links.hp_enemy.set( this.health/this.maxHealth );
};

Fighter.prototype.die = function(murderer) {
	if(this.health <= 0 && !game.winner)
		game.totalWin(murderer.name);
};