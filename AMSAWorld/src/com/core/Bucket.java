package com.core;

public class Bucket extends Item {
	TextControl app;
	public Bucket (String n, GUI g){
		super(n, g);
		app = new TextControl(g);
	}

	@Override
	public void use() {
		if(name.equals("full bucket")){
			if(canUse){
				gui.setUserInput("dragonDefeated");
			}
			else{
				app.print("You pour the water onto the ground.  Such a waste.\n");
			}
			setName("empty bucket");
		}
		else{
			app.print("The bucket is empty, but it might make a great hat.\n");			
		}
	}
	public void fill(){
		if(name.equals("empty bucket")){
			app.print("You carefully fill the bucket to the brim.\n");
		}
		else{
			app.print("The bucket is already full!\n");
		}
		setName("full bucket");
	}

}
