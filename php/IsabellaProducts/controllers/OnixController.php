<?php

/*
 * @Description - Parse Onix files and update the Database.  The Parse OnixAction is currently
 * the entry point for the parsing.  Pass the name of the onix feed as a parameter to the action
 * and the parseing and update of the DB will take place.
 * 
 * @Author Jonathan Levis jonathan.levis@isabellaproducts.com
 */

class OnixController extends Zend_Controller_Action {

    protected $partnerid = null;

    public function init() {
        $this->indexAction();
    }

    public function indexAction() {
        return;
    }

    /**
     * @description - Read the onix feed, based on the parameters, then parse it out accordingly.
     * The request must have the 'onixname' parameter.
     */
    public function parseonixAction() {
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender(TRUE);

        $params = $this->getRequest()->getParams();

        $xmlReader = new XMLReader();
        try {
            //open the xml file
            $xmlReader->open($_SERVER['DOCUMENT_ROOT'] . '/OnixFeeds/' . $params['onixname']);
            //read the entire xml
            while ($xmlReader->read()) {
                //read the sender identification information to look for onix name
                if ($xmlReader->name === 'Header' && $xmlReader->nodeType == XMLReader::ELEMENT) {
                    $this->readHeader($xmlReader);
                }

                //iterate over all product nodes, the and conditional is to assure we do not receive closing tags as well
                if ($xmlReader->name === 'Product' && $xmlReader->nodeType == XMLReader::ELEMENT) {
                    $this->readProduct($xmlReader);
                }
            }
            $xmlReader->close();
        } catch (Exception $e) {
            echo $e;
        }
    }
    
    /**
     * @description - Read the header tag and determine if we have enough information to parse it
     * 
     * @param object $xmlReader - xml reader that contains the xml data
     */
    public function readHeader($xmlReader) {
        $node = new SimpleXMLElement($xmlReader->readOuterXML());
        
        if(isset($node->Sender->SenderName)){
            $this->validateSender($node->Sender->SenderName->__toString());
        }else if(isset($node->senderidentifier->IDValue)){
            $this->validateSender($node->senderidentifier->IDValue->__toString());
        }else{
            echo 'Onix feed rejected becuase sender identification not found.</br>';
            exit;
        }
    }
    
    /**
     * @description - Validate the sender to make sure that they exist in our database before
     * processing the onix feed.
     * 
     * @param string $senderIdentifier - Sender identifier, either name or SAN number
     */
    public function validateSender($senderIdentifier){
        $partner_model = new Application_Model_Partner();
        
        $this->partnerid = $partner_model->getPartnerIdBySenderIdentifier($senderIdentifier);

        if ($this->partnerid === null) {
            echo $senderIdentifier . ' not found in the database, check to see if the Sender Identifier has changed.</br>';
            exit;
        } else {
            echo $senderIdentifier . ' found, continuing to parse Onix.</br>';
        }
    }
    
    /**
     * @description - Build a product array containing all of the required information from the ONIX feed.  Then examine the product
     * to determine whether to add, update, or remove it.
     * 
     * @param object $xmlReader - xml reader that contains the xml data
     */
    public function readProduct($xmlReader) {
        //read the xml for this product only
        $node = new SimpleXMLElement($xmlReader->readOuterXML());
        
        if(!$this->checkFormat($node->DescriptiveDetail)){
            echo 'Format not accepted.  Only epub and pdf at this time. </br>';
            return;
        }
        
        $product = array(
            'record' => $node->RecordReference->__toString(),
            'isbn' => $this->readISBN($node),
            'notificationType' => $node->NotificationType->__toString(),
            'title' => $this->readTitle($node->DescriptiveDetail->TitleDetail),
            'category' => $this->readCategory($node),
            'description' => $this->readDescription($node->CollateralDetail),
            'age' => $this->readAge($node->DescriptiveDetail),
            'type' => 4,
            'price' => $this->readPrice($node->SupplyDetail),
            'language' => $this->readLanguage($node->DescriptiveDetail),
            'authors' => $this->readAuthors($node->DescriptiveDetail),
            'tags' => 'null'//$this->readTags($node)
        );
        $this->examineProduct($product);
    }
    
