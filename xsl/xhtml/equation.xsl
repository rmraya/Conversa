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
                xmlns:u="http://www.xmlmind.com/namespace/ditac"
                xmlns:ditac="http://www.xmlmind.com/ditac/schema/ditac"
                exclude-result-prefixes="u ditac"
                version="2.0">
  
  <!-- equation-figure LIKE fig -->

  <!-- equation-block ==================================================== -->

  <xsl:template match="*[contains(@class,' equation-d/equation-block ')]">
    <div>
      <xsl:call-template name="commonAttributes"/>
      <xsl:call-template name="namedAnchor"/>

      <xsl:variable name="num"
        select="./*[contains(@class,' equation-d/equation-number ')]"/>
      <xsl:choose>
        <xsl:when test="exists($num)">
          <table class="equation-block-layout">
            <tr>
              <td class="equation-block-equation">
                <xsl:apply-templates select="./* except $num"/>
              </td>
              <td class="equation-block-number">
                <xsl:apply-templates select="$num[1]"/>
              </td>
            </tr>
          </table>
        </xsl:when>

        <xsl:otherwise>
          <xsl:apply-templates/>
        </xsl:otherwise>
      </xsl:choose>
    </div>
  </xsl:template>

  <!-- equation-inline =================================================== -->

  <xsl:template match="*[contains(@class,' equation-d/equation-inline ')]">
    <span>
      <xsl:call-template name="commonAttributes"/>
      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
    </span>
  </xsl:template>

  <!-- equation-number =================================================== -->

  <xsl:template match="*[contains(@class,' equation-d/equation-number ')]">
    <span>
      <xsl:call-template name="commonAttributes"/>
      <xsl:call-template name="namedAnchor"/>

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
    </span>
  </xsl:template>

</xsl:stylesheet>
