function Spawn(con,x,side, price){
	if(con !== undefined){
		if(con == Jesus || con == Trex || con == Terese || con == Wallace){
			if(game.players[side].hero){
				game.gui.links.alert.alert("You can produce only one hero!")
				return false;
			}
			else {
				game.players[side].hero = true;
			}
		}
		var obj = new con({});
		obj.position = new Vector2(x,game.links.terrain.getHeight(x)-obj.height/2)
		obj.owner = side;
		obj.price = price;
		if(side == "enemy"){
			obj.texture.flip = "x";
			obj.selectable = false;
			game.ai.property.push(obj)
		}
		else{
			obj.spawnSound.play();
		}
		game.add(obj);
		
	}
};