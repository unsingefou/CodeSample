package com.core;

public abstract class Item {
	GUI gui;
	boolean canUse = false;
	String name;
	Player owner;

	public Item(String n, GUI g) {
		this.name = n;
		this.gui = g;
	}
	public Item(String n) {
		this.name = n;
	}

	public abstract void use();
	
	public String getName(){
		return this.name;
	}
	public void setOwner(Player p){
		this.owner = p;
	}

	public void drop(){
		owner.removeFromInventory(this);
	}
	public void setName(String n){
		this.name = n;
	}
	public void setcanUse(boolean f){
		this.canUse = f;
	}
	
}
