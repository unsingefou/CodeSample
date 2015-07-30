using UnityEngine;
using System.Collections;

public class MeleeMonsterTile : MonsterTile {

	public override void Start(){
		key = Type.MeleeMonster;
		match = Type.MeleeWeapon;
		player = GameObject.Find ("GameManager").GetComponent<Player>();

		switch(player.level){
		case 1:
		case 2:
		case 3:
			monsterList = new Entry[]{ 
				new Entry("Wolf", new Vector3(0f,.12f,0f))
			};
			break;
		case 4:
		case 5:
		case 6:
			monsterList = new Entry[]{ 
				new Entry("Wolf", new Vector3(0f,.12f,0f)), 
				new Entry("Cyclops", new Vector3(0f,.18f,0f))
			};
			break;
		case 7:
		case 8:
		case 9:
			monsterList = new Entry[]{ 
				new Entry("Wolf", new Vector3(0f,.12f,0f)), 
				new Entry("Cyclops", new Vector3(0f,.18f,0f)),
				new Entry("Yeti", new Vector3(0f,.18f,0f))
			};
			break;
		default:
			monsterList = new Entry[]{ 
				new Entry("Wolf", new Vector3(0f,.12f,0f)), 
				new Entry("Cyclops", new Vector3(0f,.18f,0f)),
				new Entry("Yeti", new Vector3(0f,.18f,0f)),
				new Entry("Dragon", new Vector3(0f,.18f,0f))
			};
			break;
		}
		parentIconPrefab("SwordIconPrefab");
		base.Start ();

	}
	/**
	 * Override the base so that we can provide a tip for the melee monster
	 * Then calls base method.
	 */
	public override void flip(){
		if(firstFlip)
			TipManager.setTip("You have found a " + monsterName + "!  Find the matching number of swords to fight him.");
		base.flip ();
	}
}
