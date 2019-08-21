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
                xmlns:u="http://www.xmlmind.com/namespace/ditac"
                exclude-result-prefixes="xs u"
                version="2.0">
  
  <!-- prelreqs ========================================================== -->

  <xsl:attribute-set name="prelreqs" use-attribute-sets="section">
  </xsl:attribute-set>

  <xsl:attribute-set name="prelreqs-title" use-attribute-sets="section-title">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' taskreq-d/ ')]">
    <fo:block xsl:use-attribute-sets="prelreqs">
      <xsl:call-template name="commonAttributes"/>

      <fo:block xsl:use-attribute-sets="prelreqs-title">
        <xsl:call-template name="localize">
          <xsl:with-param name="message" select="'prelreqs'"/>
        </xsl:call-template>
      </fo:block>

      <xsl:apply-templates/>
    </fo:block>
  </xsl:template>

  <!-- closereqs ========================================================= -->

  <xsl:attribute-set name="closereqs" use-attribute-sets="section">
  </xsl:attribute-set>

  <xsl:attribute-set name="closereqs-title" use-attribute-sets="section-title">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' taskreq-d/closereqs ')]">
    <fo:block xsl:use-attribute-sets="closereqs">
      <xsl:call-template name="commonAttributes"/>

      <fo:block xsl:use-attribute-sets="closereqs-title">
        <xsl:call-template name="localize">
          <xsl:with-param name="message" select="'closereqs'"/>
        </xsl:call-template>
      </fo:block>

      <xsl:apply-templates/>
    </fo:block>
  </xsl:template>

  <!-- reqconds ========================================================== -->

  <xsl:attribute-set name="task-requirements-section"
                     use-attribute-sets="section">
  </xsl:attribute-set>

  <xsl:attribute-set name="task-requirements-section-title"
                     use-attribute-sets="section-title">
    <xsl:attribute name="font-size">1em</xsl:attribute>
    <xsl:attribute name="line-height">1.33</xsl:attribute>
    <xsl:attribute name="space-before.optimum">1.33em</xsl:attribute>
    <xsl:attribute name="space-before.minimum">1.2em</xsl:attribute>
    <xsl:attribute name="space-before.maximum">1.4em</xsl:attribute>
    <xsl:attribute name="space-before.optimum">0.66em</xsl:attribute>
    <xsl:attribute name="space-before.minimum">0.6em</xsl:attribute>
    <xsl:attribute name="space-before.maximum">0.7em</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="reqconds"
                     use-attribute-sets="task-requirements-section">
  </xsl:attribute-set>

  <xsl:attribute-set name="reqconds-title"
                     use-attribute-sets="task-requirements-section-title">
  </xsl:attribute-set>

  <xsl:attribute-set name="reqconds-list" use-attribute-sets="ul">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' taskreq-d/reqconds ')]">
    <fo:block xsl:use-attribute-sets="reqconds">
      <xsl:call-template name="commonAttributes"/>

      <fo:block xsl:use-attribute-sets="reqconds-title">
        <xsl:call-template name="localize">
          <xsl:with-param name="message" select="'reqconds'"/>
        </xsl:call-template>
      </fo:block>

      <xsl:choose>
        <xsl:when test="./*[contains(@class,' taskreq-d/noconds ')]">
          <xsl:apply-templates/>
        </xsl:when>
        <xsl:otherwise>
          <fo:list-block xsl:use-attribute-sets="reqconds-list">
            <xsl:call-template name="xfcULLabelFormat"/>
            <xsl:apply-templates/>
          </fo:list-block>
        </xsl:otherwise>
      </xsl:choose>
    </fo:block>
  </xsl:template>

  <!-- reqpers  ========================================================== -->

  <xsl:attribute-set name="reqpers"
                     use-attribute-sets="task-requirements-section">
  </xsl:attribute-set>

  <xsl:attribute-set name="reqpers-title"
                     use-attribute-sets="task-requirements-section-title">
  </xsl:attribute-set>

  <xsl:attribute-set name="reqpers-list" use-attribute-sets="dl">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' taskreq-d/reqpers ')]">
    <fo:block xsl:use-attribute-sets="reqpers">
      <xsl:call-template name="commonAttributes"/>

      <fo:block xsl:use-attribute-sets="reqpers-title">
        <xsl:call-template name="localize">
          <xsl:with-param name="message" select="'reqpers'"/>
        </xsl:call-template>
      </fo:block>

      <fo:block xsl:use-attribute-sets="reqpers-list">
        <xsl:apply-templates/>
      </fo:block>
    </fo:block>
  </xsl:template>

  <!-- supequip ========================================================== -->

  <xsl:attribute-set name="supequip"
                     use-attribute-sets="task-requirements-section">
  </xsl:attribute-set>

  <xsl:attribute-set name="supequip-title"
                     use-attribute-sets="task-requirements-section-title">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' taskreq-d/supequip ')]">
    <fo:block xsl:use-attribute-sets="supequip">
      <xsl:call-template name="commonAttributes"/>

      <fo:block xsl:use-attribute-sets="supequip-title">
        <xsl:call-template name="localize">
          <xsl:with-param name="message" select="'supequip'"/>
        </xsl:call-template>
      </fo:block>

      <xsl:apply-templates/>
    </fo:block>
  </xsl:template>

  <!-- supplies ========================================================== -->

  <xsl:attribute-set name="supplies"
                     use-attribute-sets="task-requirements-section">
  </xsl:attribute-set>

  <xsl:attribute-set name="supplies-title"
                     use-attribute-sets="task-requirements-section-title">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' taskreq-d/supplies ')]">
    <fo:block xsl:use-attribute-sets="supplies">
      <xsl:call-template name="commonAttributes"/>

      <fo:block xsl:use-attribute-sets="supplies-title">
        <xsl:call-template name="localize">
          <xsl:with-param name="message" select="'supplies'"/>
        </xsl:call-template>
      </fo:block>

      <xsl:apply-templates/>
    </fo:block>
  </xsl:template>

  <!-- spares ============================================================ -->

  <xsl:attribute-set name="spares"
                     use-attribute-sets="task-requirements-section">
  </xsl:attribute-set>

  <xsl:attribute-set name="spares-title"
                     use-attribute-sets="task-requirements-section-title">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' taskreq-d/spares ')]">
    <fo:block xsl:use-attribute-sets="spares">
      <xsl:call-template name="commonAttributes"/>

      <fo:block xsl:use-attribute-sets="spares-title">
        <xsl:call-template name="localize">
          <xsl:with-param name="message" select="'spares'"/>
        </xsl:call-template>
      </fo:block>

      <xsl:apply-templates/>
    </fo:block>
  </xsl:template>

  <!-- safety ============================================================ -->

  <xsl:attribute-set name="safety"
                     use-attribute-sets="task-requirements-section">
  </xsl:attribute-set>

  <xsl:attribute-set name="safety-title"
                     use-attribute-sets="task-requirements-section-title">
  </xsl:attribute-set>

  <xsl:attribute-set name="safety-list" use-attribute-sets="ol">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' taskreq-d/safety ')]">
    <fo:block xsl:use-attribute-sets="safety">
      <xsl:call-template name="commonAttributes"/>

      <fo:block xsl:use-attribute-sets="safety-title">
        <xsl:call-template name="localize">
          <xsl:with-param name="message" select="'safety'"/>
        </xsl:call-template>
      </fo:block>

      <xsl:choose>
        <xsl:when test="./*[contains(@class,' taskreq-d/nosafety ')]">
          <xsl:apply-templates/>
        </xsl:when>
        <xsl:otherwise>
          <fo:list-block xsl:use-attribute-sets="safety-list">
            <xsl:call-template name="xfcOLLabelFormat"/>
            <xsl:apply-templates/>
          </fo:list-block>
        </xsl:otherwise>
      </xsl:choose>
    </fo:block>
  </xsl:template>

  <!-- personnel ========================================================= -->
  <!-- perscat =========================================================== -->
  <!-- perskill ========================================================== -->
  <!-- esttime =========================================================== -->

  <xsl:attribute-set name="required-personnel-label" use-attribute-sets="dt">
  </xsl:attribute-set>

  <xsl:attribute-set name="required-personnel-body" use-attribute-sets="dd">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' taskreq-d/personnel ')] |
                       *[contains(@class,' taskreq-d/perscat ')] |
                       *[contains(@class,' taskreq-d/perskill ')] |
                       *[contains(@class,' taskreq-d/esttime ')]">
    <xsl:variable name="type" select="u:classToElementName(@class)"/>

    <fo:block xsl:use-attribute-sets="required-personnel-label">
      <xsl:call-template name="localize">
        <xsl:with-param name="message" select="$type"/>
      </xsl:call-template>
    </fo:block>

    <fo:block xsl:use-attribute-sets="required-personnel-body">
      <xsl:call-template name="commonAttributes"/>
      <xsl:apply-templates/>
    </fo:block>
  </xsl:template>

  <!-- supeqli =========================================================== -->
  <!-- supplyli ========================================================== -->
  <!-- sparesli ========================================================== -->

  <xsl:attribute-set name="task-requirement-list" use-attribute-sets="ul">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' taskreq-d/supeqli ')] |
                       *[contains(@class,' taskreq-d/supplyli ')] |
                       *[contains(@class,' taskreq-d/sparesli ')]">
    <fo:list-block xsl:use-attribute-sets="task-requirement-list">
      <xsl:call-template name="xfcULLabelFormat"/>
      <xsl:call-template name="commonAttributes"/>
      <xsl:apply-templates/>
    </fo:list-block>
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

  <xsl:attribute-set name="no-task-requirements"
                     use-attribute-sets="block-style">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' taskreq-d/noconds ')] |
                       *[contains(@class,' taskreq-d/nosupeq ')] |
                       *[contains(@class,' taskreq-d/nosupply ')] |
                       *[contains(@class,' taskreq-d/nospares ')] |
                       *[contains(@class,' taskreq-d/nosafety ')]">
    <fo:block xsl:use-attribute-sets="no-task-requirements">
      <xsl:call-template name="commonAttributes"/>
      <xsl:call-template name="localize">
        <xsl:with-param name="message" select="u:classToElementName(@class)"/>
      </xsl:call-template>
    </fo:block>
  </xsl:template>

</xsl:stylesheet>
