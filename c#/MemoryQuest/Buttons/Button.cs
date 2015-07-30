using UnityEngine;
using System.Collections;

public class Button : MonoBehaviour {
	protected Sprite defaultImg;
	public Sprite activeImg;
	public Sprite greyOutImg;
	protected Player player;
	protected AudioController audio;
	protected SpriteRenderer spriteRenderer;

	public virtual void OnMouseDown(){
		spriteRenderer.sprite = activeImg;
	}

	public virtual void OnMouseUp(){
		audio.playSound("button");
		spriteRenderer.sprite = defaultImg;
	}

	// Use this for initialization
	public virtual void Start () {
		player = GameObject.Find("GameManager").GetComponent<Player>();
		audio = GameObject.Find("FXController").GetComponent<AudioController>();
		spriteRenderer = gameObject.GetComponent<SpriteRenderer>();
		defaultImg = spriteRenderer.sprite;
	}
	public void setDefaultImg(){
		GetComponent<BoxCollider2D>().enabled = true;
		spriteRenderer.sprite = defaultImg;
	}
	public void setGreyImg(){
		GetComponent<BoxCollider2D>().enabled = false;
		spriteRenderer.sprite = greyOutImg;
	}
}
