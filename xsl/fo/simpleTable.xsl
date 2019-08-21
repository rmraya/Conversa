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
                xmlns:u="http://www.xmlmind.com/namespace/ditac"
                exclude-result-prefixes="xs u"
                version="2.0">
  
  <!-- simpletable ======================================================= -->

  <xsl:attribute-set name="simpletable" use-attribute-sets="block-style">
    <!-- Justify gives ugly results inside table cells. -->
    <xsl:attribute name="text-align">left</xsl:attribute>
    <xsl:attribute name="width">100%</xsl:attribute>
    <xsl:attribute name="border">0.5pt solid #808080</xsl:attribute>
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' topic/simpletable ')]">
    <fo:table xsl:use-attribute-sets="simpletable">
      <xsl:call-template name="commonAttributes"/>
      <xsl:call-template name="bgcolorAttribute"/>

      <!-- LIMITATION: $center not supported:
           simpletable width is always 100% -->

      <!-- Display attributes -->
      <!-- LIMITATION: @expanse not supported -->
      <!-- LIMITATION: @frame not supported -->

      <xsl:if test="@scale">
        <xsl:attribute name="font-size" select="concat(string(@scale), '%')"/>
      </xsl:if>

      <xsl:choose>
        <xsl:when test="@relcolwidth">
          <xsl:attribute name="table-layout">fixed</xsl:attribute>

          <xsl:variable name="relWidths"
            select="for $i in 
                     tokenize(normalize-space(translate(@relcolwidth,'*',' ')),
                              '\s+')
                    return number($i)"/>

          <xsl:variable name="minWidth" select="min($relWidths)"/>

          <xsl:for-each select="$relWidths">
            <fo:table-column column-number="{position()}">
              <xsl:attribute name="column-width">
                <xsl:choose>
                  <xsl:when test=". gt 0 and 
                                  $minWidth gt 0 and
                                  round(. div $minWidth) ge 1">
                    <xsl:value-of select="concat('proportional-column-width(',
                                                 round(. div $minWidth), 
                                                 ')')"/>
                  </xsl:when>
                  <xsl:otherwise>proportional-column-width(1)</xsl:otherwise>
                </xsl:choose>
              </xsl:attribute>
            </fo:table-column>
          </xsl:for-each>
        </xsl:when>

        <xsl:when test="$foProcessor eq 'FOP'">
          <!-- FOP does not support table-layout=auto. -->
          <xsl:attribute name="table-layout">fixed</xsl:attribute>

          <xsl:variable name="columns" select="count(./*[1]/*)"/>

          <xsl:for-each select="1 to $columns">
            <fo:table-column column-number="{.}" 
                             column-width="proportional-column-width(1)"/>
          </xsl:for-each>
        </xsl:when>

        <xsl:otherwise>
          <xsl:attribute name="table-layout">auto</xsl:attribute>
        </xsl:otherwise>
      </xsl:choose>

      <xsl:variable name="header"
                    select="./*[contains(@class,' topic/sthead ')]"/>
      <xsl:choose>
        <xsl:when test="exists($header)">
          <fo:table-header>
            <xsl:apply-templates select="$header"/>
          </fo:table-header>
        </xsl:when>

        <xsl:when test="contains(@class,' task/choicetable ')">
          <!-- Generate a chhead containing Option and Description when such
               header is absent. -->
          <fo:table-header>
            <fo:table-row xsl:use-attribute-sets="chhead">
              <fo:table-cell start-indent="0"
                             xsl:use-attribute-sets="choptionhd">
                <fo:block>
                  <xsl:call-template name="localize">
                    <xsl:with-param name="message" select="'option'"/>
                  </xsl:call-template>
                </fo:block>
              </fo:table-cell>
              <fo:table-cell start-indent="0"
                             xsl:use-attribute-sets="chdeschd">
                <fo:block>
                  <xsl:call-template name="localize">
                    <xsl:with-param name="message" select="'description'"/>
                  </xsl:call-template>
                </fo:block>
              </fo:table-cell>
            </fo:table-row>
          </fo:table-header>
        </xsl:when>
      </xsl:choose>

      <fo:table-body>
        <xsl:apply-templates select="./*[contains(@class,' topic/strow ')]"/>
      </fo:table-body>
    </fo:table>
  </xsl:template>

  <!-- sthead ============================================================ -->

  <xsl:attribute-set name="sthead" use-attribute-sets="table-header-style">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' topic/sthead ')]">
    <fo:table-row xsl:use-attribute-sets="sthead">
      <xsl:call-template name="commonAttributes"/>
      <xsl:call-template name="bgcolorAttribute"/>
      <xsl:apply-templates/>
    </fo:table-row>
  </xsl:template>

  <!-- strow ============================================================= -->

  <xsl:attribute-set name="strow">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' topic/strow ')]">
    <fo:table-row xsl:use-attribute-sets="strow">
      <xsl:call-template name="commonAttributes"/>
      <xsl:call-template name="bgcolorAttribute"/>
      <xsl:apply-templates/>
    </fo:table-row>
  </xsl:template>

  <!-- stentry =========================================================== -->

  <xsl:attribute-set name="stentry">
    <xsl:attribute name="border">0.5pt solid #808080</xsl:attribute>
    <xsl:attribute name="padding">0.33em</xsl:attribute>
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' topic/stentry ')]">
    <xsl:variable name="column" select="position()" />

    <xsl:choose>
      <xsl:when test="ancestor::*[contains(@class,' topic/simpletable ') and 
                                  number(@keycol) eq $column]">
        <fo:table-cell start-indent="0" 
                       xsl:use-attribute-sets="stentry table-header-style">
          <xsl:call-template name="commonAttributes"/>
          <xsl:call-template name="bgcolorAttribute"/>
          <fo:block>
            <xsl:call-template name="processCellContents"/>
          </fo:block>
        </fo:table-cell>
      </xsl:when>
      <xsl:otherwise>
        <fo:table-cell  start-indent="0" xsl:use-attribute-sets="stentry">
          <xsl:call-template name="commonAttributes"/>
          <xsl:call-template name="bgcolorAttribute"/>
          <fo:block>
            <xsl:call-template name="processCellContents"/>
          </fo:block>
        </fo:table-cell>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

</xsl:stylesheet>
