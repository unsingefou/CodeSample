using UnityEngine;
using System.Collections;

public class Tile : MonoBehaviour {
	public enum Type {RangedMonster, RangedWeapon, MeleeMonster, MeleeWeapon, Key, Chest, Lever, Door, Gem, Pick, Empty, None};
	//public Vector3 position;
	public Type key;
	public Type match;
	public Sprite frontImage;
	public Sprite backImage;
	public int count = 0;
	public bool isFaceDown = true;
	public bool firstFlip = true;
	SpriteRenderer spriteRender;
	protected Animator animator;
	public float waitFail = 2.0f;
	public float waitMatch = 1.0f;
	public SelectionManager selectionManager;
	public DungeonManager dungeonManager;

	//private float textOffsetx = Screen.width * 0.00035f;		//some sort of percentage of the width should be used for placement
	//private float textOffsety = Screen.height * 0.00015f * -1f;
	private TextMesh childText;
	private MeshRenderer childRenderer;
	protected Animator childAnimator;
	protected Transform childAnimationPrefab;
	protected Vector3 childAnimationOffset;
	protected string pathToPrefab = "";
	protected SpriteRenderer childIconRenderer;
	protected string pathToInfoText = "Prefabs/InfoTextPrefab";
	protected TipManager TipManager;
	protected Player player;
	protected Transform dropPrefab;
	protected AudioController audio;

	// Use this for initialization
	public virtual void Start () {
		selectionManager = GameObject.Find ("GameManager").GetComponent<SelectionManager>();
		dungeonManager = GameObject.Find ("GameManager").GetComponent<DungeonManager>();
		TipManager = GameObject.Find ("GameManager").GetComponent<TipManager>();
		player = GameObject.Find ("GameManager").GetComponent<Player>();
		spriteRender = this.gameObject.GetComponent<SpriteRenderer>();
		animator = this.gameObject.GetComponent<Animator>();
		//animator.enabled = false;  //atempt to turn off animations when not needed

		if(pathToPrefab.Length > 0)
			parentAnimationPrefab (pathToPrefab);

		//if(childAnimationPrefab != null)

		particleSystem.renderer.sortingLayerName = "Foreground";
		setImage(backImage);

		transform.name = this.GetType().Name;
		audio = GameObject.Find("FXController").GetComponent<AudioController>();
	}

	// Update is called once per frame
	void Update () {
		if(Input.GetButtonDown("Jump")){
			flip ();
		}
	}

	public virtual void OnMouseDown(){
		if(player.spyGlass != null){
			StartCoroutine(spyGlassFlip());
		}
		else if (player.fireball != null){
			if(key != Type.Door && key != Type.Lever){
				fireballDestroy();
				player.fireball.remove();
			}
		}
		else{
			if(isFaceDown){
				if(selectionManager.setSelection(this))
					flip ();
			}  
			else{
				//print ("can't do that now");
			}
		}
	}

	/**
	 * Checks for a match based on the keys 
	 * other - tile that is currently being checked against this one
	 * returns - ture when there is a match, false otherwise
	 */
	public virtual bool isMatch(Tile other){
		if(match == other.getKey()){
			return true;
		}
		else{
			return false;
		}
	}
	/**
	 * When there is a match disable children text and add one to the tile cleared count
	 */
	public virtual void onMatch(){
		//isFaceDown = true;
		enabledChildTextMesh(false);
		dungeonManager.tilesCleared++;
	}
	/**
	 * When it does not match, flip it back over
	 */
	public virtual void onFail(){
		//StartCoroutine(flipPause(1.0f));
	}
	/**
	 * Start the flip animation and set the firstFlip var to false
	 */
	public virtual void flip(){
		//audio.playSound("flip");
		//animator.enabled = !animator.enabled;  //atempt to turn off animations when not needed
		isFaceDown = !isFaceDown;
		if(animator != null)
			animator.SetTrigger("flipTrigger");
		if(firstFlip)
			firstFlip = false;
	}
	/**
	 * Based on the state of the image, change the background of the tile and
	 * enable or disable children and text
	 */
	public void flipImage(){
		if(isFaceDown){
			setImage (backImage);
			enabledChildTextMesh(false);
			toggleChild (false);
		}
		else{
			setImage (frontImage);
			enabledChildTextMesh(true);
			toggleChild(true);
		}
	}
	/**
	 * Each tile has a child animation, this will disable/enable the animator and render of that child
	 */
	public virtual void toggleChild(bool value){
		Transform child = transform.FindChild("childAnimation");
		if(child != null){
			//child.gameObject.SetActive(value);
			SpriteRenderer childRend = child.gameObject.GetComponent<SpriteRenderer>();
			childRend.enabled = value;
			Animator childAnim = child.gameObject.GetComponent<Animator>();
			childAnim.enabled = value;
		}
	}

