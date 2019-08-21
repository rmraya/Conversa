<?xml version="1.0" encoding="UTF-8"?>
<!--
| Copyright (c) 2017-2018 XMLmind Software. All rights reserved.
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

  <!-- apiname =========================================================== -->

  <xsl:template match="*[contains(@class,' pr-d/apiname ')]">
    <code>
      <xsl:call-template name="commonAttributes"/>
      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
    </code>
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

  <xsl:template match="*[contains(@class,' pr-d/codeph ')]">
    <code>
      <xsl:call-template name="commonAttributes"/>
      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
    </code>
  </xsl:template>

  <!-- option ============================================================ -->

  <xsl:template match="*[contains(@class,' pr-d/option ')]">
    <code>
      <xsl:call-template name="commonAttributes"/>
      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
    </code>
  </xsl:template>

  <!-- parmname ========================================================== -->

  <xsl:template match="*[contains(@class,' pr-d/parmname ')]">
    <code>
      <xsl:call-template name="commonAttributes"/>
      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
    </code>
  </xsl:template>

  <!-- LIKE: dl, parml -->
  <!-- LIKE: dlentry, plentry -->
  <!-- LIKE: dt, pt -->
  <!-- LIKE: dd, pd -->

  <!-- synph ============================================================= -->

  <xsl:template match="*[contains(@class,' pr-d/synph ')]">
    <span>
      <xsl:call-template name="commonAttributes"/>
      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
    </span>
  </xsl:template>

  <!-- OMITTED: syntaxdiagram groupseq groupchoice groupcomp fragment 
       fragref synblk synnote synnoteref repsep -->

  <xsl:template match="*[contains(@class,' pr-d/syntaxdiagram ')]"/>

  <!-- kwd =============================================================== -->

  <xsl:template match="*[contains(@class,' pr-d/kwd ')]">
    <code>
      <xsl:call-template name="commonAttributes"/>
      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
    </code>
  </xsl:template>

  <!-- var =============================================================== -->

  <xsl:template match="*[contains(@class,' pr-d/var ')]">
    <code>
      <xsl:call-template name="commonAttributes"/>
      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
    </code>
  </xsl:template>

  <!-- oper ============================================================== -->

  <xsl:template match="*[contains(@class,' pr-d/oper ')]">
    <code>
      <xsl:call-template name="commonAttributes"/>
      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
    </code>
  </xsl:template>

  <!-- delim ============================================================= -->

  <xsl:template match="*[contains(@class,' pr-d/delim ')]">
    <code>
      <xsl:call-template name="commonAttributes"/>
      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
    </code>
  </xsl:template>

  <!-- sep =============================================================== -->

  <xsl:template match="*[contains(@class,' pr-d/sep ')]">
    <code>
      <xsl:call-template name="commonAttributes"/>
      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
    </code>
  </xsl:template>

</xsl:stylesheet>
