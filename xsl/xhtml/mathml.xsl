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
                xmlns:mml="http://www.w3.org/1998/Math/MathML"
                xmlns:u="http://www.xmlmind.com/namespace/ditac"
                exclude-result-prefixes="mml u"
                version="2.0">

  <!-- mathml ============================================================ -->

  <xsl:template match="*[contains(@class,' mathml-d/mathml ')]">
    <!-- No HTML container having common attributes. -->

    <xsl:apply-templates/>
  </xsl:template>

  <!-- mathmlref ========================================================= -->

  <xsl:template match="*[contains(@class,' mathml-d/mathmlref ')]">
    <!-- No HTML container having common attributes. -->

    <xsl:variable name="math" select="u:loadElement(@href)"/>
    <xsl:if test="not($math/self::mml:math)">
      <xsl:message terminate="yes" 
        select="concat('cannot load an mml:math element from &quot;', @href, 
                       '&quot;.')"/>
    </xsl:if>

    <xsl:for-each select="$math">
      <xsl:call-template name="processMathML"/>
    </xsl:for-each>
  </xsl:template>

  <!-- mml:math =========================================================== -->

  <xsl:template match="mml:math">
    <xsl:call-template name="processMathML"/>
  </xsl:template>

</xsl:stylesheet>
