<?xml version="1.0" encoding="UTF-8"?>
<!--
| Copyright (c) 2017 XMLmind Software. All rights reserved.
|
| Author: Hussein Shafie (hussein@xmlmind.com)
|
| This file is part of the XMLmind DITA Converter project.
| For conditions of distribution and use, see the accompanying LEGAL.txt file.
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                xmlns:fo="http://www.w3.org/1999/XSL/Format"
                exclude-result-prefixes="xs"
                version="2.0">
  
  <!-- imagemap ========================================================== -->

  <xsl:attribute-set name="imagemap"
                     use-attribute-sets="display-style split-border-style">
  </xsl:attribute-set>

  <xsl:attribute-set name="imagemap-list" use-attribute-sets="block-style">
    <xsl:attribute
      name="keep-with-previous.within-column">always</xsl:attribute>
    <xsl:attribute name="keep-together.within-column">always</xsl:attribute>
    <xsl:attribute
        name="provisional-distance-between-starts">3em</xsl:attribute>
    <xsl:attribute name="provisional-label-separation">0.5em</xsl:attribute>
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' ut-d/imagemap ')]">
    <fo:block xsl:use-attribute-sets="imagemap">
      <xsl:call-template name="commonAttributes"/>
      <xsl:call-template name="displayAttributes"/>

      <!-- Content model is: image, area+ -->
      <xsl:apply-templates select="*[contains(@class,' topic/image ')]"/>

      <xsl:if test="$show-imagemap-links eq 'yes'">
        <xsl:variable name="liveAreas"
          select="*[contains(@class,' ut-d/area ') and 
                    exists(./*[contains(@class,' topic/xref ') and
                               normalize-space(@href) ne '' and 
                               normalize-space(@href) ne '???'])]"/>

        <xsl:if test="exists($liveAreas)">
          <fo:list-block xsl:use-attribute-sets="imagemap-list">
            <xsl:apply-templates select="$liveAreas"/>
          </fo:list-block>
        </xsl:if>
      </xsl:if>
    </fo:block>
  </xsl:template>

  <!-- area, shape, coords =============================================== -->

  <xsl:attribute-set name="area">
    <xsl:attribute name="relative-align">baseline</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="area-callout">
    <xsl:attribute name="font-family">sans-serif</xsl:attribute>
    <xsl:attribute name="font-size">0.8em</xsl:attribute>
    <xsl:attribute name="font-weight">bold</xsl:attribute>
    <xsl:attribute name="font-style">normal</xsl:attribute>
    <xsl:attribute name="text-decoration">none</xsl:attribute>
    <xsl:attribute name="background-color">black</xsl:attribute>
    <xsl:attribute name="color">white</xsl:attribute>
    <xsl:attribute name="padding">0.1em</xsl:attribute>
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' ut-d/area ')]">
    <xsl:variable name="href"
      select="normalize-space(./*[contains(@class,' topic/xref ')]/@href)"/>

    <xsl:if test="$href ne '' and $href ne '???'">
      <fo:list-item xsl:use-attribute-sets="area">
        <fo:list-item-label end-indent="label-end()">
          <fo:block text-align="end">
            <fo:inline xsl:use-attribute-sets="area-callout">
              <xsl:number level="single" format="1"
                count="*[contains(@class,' ut-d/area ') and 
                         exists(./*[contains(@class,' topic/xref ') and
                                    normalize-space(@href) ne '' and 
                                    normalize-space(@href) ne '???'])]" />
            </fo:inline>
          </fo:block>
        </fo:list-item-label>

        <fo:list-item-body start-indent="body-start()">
          <fo:block text-align="start">
            <xsl:apply-templates/>
          </fo:block>
        </fo:list-item-body>
      </fo:list-item>
    </xsl:if>
  </xsl:template>

  <xsl:template match="*[contains(@class,' ut-d/shape ')]" />

  <xsl:template match="*[contains(@class,' ut-d/coords ')]" />

  <!-- sort-as =========================================================== -->

  <xsl:template match="*[contains(@class,' ut-d/sort-as ')]" />

</xsl:stylesheet>