    public function checkFormat($xml){
        $accepted = false;
        foreach ($xml->ProductFormDetail as $type){
            $detail = $type->__toString();
            if($detail === 'E101' || $detail === 'E107' || $detail === 'E201'){
                $accepted = true;
            }
        }
        return $accepted;
    }

    /**
     * @description - Examine the notification type of the product and call the appropriate method to add, 
     * update, remove, etc.
     * 
     * @param array $product - An associative array which contains all the data about the product
     */
    public function examineProduct($product) {

        if ($product['category'] !== null && $product['age'] !== null && $product['language'] !== null) {
            switch ($product['notificationType']) {
                case '02':
                    $this->addProduct($product);
                    break;
                case '03':
                case '04':
                    $this->updateProduct($product);
                    break;
                case '05':
                    $this->removeProduct($product);
                    break;
                case '89':
                //test record
                default:
                    break;
            }
        } else {
            echo 'One of the required fields is not set in the onix feed for '. $product['title'] . '</br>';
        }
    }

    /**
     * @description - Add a product to the DB and set the status according to the parameter passed.
     * 
     * @param array $product - An associative array which contains all the data about the product
     */
    public function addProduct($product) {
        $content_model = new Application_Model_Content();
        $existingContent = $content_model->getContentByIsbn($product['isbn']);

        if ($existingContent === null) {
            echo 'Adding ' . $product['title'] . '</br>';
            $content_model = new Application_Model_Content();
            $content = new Application_Model_ContentObject($product);
            /*
             * This is required when there is an onix feed that delivers real content
              $transferResult = $content_model->transferFiles($content, $partner);

              if($transferResult === null){
              die("Please try again.");
              } else if(!empty($transferResult)) {
              $content->setPackage($transferResult['package']);
              $content->setIcon($transferResult['icon']);
              $content->setSize($transferResult['size']);
              $content->setScreens($transferResult['screens']);
              } */

            $content->setStatus(1);
            $content->setShorttitle($content->getTitle());
            $content->setTemplate(0);
            $content->setPackage('To Be Uploaded');
            $content->setSize('To Be Uploaded');
            $content->setIcon('To Be Uploaded');
            $content->setScreens('To Be Uploaded');
            //partnerid is set in the readHeader() method, if the partner is found
            $content->setVid($this->partnerid);
            $content->setCreated(time());

            $id = $content_model->saveContent($content);

            $library_model = new Application_Model_Library();
            $newContent = $content_model->getContentById($id);

            $library_model->addContentToLibrary($newContent);
        } else {
            $this->updateProduct($product);
        }
    }

    /**
     * @description - Update an existing recrod of the product in the DB.
     * 
     * @param array $product - An associative array which contains all the data about the product
     */
    public function updateProduct($product) {
        $content_model = new Application_Model_Content();
        $existingContent = $content_model->getContentByIsbn($product['isbn']);

        if ($existingContent !== null) {
            echo('Updating ' . $product['title'] . '</br>');
        } else {
            $this->addProduct($product);
        }
    }

    /**
     * @description - Delete an existing recrod of the product from the DB.
     * 
     * @param array $product - An associative array which contains all the data about the product
     */
    public function removeProduct($product) {
        $content_model = new Application_Model_Content();
        $existingContent = $content_model->getContentByIsbn($product['isbn']);

        if ($existingContent !== null) {
            echo('Removing ' . $product['title'] . '</br>');
        }
    }
    
