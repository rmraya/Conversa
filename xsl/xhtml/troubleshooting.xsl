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
                xmlns="http://www.w3.org/1999/xhtml"
                xmlns:ditac="http://www.xmlmind.com/ditac/schema/ditac"
                xmlns:u="http://www.xmlmind.com/namespace/ditac"
                exclude-result-prefixes="xs ditac u"
                version="2.0">
  
  <!-- troubleshooting LIKE topic -->
  <!-- troublebody LIKE body -->

  <!-- condition ========================================================= -->

  <xsl:template match="*[contains(@class,' troubleshooting/condition ')]">
    <xsl:element name="{$sectionQName}">
      <xsl:call-template name="commonAttributes"/>

      <xsl:if test="not(./*[contains(@class,' topic/title ')])">
        <h3 class="condition-title">
          <xsl:call-template name="localize">
            <xsl:with-param name="message" select="'condition'"/>
          </xsl:call-template>
        </h3>
      </xsl:if>

      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

  <!-- condition/title =================================================== -->

  <xsl:template
    match="*[contains(@class,' troubleshooting/condition ')]/*[contains(@class,' topic/title ')]">
    <h3>
      <xsl:call-template name="commonAttributes">
        <xsl:with-param name="class">condition-title</xsl:with-param>
      </xsl:call-template>

      <xsl:call-template name="namedAnchor"/>
      <xsl:call-template name="titleContents"/>
    </h3>
  </xsl:template>

  <!-- troubleSolution =================================================== -->

  <xsl:template match="*[contains(@class,' troubleshooting/troubleSolution ')]">
    <xsl:element name="{$sectionQName}">
      <xsl:call-template name="commonAttributes"/>

      <h3 class="troubleSolution-title">
        <xsl:call-template name="localize">
          <xsl:with-param name="message" select="'troubleSolution'"/>
        </xsl:call-template>

        <xsl:if test="$troubleSolution-number-format ne '' and
                      count(../*[contains(@class,' troubleshooting/troubleSolution ')]) gt 1">
          <xsl:number format="{$troubleSolution-number-format}"/>
        </xsl:if>
      </h3>

      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

  <!-- cause ============================================================= -->

  <xsl:template match="*[contains(@class,' troubleshooting/cause ')]">
    <xsl:element name="{$sectionQName}">
      <xsl:call-template name="commonAttributes"/>

      <xsl:if test="not(./*[contains(@class,' topic/title ')])">
        <h4 class="cause-title">
          <xsl:call-template name="localize">
            <xsl:with-param name="message" select="'cause'"/>
          </xsl:call-template>

          <xsl:if test="$cause-number-format ne '' and
                        count(../*[contains(@class,' troubleshooting/cause ')]) gt 1">
            <xsl:number format="{$cause-number-format}"/>
          </xsl:if>
        </h4>
      </xsl:if>

      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

  <!-- remedy ============================================================ -->

  <xsl:template match="*[contains(@class,' troubleshooting/remedy ')]">
    <xsl:element name="{$sectionQName}">
      <xsl:call-template name="commonAttributes"/>

      <xsl:if test="not(./*[contains(@class,' topic/title ')])">
        <h4 class="remedy-title">
          <xsl:call-template name="localize">
            <xsl:with-param name="message" select="'remedy'"/>
          </xsl:call-template>

          <xsl:if test="$remedy-number-format ne '' and
                        count(../*[contains(@class,' troubleshooting/remedy ')]) gt 1">
            <xsl:number format="{$remedy-number-format}"/>
          </xsl:if>
        </h4>
      </xsl:if>

      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

  <!-- cause/title ======================================================= -->
  <!-- remedy/title ====================================================== -->

  <xsl:template
    match="*[contains(@class,' troubleshooting/cause ')]/*[contains(@class,' topic/title ')] |
           *[contains(@class,' troubleshooting/remedy ')]/*[contains(@class,' topic/title ')]">
    <xsl:variable name="parentType" select="u:classToElementName(../@class)"/>

    <h4>
      <xsl:call-template name="commonAttributes">
        <xsl:with-param name="class" select="concat($parentType, '-title')" />
      </xsl:call-template>

      <xsl:call-template name="namedAnchor"/>
      <xsl:call-template name="titleContents"/>
    </h4>
  </xsl:template>

  <!-- responsibleParty ================================================== -->

  <xsl:template match="*[contains(@class,' troubleshooting/responsibleParty ')]">
    <div>
      <xsl:call-template name="commonAttributes"/>

      <b class="responsibleParty-label">
        <xsl:call-template name="localize">
          <xsl:with-param name="message" select="'responsibleParty'"/>
        </xsl:call-template>
      </b>
      <xsl:text> </xsl:text>

      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
    </div>
  </xsl:template>

  <!-- remedy/steps-informal ============================================= -->
  <!-- task/steps-informal is a fully flaggable topic/section -->

  <xsl:template match="*[contains(@class,' troubleshooting/remedy ')]/*[contains(@class,' task/steps-informal ')] |
                       *[contains(@class,' troubleshooting/remedy ')]/ditac:flags-block/*[contains(@class,' task/steps-informal ')]">
    <xsl:call-template name="stepsInformalContents">
      <xsl:with-param name="sectionTitleQName" select="''"/>
    </xsl:call-template>
  </xsl:template>

  <!-- remedy/steps ====================================================== -->
  <!-- task/steps is a fully flaggable topic/ol -->

  <xsl:template match="*[contains(@class,' troubleshooting/remedy ')]/*[contains(@class,' task/steps ')] |
                       *[contains(@class,' troubleshooting/remedy ')]/ditac:flags-block/*[contains(@class,' task/steps ')]">
    <xsl:call-template name="stepsContents">
      <xsl:with-param name="sectionTitleQName" select="''"/>
    </xsl:call-template>
  </xsl:template>

  <!-- remedy/steps-unordered ============================================ -->
  <!-- task/steps-unordered is a fully flaggable topic/ul -->

  <xsl:template match="*[contains(@class,' troubleshooting/remedy ')]/*[contains(@class,' task/steps-unordered ')] |
                       *[contains(@class,' troubleshooting/remedy ')]/ditac:flags-block/*[contains(@class,' task/steps-unordered ')]">
    <xsl:call-template name="stepsUnorderedContents">
      <xsl:with-param name="sectionTitleQName" select="''"/>
    </xsl:call-template>
  </xsl:template>

</xsl:stylesheet>
