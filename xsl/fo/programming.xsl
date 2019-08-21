<?xml version="1.0" encoding="UTF-8"?>
<!--
| Copyright (c) 2017-2018 XMLmind Software. All rights reserved.
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

  <!-- apiname =========================================================== -->

  <xsl:attribute-set name="apiname" use-attribute-sets="monospace-style">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' pr-d/apiname ')]">
    <fo:inline xsl:use-attribute-sets="apiname">
      <xsl:call-template name="commonAttributes"/>
      <xsl:apply-templates/>
    </fo:inline>
  </xsl:template>

  <!-- LIKE: pre, codeblock -->

  <!-- coderef =========================================================== -->

  <xsl:template match="*[contains(@class,' pr-d/coderef ')]">
    <xsl:variable name="href" select="normalize-space(@href)"/>
    <xsl:if test="$href ne ''">
      <xsl:variable name="charset">
        <xsl:call-template name="formatCharset"/>
      </xsl:variable>

      <xsl:choose>
        <xsl:when test="$charset ne ''">
          <xsl:value-of select="unparsed-text($href, $charset)"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="unparsed-text($href)"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:if>
  </xsl:template>

  <!-- codeph ============================================================ -->

  <xsl:attribute-set name="codeph" use-attribute-sets="monospace-style">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' pr-d/codeph ')]">
    <fo:inline xsl:use-attribute-sets="codeph">
      <xsl:call-template name="commonAttributes"/>
      <xsl:apply-templates/>
    </fo:inline>
  </xsl:template>

  <!-- option ============================================================ -->

  <xsl:attribute-set name="option" use-attribute-sets="monospace-style">
    <xsl:attribute name="font-weight">bold</xsl:attribute>
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' pr-d/option ')]">
    <fo:inline xsl:use-attribute-sets="option">
      <xsl:call-template name="commonAttributes"/>
      <xsl:apply-templates/>
    </fo:inline>
  </xsl:template>

  <!-- parmname ========================================================== -->

  <xsl:attribute-set name="parmname" use-attribute-sets="monospace-style">
    <xsl:attribute name="font-style">italic</xsl:attribute>
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' pr-d/parmname ')]">
    <fo:inline xsl:use-attribute-sets="parmname">
      <xsl:call-template name="commonAttributes"/>
      <xsl:apply-templates/>
    </fo:inline>
  </xsl:template>

  <!-- LIKE: dl, parml -->
  <!-- LIKE: dlentry, plentry -->
  <!-- LIKE: dt, pt -->
  <!-- LIKE: dd, pd -->

  <!-- synph ============================================================= -->

  <xsl:attribute-set name="synph" use-attribute-sets="monospace-style">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' pr-d/synph ')]">
    <fo:inline xsl:use-attribute-sets="synph">
      <xsl:call-template name="commonAttributes"/>
      <xsl:apply-templates/>
    </fo:inline>
  </xsl:template>

  <!-- OMITTED: syntaxdiagram groupseq groupchoice groupcomp fragment 
       fragref synblk synnote synnoteref repsep -->

  <xsl:template match="*[contains(@class,' pr-d/syntaxdiagram ')]"/>

  <!-- kwd =============================================================== -->

  <xsl:attribute-set name="kwd" use-attribute-sets="monospace-style">
    <xsl:attribute name="font-weight">bold</xsl:attribute>
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' pr-d/kwd ')]">
    <fo:inline xsl:use-attribute-sets="kwd">
      <xsl:call-template name="commonAttributes"/>
      <xsl:apply-templates/>
    </fo:inline>
  </xsl:template>

  <!-- var =============================================================== -->

  <xsl:attribute-set name="var" use-attribute-sets="monospace-style">
    <xsl:attribute name="font-style">italic</xsl:attribute>
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' pr-d/var ')]">
    <fo:inline xsl:use-attribute-sets="var">
      <xsl:call-template name="commonAttributes"/>
      <xsl:apply-templates/>
    </fo:inline>
  </xsl:template>

  <!-- oper ============================================================== -->

  <xsl:attribute-set name="oper" use-attribute-sets="monospace-style">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' pr-d/oper ')]">
    <fo:inline xsl:use-attribute-sets="oper">
      <xsl:call-template name="commonAttributes"/>
      <xsl:apply-templates/>
    </fo:inline>
  </xsl:template>

  <!-- delim ============================================================= -->

  <xsl:attribute-set name="delim" use-attribute-sets="monospace-style">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' pr-d/delim ')]">
    <fo:inline xsl:use-attribute-sets="delim">
      <xsl:call-template name="commonAttributes"/>
      <xsl:apply-templates/>
    </fo:inline>
  </xsl:template>

  <!-- sep =============================================================== -->

  <xsl:attribute-set name="sep" use-attribute-sets="monospace-style">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' pr-d/sep ')]">
    <fo:inline xsl:use-attribute-sets="sep">
      <xsl:call-template name="commonAttributes"/>
      <xsl:apply-templates/>
    </fo:inline>
  </xsl:template>

  <!-- table outputclass=listing-layout ================================== -->

  <xsl:attribute-set name="listing-layout" use-attribute-sets="block-style">
    <xsl:attribute name="table-layout">fixed</xsl:attribute>
    <xsl:attribute name="width">100%</xsl:attribute>
    <xsl:attribute name="border-collapse">collapse</xsl:attribute>
    <xsl:attribute name="background-color">#F0F0F0</xsl:attribute>
    <xsl:attribute name="border-color">#D0D0D0</xsl:attribute>
    <xsl:attribute name="border-style">dotted</xsl:attribute>
    <xsl:attribute name="border-width">0.5pt</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="listing-numbers-column">
    <xsl:attribute name="border-right">0.5pt solid #808080</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="listing-lines-column">
    <xsl:attribute name="column-width">proportional-column-width(1)</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="listing-table-body">
  </xsl:attribute-set>

  <xsl:attribute-set name="listing-row">
  </xsl:attribute-set>

  <xsl:attribute-set name="listing-cell">
    <xsl:attribute name="relative-align">baseline</xsl:attribute>
    <xsl:attribute name="padding">0.33em</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="listing-numbers-cell"
                     use-attribute-sets="listing-cell">
    <xsl:attribute name="color">#808080</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="listing-lines-cell"
                     use-attribute-sets="listing-cell">
  </xsl:attribute-set>

  <xsl:attribute-set name="listing-pre" 
                     use-attribute-sets="monospace-block-style">
    <xsl:attribute name="background-color">transparent</xsl:attribute>
    <xsl:attribute name="border-style">none</xsl:attribute>
    <xsl:attribute name="padding">0pt</xsl:attribute>
    <xsl:attribute name="space-before.optimum">0pt</xsl:attribute>
    <xsl:attribute name="space-before.minimum">0pt</xsl:attribute>
    <xsl:attribute name="space-before.maximum">0pt</xsl:attribute>
    <xsl:attribute name="space-after.optimum">0pt</xsl:attribute>
    <xsl:attribute name="space-after.minimum">0pt</xsl:attribute>
    <xsl:attribute name="space-after.maximum">0pt</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="listing-numbers" use-attribute-sets="listing-pre">
    <xsl:attribute name="text-align">right</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="listing-lines" use-attribute-sets="listing-pre">
    <xsl:attribute name="text-align">left</xsl:attribute>
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' topic/table ') and
                         @outputclass eq 'listing-layout']">
    <xsl:variable name="colspec"
      select=".//*[contains(@class,' topic/colspec ') and @colwidth ne '']"/>

    <xsl:variable name="pre" select=".//*[contains(@class,' topic/pre ')]"/>

    <xsl:if test="count($colspec) ne 1 or count($pre) ne 2">
      <xsl:message terminate="yes">internal error: table outputclass=listing-layout should have 1 colspec and 2 pre descendants</xsl:message>
    </xsl:if>

    <fo:table xsl:use-attribute-sets="listing-layout">
      <xsl:call-template name="commonAttributes"/>

      <fo:table-column xsl:use-attribute-sets="listing-numbers-column">
        <xsl:attribute name="column-width" select="string($colspec/@colwidth)"/>
      </fo:table-column>

      <fo:table-column xsl:use-attribute-sets="listing-lines-column"/>

      <fo:table-body xsl:use-attribute-sets="listing-table-body">
        <fo:table-row xsl:use-attribute-sets="listing-row">
          <fo:table-cell start-indent="0"
                         xsl:use-attribute-sets="listing-numbers-cell">
            <fo:block xsl:use-attribute-sets="listing-numbers">
              <xsl:for-each select="$pre[1]">
                <xsl:call-template name="processPre"/>
              </xsl:for-each>
            </fo:block>
          </fo:table-cell>

          <fo:table-cell start-indent="0"
                         xsl:use-attribute-sets="listing-lines-cell">
            <fo:block xsl:use-attribute-sets="listing-lines">
              <xsl:for-each select="$pre[2]">
                <xsl:call-template name="processPre"/>
              </xsl:for-each>
            </fo:block>
          </fo:table-cell>
        </fo:table-row>
      </fo:table-body>
    </fo:table>
  </xsl:template>

</xsl:stylesheet>
