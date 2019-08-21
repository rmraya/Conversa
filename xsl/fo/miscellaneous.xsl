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
                xmlns:ditac="http://www.xmlmind.com/ditac/schema/ditac"
                exclude-result-prefixes="xs ditac"
                version="2.0">

  <!-- dita ============================================================== -->

  <xsl:template match="dita">
    <xsl:apply-templates/>
  </xsl:template>

  <!-- draft-comment ===================================================== -->

  <xsl:attribute-set name="draft-comment">
    <xsl:attribute name="color">red</xsl:attribute>
    <xsl:attribute name="font-size">0.9em</xsl:attribute>
    <xsl:attribute name="line-height">1.48</xsl:attribute>
    <!-- No margins. -->
  </xsl:attribute-set>

  <xsl:attribute-set name="draft-comment-info">
    <xsl:attribute name="font-weight">bold</xsl:attribute>
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' topic/draft-comment ')]">
    <xsl:if test="$show-draft-comments eq 'yes'">
      <fo:block xsl:use-attribute-sets="draft-comment">
        <xsl:call-template name="commonAttributes"/>

        <xsl:if test="@author or @time or @disposition">
          <fo:inline xsl:use-attribute-sets="draft-comment-info">
            <xsl:value-of
                select="string-join((@time, @author, @disposition), ', ')"/>
            <xsl:text>: </xsl:text>
          </fo:inline>
        </xsl:if>

        <xsl:apply-templates/>
      </fo:block>
    </xsl:if>
  </xsl:template>

  <!-- fn ================================================================ -->

  <xsl:template match="*[contains(@class,' topic/fn ')]">
    <xsl:if test="not(@id)">
      <fo:footnote>
        <xsl:call-template name="footnoteCallout">
          <xsl:with-param name="footnote" select="."/>
        </xsl:call-template>

        <xsl:call-template name="footnoteBody">
          <xsl:with-param name="footnote" select="."/>
        </xsl:call-template>
      </fo:footnote>
    </xsl:if>
  </xsl:template>

  <!-- indexterm ========================================================= -->

  <xsl:template match="*[contains(@class,' topic/indexterm ')]">
    <fo:inline id="{@id}" hyphenate="false">
      <xsl:call-template name="addIndexAnchor">
        <xsl:with-param name="id" select="@id"/>
      </xsl:call-template>
      
      <!-- Workaround for FOP bug 48765 - 
           java.lang.NullPointerException in
           org.apache.fop.layoutmgr.inline.InlineStackingLayoutManager.
           getChangedKnuthElements -->

      <xsl:if test="$foProcessor eq 'FOP' and $hyphenate eq 'yes'">
        <xsl:text>&#xFEFF;</xsl:text>
      </xsl:if>
    </fo:inline>
  </xsl:template>

  <xsl:key name="indexAnchors" 
           match="ditac:indexList//ditac:indexAnchor" use="@id"/>
  <xsl:key name="indexAnchors2" 
           match="ditac:indexList//ditac:indexAnchor[@id2]" use="@id2"/>

  <xsl:template name="addIndexAnchor">
    <xsl:param name="id" select="''"/>

    <xsl:if test="$id ne '' and 
                  ($foProcessor eq 'XEP' or $foProcessor eq 'AHF')">

      <!-- Note that it is not possible to have indexterms after the indexlist
           because both XEP and AHF do their index entry processing in a
           single pass. -->

      <xsl:variable name="anchors" 
                    select="(key('indexAnchors', $id, $ditacLists), 
                             key('indexAnchors2', $id, $ditacLists))"/>

      <xsl:for-each select="$anchors">
        <xsl:variable name="key" select="string(../@xml:id)"/>

        <xsl:choose>
          <xsl:when test="$foProcessor eq 'XEP'">
            <xsl:choose>
              <xsl:when test="@id2 eq $id">
                <rx:end-index-range 
                  ref-id="{concat($key, '--', @number, '-', @number2)}"
                  xmlns:rx="http://www.renderx.com/XSL/Extensions"/>
              </xsl:when>
              <xsl:when test="exists(@id2) and @id eq $id">
                <rx:begin-index-range rx:key="{$key}"
                  id="{concat($key, '--', @number, '-', @number2)}"
                  xmlns:rx="http://www.renderx.com/XSL/Extensions"/>
              </xsl:when>
              <xsl:otherwise>
                <fo:inline rx:key="{$key}"
                           xmlns:rx="http://www.renderx.com/XSL/Extensions"/>
              </xsl:otherwise>
            </xsl:choose>
          </xsl:when>

          <xsl:when test="$foProcessor eq 'AHF'">
            <xsl:choose>
              <xsl:when test="@id2 eq $id">
                <fo:index-range-end
                  ref-id="{concat($key, '--', @number, '-', @number2)}"/>
              </xsl:when>
              <xsl:when test="exists(@id2) and @id eq $id">
                <fo:index-range-begin index-key="{$key}"
                  id="{concat($key, '--', @number, '-', @number2)}"/>
              </xsl:when>
              <xsl:otherwise>
                <fo:inline index-key="{$key}"/>
              </xsl:otherwise>
            </xsl:choose>
          </xsl:when>
        </xsl:choose>
      </xsl:for-each>
    </xsl:if>
  </xsl:template>

  <!-- OMITTED: index-base, index-see, index-see-also, index-sort-as -->

  <!-- indextermref ====================================================== -->

  <xsl:template match="*[contains(@class,' topic/indextermref ')]"/>

  <!-- tm ================================================================ -->
  
  <xsl:attribute-set name="tm">
  </xsl:attribute-set>

  <xsl:attribute-set name="tm-symbol">
  </xsl:attribute-set>

  <xsl:attribute-set name="tm-service-symbol">
    <xsl:attribute name="baseline-shift">super</xsl:attribute>
    <xsl:attribute name="font-size">smaller</xsl:attribute>
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' topic/tm ')]">
    <fo:inline xsl:use-attribute-sets="tm">
      <xsl:call-template name="commonAttributes"/>
      <xsl:apply-templates/>

      <xsl:choose>
        <xsl:when test="@tmtype eq 'reg'">
          <fo:inline xsl:use-attribute-sets="tm-symbol">&#x00AE;</fo:inline>
        </xsl:when>
        <xsl:when test="@tmtype eq 'service'">
          <fo:inline xsl:use-attribute-sets="tm-service-symbol">SM</fo:inline>
        </xsl:when>
        <xsl:otherwise>
          <fo:inline xsl:use-attribute-sets="tm-symbol">&#x2122;</fo:inline>
        </xsl:otherwise>
      </xsl:choose>
    </fo:inline>
  </xsl:template>

  <!-- data-about ======================================================== -->

  <xsl:template match="*[contains(@class,' topic/data-about ')]"/>

  <!-- data ============================================================== -->

  <xsl:template match="*[contains(@class,' topic/data ')]"/>

  <!-- foreign =========================================================== -->

  <xsl:template match="*[contains(@class,' topic/foreign ')]">
    <!-- No XSL-FO container having common attributes. -->

    <xsl:for-each select="./svg:svg" xmlns:svg="http://www.w3.org/2000/svg">
      <xsl:call-template name="processSVG"/>
    </xsl:for-each>

    <xsl:for-each select="./mml:math"
                  xmlns:mml="http://www.w3.org/1998/Math/MathML">
      <xsl:call-template name="processMathML"/>
    </xsl:for-each>
  </xsl:template>

  <xsl:template name="processSVG">
    <fo:instream-foreign-object>
      <xsl:copy-of select="."/>
    </fo:instream-foreign-object>
  </xsl:template>

  <xsl:template name="processMathML">
    <xsl:choose>
      <xsl:when test="$foProcessor eq 'XEP'">
        <!-- XEP does not support MathML. All we get is many error messages. -->
        <fo:inline xsl:use-attribute-sets="monospace-style">
          <xsl:value-of select="normalize-space(string(.))"/>
        </fo:inline>
      </xsl:when>
      <xsl:otherwise>
        <fo:instream-foreign-object>
          <xsl:copy-of select="."/>
        </fo:instream-foreign-object>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- unknown =========================================================== -->

  <xsl:template match="*[contains(@class,' topic/unknown ')]"/>

</xsl:stylesheet>
