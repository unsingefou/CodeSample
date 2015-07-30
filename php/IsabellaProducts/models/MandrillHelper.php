<?php

class Application_Model_MandrillHelper extends SF_Model_AbstractObject
{
	/*
	**  MandrillHelper attributes
	*/
	protected $apiKey;		// [apiKey]  		Unique key from mandrill account info@isabellaproducts.com
	

	/*
	**	Class constructor
	*/
	public function __construct(array $options = null)
	{
		$this->apiKey = 'voCTA8Qc5Mk6O8tYbSwZag';

		parent::__construct($options);
	}

	/**
	 * Send an email using predefind templates in Mandrill
	 * @param unknown $template_name - name of the template from Mandrill
	 * @param unknown $recipient - email address to send the email
	 */
	public function sendTemplate($template_name, $recipient, $global_merge_vars, $attachments = null){
		
		require_once (APPLICATION_PATH . '/../library/Mandrill.php'); //required for Mandrill to function
		$mandrill = new Mandrill($this->apiKey);
		
		//don't know why this is need, but just leaving simple info
		$template_content = array(
	        array(
	            'name' => 'example name',
	            'content' => 'example content'
	        )
	    );
		
		//only need the recipient email here
		$message = array(
				'to' => array(array('email' => $recipient, 'name' => $recipient)),
				'track_opens' => true,
				'track_clicks' => true,
				'merge'=> true,
				'global_merge_vars' => $global_merge_vars,
				'attachments' => $attachments
		);
		
		//all three parameters are required for sending an email from template.
		$mandrill->messages->sendTemplate($template_name, $template_content, $message);
		
	}
}
?>
