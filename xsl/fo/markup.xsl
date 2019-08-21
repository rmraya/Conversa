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
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                xmlns:fo="http://www.w3.org/1999/XSL/Format"
                exclude-result-prefixes="xs"
                version="2.0">

  <!-- markupname ======================================================== -->

  <xsl:attribute-set name="markupname" use-attribute-sets="monospace-style">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' markup-d/markupname ') and
                         not(contains(@class,' xml-d/'))]">
    <fo:inline xsl:use-attribute-sets="markupname">
      <xsl:call-template name="commonAttributes"/>
      <xsl:apply-templates/>
    </fo:inline>
  </xsl:template>

  <!-- numcharref ======================================================== -->

  <xsl:attribute-set name="numcharref" use-attribute-sets="markupname">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' xml-d/numcharref ')]">
    <fo:inline xsl:use-attribute-sets="numcharref">
      <xsl:call-template name="commonAttributes"/>
      <xsl:text>&amp;#</xsl:text>
      <xsl:apply-templates/>
      <xsl:text>;</xsl:text>
    </fo:inline>
  </xsl:template>

  <!-- parameterentity =================================================== -->

  <xsl:attribute-set name="parameterentity" use-attribute-sets="markupname">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' xml-d/parameterentity ')]">
    <fo:inline xsl:use-attribute-sets="parameterentity">
      <xsl:call-template name="commonAttributes"/>
      <xsl:text>%</xsl:text>
      <xsl:apply-templates/>
      <xsl:text>;</xsl:text>
    </fo:inline>
  </xsl:template>

  <!-- textentity ======================================================== -->

  <xsl:attribute-set name="textentity" use-attribute-sets="markupname">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' xml-d/textentity ')]">
    <fo:inline xsl:use-attribute-sets="textentity">
      <xsl:call-template name="commonAttributes"/>
      <xsl:text>&amp;</xsl:text>
      <xsl:apply-templates/>
      <xsl:text>;</xsl:text>
    </fo:inline>
  </xsl:template>

  <!-- xmlatt ============================================================ -->

  <xsl:attribute-set name="xmlatt" use-attribute-sets="markupname">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' xml-d/xmlatt ')]">
    <fo:inline xsl:use-attribute-sets="xmlatt">
      <xsl:call-template name="commonAttributes"/>
      <xsl:text>@</xsl:text>
      <xsl:apply-templates/>
    </fo:inline>
  </xsl:template>

  <!-- xmlelement ======================================================== -->

  <xsl:attribute-set name="xmlelement" use-attribute-sets="markupname">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' xml-d/xmlelement ')]">
    <fo:inline xsl:use-attribute-sets="xmlelement">
      <xsl:call-template name="commonAttributes"/>
      <xsl:text>&lt;</xsl:text>
      <xsl:apply-templates/>
      <xsl:text>&gt;</xsl:text>
    </fo:inline>
  </xsl:template>

  <!-- xmlnsname ========================================================= -->

  <xsl:attribute-set name="xmlnsname" use-attribute-sets="markupname">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' xml-d/xmlnsname ')]">
    <fo:inline xsl:use-attribute-sets="xmlnsname">
      <xsl:call-template name="commonAttributes"/>
      <xsl:text>"</xsl:text>
      <xsl:apply-templates/>
      <xsl:text>"</xsl:text>
    </fo:inline>
  </xsl:template>

  <!-- xmlpi ============================================================= -->

  <xsl:attribute-set name="xmlpi" use-attribute-sets="markupname">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' xml-d/xmlpi ')]">
    <fo:inline xsl:use-attribute-sets="xmlpi">
      <xsl:call-template name="commonAttributes"/>
      <xsl:text>&lt;?</xsl:text>
      <xsl:apply-templates/>
      <xsl:text>?&gt;</xsl:text>
    </fo:inline>
  </xsl:template>

 </xsl:stylesheet>
