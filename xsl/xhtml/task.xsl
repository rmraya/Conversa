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
  
  <!-- task LIKE topic -->
  <!-- taskbody LIKE body -->

  <!-- prereq ============================================================ -->
  <!-- context =========================================================== -->
  <!-- result ============================================================ -->
  <!-- postreq =========================================================== -->

  <xsl:template match="*[contains(@class,' task/prereq ')] |
                       *[contains(@class,' task/context ')] |
                       *[contains(@class,' task/result ')] |
                       *[contains(@class,' task/postreq ')]">
    <xsl:variable name="type" select="u:classToElementName(@class)"/>

    <xsl:element name="{$sectionQName}">
      <xsl:call-template name="commonAttributes"/>

      <h3 class="{$type}-title">
        <xsl:call-template name="localize">
          <xsl:with-param name="message" select="$type"/>
        </xsl:call-template>
      </h3>

      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

  <!-- tasktroubleshooting =============================================== -->

  <xsl:template match="*[contains(@class,' task/tasktroubleshooting ')]">
    <xsl:element name="{$sectionQName}">
      <xsl:call-template name="commonAttributes"/>

      <h3 class="tasktroubleshooting-title">
        <xsl:call-template name="localize">
          <xsl:with-param name="message" select="'trouble'"/>
        </xsl:call-template>
      </h3>

      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

  <!-- steps-informal ==================================================== -->

  <xsl:template match="*[contains(@class,' task/steps-informal ')]">
    <xsl:call-template name="stepsInformalContents"/>
  </xsl:template>

  <xsl:template name="stepsInformalContents">
    <xsl:param name="sectionTitleQName" select="'h3'"/>

    <xsl:element name="{$sectionQName}">
      <xsl:call-template name="commonAttributes"/>

      <xsl:if test="$sectionTitleQName ne ''">
        <xsl:element name="{$sectionTitleQName}">
          <xsl:attribute name="class" select="'steps-informal-title'"/>

          <xsl:call-template name="localize">
            <xsl:with-param name="message" select="'steps'"/>
          </xsl:call-template>
        </xsl:element>
      </xsl:if>

      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

  <!-- steps ============================================================= -->

  <xsl:template match="*[contains(@class,' task/steps ')]">
    <xsl:call-template name="stepsContents"/>
  </xsl:template>

  <xsl:template name="stepsContents">
    <xsl:param name="sectionTitleQName" select="'h3'"/>

    <xsl:element name="{$sectionQName}">
      <xsl:call-template name="commonAttributes"/>

      <xsl:if test="$sectionTitleQName ne ''">
        <xsl:element name="{$sectionTitleQName}">
          <xsl:attribute name="class" select="'steps-title'"/>

          <xsl:call-template name="localize">
            <xsl:with-param name="message" select="'steps'"/>
          </xsl:call-template>
        </xsl:element>
      </xsl:if>

      <xsl:variable name="class">
        <xsl:call-template name="stepListClass">
          <xsl:with-param name="suffix" select="'step-list'"/>
        </xsl:call-template>
      </xsl:variable>

      <xsl:call-template name="namedAnchor"/>
      <ol class="{$class}">
        <xsl:apply-templates/>
      </ol>
    </xsl:element>
  </xsl:template>

  <xsl:template name="stepListClass">
    <xsl:param name="suffix" select="'step-list'"/>

    <xsl:variable name="compact">
      <xsl:call-template name="compactStepListPrefix"/>
    </xsl:variable>

    <xsl:value-of select="concat($compact, $suffix)"/>
  </xsl:template>

  <xsl:template name="compactStepListPrefix">
    <xsl:choose>
      <xsl:when test="exists(./*[contains(@class,' task/stepsection ')] |
                             ./*/*[contains(@class,' task/info ') or 
                                   contains(@class,' task/substeps ') or 
                                   contains(@class,' task/tutorialinfo ') or 
                                   contains(@class,' task/stepxmp ') or 
                                   contains(@class,' task/choicetable ') or 
                                   contains(@class,' task/choices ') or 
                                   contains(@class,' task/stepresult ')
                                  ])"></xsl:when>
      <xsl:otherwise>compact-</xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- steps-unordered =================================================== -->

  <xsl:template match="*[contains(@class,' task/steps-unordered ')]">
    <xsl:call-template name="stepsUnorderedContents"/>
  </xsl:template>

  <xsl:template name="stepsUnorderedContents">
    <xsl:param name="sectionTitleQName" select="'h3'"/>

    <xsl:element name="{$sectionQName}">
      <xsl:call-template name="commonAttributes"/>

      <xsl:if test="$sectionTitleQName ne ''">
        <xsl:element name="{$sectionTitleQName}">
          <xsl:attribute name="class" select="'steps-title'"/>

          <xsl:call-template name="localize">
            <xsl:with-param name="message" select="'steps'"/>
          </xsl:call-template>
        </xsl:element>
      </xsl:if>

      <xsl:variable name="class">
        <xsl:call-template name="stepListClass">
          <xsl:with-param name="suffix" select="'unordered-step-list'"/>
        </xsl:call-template>
      </xsl:variable>

      <xsl:call-template name="namedAnchor"/>
      <ul class="{$class}">
        <xsl:apply-templates/>
      </ul>
    </xsl:element>
  </xsl:template>

  <!-- stepsection ======================================================= -->

  <xsl:template match="*[contains(@class,' task/stepsection ')]">
    <li>
      <xsl:call-template name="commonAttributes"/>
      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
    </li>
  </xsl:template>

  <!-- step ============================================================== -->

  <xsl:template match="*[contains(@class,' task/step ')]">
    <li>
      <xsl:call-template name="commonAttributes">
        <xsl:with-param name="classPrefix" 
          select="if (@importance) then concat(@importance, '-') else ''"/>
      </xsl:call-template>
      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
    </li>
  </xsl:template>

  <!-- cmd =============================================================== -->

  <xsl:template match="*[contains(@class,' task/cmd ')]">
    <!-- A step or substep always starts with a single cmd child. -->
    <xsl:call-template name="processParentStepImportance"/>

    <span>
      <xsl:call-template name="commonAttributes"/>
      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
    </span>
  </xsl:template>

  <xsl:template name="processParentStepImportance">
    <xsl:if test="$mark-important-steps eq 'yes'">
      <xsl:variable name="importance" select="string(../@importance)"/>
      <xsl:choose>
        <xsl:when test="$importance eq 'optional'">
          <i class="step-importance-optional">
            <xsl:call-template name="localize">
              <xsl:with-param name="message" select="'optional'"/>
            </xsl:call-template>
            <xsl:call-template name="localize">
              <xsl:with-param name="message" select="'periodSeparator'"/>
            </xsl:call-template>
          </i>
        </xsl:when>
        <xsl:when test="$importance eq 'required'">
          <b class="step-importance-required">
            <xsl:call-template name="localize">
              <xsl:with-param name="message" select="'required'"/>
            </xsl:call-template>
            <xsl:call-template name="localize">
              <xsl:with-param name="message" select="'periodSeparator'"/>
            </xsl:call-template>
          </b>
        </xsl:when>
      </xsl:choose>
    </xsl:if>
  </xsl:template>

  <!-- substeps ========================================================== -->

  <xsl:template match="*[contains(@class,' task/substeps ')]">
    <xsl:variable name="compact">
      <xsl:call-template name="compactStepListPrefix"/>
    </xsl:variable>

    <xsl:call-template name="namedAnchor"/>
    <ol>
      <xsl:call-template name="commonAttributes">
        <xsl:with-param name="classPrefix" select="$compact"/>
      </xsl:call-template>
      <xsl:apply-templates/>
    </ol>
  </xsl:template>

  <!-- substep =========================================================== -->

  <xsl:template match="*[contains(@class,' task/substep ')]">
    <li>
      <xsl:call-template name="commonAttributes">
        <xsl:with-param name="classPrefix" 
          select="if (@importance) then concat(@importance, '-') else ''"/>
      </xsl:call-template>
      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
    </li>
  </xsl:template>

  <!-- choicetable LIKE simpletable -->

  <!-- chhead ========================================================== -->

  <xsl:template match="*[contains(@class,' task/chhead ')]">
    <tr>
      <xsl:call-template name="commonAttributes">
        <xsl:with-param name="extraClasses" select="'table-header-style'"/>
      </xsl:call-template>
      <xsl:apply-templates/>
    </tr>
  </xsl:template>

  <!-- choptionhd ======================================================= -->

  <xsl:template match="*[contains(@class,' task/choptionhd ')]">
    <td>
      <xsl:call-template name="commonAttributes"/>
      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
    </td>
  </xsl:template>

  <!-- chdeschd ======================================================== -->

  <xsl:template match="*[contains(@class,' task/chdeschd ')]">
    <td>
      <xsl:call-template name="commonAttributes"/>
      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
    </td>
  </xsl:template>

  <!-- chrow ========================================================== -->

  <xsl:template match="*[contains(@class,' task/chrow ')]">
    <tr>
      <xsl:call-template name="commonAttributes"/>
      <xsl:apply-templates/>
    </tr>
  </xsl:template>

  <!-- choption ========================================================= -->

  <xsl:template match="*[contains(@class,' task/choption ')]">
    <td>
      <xsl:call-template name="commonAttributes"/>
      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
    </td>
  </xsl:template>

  <!-- chdesc ========================================================== -->

  <xsl:template match="*[contains(@class,' task/chdesc ')]">
    <td>
      <xsl:call-template name="commonAttributes"/>
      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
    </td>
  </xsl:template>

  <!-- choices ========================================================== -->

  <xsl:template match="*[contains(@class,' task/choices ')]">
    <xsl:call-template name="namedAnchor"/>
    <ul>
      <xsl:call-template name="commonAttributes"/>
      <xsl:apply-templates/>
    </ul>
  </xsl:template>

  <!-- choice =========================================================== -->

  <xsl:template match="*[contains(@class,' task/choice ')]">
    <li>
      <xsl:call-template name="commonAttributes"/>
      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
    </li>
  </xsl:template>

  <!-- info ============================================================== -->
  <!-- tutorialinfo ====================================================== -->
  <!-- stepxmp =========================================================== -->
  <!-- stepresult ======================================================== -->

  <xsl:template match="*[contains(@class,' task/info ')] |
                       *[contains(@class,' task/tutorialinfo ')] |
                       *[contains(@class,' task/stepxmp ')] |
                       *[contains(@class,' task/stepresult ')]">
    <div>
      <xsl:call-template name="commonAttributes"/>
      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
    </div>
  </xsl:template>

  <!-- steptroubleshooting =============================================== -->

  <xsl:template match="*[contains(@class,' task/steptroubleshooting ')]">
    <div>
      <xsl:call-template name="commonAttributes"/>

      <h4 class="steptroubleshooting-title">
        <xsl:call-template name="localize">
          <xsl:with-param name="message" select="'trouble'"/>
        </xsl:call-template>
      </h4>

      <xsl:call-template name="namedAnchor"/>
      <xsl:apply-templates/>
    </div>
  </xsl:template>

</xsl:stylesheet>