    public function readTitle($titleDetail){
        $title = null;
        foreach($titleDetail->TitleElement as $titleElement){
            if($titleElement->TitleElementLevel->__toString() === '01'){
               $title = $titleElement->TitleText->__toString();
               if(isset($titleElement->Subtitle)){
                   $title = $title . ': ' . $titleElement->Subtitle->__toString();
               }
            }
        }
        
        return $title;
    }

    /**
     * @description - Read the simple xml feed and parse out the audience, and map it to specific ages
     * 
     * @param string $xml - simple xml string
     * @return string - age rating for vizitme
     */
    public function readAge($xml) {
        if (isset($xml->AudienceRange)) {
            return $this->mapAge($xml->AudienceRange);
        }
        else if (isset($xml->Audience) && $xml->Audience->AudienceCodeValue->__toString() === '02') {
            return 'Everyone';
        } else {
            return null;
        }
    }

    /**
     * @description - Using the audiencerange element of the Onix feed, determine how the audience is defined and
     * return the properly mapped age.  Specifically look at the format of the audiencerange, either months, years, or grades.
     * 
     * @param string $audienceRange - audiencerange xml element
     * @return string - age range for vizitme or null
     */
    public function mapAge($audienceRange) {
        switch ($audienceRange->AudienceRangeQualifier->__toString()) {
            //the range is in months, automatically return the youngest age category
            case '16':
                return '3-5';

            //range is in years
            case '17':
                return $this->readAudienceRange($audienceRange, 'mapExactAge', 'mapRangeAge');

            //range is in grade levels

            case '11':
                return $this->readAudienceRange($audienceRange, 'mapExactGrade', 'mapRangeGrade');

            //not one of the proper mappings, return null
            default:
                return null;
        }
    }

    /**
     * @description - Determine if the audiencerange is an exact number or is an actual range with 'from' and 'to' 
     * elements.  Then call the appropriate mapping function.
     * 
     * @param string $audiencerange - audiencerange xml element
     * @param string $mapExactFunction - name of function to be used for mapping an exact audience
     * @param string $mapRangeFunction - name of function to be used for mapping a range
     * @return string - age range for vizitme or null
     */
    public function readAudienceRange($audienceRange, $mapExactFunction, $mapRangeFunction) {
        //audiencerange is exact with only one value
        if ($audienceRange->AudienceRangePrecision->__toString() === '01') {
            return $this->$mapExactFunction($audienceRange->AudienceRangeValue->__toString());
        }
        //audiencerange is an actual range with 'from' and 'to'
        else if ($audienceRange->AudienceRangePrecision->__toString() === '03') {
            $limits = array();
            foreach ($audienceRange->AudienceRangeValue as $limit) {
                $limits[] = $limit->__toString();
            }
            //the onix feed claims to be a range, but may not have the 'to' tag, check that here
            if (count($limits) > 1) {
                return $this->$mapRangeFunction($limits[0], $limits[1]);
            } else {
                return $this->$mapExactFunction($audienceRange->AudienceRangeValue->__toString());
            }
        }
        //range is of unknown type
        else {
            return null;
        }
    }

    /**
     * @description - Based on the single age value provided, map the value to one of the
     * Vizitme age ranges.  Convert the age value to an integer for evaluative purposes.
     * 
     * @param string $age - age value from the onix xml feed
     * @return string - proper age range in vizitme
     */
    public function mapExactAge($age) {
        $num = intval($age);
        if ($num <= 5) {
            return '3-5';
        } else if ($num <= 8) {
            return '6-8';
        } else {
            return '9+';
        }
    }

    /**
     * @description - Based on the 'from' and 'to' values provided, map the value to one of the
     * Vizitme age ranges.  Convert the parameter values to integers for evaluative purposes.
     * 
     * @param string $from - age starting value
     * @param string $to - age ending value
     * @return string - proper age range in vizitme
     */
    public function mapRangeAge($from, $to) {
        $from = intval($from);
        $to = intval($to);
        if ($from <= 5 && $to <= 5) {
            return '3-5';
        } else if ($from <= 5 && $to > 5) {
            return 'Everyone';
        } else if ($from <= 8 && $to <= 8) {
            return '6-8';
        } else if ($from <= 8 && $to > 8) {
            return 'Everyone';
        } else if ($from > 8) {
            return '9+';
        } else {
            return '9+';
        }
    }

