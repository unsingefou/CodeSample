package com.core;

import java.awt.Color;


public class TextControl {
	private GUI gui;
	private String userInput;
	private Color green = new Color(17, 91, 31);
	private Color orange = new Color(255, 90, 0);
	/**
	 * @param args
	 */
	public TextControl(GUI g){
		this.gui = g;
		this.userInput = gui.getUserInput();
	}
	public String getInput(){
		//if(GUI.inputText.isEnabled()){
		userPrompt();
		gui.setUserInput("");
		while(gui.getUserInput().equals("")){
			System.out.println("waiting for input");
		}
		pause(200);
		return gui.getUserInput();
		//}
		//else
	}
	public void print(String text){
		gui.appendToPane(text, Color.black);
	}
	public void alert(String text){
		gui.appendToPane(text, Color.red);
	}
	public void quote(String text){
		gui.appendToPane(text, green);
	}
	public void special(String text){
		gui.appendToPane(text, orange);
	}
	public void userPrompt(){
		gui.appendToPane("#", Color.blue);
	}
	public void pause(int miliseconds){
		try {
			Thread.sleep(miliseconds);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	


}