	public void setImage(Sprite img){
		spriteRender.sprite = img;
	}
	public void setFront(Sprite img){
		this.frontImage = img;
	}
	public void setBack(Sprite img){
		this.backImage = img;
	}
	public Type getKey(){
		return this.key;
	}
	public void setKey(Type t){
		this.key = t;
	}
	public void setMatch(Type t){
		this.match = t;
	}
	public virtual void setCount(int num){
		count = num;
	}

	/**
	 * Parent a text object to the tile
	 */
	public void addText(){
		childText = gameObject.GetComponentInChildren<TextMesh>();
		childText.text = count.ToString();
		childRenderer = childText.gameObject.GetComponent<MeshRenderer>();
		childRenderer.enabled = false;
	}
	/**
	 * Enable/disable the child text
	 * b - visible or not, true or false
	 */
	public void enabledChildTextMesh(bool b){
		if(childRenderer != null)
			childRenderer.enabled = b;
	}
	/**
	 * Coroutine that will flip over a tile wait, and then flip back
	 */
	public IEnumerator spyGlassFlip() {
		flip ();
		player.spyGlass.remove ();
		yield return new WaitForSeconds(player.spyGlass.waitTime);
		flip ();
	}
	/**
	 * Parent the animation to the tile object
	 * path - the path to the child animation prefab, should always be in resources folder
	 */
	public Transform parentAnimationPrefab(string path){
		Transform child = (Transform)Instantiate(Resources.Load<Transform>(path));
		child.parent = this.transform;
		child.name = "childAnimation";
		childAnimationPrefab = child;
		child.localPosition = childAnimationOffset;
		//child.localPosition = new Vector3(0f, 0f, 0f);
		childAnimator = child.gameObject.GetComponent<Animator>();
		return child;
	}
	/**
	 * Parent the icon to the tile object
	 * path - the path to the icon prefab, should always be in resources folder
	 */
	public void parentIconPrefab(string path){
		Transform child = (Transform)Instantiate(Resources.Load<Transform>(path));
		child.parent = this.transform;
		child.name = "childIcon";
		child.localPosition = new Vector3(0f, 0f, -.01f);
		childIconRenderer = child.gameObject.GetComponent<SpriteRenderer>();
	}
	IEnumerator flipPause(float time){
		yield return new WaitForSeconds(time);
		if(!isFaceDown){
			flip ();
			selectionManager.resetSelect();
		}
	}
	/**
	 * Instantiates an info text object from the resouces folder
	 */
	public void genInfoText(string type, string text){
		Transform prefab = (Transform)Instantiate(Resources.Load<Transform>(pathToInfoText));
		InfoText infoText = prefab.GetComponent<InfoText>();
		infoText.setup(transform.localPosition, text, type);
	}
	public void toggleCollider(){
		BoxCollider2D collider = GetComponent<BoxCollider2D>();
		collider.enabled = !collider.enabled;
	}
	public Drop dropItem(string[] dropList){
		Vector3 dropVector = new Vector3(transform.position.x, transform.position.y, -1f);
		Transform itemTransform = (Transform)Instantiate(dropPrefab, dropVector, transform.rotation);
		int rand;
		if(dropList.Length > 1)
			rand = Random.Range(0, dropList.Length);
		else
			rand = 0;
		Drop drop = (Drop)itemTransform.gameObject.AddComponent(dropList[rand]);
		//drop.level = count;
		return drop;
	}
	public void fireballDestroy(){
		setImage(frontImage);
		isFaceDown = false;
		particleSystem.Play();
		selectionManager.removeFromSelection(this.transform);
		enabledChildTextMesh(false);
		toggleChild(false);
		Destroy (childAnimationPrefab.gameObject);
		dropItem (new string[]{"GreenGemDrop"});
		print ("image should have changed!");
	}
}
