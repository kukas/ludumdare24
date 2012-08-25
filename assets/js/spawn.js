function Spawn(id,vec2,side){
	if(id == "crusader" || id == "Crusader"){
		game.add(new Crusader({owner:side,position:vec2}));
	}
	if(id == "skull" || id == "Skull"){
		game.add(new Skull({owner:side,position:vec2}));
	}
};