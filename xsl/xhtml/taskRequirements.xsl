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
                xmlns:u="http://www.xmlmind.com/namespace/ditac"
                exclude-result-prefixes="xs u"
                version="2.0">
  
  <!-- prelreqs LIKE prereq -->
  <!-- closereqs LIKE postreq -->

  <!-- reqconds ========================================================== -->

  <xsl:template match="*[contains(@class,' taskreq-d/reqconds ')]">
    <xsl:element name="{$sectionQName}">
      <xsl:call-template name="commonAttributes"/>

      <h4 class="reqconds-title">
        <xsl:call-template name="localize">
          <xsl:with-param name="message" select="'reqconds'"/>
        </xsl:call-template>
      </h4>

      <xsl:call-template name="namedAnchor"/>

      <xsl:choose>
        <xsl:when test="./*[contains(@class,' taskreq-d/noconds ')]">
          <xsl:apply-templates/>
        </xsl:when>
        <xsl:otherwise>
          <ul class="reqconds-list">
            <xsl:apply-templates/>
          </ul>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:element>
  </xsl:template>

  <!-- reqpers  ========================================================== -->

  <xsl:template match="*[contains(@class,' taskreq-d/reqpers ')]">
    <xsl:element name="{$sectionQName}">
      <xsl:call-template name="commonAttributes"/>

      <h4 class="reqpers-title">
        <xsl:call-template name="localize">
          <xsl:with-param name="message" select="'reqpers'"/>
        </xsl:call-template>
      </h4>

      <xsl:call-template name="namedAnchor"/>

      <dl class="reqpers-list">
        <xsl:apply-templates/>
      </dl>
    </xsl:element>
  </xsl:template>

  <!-- supequip ========================================================== -->
  <!-- supplies ========================================================== -->
  <!-- spares ============================================================ -->

  <xsl:template match="*[contains(@class,' taskreq-d/supequip ')] |
                       *[contains(@class,' taskreq-d/supplies ')] |
                       *[contains(@class,' taskreq-d/spares ')]">
    <xsl:variable name="type" select="u:classToElementName(@class)"/>

    <xsl:element name="{$sectionQName}">
      <xsl:call-template name="commonAttributes"/>

      <h4 class="{$type}-title">
        <xsl:call-template name="localize">
          <xsl:with-param name="message" select="$type"/>
        </xsl:call-template>
      </h4>

      <xsl:call-template name="namedAnchor"/>

      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

  <!-- safety ============================================================ -->

  <xsl:template match="*[contains(@class,' taskreq-d/safety ')]">
    <xsl:element name="{$sectionQName}">
      <xsl:call-template name="commonAttributes"/>

      <h4 class="safety-title">
        <xsl:call-template name="localize">
          <xsl:with-param name="message" select="'safety'"/>
        </xsl:call-template>
      </h4>

      <xsl:call-template name="namedAnchor"/>

      <xsl:choose>
        <xsl:when test="./*[contains(@class,' taskreq-d/nosafety ')]">
          <xsl:apply-templates/>
        </xsl:when>
        <xsl:otherwise>
          <ol class="safety-list">
            <xsl:apply-templates/>
          </ol>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:element>
  </xsl:template>

  <!-- personnel ========================================================= -->
  <!-- perscat =========================================================== -->
  <!-- perskill ========================================================== -->
  <!-- esttime =========================================================== -->

  <xsl:template match="*[contains(@class,' taskreq-d/personnel ')] |
                       *[contains(@class,' taskreq-d/perscat ')] |
                       *[contains(@class,' taskreq-d/perskill ')] |
                       *[contains(@class,' taskreq-d/esttime ')]">
    <xsl:variable name="type" select="u:classToElementName(@class)"/>

    <dt class="{$type}-label">
      <xsl:call-template name="localize">
        <xsl:with-param name="message" select="$type"/>
      </xsl:call-template>
    </dt>

    <dd class="{$type}-body">
      <xsl:call-template name="commonAttributes"/>
      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
    </dd>
  </xsl:template>

  <!-- supeqli =========================================================== -->
  <!-- supplyli ========================================================== -->
  <!-- sparesli ========================================================== -->

  <xsl:template match="*[contains(@class,' taskreq-d/supeqli ')] |
                       *[contains(@class,' taskreq-d/supplyli ')] |
                       *[contains(@class,' taskreq-d/sparesli ')]">
    <xsl:call-template name="namedAnchor"/>
    <ul>
      <!-- Not like ul -->
      <xsl:call-template name="commonAttributes"/>
      <xsl:apply-templates/>
    </ul>
  </xsl:template>

  <!-- reqcond LIKE li -->
  <!-- reqcontp LIKE li -->
  <!-- supequi LIKE li -->
  <!-- supply LIKE li -->
  <!-- spare LIKE li -->
  <!-- safecond LIKE li -->

  <!-- noconds =========================================================== -->
  <!-- nosupeq =========================================================== -->
  <!-- nosupply  ========================================================= -->
  <!-- nospares  ========================================================= -->
  <!-- nosafety ========================================================== -->

  <xsl:template match="*[contains(@class,' taskreq-d/noconds ')] |
                       *[contains(@class,' taskreq-d/nosupeq ')] |
                       *[contains(@class,' taskreq-d/nosupply ')] |
                       *[contains(@class,' taskreq-d/nospares ')] |
                       *[contains(@class,' taskreq-d/nosafety ')]">
    <p>
      <xsl:call-template name="commonAttributes"/>
      <xsl:call-template name="namedAnchor"/>
      <xsl:call-template name="localize">
        <xsl:with-param name="message" select="u:classToElementName(@class)"/>
      </xsl:call-template>
    </p>
  </xsl:template>

</xsl:stylesheet>
