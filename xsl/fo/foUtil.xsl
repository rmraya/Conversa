<?xml version="1.0" encoding="UTF-8"?>
<!--
| Copyright (c) 2017-2019 XMLmind Software. All rights reserved.
|
| Author: Hussein Shafie (hussein@xmlmind.com)
|
| This file is part of the XMLmind DITA Converter project.
| For conditions of distribution and use, see the accompanying LEGAL.txt file.
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                xmlns:fo="http://www.w3.org/1999/XSL/Format"
                xmlns:xfc="http://www.xmlmind.com/foconverter/xsl/extensions"
                xmlns:ditac="http://www.xmlmind.com/ditac/schema/ditac"
                xmlns:u="http://www.xmlmind.com/namespace/ditac"
                exclude-result-prefixes="xs ditac u"
                version="2.0">

  <xsl:template name="commonAttributes">
    <xsl:call-template name="idAttribute"/>
    <xsl:call-template name="localizationAttributes"/>
    <xsl:call-template name="flagsAttributes"/>
  </xsl:template>

  <xsl:template name="commonAttributes2">
    <xsl:call-template name="idAttribute2"/>
    <xsl:call-template name="localizationAttributes"/>
    <xsl:call-template name="flagsAttributes"/>
  </xsl:template>

  <xsl:template name="idAttribute">
    <xsl:copy-of select="@id"/>
  </xsl:template>

  <xsl:template name="idAttribute2">
    <xsl:choose>
      <xsl:when test="@id">
        <xsl:copy-of select="@id"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:attribute name="id" select="concat('I_', generate-id(), '_')"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="localizationAttributes">
    <!-- XSL treats xml:lang as a shorthand and uses it to set the country and
         language properties. -->
    <xsl:copy-of select="@xml:lang"/>
  </xsl:template>

  <xsl:template name="flagsAttributes">
    <xsl:for-each select="(@ditac:flags-color, 
                           @ditac:flags-background-color, 
                           @ditac:flags-font-weight,
                           @ditac:flags-font-style,
                           @ditac:flags-text-decoration)">
      <xsl:attribute name="{substring-after(local-name(), 'flags-')}" 
                     select="."/>
    </xsl:for-each>
  </xsl:template>

  <xsl:template name="displayAttributes">
    <!-- @expanse not implemented here -->

    <xsl:if test="@scale">
      <xsl:attribute name="font-size" select="concat(string(@scale), '%')"/>
    </xsl:if>

    <xsl:if test="@frame">
      <xsl:choose>
        <xsl:when test="@frame eq 'top'">
          <xsl:attribute name="border-top-width">0.5pt</xsl:attribute>
          <xsl:attribute name="border-top-style">solid</xsl:attribute>
          <xsl:attribute name="padding-top">0.37em</xsl:attribute>
        </xsl:when>
        <xsl:when test="@frame eq 'bottom'">
          <xsl:attribute name="border-bottom-width">0.5pt</xsl:attribute>
          <xsl:attribute name="border-bottom-style">solid</xsl:attribute>
          <xsl:attribute name="padding-bottom">0.37em</xsl:attribute>
        </xsl:when>
        <xsl:when test="@frame eq 'topbot'">
          <xsl:attribute name="border-top-width">0.5pt</xsl:attribute>
          <xsl:attribute name="border-top-style">solid</xsl:attribute>
          <xsl:attribute name="border-bottom-width">0.5pt</xsl:attribute>
          <xsl:attribute name="border-bottom-style">solid</xsl:attribute>
          <xsl:attribute name="padding-top">0.37em</xsl:attribute>
          <xsl:attribute name="padding-bottom">0.37em</xsl:attribute>
        </xsl:when>
        <xsl:when test="@frame eq 'all'">
          <xsl:attribute name="border-width">0.5pt</xsl:attribute>
          <xsl:attribute name="border-style">solid</xsl:attribute>
          <xsl:attribute name="padding">0.37em</xsl:attribute>
          <xsl:attribute name="margin-left">1pt</xsl:attribute>
          <xsl:attribute name="margin-right">1pt</xsl:attribute>
        </xsl:when>
        <xsl:when test="@frame eq 'sides'">
          <xsl:attribute name="border-left-width">0.5pt</xsl:attribute> 
          <xsl:attribute name="border-left-style">solid</xsl:attribute> 
          <xsl:attribute name="border-right-width">0.5pt</xsl:attribute>
          <xsl:attribute name="border-right-style">solid</xsl:attribute>
          <xsl:attribute name="padding-left">0.37em</xsl:attribute>
          <xsl:attribute name="padding-right">0.37em</xsl:attribute>
          <xsl:attribute name="margin-left">1pt</xsl:attribute>
          <xsl:attribute name="margin-right">1pt</xsl:attribute>
        </xsl:when>
      </xsl:choose>
    </xsl:if>

    <!-- A "equation-d/equation-figure" is also a "topic/fig".
         "svg-d/svg-container" and "mathml-d/mathml" are 
         also "topic/foreign". -->
    <xsl:if test="contains(@class,' topic/fig ') and 
                (index-of($centerList, u:classToElementName(@class)) ge 1) and
                exists(./*[contains(@class,' topic/image ') or
                           contains(@class,' topic/foreign ')])">
      <xsl:attribute name="text-align">center</xsl:attribute>
    </xsl:if>
  </xsl:template>

  <!-- checkLength ======================================================= -->

  <xsl:function name="u:checkLength" as="xs:string">
    <xsl:param name="length" as="xs:string"/>

    <!-- Real number optionally followed by a unit of measure from the set of
         pc, pt, px, in, cm, mm, em (picas, points, pixels, inches,
         centimeters, millimeters, and ems respectively). 
         The default unit is px (pixels). -->

    <xsl:choose>
      <xsl:when test="number($length) gt 0">
        <xsl:sequence select="concat(string($length), 'px')"/>
      </xsl:when>

      <xsl:otherwise>
        <xsl:variable name="value"
          select="substring($length, 1, string-length($length)-2)"/>

        <xsl:variable name="unit"
          select="substring($length, string-length($length)-1)"/>
        
        <xsl:if test="not((number($value) gt 0) and 
                          ($unit eq 'pc' or $unit eq 'pt' or $unit eq 'px' or 
                           $unit eq 'in' or $unit eq 'cm' or $unit eq 'mm' or 
                           $unit eq 'em'))">
          <xsl:message terminate="yes" 
             select="concat('&quot;', $length, '&quot;, invalid length')" />
        </xsl:if>

        <xsl:sequence select="$length"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:function>

  <!-- basicLink ========================================================= -->

  <xsl:template name="basicLink">
    <xsl:param name="href" select="''"/>
    <xsl:param name="text" select="''"/>

    <xsl:choose>
      <xsl:when test="$href ne ''">
        <fo:basic-link xsl:use-attribute-sets="link-style">
          <xsl:call-template name="linkDestination">
            <xsl:with-param name="href" select="$href"/>
          </xsl:call-template>

          <xsl:choose>
            <xsl:when test="$text ne ''">
              <xsl:value-of select="$text"/>
            </xsl:when>
            <xsl:otherwise>
              <xsl:choose>
                <xsl:when test="exists(./node())">
                  <xsl:apply-templates/>
                </xsl:when>
                <xsl:otherwise>
                  <xsl:value-of select="$href"/>
                </xsl:otherwise>
              </xsl:choose>
            </xsl:otherwise>
          </xsl:choose>
        </fo:basic-link>
      </xsl:when>

      <xsl:otherwise>
        <xsl:apply-templates/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="linkDestination">
    <xsl:param name="href" select="''"/>

    <xsl:choose>
      <!-- The preprocessor always appends #flat_id to local links. -->
      <xsl:when test="contains($href, '#') and not(contains($href, '/'))">
        <xsl:attribute name="internal-destination" 
                       select="substring-after($href, '#')"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:attribute name="external-destination" 
                       select="concat('url(', $href, ')')"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- outlineLevel1 ===================================================== -->

  <xsl:template name="outlineLevel1">
    <xsl:if test="$foProcessor eq 'XFC'">
      <xsl:attribute name="xfc:outline-level" select="'1'"/>
    </xsl:if>
  </xsl:template>

  <!-- bgcolorAttribute ================================================== -->

  <xsl:template name="bgcolorAttribute">
    <xsl:variable name="bgcolor"
      select="normalize-space(substring-before(substring-after(@outputclass, 
                                                               'bgcolor('), 
                                               ')'))"/>

    <xsl:if test="$bgcolor ne ''">
      <xsl:attribute name="background-color" select="$bgcolor"/>
    </xsl:if>
  </xsl:template>

</xsl:stylesheet>
