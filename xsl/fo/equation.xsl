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
                xmlns:fo="http://www.w3.org/1999/XSL/Format"
                xmlns:u="http://www.xmlmind.com/namespace/ditac"
                xmlns:ditac="http://www.xmlmind.com/ditac/schema/ditac"
                exclude-result-prefixes="u ditac"
                version="2.0">
  
  <!-- fig =============================================================== -->

  <xsl:attribute-set name="equation-figure" use-attribute-sets="fig">
  </xsl:attribute-set>

  <xsl:attribute-set name="equation-figure-contents"
                     use-attribute-sets="fig-contents">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' equation-d/equation-figure ')]">
    <fo:block xsl:use-attribute-sets="equation-figure">
      <xsl:call-template name="commonAttributes"/>
      <xsl:call-template name="processEquationFigure"/>
    </fo:block>
  </xsl:template>

  <xsl:template name="processEquationFigure">
    <xsl:variable name="title" select="./*[contains(@class,' topic/title ')]"/>

    <xsl:choose>
      <xsl:when test="$title">
        <!-- Display attributes do not apply to the title. -->
        <xsl:choose>
          <xsl:when
            test="index-of($titleAfterList,u:classToElementName(@class)) ge 1">
            <fo:block xsl:use-attribute-sets="equation-figure-contents">
              <xsl:call-template name="displayAttributes"/>
              <xsl:apply-templates select="./* except $title"/>
            </fo:block>
            <xsl:apply-templates select="$title"/>
          </xsl:when>

          <xsl:otherwise>
            <xsl:apply-templates select="$title"/>
            <fo:block xsl:use-attribute-sets="equation-figure-contents">
              <xsl:call-template name="displayAttributes"/>
              <xsl:apply-templates select="./* except $title"/>
            </fo:block>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:when>

      <xsl:otherwise>
        <xsl:call-template name="displayAttributes"/>
        <xsl:apply-templates/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- equation-block ==================================================== -->

  <xsl:attribute-set name="equation-block" use-attribute-sets="block-style">
    <xsl:attribute name="text-align">center</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="equation-block-layout">
    <xsl:attribute name="width">90%</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="equation-block-equation">
    <xsl:attribute name="display-align">center</xsl:attribute>
    <xsl:attribute name="text-align">center</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="equation-block-number">
    <xsl:attribute name="display-align">center</xsl:attribute>
    <xsl:attribute name="text-align">end</xsl:attribute>
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' equation-d/equation-block ')]">
    <fo:block xsl:use-attribute-sets="equation-block">
      <xsl:call-template name="commonAttributes"/>

      <xsl:variable name="num"
        select="./*[contains(@class,' equation-d/equation-number ')]"/>
      <xsl:choose>
        <xsl:when test="exists($num)">
          <fo:table table-layout="fixed"
                    xsl:use-attribute-sets="equation-block-layout">
            <fo:table-column column-number="1"
                             column-width="{$equation-block-equation-width}"/>
            <fo:table-column column-number="2"
                             column-width="{$equation-block-number-width}"/>
            <fo:table-body>
              <fo:table-row>
                <fo:table-cell start-indent="0" 
                               xsl:use-attribute-sets="equation-block-equation">
                  <fo:block>
                    <xsl:apply-templates select="./* except $num"/>
                  </fo:block>
                </fo:table-cell>
                <fo:table-cell start-indent="0" 
                               xsl:use-attribute-sets="equation-block-number">
                  <fo:block>
                    <xsl:apply-templates select="$num[1]"/>
                  </fo:block>
                </fo:table-cell>
              </fo:table-row>
            </fo:table-body>
          </fo:table>
        </xsl:when>

        <xsl:otherwise>
          <xsl:apply-templates/>
        </xsl:otherwise>
      </xsl:choose>
    </fo:block>
  </xsl:template>

  <!-- equation-inline =================================================== -->

  <xsl:attribute-set name="equation-inline">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' equation-d/equation-inline ')]">
    <fo:inline xsl:use-attribute-sets="equation-inline">
      <xsl:call-template name="commonAttributes"/>
      <xsl:apply-templates/>
    </fo:inline>
  </xsl:template>

  <!-- equation-number =================================================== -->

  <xsl:attribute-set name="equation-number">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' equation-d/equation-number ')]">
    <fo:inline xsl:use-attribute-sets="equation-number">
      <xsl:call-template name="commonAttributes"/>

      <xsl:value-of select="$equation-number-before"/>

      <xsl:choose>
        <xsl:when test="empty(@ditac:filled)">
          <xsl:apply-templates/>
        </xsl:when>

        <xsl:otherwise>
          <xsl:variable name="num" select="u:shortTitlePrefix(string(.), .)"/>
          <!-- Discard leading 'Equation '. -->
          <xsl:value-of select="u:extractNumber($num, .)"/>
        </xsl:otherwise>
      </xsl:choose>

      <xsl:value-of select="$equation-number-after"/>
    </fo:inline>
  </xsl:template>

</xsl:stylesheet>
