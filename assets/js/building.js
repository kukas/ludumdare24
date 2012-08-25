function Building(options){
	Object2D.call(this, options);
}
Building.prototype = new Object2D();

Building.prototype.dealDamage = function (obj){
	if(this.armed){
		if(this.lastdeal !== undefined){
			if(this.lastdeal >= this.cadency){
				obj.health-=this.damage;
				console.log("dealing damage");
				if(obj.health <= 0){console.log("died");
					game.remove(obj);
				}
				this.lastdeal = 0;
			}
			else{
				this.lastdeal++;
			}
		}	
		else{
			obj.health-=this.damage;
			console.log("dealing damage");
			if(obj.health <= 0){console.log("died");
				game.remove(obj);
			}
			this.lastdeal = 0;
		}
	}
};