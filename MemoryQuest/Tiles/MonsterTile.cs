using UnityEngine;
using System.Collections;

public class MonsterTile : Tile {
	protected int xpValue = 5;
	protected int gemValue = 1;
	//protected Sprite[] monsterSprites;
	//protected object[,] monsterList1;
	protected Entry[] monsterList;
	protected bool isaggro = false;
	protected string monsterName;
	protected string[] dropList = {"HeartDrop", "GreenGemDrop"};

	public override void Start(){
		dropPrefab = Resources.Load<Transform> ("Prefabs/DropPrefab");
		genRandomMonster();
		addText();
		base.Start ();
	}
	/**
	* Overrides the super isMatch, becuase with monsters the count must also be checked
	* other - tile for comparison
	*/
	public override bool isMatch(Tile other){
		if(match == other.getKey() && count == other.count){
			return true;
		}
		else{
			return false;
		}
	}
	/**
	 * When it does not match, check to see if the monster is agroed.  If it is attack the player, otherwise, 
	 * make it agro.  Then calls the base class
	 */
	public override void onFail(){
		if(isaggro){
			genInfoText("Heart", "-" + count);
			player.setHealth(-count);
		}
		else{
			isaggro = true;
			childAnimator.SetTrigger("aggro");
		}
		base.onFail ();
	}
	/**
	 * When matched, show a tip indicated so, then increase kill count, play the particles, give the player
	 * xperience, and disable the child animator.  Then calls the base class
	 */
	public override void onMatch(){
		audio.playSound("killMonster");
		TipManager.setTip("Nice job! You defeated the " + monsterName + "!");
		dungeonManager.killCount++;
		particleSystem.Play();
		player.addXp(xpValue);
		player.totalKills++;
		int num = Random.Range (0, 100);
		if(num > 33)
			dropItem (dropList);
		//genInfoText("Gem", "+" + gemValue);
		//player.setGems(gemValue);
		toggleChild(false);
		Destroy (childAnimationPrefab.gameObject);
		base.onMatch ();
	}
	/**
	 * Generates a random monster from the monster list.
	 */
	public void genRandomMonster(){
		int monsterIndex = Random.Range (0, monsterList.Length);
		//monsterName = (string)monsterList1[monsterIndex, 0];
		monsterName = monsterList[monsterIndex].mName;
		pathToPrefab = "Tiles/Monsters/" + monsterName + "/" + monsterName + "Prefab";

		//childAnimationOffset = (Vector3)monsterList1[monsterIndex, 1];
		childAnimationOffset = monsterList[monsterIndex].mOffset;
	}
	/**
	 * Override the base because we also need to disable the icon renderer as well
	 */
	public override void toggleChild(bool value){
		childIconRenderer.enabled = value;
		base.toggleChild(value);
	}
	public override void setCount(int num){
		xpValue = count * 3;
		base.setCount(num);
	}
	public int generateCount(Player player){
		int count;
		if(player.level == 1)
			count = 1;
		else
			count = (int)(player.level *.5f);
		count = Random.Range(1, count+1);
		return count;
	}
	protected struct Entry{
		public string mName;
		public Vector3 mOffset;
		
		public Entry(string name, Vector3 offset){
			mName = name;
			mOffset = offset;
		}
	}
}
