package com.core;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.*;

import javax.swing.*;


public class Player {
	TextControl app;
	private GUI gui;
	private String name;
	private ArrayList<Item> inventory = new ArrayList<Item>();
	private int health = 100, mana = 100, sanity = 100, gold = 0;
	private JPanel playerPanel;
	JLabel nLabel = new JLabel("name");
	JLabel hLabel = new JLabel("Health:");
	JLabel mLabel = new JLabel("Mana:");
	JLabel sLabel = new JLabel("Sanity:");
	JLabel gLabel = new JLabel("Gold:");
	
	public Player(String n, GUI g){
		this.name = n;
		this.gui = g;
		app = new TextControl(gui);
		this.playerPanel = gui.getTopPanel();
		playerPanel.add(nLabel);
		playerPanel.add(hLabel);
		playerPanel.add(mLabel);
		playerPanel.add(sLabel);
		playerPanel.add(gLabel);
	    
		nLabel.setText(name);
		hLabel.setText("Health: " + String.valueOf(health));
		mLabel.setText("Mana: " + String.valueOf(mana));
		sLabel.setText("Sanity: " + String.valueOf(sanity));
		gLabel.setText("Gold: " + String.valueOf(gold));
	}

	public String getName(){
		return this.name;
	}
	public void addToInventory(Item item){
		//The section below uses the actual item object
		app.alert("You received: " + item.getName() + "\n");
		inventory.add(item);
		item.setOwner(this);
	}
	public void removeFromInventory(Item item){
		for(int i = 0; i<inventory.size(); i++){
			if(inventory.get(i).equals(item)){
				Item tempItem = (Item) inventory.get(i);
				inventory.remove(i);
			}
		}
	}
	public ArrayList getInventory(){
		return this.inventory;
	}

	public boolean searchInventory(String key){
		for(Item i : inventory){
			if(i.getName().equalsIgnoreCase(key)){
				return true;
			}
		}
		return false;
	}
	public int getHealth(){
		return this.health;
	}
	public void changeHealth(int h){
		health += h;
		
		if(health >= 100)
			health = 100;
		//System.out.println(health);
		app.alert(h + "hp\n");
		hLabel.setText("Health: " + String.valueOf(health));
		if(health <= 0){
			health = 0;
			app.alert("I'm sorry you have died.");
			gui.toggleTextField(false);
		}
	}
	public double getMana(){
		return this.mana;
	}
	public void changeMana(int m){
		mana += m;
		if(mana <= 0)
			mana = 0;
		if(mana >= 100)
			mana = 100;
		//System.out.println(mana);
		mLabel.setText("Mana: " + String.valueOf(mana));
	}
	public double getSanity(){
		return this.sanity;
	}
	public void changeSanity(int s){
		sanity += s;
		if(sanity <= 0)
			sanity = 0;
		if(sanity >= 100)
			sanity = 100;
		//System.out.println(sanity);
		sLabel.setText("Sanity: " + String.valueOf(sanity));
	}
	public double getGold(){
		return this.gold;
	}
	public void changeGold(int g){
		gold += g;
		//System.out.println(gold);
		gLabel.setText("Gold: " + String.valueOf(gold));
	}
}