    /**
     * @description - Based on the single grade value provided, map the value to one of the
     * Vizitme age ranges.  Convert the grade value to an integer for evaluative purposes.
     * 
     * @param type $grade - grade value from the onix xml feed
     * @return string - proper age range in vizitme
     */
    public function mapExactGrade($grade) {
        //check for chars first, then convert and check ranges
        if ($grade === 'P' || $grade === 'K') {
            return '3-5';
        } else {
            $num = intval($grade);
            if ($num <= 3) {
                return '6-8';
            } else {
                return '9+';
            }
        }
    }

    /**
     * @description - Based on the 'from' and 'to' values provided, map the value to one of the
     * Vizitme age ranges.  Convert the parameter values to integers for evaluative purposes.
     * 
     * @param string $from - grade starting value
     * @param string $to - grade ending value
     * @return string - proper age range in vizitme
     */
    public function mapRangeGrade($from, $to) {
        //check first for the characters
        if ($from === 'P' && $to === 'K') {
            return '3-5';
        }

        //$to has been evaluated as a character, now convert it to an int
        $to = intval($to);
        if ($from === 'P' && $to <= 1) {
            return '3-5';
        } else if ($from === 'P' && $to > 1) {
            return 'Everyone';
        } else if ($from === 'K' && $to <= 1) {
            return '3-5';
        } else if ($from === 'K' && $to > 1) {
            return 'Everyone';
        }

        //$from has been evaluated as a character, now convert it to an int
        $from = intval($from);
        if ($from <= 1 && $to <= 1) {
            return '3-5';
        } else if ($from <= 1 && $to > 1) {
            return 'Everyone';
        } else if ($from <= 3 && $to <= 3) {
            return '6-8';
        } else if ($from <= 3 && $to > 3) {
            return 'Everyone';
        } else if ($from > 3) {
            return '9+';
        } else {
            return '9+';
        }
    }

    /**
     * @description - Read the simple xml feed and parse out the subject, map it to Vizitme Category
     * 
     * @param string $xml - mainsubject element of the onix feed
     * @return string - language in Vizitme db
     * b253 - 1
     * b252 is the language
     * 
     */
    public function readLanguage($xml) {
        $languages = array();
        //iterate over every language tag
        foreach ($xml->Language as $language) {
            if ($language->LanguageRole->__toString() === '01') {
                $abbreviation = $language->LanguageCode->__toString();
                $language_model = new Application_Model_Language();
                $exists = $language_model->validateByAbbreviation($abbreviation);
                if ($exists) {
                    return $abbreviation;
                }
            }
        }
        return null;
    }

    /**
     * @description - Read the simple xml feed and parse out the subject, map it to Vizitme Category
     * 
     * @param string $xml - mainsubject element of the onix feed
     * @return int - integer of the categor in the Vizitme db corresponding to the BISAC subject codes
     */
    public function readCategory($xml) {
        //b069 is the main subject code in Onix feed
        $code = null;
        //check if mainsubject or subject exists
        if (isset($xml->Subject)) {
            $code = $xml->Subject->SubjectCode->__toString();
            return $this->mapOnixCategory($code);
        } else {
            return null;
        }
    }

    /**
     * @description - Use the string parameter to map the onix category to the vizitme category
     * 
     * @param string $code - onix code
     * @return int - vizitme category
     */
    public function mapOnixCategory($code) {
        $onixcategory_model = new Application_Model_Onixcategory();
        $onix_category = $onixcategory_model->getOnixCategoryByCode($code);

        //check if the category exists
        if ($onix_category !== null) {
            $categoryId = $onix_category->getCategoryId();
            return $categoryId;
        } else {
            return null;
        }
    }

