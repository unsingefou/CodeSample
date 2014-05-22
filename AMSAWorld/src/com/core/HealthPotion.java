package com.core;

public class HealthPotion extends Item{
	public HealthPotion(String n){
		super(n);
	}
	
	public void use(){
		owner.changeHealth(50);
		drop();
	}

}
