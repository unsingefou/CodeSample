using UnityEngine;
using System.Collections;

public class PlayButton : Button {

	public override void OnMouseUp(){
		GameStateManager.triggerGameStart();
		base.OnMouseUp();
	}
}
