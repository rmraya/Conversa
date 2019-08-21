<?xml version="1.0" encoding="UTF-8"?>
<!--
| Copyright (c) 2017 XMLmind Software. All rights reserved.
|
| Author: Hussein Shafie
|
| This file is part of the XMLmind DITA Converter project.
| For conditions of distribution and use, see the accompanying LEGAL.txt file.
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns="http://www.w3.org/1999/xhtml"                
                xmlns:svg="http://www.w3.org/2000/svg"
                xmlns:u="http://www.xmlmind.com/namespace/ditac"
                exclude-result-prefixes="svg u"
                version="2.0">

  <!-- svg-container ===================================================== -->

  <xsl:template match="*[contains(@class,' svg-d/svg-container ')]">
    <!-- No HTML container having common attributes. -->

    <xsl:apply-templates/>
  </xsl:template>

  <!-- svgref ============================================================ -->

  <xsl:template match="*[contains(@class,' svg-d/svgref ')]">
    <!-- No HTML container having common attributes. -->

    <xsl:variable name="svg" select="u:loadElement(@href)"/>
    <xsl:if test="not($svg/self::svg:svg)">
      <xsl:message terminate="yes" 
        select="concat('cannot load an svg:svg element from &quot;', @href, 
                       '&quot;.')"/>
    </xsl:if>

    <xsl:for-each select="$svg">
      <xsl:call-template name="processSVG"/>
    </xsl:for-each>
  </xsl:template>

  <!-- svg:svg =========================================================== -->

  <xsl:template match="svg:svg">
    <xsl:call-template name="processSVG"/>
  </xsl:template>

</xsl:stylesheet>
