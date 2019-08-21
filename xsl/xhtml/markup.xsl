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
                xmlns="http://www.w3.org/1999/xhtml"
                exclude-result-prefixes="xs"
                version="2.0">

  <!-- markupname ======================================================== -->

  <xsl:template match="*[contains(@class,' markup-d/markupname ') and
                         not(contains(@class,' xml-d/'))]">
    <code>
      <xsl:call-template name="commonAttributes"/>
      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
    </code>
  </xsl:template>

  <!-- numcharref ======================================================== -->

  <xsl:template match="*[contains(@class,' xml-d/numcharref ')]">
    <code>
      <xsl:call-template name="commonAttributes"/>
      <xsl:text>&amp;#</xsl:text>
      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
      <xsl:text>;</xsl:text>
    </code>
  </xsl:template>

  <!-- parameterentity =================================================== -->

  <xsl:template match="*[contains(@class,' xml-d/parameterentity ')]">
    <code>
      <xsl:call-template name="commonAttributes"/>
      <xsl:text>%</xsl:text>
      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
      <xsl:text>;</xsl:text>
    </code>
  </xsl:template>

  <!-- textentity ======================================================== -->

  <xsl:template match="*[contains(@class,' xml-d/textentity ')]">
    <code>
      <xsl:call-template name="commonAttributes"/>
      <xsl:text>&amp;</xsl:text>
      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
      <xsl:text>;</xsl:text>
    </code>
  </xsl:template>

  <!-- xmlatt ============================================================ -->

  <xsl:template match="*[contains(@class,' xml-d/xmlatt ')]">
    <code>
      <xsl:call-template name="commonAttributes"/>
      <xsl:text>@</xsl:text>
      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
    </code>
  </xsl:template>

  <!-- xmlelement ======================================================== -->

  <xsl:template match="*[contains(@class,' xml-d/xmlelement ')]">
    <code>
      <xsl:call-template name="commonAttributes"/>
      <xsl:text>&lt;</xsl:text>
      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
      <xsl:text>&gt;</xsl:text>
    </code>
  </xsl:template>

  <!-- xmlnsname ========================================================= -->

  <xsl:template match="*[contains(@class,' xml-d/xmlnsname ')]">
    <code>
      <xsl:call-template name="commonAttributes"/>
      <xsl:text>"</xsl:text>
      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
      <xsl:text>"</xsl:text>
    </code>
  </xsl:template>

  <!-- xmlpi ============================================================= -->

  <xsl:template match="*[contains(@class,' xml-d/xmlpi ')]">
    <code>
      <xsl:call-template name="commonAttributes"/>
      <xsl:text>&lt;?</xsl:text>
      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
      <xsl:text>?&gt;</xsl:text>
    </code>
  </xsl:template>

 </xsl:stylesheet>
