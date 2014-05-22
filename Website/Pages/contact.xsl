<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:include href="../utilities/master.xsl"/>
<xsl:include href="../utilities/footer.xsl"/>

<xsl:template match="data">
	<div class="contactWrapper">
        <div class="contactTitle" id="contactTitle">Drop me a note.</div>
        <form class="form" name="contactForm" id="contactForm">
			<div id="showHide">
                <input type="text" name="nameBox" class="inputBox" placeholder="name"/>  
                <div class="requiredOff" id="name">name is a required field</div>
                <input type="text" name="emailBox" class="inputBox" placeholder="email"/>
                <div class="requiredOff" id="email">email is a required field</div>
                <input type="text" name="phoneBox" class="inputBox" placeholder="phone"/> 
                <textarea name="messageBox" class="textArea" placeholder="message"></textarea>
                <div class="requiredOff" id="message">message is a required field</div>
            </div>
            <div class="emailButton" id="emailButton" onClick="validateForm()">
            	<div class="emailButtonText" id="emailButtonText">send</div>
            </div>
        </form>
    </div>
    <xsl:call-template name="footer"/>  
</xsl:template>

</xsl:stylesheet>