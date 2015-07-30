<?php

class Application_Model_MailchimpHelper extends SF_Model_AbstractObject
{
	/*
	**  MailchipmHelper attributes
	*/
	protected $apiKey;		// [apiKey]  		Unique key from mandrill account info@isabellaproducts.com

	/*
	**	Class constructor
	*/
	public function __construct(array $options = null)
	{
		$this->apiKey = '3c3c2f04ed006e2c5cd6e6145800e9f7-us10';
		
		parent::__construct($options);
	}
	
	/**
	 * 
	 * @param unknown $list_id string - id of the list in mailchimp
	 * @param unknown $email string - email of the user to add
	 * @param unknown $merge_vars associative array - properties for the user fields
	 * @param unknown $optin boolean - send opt-in email
	 * @param unknown $send_welcome boolean - send welcome email
	 * @return mixed
	 */
	public function subscribe_to_list($list_id, $email, $merge_vars){
		require_once (APPLICATION_PATH . '/../library/Mailchimp.php');
		
		$mailchimp = new Mailchimp($this->apiKey);
		//$Mailchimp_Lists = new Mailchimp_Lists( $mailchimp );

		$result = $mailchimp->call('lists/subscribe', array(
                'id'                => $list_id,
                'email'             => array('email'=>$email),
                'merge_vars'        => $merge_vars,
                'double_optin'      => false,
                'update_existing'   => true,
                'replace_interests' => false,
                'send_welcome'      => false,
            ));
		return $result;
	}
	
	
	public function update_user_info($list_id, $email, $merge_vars){
		require_once (APPLICATION_PATH . '/../library/Mailchimp.php');
		$mailchimp = new Mailchimp($this->apiKey);
		
		$result = $mailchimp->call('lists/updateMember', array(
				'id'                => $list_id,
				'email'             => array('email'=>$email),
				'merge_vars'        => $merge_vars
		));
		return $result;
	}
}
?>
