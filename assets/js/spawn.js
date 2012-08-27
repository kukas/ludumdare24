function Spawn(con,x,side, price){
	if(con !== undefined){
		if((con == Jesus || con == Trex || con == Terese || con == Wallace) && game.players[side].hero)
			console.log("IMPASSIBRU");
			return false;
		var obj = new con({});
		obj.position = new Vector2(x,game.links.terrain.getHeight(x)-obj.height/2)
		obj.owner = side;
		obj.price = price;
		if(side == "enemy"){
			obj.texture.flip = "x";
			game.ai.property.push(obj)
		}
		else{
			obj.spawnSound.play();
		}
		game.add(obj);
		
	}
};