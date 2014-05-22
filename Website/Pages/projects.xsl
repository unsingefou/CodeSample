<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:include href="../utilities/master.xsl"/>
<xsl:include href="../utilities/projectNaviation.xsl"/>
<xsl:include href="../utilities/footer.xsl"/>

<xsl:template match="data">
        <div class="projectWrapper">
        	<div class="projectMenu">
            	<a href="/projects" style="text-decoration: none"><h1>Projects</h1></a>
                <xsl:apply-templates select="projectmenu"/>
            </div>
          
            <div class="projectPanel">
                <xsl:apply-templates select="projectdata"/>
                <xsl:if test="$current-path = '/projects'">
                    <div class="imageWrapper">
                        <div class="imagine">
                        	<div class="imageText">verb: to form mental images of things not present to the senses; to
                                form a concept<br/><br/>Any good idea starts by listening. Asking questions and learning about
                                the industry helps to identify the needs so that a real solution can
                                be built.
                            </div>
                        </div>
                        <div class="design">
                        	<div class="imageText">verb: to prepare the preliminary sketch or the plans for a work to be executed
                            	<br/><br/>Creative juices start flowing to produce a design that is both user-friendly and visually-pleasing.
                            </div>
                        </div>
                        <div class="code">
                        	<div class="imageText">verb: to translate a design into language that can be communicated to the computer.
                            	<br/><br/> Coding is the nuts and bolts behind a successful design. Throw me some
								Javascript, PHP, XSLT, CSS ... I love it all.
                            </div>
                        </div>
                    </div>
                    
                </xsl:if>
            </div>
      
        </div>
        <xsl:call-template name="footer"/>
</xsl:template>

<xsl:template match="projectdata">
            <xsl:for-each select="entry">
                <div class="project">
                    <xsl:attribute name="id"><xsl:value-of select="title"/></xsl:attribute>
                    <h1><xsl:value-of select="title"/></h1>
                    <xsl:if test="$current-path = '/projects/vce'">
                    	<iframe class="video" src="//player.vimeo.com/video/80408271?title=0&amp;byline=0&amp;portrait=0&amp;color=3399ff" width="600" height="338">
                        </iframe>
                        <div class="videoCaption">A narrated demo of the product developed for VCE</div>
                        <div class="hdButton"><a href="http://vimeo.com/80408271" target="_blank">Watch in HD now</a></div> 
                        
                    </xsl:if>
                    <xsl:if test="$current-path = '/projects/ninja'">
                        <script type="text/javascript">
    						swfobject.embedSWF("/workspace/images/NinjaWarriorWebsite.swf", "flashContent", "640", "480", "9.0.0");
    					</script>
                        <div id="flashContent">
                        	<img src="/workspace/images/ninjaAlternate.png" alt="ninjaScreenshot" height="300" width="400"/>
                            <p>Please use a flash enabled device to play Ninja Warrior</p>
                        </div>
					</xsl:if>
                    <xsl:if test="image != ''">
                        <img class="projectImage" alt="project image">
                            <xsl:attribute name="src">
                                <xsl:value-of select="$root"/>/workspace/images/<xsl:value-of select="image/filename"/>
                            </xsl:attribute>
                        </img>
                    </xsl:if>
                    <h2>Concept</h2>
                    <xsl:value-of select="concept"/>
                    <h2>Design</h2>
                    <xsl:value-of select="design"/>
                    <h2>Code</h2>
                    <xsl:for-each select="code/item">
                    	<div class="codeItem"> <xsl:value-of select="."/></div>
                    </xsl:for-each>
                   <!-- <xsl:value-of select="code"/><br/>-->
                </div>
            </xsl:for-each>
</xsl:template>

</xsl:stylesheet>