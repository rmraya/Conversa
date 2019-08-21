<?xml version="1.0" encoding="UTF-8"?>
<!--
| Copyright (c) 2017-2019 XMLmind Software. All rights reserved.
|
| Author: Hussein Shafie
|
| This file is part of the XMLmind DITA Converter project.
| For conditions of distribution and use, see the accompanying LEGAL.txt file.
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                xmlns:fo="http://www.w3.org/1999/XSL/Format"
                xmlns:ditac="http://www.xmlmind.com/ditac/schema/ditac"
                xmlns:u="http://www.xmlmind.com/namespace/ditac"
                exclude-result-prefixes="xs ditac u"
                version="2.0">
  
  <!-- troubleshooting LIKE topic -->
  <!-- troublebody LIKE body -->

  <!-- condition ========================================================= -->

  <xsl:attribute-set name="condition" use-attribute-sets="section">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' troubleshooting/condition ')]">
    <fo:block xsl:use-attribute-sets="condition">
      <xsl:call-template name="commonAttributes"/>

      <xsl:if test="not(./*[contains(@class,' topic/title ')])">
        <fo:block xsl:use-attribute-sets="condition-title">
          <xsl:call-template name="localize">
            <xsl:with-param name="message" select="'condition'"/>
          </xsl:call-template>
        </fo:block>
      </xsl:if>

      <xsl:apply-templates/>
    </fo:block>
  </xsl:template>

  <!-- condition/title =================================================== -->

  <xsl:attribute-set name="condition-title" use-attribute-sets="section-title">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' troubleshooting/condition ')]/*[contains(@class,' topic/title ')]">
    <fo:block xsl:use-attribute-sets="condition-title">
      <xsl:call-template name="commonAttributes"/>
      <xsl:call-template name="titleContents"/>
    </fo:block>
  </xsl:template>

  <!-- troubleSolution =================================================== -->

  <xsl:attribute-set name="troubleSolution" use-attribute-sets="section">
  </xsl:attribute-set>

  <xsl:attribute-set name="troubleSolution-title"
                     use-attribute-sets="section-title">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' troubleshooting/troubleSolution ')]">
    <fo:block xsl:use-attribute-sets="troubleSolution">
      <xsl:call-template name="commonAttributes"/>

      <fo:block xsl:use-attribute-sets="troubleSolution-title">
        <xsl:call-template name="localize">
          <xsl:with-param name="message" select="'troubleSolution'"/>
        </xsl:call-template>

        <xsl:if test="$troubleSolution-number-format ne '' and
                      count(../*[contains(@class,' troubleshooting/troubleSolution ')]) gt 1">
          <xsl:number format="{$troubleSolution-number-format}"/>
        </xsl:if>
      </fo:block>

      <xsl:apply-templates/>
    </fo:block>
  </xsl:template>

  <!-- cause ============================================================= -->

  <xsl:attribute-set name="troubleshooting-section"
                     use-attribute-sets="section">
  </xsl:attribute-set>

  <xsl:attribute-set name="cause" use-attribute-sets="troubleshooting-section">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' troubleshooting/cause ')]">
    <fo:block xsl:use-attribute-sets="cause">
      <xsl:call-template name="commonAttributes"/>

      <xsl:if test="not(./*[contains(@class,' topic/title ')])">
        <fo:block xsl:use-attribute-sets="cause-title">
          <xsl:call-template name="localize">
            <xsl:with-param name="message" select="'cause'"/>
          </xsl:call-template>

          <xsl:if test="$cause-number-format ne '' and
                        count(../*[contains(@class,' troubleshooting/cause ')]) gt 1">
            <xsl:number format="{$cause-number-format}"/>
          </xsl:if>
        </fo:block>
      </xsl:if>

      <xsl:apply-templates/>
    </fo:block>
  </xsl:template>

  <!-- cause/title ======================================================= -->

  <xsl:attribute-set name="troubleshooting-section-title"
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

  <xsl:attribute-set name="cause-title"
                     use-attribute-sets="troubleshooting-section-title">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' troubleshooting/cause ')]/*[contains(@class,' topic/title ')]">
    <fo:block xsl:use-attribute-sets="cause-title">
      <xsl:call-template name="commonAttributes"/>
      <xsl:call-template name="titleContents"/>
    </fo:block>
  </xsl:template>

  <!-- remedy ============================================================ -->

  <xsl:attribute-set name="remedy" use-attribute-sets="troubleshooting-section">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' troubleshooting/remedy ')]">
    <fo:block xsl:use-attribute-sets="remedy">
      <xsl:call-template name="commonAttributes"/>

      <xsl:if test="not(./*[contains(@class,' topic/title ')])">
        <fo:block xsl:use-attribute-sets="remedy-title">
          <xsl:call-template name="localize">
            <xsl:with-param name="message" select="'remedy'"/>
          </xsl:call-template>

          <xsl:if test="$remedy-number-format ne '' and
                        count(../*[contains(@class,' troubleshooting/remedy ')]) gt 1">
            <xsl:number format="{$remedy-number-format}"/>
          </xsl:if>
        </fo:block>
      </xsl:if>

      <xsl:apply-templates/>
    </fo:block>
  </xsl:template>

  <!-- remedy/title ====================================================== -->

  <xsl:attribute-set name="remedy-title"
                     use-attribute-sets="troubleshooting-section-title">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' troubleshooting/remedy ')]/*[contains(@class,' topic/title ')]">
    <fo:block xsl:use-attribute-sets="remedy-title">
      <xsl:call-template name="commonAttributes"/>
      <xsl:call-template name="titleContents"/>
    </fo:block>
  </xsl:template>

  <!-- responsibleParty ================================================== -->

  <xsl:attribute-set name="responsibleParty"
                     use-attribute-sets="block-style">
  </xsl:attribute-set>

  <xsl:attribute-set name="responsibleParty-label">
    <xsl:attribute name="font-family">sans-serif</xsl:attribute>
    <xsl:attribute name="font-weight">bold</xsl:attribute>
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' troubleshooting/responsibleParty ')]">
    <fo:block xsl:use-attribute-sets="responsibleParty">
      <xsl:call-template name="commonAttributes"/>

      <fo:inline xsl:use-attribute-sets="responsibleParty-label">
        <xsl:call-template name="localize">
          <xsl:with-param name="message" select="'responsibleParty'"/>
        </xsl:call-template>
      </fo:inline>
      <xsl:text> </xsl:text>

      <xsl:apply-templates/>
    </fo:block>
  </xsl:template>

  <!-- remedy/steps-informal ============================================= -->
  <!-- task/steps-informal is a fully flaggable topic/section -->

  <xsl:template match="*[contains(@class,' troubleshooting/remedy ')]/*[contains(@class,' task/steps-informal ')] |
                       *[contains(@class,' troubleshooting/remedy ')]/ditac:flags-block/*[contains(@class,' task/steps-informal ')]">
    <xsl:call-template name="stepsInformalContents">
      <xsl:with-param name="addTitle" select="'no'"/>
    </xsl:call-template>
  </xsl:template>

  <!-- remedy/steps ====================================================== -->
  <!-- task/steps is a fully flaggable topic/ol -->

  <xsl:template match="*[contains(@class,' troubleshooting/remedy ')]/*[contains(@class,' task/steps ')] |
                       *[contains(@class,' troubleshooting/remedy ')]/ditac:flags-block/*[contains(@class,' task/steps ')]">
    <xsl:call-template name="stepsContents">
      <xsl:with-param name="addTitle" select="'no'"/>
    </xsl:call-template>
  </xsl:template>

  <!-- remedy/steps-unordered ============================================ -->
  <!-- task/steps-unordered is a fully flaggable topic/ul -->

  <xsl:template match="*[contains(@class,' troubleshooting/remedy ')]/*[contains(@class,' task/steps-unordered ')] |
                       *[contains(@class,' troubleshooting/remedy ')]/ditac:flags-block/*[contains(@class,' task/steps-unordered ')]">
    <xsl:call-template name="stepsUnorderedContents">
      <xsl:with-param name="addTitle" select="'no'"/>
    </xsl:call-template>
  </xsl:template>

</xsl:stylesheet>