    /**
     * @description - Read the simple xml feed and parse out and return only the price
     * 
     * @param string $xml - Supplydetails element of the onix feed.
     * @return string $p - price of the product in USD or null if none
     */
    public function readPrice($xml) {
        $p = null;
        //iterate over every price element of the supply detail element
        foreach ($xml->Price as $price) {
            //j152 is the type of currency, USD
            if ($price->CurrencyCode->__toString() === 'USD' && $price->CountryCode->__toString() === 'US') {
                $p = $price->PriceAmount->__toString();
            }
        }
        return $p;
    }

    /**
     * @description - Read the simple xml feed and parse out and return only the ISBN
     * 
     * @param string $xml - product element of the onix feed.
     * @return string $ISBN - ISBN of the product or null if none
     */
    public function readISBN($xml) {
        $ISBN = null;
        //iterate over element of the product element
        foreach ($xml->ProductIdentifier as $productIdentifier) {
            //b221 is the type of identifier, ISBN-13
            if ($productIdentifier->ProductIDType == '15') {
                $ISBN = $productIdentifier->IDValue->__toString();
            }
        }
        return $ISBN;
    }

    /**
     * @description - Read the simple xml feed and parse out and return only the authors.
     * Sometimes products have individual and corporate contributors.  Both are handled and returned.
     * 
     * @param string $xml - product element of the onix feed.
     * @return array $authors - Array of all contributing authors
     */
    public function readAuthors($xml) {
        $authors = array();
        //iterate over element of the product element
        foreach ($xml->Contributor as $contributor) {
            $authorFirstName = $contributor->NamesBeforeKey->__toString();
            $authorLastName = $contributor->KeyNames->__toString();
            //SHORT TAG
            $corporateContributer = $contributor->b047->__toString();

            //when both are not null, concatenate and add to authors
            if ($authorFirstName != null && $authorLastName != null) {
                $authors[] = $authorFirstName . ' ' . $authorLastName;
            } else if ($authorFirstName != null) {
                $authors[] = $authorFirstName;
            } else if ($authorLastName != null) {
                $authors[] = $authorLastName;
            }

            if ($corporateContributer != null) {
                $authors[] = $corporateContributer;
            }
        }
        return implode("::", $authors);
    }

    /**
     * @description - Read the simple xml feed and parse out and return an array of descriptive items.
     * 
     * @param string $xml - product element of the onix feed.
     * @return array $description - Associative array of all descriptive text including
     * the format.  01 - plain text or 02 - html
     */
    public function readDescription($collateralDetail) {
        $desc = array();
        //iterate over element of the product element
        foreach ($collateralDetail->TextContent as $textContent) {
            $type = $textContent->TextType->__toString();
            switch ($type) {
                case '01':
                    $desc['description'] = $textContent->Text->__toString();
                case '02':
                    $desc['short'] = $textContent->Text->__toString();
                case '03':
                    $desc['long'] = $textContent->Text->__toString();
                case '13':
                default:
                    break;
            }
        }
        //As long as the value is set, return the description.  Only one, becuase of priority
        if (isset($desc['description'])) {
            return $desc['description'];
        } else if (isset($desc['long'])) {
            return $desc['long'];
        } else if (isset($desc['short'])) {
            return $desc['short'];
        } else {
            return 'None';
        }
    }

    /**
     * @description - Read the simple xml feed and parse out and return only tags.
     * 
     * @param string $xml - product element of the onix feed.
     * @return string $tags - A string of all the tags delimited by ';'
     */
    public function readTags($xml) {
        //SHORT TAG
        $tags = null;
        //iterate over element of the product element
        foreach ($xml->Subject as $subject) {
            if ($subject->b067->__toString() == '20') {
                $tags = $subject->b070->__toString();
            }
        }
        return $tags;
    }

}
