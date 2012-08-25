function Spawn(con,vec2,side){
	if(con !== undefined){
		var obj = new con({position:vec2,owner:side})
		game.add(obj);
		obj.spawnSound.play();
	}
};