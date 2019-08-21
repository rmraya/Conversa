<?xml version="1.0" encoding="UTF-8"?>
<!--
| Copyright (c) 2018 XMLmind Software. All rights reserved.
|
| Author: Hussein Shafie
|
| This file is part of the XMLmind DITA Converter project.
| For conditions of distribution and use, see the accompanying LEGAL.txt file.
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:fo="http://www.w3.org/1999/XSL/Format"
                version="2.0">

  <!-- audio ============================================================= -->
 
  <xsl:template match="*[contains(@class,' media-d/audio ')]">
    <xsl:call-template name="processMediaDesc"/>
  </xsl:template>

  <!-- video ============================================================= -->
 
  <xsl:template match="*[contains(@class,' media-d/video ')]">
    <xsl:call-template name="processMediaDesc"/>
  </xsl:template>

  <xsl:template name="processMediaDesc">
    <xsl:variable name="source" 
      select="normalize-space(./*[contains(@class,' media-d/media-source ')][1]/@value)"/>

    <xsl:call-template name="processObjectDesc">
      <xsl:with-param name="download" select="$source"/>
    </xsl:call-template>
  </xsl:template>

</xsl:stylesheet>
