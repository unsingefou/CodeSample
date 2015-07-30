package com.worlds;

import com.core.GUI;
import com.core.Player;
import com.core.TextControl;

public class World {
	GUI gui;
	TextControl app;
	Player player;
	
	public World(GUI g){
		this.gui = g;
		app = new TextControl(gui);
	}
	
	public Player play(Player p){
		return p;
	}
}
