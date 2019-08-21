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
                xmlns:xfc="http://www.xmlmind.com/foconverter/xsl/extensions"
                xmlns:u="http://www.xmlmind.com/namespace/ditac"
                exclude-result-prefixes="xs u"
                version="2.0">
  
  <!-- topic ============================================================= -->

  <xsl:attribute-set name="topic">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' topic/topic ')]">
    <fo:block xsl:use-attribute-sets="topic">
      <xsl:call-template name="commonAttributes2"/>
      <xsl:apply-templates/>
    </fo:block>
  </xsl:template>

  <!-- title ============================================================= -->

  <xsl:attribute-set name="title" use-attribute-sets="block-style">
    <xsl:attribute name="font-family" select="$title-font-family"/>
    <xsl:attribute name="font-weight">bold</xsl:attribute>
    <xsl:attribute name="color" select="$title-color"/>
    <xsl:attribute name="text-align">left</xsl:attribute>
    <xsl:attribute name="hyphenate">false</xsl:attribute>
    <xsl:attribute name="keep-with-next.within-column">always</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="any-topic-title" use-attribute-sets="title">
  </xsl:attribute-set>

  <!-- Applies to the title of any ``untyped topicref'' (not a preface,
       not a dedication, etc) which is a direct child of frontmatter. -->
  <xsl:attribute-set name="frontmattersection-title"
                     use-attribute-sets="any-topic-title">
    <xsl:attribute name="font-size">1.8em</xsl:attribute>
    <xsl:attribute name="line-height">1</xsl:attribute><!--Not 0.74-->
    <xsl:attribute name="space-before.optimum">0.74em</xsl:attribute>
    <xsl:attribute name="space-before.minimum">0.7em</xsl:attribute>
    <xsl:attribute name="space-before.maximum">0.8em</xsl:attribute>
    <xsl:attribute name="space-after.optimum">0.37em</xsl:attribute>
    <xsl:attribute name="space-after.minimum">0.3em</xsl:attribute>
    <xsl:attribute name="space-after.maximum">0.4em</xsl:attribute>
  </xsl:attribute-set>

  <!-- Applies to the title of any ``untyped topicref'' (not a preface,
       not a dedication, etc) which is a direct child of backmatter. -->
  <xsl:attribute-set name="backmattersection-title" 
                     use-attribute-sets="frontmattersection-title">
  </xsl:attribute-set>

  <xsl:attribute-set name="amendments-title" 
                     use-attribute-sets="frontmattersection-title">
  </xsl:attribute-set>

  <xsl:attribute-set name="bookabstract-title" 
                     use-attribute-sets="frontmattersection-title">
  </xsl:attribute-set>

  <xsl:attribute-set name="colophon-title" 
                     use-attribute-sets="frontmattersection-title">
  </xsl:attribute-set>

  <xsl:attribute-set name="dedication-title" 
                     use-attribute-sets="frontmattersection-title">
  </xsl:attribute-set>

  <xsl:attribute-set name="draftintro-title" 
                     use-attribute-sets="frontmattersection-title">
  </xsl:attribute-set>

  <xsl:attribute-set name="notices-title" 
                     use-attribute-sets="frontmattersection-title">
  </xsl:attribute-set>

  <xsl:attribute-set name="preface-title" 
                     use-attribute-sets="frontmattersection-title">
  </xsl:attribute-set>

  <xsl:attribute-set name="abbrevlist-title" 
                     use-attribute-sets="frontmattersection-title">
  </xsl:attribute-set>

  <xsl:attribute-set name="bibliolist-title" 
                     use-attribute-sets="frontmattersection-title">
  </xsl:attribute-set>

  <xsl:attribute-set name="glossarylist-title" 
                     use-attribute-sets="frontmattersection-title">
  </xsl:attribute-set>

  <xsl:attribute-set name="trademarklist-title" 
                     use-attribute-sets="frontmattersection-title">
  </xsl:attribute-set>

  <xsl:attribute-set name="topic-title" use-attribute-sets="any-topic-title">
    <xsl:attribute name="font-size">1.6em</xsl:attribute>
    <xsl:attribute name="line-height">1</xsl:attribute><!--Not 0.83-->
    <xsl:attribute name="border-bottom-width">0.5pt</xsl:attribute>
    <xsl:attribute name="border-bottom-style">solid</xsl:attribute>
    <xsl:attribute name="border-bottom-color" select="$title-color"/>
    <xsl:attribute name="padding-bottom">0.21em</xsl:attribute>
    <xsl:attribute name="space-before.optimum">0.83em</xsl:attribute>
    <xsl:attribute name="space-before.minimum">0.8em</xsl:attribute>
    <xsl:attribute name="space-before.maximum">0.9em</xsl:attribute>
    <xsl:attribute name="space-after.optimum">0.41em</xsl:attribute>
    <xsl:attribute name="space-after.minimum">0.4em</xsl:attribute>
    <xsl:attribute name="space-after.maximum">0.5em</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="part-title" use-attribute-sets="topic-title">
    <xsl:attribute name="font-size">1.8em</xsl:attribute>
    <xsl:attribute name="line-height">1</xsl:attribute><!--Not 0.74-->
    <xsl:attribute name="border-bottom-width">4pt</xsl:attribute>
    <xsl:attribute name="space-before.optimum">0.74em</xsl:attribute>
    <xsl:attribute name="space-before.minimum">0.7em</xsl:attribute>
    <xsl:attribute name="space-before.maximum">0.8em</xsl:attribute>
    <xsl:attribute name="space-after.optimum">0.37em</xsl:attribute>
    <xsl:attribute name="space-after.minimum">0.3em</xsl:attribute>
    <xsl:attribute name="space-after.maximum">0.4em</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="chapter-title" use-attribute-sets="topic-title">
    <xsl:attribute name="font-size">1.8em</xsl:attribute>
    <xsl:attribute name="line-height">1</xsl:attribute><!--Not 0.74-->
    <xsl:attribute name="border-bottom-width">2pt</xsl:attribute>
    <xsl:attribute name="space-before.optimum">0.74em</xsl:attribute>
    <xsl:attribute name="space-before.minimum">0.7em</xsl:attribute>
    <xsl:attribute name="space-before.maximum">0.8em</xsl:attribute>
    <xsl:attribute name="space-after.optimum">0.37em</xsl:attribute>
    <xsl:attribute name="space-after.minimum">0.3em</xsl:attribute>
    <xsl:attribute name="space-after.maximum">0.4em</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="appendices-title" use-attribute-sets="topic-title">
    <xsl:attribute name="font-size">1.8em</xsl:attribute>
    <xsl:attribute name="line-height">1</xsl:attribute><!--Not 0.74-->
    <xsl:attribute name="border-bottom-width">4pt</xsl:attribute>
    <xsl:attribute name="space-before.optimum">0.74em</xsl:attribute>
    <xsl:attribute name="space-before.minimum">0.7em</xsl:attribute>
    <xsl:attribute name="space-before.maximum">0.8em</xsl:attribute>
    <xsl:attribute name="space-after.optimum">0.37em</xsl:attribute>
    <xsl:attribute name="space-after.minimum">0.3em</xsl:attribute>
    <xsl:attribute name="space-after.maximum">0.4em</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="appendix-title" use-attribute-sets="topic-title">
    <xsl:attribute name="font-size">1.8em</xsl:attribute>
    <xsl:attribute name="line-height">1</xsl:attribute><!--Not 0.74-->
    <xsl:attribute name="border-bottom-width">2pt</xsl:attribute>
    <xsl:attribute name="space-before.optimum">0.74em</xsl:attribute>
    <xsl:attribute name="space-before.minimum">0.7em</xsl:attribute>
    <xsl:attribute name="space-before.maximum">0.8em</xsl:attribute>
    <xsl:attribute name="space-after.optimum">0.37em</xsl:attribute>
    <xsl:attribute name="space-after.minimum">0.3em</xsl:attribute>
    <xsl:attribute name="space-after.maximum">0.4em</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="section1-title" use-attribute-sets="topic-title">
  </xsl:attribute-set>

  <xsl:attribute-set name="section2-title" use-attribute-sets="topic-title">
    <xsl:attribute name="font-size">1.4em</xsl:attribute>
    <xsl:attribute name="line-height">1</xsl:attribute><!--Not 0.95-->
    <xsl:attribute name="space-before.optimum">0.95em</xsl:attribute>
    <xsl:attribute name="space-before.minimum">0.9em</xsl:attribute>
    <xsl:attribute name="space-before.maximum">1em</xsl:attribute>
    <xsl:attribute name="space-after.optimum">0.47em</xsl:attribute>
    <xsl:attribute name="space-after.minimum">0.4em</xsl:attribute>
    <xsl:attribute name="space-after.maximum">0.5em</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="section3-title" use-attribute-sets="topic-title">
    <xsl:attribute name="font-size">1.2em</xsl:attribute>
    <xsl:attribute name="line-height">1.11</xsl:attribute>
    <xsl:attribute name="space-before.optimum">1.11em</xsl:attribute>
    <xsl:attribute name="space-before.minimum">1em</xsl:attribute>
    <xsl:attribute name="space-before.maximum">1.2em</xsl:attribute>
    <xsl:attribute name="space-after.optimum">0.55em</xsl:attribute>
    <xsl:attribute name="space-after.minimum">0.5em</xsl:attribute>
    <xsl:attribute name="space-after.maximum">0.6em</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="section4-title" use-attribute-sets="topic-title">
    <xsl:attribute name="font-size">1.2em</xsl:attribute>
    <xsl:attribute name="line-height">1.11</xsl:attribute>
    <xsl:attribute name="space-before.optimum">1.11em</xsl:attribute>
    <xsl:attribute name="space-before.minimum">1em</xsl:attribute>
    <xsl:attribute name="space-before.maximum">1.2em</xsl:attribute>
    <xsl:attribute name="space-after.optimum">0.55em</xsl:attribute>
    <xsl:attribute name="space-after.minimum">0.5em</xsl:attribute>
    <xsl:attribute name="space-after.maximum">0.6em</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="section5-title" use-attribute-sets="topic-title">
    <xsl:attribute name="font-size">1.2em</xsl:attribute>
    <xsl:attribute name="line-height">1.11</xsl:attribute>
    <xsl:attribute name="space-before.optimum">1.11em</xsl:attribute>
    <xsl:attribute name="space-before.minimum">1em</xsl:attribute>
    <xsl:attribute name="space-before.maximum">1.2em</xsl:attribute>
    <xsl:attribute name="space-after.optimum">0.55em</xsl:attribute>
    <xsl:attribute name="space-after.minimum">0.5em</xsl:attribute>
    <xsl:attribute name="space-after.maximum">0.6em</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="section6-title" use-attribute-sets="topic-title">
    <xsl:attribute name="font-size">1.2em</xsl:attribute>
    <xsl:attribute name="line-height">1.11</xsl:attribute>
    <xsl:attribute name="space-before.optimum">1.11em</xsl:attribute>
    <xsl:attribute name="space-before.minimum">1em</xsl:attribute>
    <xsl:attribute name="space-before.maximum">1.2em</xsl:attribute>
    <xsl:attribute name="space-after.optimum">0.55em</xsl:attribute>
    <xsl:attribute name="space-after.minimum">0.5em</xsl:attribute>
    <xsl:attribute name="space-after.maximum">0.6em</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="section7-title" use-attribute-sets="topic-title">
    <xsl:attribute name="font-size">1.2em</xsl:attribute>
    <xsl:attribute name="line-height">1.11</xsl:attribute>
    <xsl:attribute name="space-before.optimum">1.11em</xsl:attribute>
    <xsl:attribute name="space-before.minimum">1em</xsl:attribute>
    <xsl:attribute name="space-before.maximum">1.2em</xsl:attribute>
    <xsl:attribute name="space-after.optimum">0.55em</xsl:attribute>
    <xsl:attribute name="space-after.minimum">0.5em</xsl:attribute>
    <xsl:attribute name="space-after.maximum">0.6em</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="section8-title" use-attribute-sets="topic-title">
    <xsl:attribute name="font-size">1.2em</xsl:attribute>
    <xsl:attribute name="line-height">1.11</xsl:attribute>
    <xsl:attribute name="space-before.optimum">1.11em</xsl:attribute>
    <xsl:attribute name="space-before.minimum">1em</xsl:attribute>
    <xsl:attribute name="space-before.maximum">1.2em</xsl:attribute>
    <xsl:attribute name="space-after.optimum">0.55em</xsl:attribute>
    <xsl:attribute name="space-after.minimum">0.5em</xsl:attribute>
    <xsl:attribute name="space-after.maximum">0.6em</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="section9-title" use-attribute-sets="topic-title">
    <xsl:attribute name="font-size">1.2em</xsl:attribute>
    <xsl:attribute name="line-height">1.11</xsl:attribute>
    <xsl:attribute name="space-before.optimum">1.11em</xsl:attribute>
    <xsl:attribute name="space-before.minimum">1em</xsl:attribute>
    <xsl:attribute name="space-before.maximum">1.2em</xsl:attribute>
    <xsl:attribute name="space-after.optimum">0.55em</xsl:attribute>
    <xsl:attribute name="space-after.minimum">0.5em</xsl:attribute>
    <xsl:attribute name="space-after.maximum">0.6em</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="section-title" use-attribute-sets="title">
    <xsl:attribute name="font-size">1.2em</xsl:attribute>
    <xsl:attribute name="line-height">1.11</xsl:attribute>
    <xsl:attribute name="space-before.optimum">1.11em</xsl:attribute>
    <xsl:attribute name="space-before.minimum">1em</xsl:attribute>
    <xsl:attribute name="space-before.maximum">1.2em</xsl:attribute>
    <xsl:attribute name="space-after.optimum">0.55em</xsl:attribute>
    <xsl:attribute name="space-after.minimum">0.5em</xsl:attribute>
    <xsl:attribute name="space-after.maximum">0.6em</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="example-title" use-attribute-sets="section-title">
  </xsl:attribute-set>

  <xsl:attribute-set name="refsyn-title" use-attribute-sets="section-title">
  </xsl:attribute-set>

  <!-- Not an actual title. Just a caption. -->
  <xsl:attribute-set name="any-figure-title" use-attribute-sets="caption-style">
    <xsl:attribute name="text-align">left</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="fig-title" use-attribute-sets="any-figure-title">
  </xsl:attribute-set>

  <xsl:attribute-set name="equation-figure-title"
                     use-attribute-sets="any-figure-title">
  </xsl:attribute-set>

  <xsl:attribute-set name="table-title" use-attribute-sets="any-figure-title">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' topic/title ')]">
    <xsl:choose>
      <xsl:when test="parent::*[contains(@class,' topic/topic ')]">
        <xsl:variable name="titleClass">
          <xsl:call-template name="topicTitleClass"/>
        </xsl:variable>
        <xsl:choose>
          <xsl:when test="$titleClass eq 'part-title'">
            <fo:block xsl:use-attribute-sets="part-title">
              <xsl:call-template name="topicTitle"/>
            </fo:block>
          </xsl:when>
          <xsl:when test="$titleClass eq 'chapter-title'">
            <fo:block xsl:use-attribute-sets="chapter-title">
              <xsl:call-template name="topicTitle"/>
            </fo:block>
          </xsl:when>
          <xsl:when test="$titleClass eq 'appendices-title'">
            <fo:block xsl:use-attribute-sets="appendices-title">
              <xsl:call-template name="topicTitle"/>
            </fo:block>
          </xsl:when>
          <xsl:when test="$titleClass eq 'appendix-title'">
            <fo:block xsl:use-attribute-sets="appendix-title">
              <xsl:call-template name="topicTitle"/>
            </fo:block>
          </xsl:when>
          <xsl:when test="$titleClass eq 'section1-title'">
            <fo:block xsl:use-attribute-sets="section1-title">
              <xsl:call-template name="topicTitle"/>
            </fo:block>
          </xsl:when>
          <xsl:when test="$titleClass eq 'section2-title'">
            <fo:block xsl:use-attribute-sets="section2-title">
              <xsl:call-template name="topicTitle"/>
            </fo:block>
          </xsl:when>
          <xsl:when test="$titleClass eq 'section3-title'">
            <fo:block xsl:use-attribute-sets="section3-title">
              <xsl:call-template name="topicTitle"/>
            </fo:block>
          </xsl:when>
          <xsl:when test="$titleClass eq 'section4-title'">
            <fo:block xsl:use-attribute-sets="section4-title">
              <xsl:call-template name="topicTitle"/>
            </fo:block>
          </xsl:when>
          <xsl:when test="$titleClass eq 'section5-title'">
            <fo:block xsl:use-attribute-sets="section5-title">
              <xsl:call-template name="topicTitle"/>
            </fo:block>
          </xsl:when>
          <xsl:when test="$titleClass eq 'section6-title'">
            <fo:block xsl:use-attribute-sets="section6-title">
              <xsl:call-template name="topicTitle"/>
            </fo:block>
          </xsl:when>
          <xsl:when test="$titleClass eq 'section7-title'">
            <fo:block xsl:use-attribute-sets="section7-title">
              <xsl:call-template name="topicTitle"/>
            </fo:block>
          </xsl:when>
          <xsl:when test="$titleClass eq 'section8-title'">
            <fo:block xsl:use-attribute-sets="section8-title">
              <xsl:call-template name="topicTitle"/>
            </fo:block>
          </xsl:when>
          <xsl:when test="$titleClass eq 'section9-title'">
            <fo:block xsl:use-attribute-sets="section9-title">
              <xsl:call-template name="topicTitle"/>
            </fo:block>
          </xsl:when>
          <xsl:when test="$titleClass eq 'frontmattersection-title'">
            <fo:block xsl:use-attribute-sets="frontmattersection-title">
              <xsl:call-template name="topicTitle"/>
            </fo:block>
          </xsl:when>
          <xsl:when test="$titleClass eq 'backmattersection-title'">
            <fo:block xsl:use-attribute-sets="backmattersection-title">
              <xsl:call-template name="topicTitle"/>
            </fo:block>
          </xsl:when>
          <xsl:when test="$titleClass eq 'amendments-title'">
            <fo:block xsl:use-attribute-sets="amendments-title">
              <xsl:call-template name="topicTitle"/>
            </fo:block>
          </xsl:when>
          <xsl:when test="$titleClass eq 'bookabstract-title'">
            <fo:block xsl:use-attribute-sets="bookabstract-title">
              <xsl:call-template name="topicTitle"/>
            </fo:block>
          </xsl:when>
          <xsl:when test="$titleClass eq 'colophon-title'">
            <fo:block xsl:use-attribute-sets="colophon-title">
              <xsl:call-template name="topicTitle"/>
            </fo:block>
          </xsl:when>
          <xsl:when test="$titleClass eq 'dedication-title'">
            <fo:block xsl:use-attribute-sets="dedication-title">
              <xsl:call-template name="topicTitle"/>
            </fo:block>
          </xsl:when>
          <xsl:when test="$titleClass eq 'draftintro-title'">
            <fo:block xsl:use-attribute-sets="draftintro-title">
              <xsl:call-template name="topicTitle"/>
            </fo:block>
          </xsl:when>
          <xsl:when test="$titleClass eq 'notices-title'">
            <fo:block xsl:use-attribute-sets="notices-title">
              <xsl:call-template name="topicTitle"/>
            </fo:block>
          </xsl:when>
          <xsl:when test="$titleClass eq 'preface-title'">
            <fo:block xsl:use-attribute-sets="preface-title">
              <xsl:call-template name="topicTitle"/>
            </fo:block>
          </xsl:when>
          <xsl:when test="$titleClass eq 'abbrevlist-title'">
            <fo:block xsl:use-attribute-sets="abbrevlist-title">
              <xsl:call-template name="topicTitle"/>
            </fo:block>
          </xsl:when>
          <xsl:when test="$titleClass eq 'bibliolist-title'">
            <fo:block xsl:use-attribute-sets="bibliolist-title">
              <xsl:call-template name="topicTitle"/>
            </fo:block>
          </xsl:when>
          <xsl:when test="$titleClass eq 'glossarylist-title'">
            <fo:block xsl:use-attribute-sets="glossarylist-title">
              <xsl:call-template name="topicTitle"/>
            </fo:block>
          </xsl:when>
          <xsl:when test="$titleClass eq 'trademarklist-title'">
            <fo:block xsl:use-attribute-sets="trademarklist-title">
              <xsl:call-template name="topicTitle"/>
            </fo:block>
          </xsl:when>
          <xsl:otherwise>
            <fo:block xsl:use-attribute-sets="topic-title">
              <xsl:call-template name="topicTitle"/>
            </fo:block>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:when>

      <xsl:when test="parent::*[contains(@class,' topic/section ')]">
        <fo:block xsl:use-attribute-sets="section-title">
          <xsl:call-template name="commonAttributes"/>

          <!-- Sections are not numbered. -->

          <xsl:call-template name="titleContents"/>
        </fo:block>
      </xsl:when>

      <xsl:when test="parent::*[contains(@class,' reference/refsyn ')]">
        <fo:block xsl:use-attribute-sets="refsyn-title">
          <xsl:call-template name="commonAttributes"/>

          <!-- Refsyns are not numbered. -->

          <xsl:call-template name="titleContents"/>
        </fo:block>
      </xsl:when>

      <xsl:when test="parent::*[contains(@class,' topic/example ')]">
        <fo:block xsl:use-attribute-sets="example-title">
          <xsl:call-template name="commonAttributes"/>

          <xsl:call-template name="titlePrefix"/>

          <xsl:call-template name="titleContents"/>
        </fo:block>
      </xsl:when>

      <!-- Before fig. equation-figure is also a fig. -->
      <xsl:when
        test="parent::*[contains(@class,' equation-d/equation-figure ')]">
        <fo:block xsl:use-attribute-sets="equation-figure-title">
          <xsl:call-template name="captionAttributes"/>
          <xsl:call-template name="commonAttributes"/>

          <xsl:call-template name="titlePrefix"/>

          <xsl:call-template name="titleContents"/>
        </fo:block>
      </xsl:when>

      <xsl:when test="parent::*[contains(@class,' topic/fig ')]">
        <fo:block xsl:use-attribute-sets="fig-title">
          <xsl:call-template name="captionAttributes"/>
          <xsl:call-template name="commonAttributes"/>

          <xsl:call-template name="titlePrefix"/>

          <xsl:call-template name="titleContents"/>
        </fo:block>
      </xsl:when>

      <xsl:when test="parent::*[contains(@class,' topic/table ')]">
        <fo:block xsl:use-attribute-sets="table-title">
          <xsl:call-template name="captionAttributes"/>
          <xsl:call-template name="commonAttributes"/>

          <xsl:call-template name="titlePrefix"/>

          <xsl:call-template name="titleContents"/>
        </fo:block>
      </xsl:when>

      <xsl:otherwise>
        <fo:block xsl:use-attribute-sets="title">
          <xsl:call-template name="commonAttributes"/>

          <!-- No need to call titlePrefix. -->

          <xsl:call-template name="titleContents"/>
        </fo:block>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="topicTitle">
    <xsl:call-template name="commonAttributes"/>
    <xsl:call-template name="outlineLevel"/>

    <xsl:variable name="runningTitle" 
                  select="u:runningSection1Title(string(parent::*/@id))"/>
    <xsl:if test="$runningTitle ne ''">
      <fo:marker marker-class-name="section1-title">
        <xsl:value-of select="$runningTitle"/>
      </fo:marker>
    </xsl:if>

    <xsl:variable name="prefix">
      <xsl:call-template name="titlePrefix"/>
    </xsl:variable>

    <fo:marker marker-class-name="topic-title">
      <xsl:value-of select="concat($prefix, string(.))"/>
    </fo:marker>

    <xsl:value-of select="$prefix"/>
    <xsl:call-template name="titleContents"/>

    <xsl:call-template name="addIndexAnchor">
      <xsl:with-param name="id" select="@id"/>
    </xsl:call-template>
  </xsl:template>

  <xsl:template name="outlineLevel">
    <xsl:if test="$foProcessor eq 'XFC'">
      <!-- A document map is not a TOC. All parts of the document, including
           the TOC, should appear here. -->
      <xsl:variable name="parent" select="parent::*"/>
      <xsl:variable name="id" select="string($parent/@id)"/>

      <xsl:if test="$id ne ''">
        <xsl:variable name="topicEntry" select="u:topicEntry($id)"/>
        <xsl:if test="exists($topicEntry)">
          <xsl:variable name="level" 
                        select="count(tokenize($topicEntry/@number, '\s+'))"/>
          <xsl:if test="$level ge 1 and $level le 9">
            <xsl:attribute name="xfc:outline-level" select="$level"/>
          </xsl:if>
        </xsl:if>
      </xsl:if>
    </xsl:if>
  </xsl:template>

  <xsl:template name="captionAttributes">
    <xsl:variable name="parent" select="u:classToElementName(../@class)"/>

    <xsl:if test="index-of($centerList, $parent) ge 1">
      <xsl:attribute name="text-align">center</xsl:attribute>
    </xsl:if>

    <xsl:choose>
      <xsl:when test="index-of($titleAfterList, $parent) ge 1">
        <xsl:attribute
          name="keep-with-previous.within-column">always</xsl:attribute>
      </xsl:when>
      <xsl:otherwise>
        <xsl:attribute
          name="keep-with-next.within-column">always</xsl:attribute>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- titlealts ========================================================= -->

  <xsl:template match="*[contains(@class,' topic/titlealts ')]"/>

  <!-- OMITTED: navtitle, searchtitle -->

  <!-- abstract ========================================================== -->

  <xsl:attribute-set name="abstract" use-attribute-sets="block-style">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' topic/abstract ')]">
    <fo:block xsl:use-attribute-sets="abstract">
      <xsl:call-template name="commonAttributes"/>
      <xsl:apply-templates/>
    </fo:block>
  </xsl:template>

  <!-- shortdesc ========================================================= -->

  <xsl:attribute-set name="shortdesc" use-attribute-sets="block-style">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' topic/shortdesc ')]">
    <fo:block xsl:use-attribute-sets="shortdesc">
      <xsl:call-template name="commonAttributes"/>
      <xsl:apply-templates/>
    </fo:block>
  </xsl:template>

  <!-- body ============================================================== -->

  <xsl:attribute-set name="body" use-attribute-sets="block-style">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' topic/body ')]">
    <fo:block xsl:use-attribute-sets="body">
      <xsl:call-template name="commonAttributes"/>
      <xsl:apply-templates/>
    </fo:block>
  </xsl:template>

  <!-- bodydiv =========================================================== -->
  <!-- sectiondiv ======================================================== -->
  <!-- div =============================================================== -->

  <!-- Transparent containers. No attribute-sets. -->

  <xsl:template match="*[contains(@class,' topic/bodydiv ')] |
                       *[contains(@class,' topic/sectiondiv ')] |
                       *[contains(@class,' topic/div ')]">
    <fo:block>
      <xsl:call-template name="commonAttributes"/>
      <xsl:apply-templates/>
    </fo:block>
  </xsl:template>

  <!-- section =========================================================== -->

  <xsl:attribute-set name="section" use-attribute-sets="block-style">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' topic/section ')]">
    <fo:block xsl:use-attribute-sets="section">
      <xsl:call-template name="commonAttributes2"/>
      <xsl:apply-templates/>
    </fo:block>
  </xsl:template>

  <!-- example =========================================================== -->

  <xsl:attribute-set name="example" use-attribute-sets="section">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' topic/example ')]">
    <fo:block xsl:use-attribute-sets="example">
      <xsl:call-template name="commonAttributes2"/>

      <xsl:if test="not(./*[contains(@class,' topic/title ')])">
        <fo:block xsl:use-attribute-sets="example-title">
          <xsl:call-template name="localize">
            <xsl:with-param name="message" select="'example'"/>
          </xsl:call-template>
        </fo:block>
      </xsl:if>

      <xsl:apply-templates/>
    </fo:block>
  </xsl:template>

  <!-- related-links ===================================================== -->

  <xsl:attribute-set name="related-links" use-attribute-sets="block-style">
  </xsl:attribute-set>

  <xsl:attribute-set name="related-links-title"
                     use-attribute-sets="section-title">
  </xsl:attribute-set>

  <xsl:template match="*[contains(@class,' topic/related-links ')]">
    <xsl:variable name="navigationChildren" 
      select="for $c in ./*
              return
                  if ($c[contains(@class,' topic/linkpool ') and
                         (ends-with(@mapkeyref, 'type=sequence-parent') or 
                          ends-with(@mapkeyref, 'type=sequence-members') or 
                          ends-with(@mapkeyref, 'type=family-parent') or 
                          ends-with(@mapkeyref, 'type=family-members') or 
                          ends-with(@mapkeyref, 'type=unordered-parent') or 
                          ends-with(@mapkeyref, 'type=unordered-members') or 
                          ends-with(@mapkeyref, 'type=choice-parent') or 
                          ends-with(@mapkeyref, 'type=choice-members'))])
                  then $c
                  else ()" />

    <xsl:variable name="otherChildren" 
                  select="./* except $navigationChildren" />

    <xsl:if test="count($otherChildren) gt 0">
      <xsl:choose>
        <xsl:when test="parent::*[contains(@class,' glossentry/glossentry ')]">
          <fo:block xsl:use-attribute-sets="glossentry-related-links">
            <xsl:call-template name="commonAttributes"/>

            <fo:block xsl:use-attribute-sets="glossentry-related-links-title">
              <xsl:call-template name="relatedLinksTitleText"/>
            </fo:block>

            <xsl:apply-templates select="$otherChildren"/>
          </fo:block>
        </xsl:when>

        <xsl:otherwise>
          <fo:block xsl:use-attribute-sets="related-links">
            <xsl:call-template name="commonAttributes"/>

            <fo:block xsl:use-attribute-sets="related-links-title">
              <xsl:call-template name="relatedLinksTitleText"/>
            </fo:block>

            <xsl:apply-templates select="$otherChildren"/>
          </fo:block>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:if>

    <!-- In the case of a print media, $navigationChildren are ignored. -->
  </xsl:template>

  <xsl:template name="relatedLinksTitleText">
    <xsl:variable name="key">
      <xsl:choose>
        <xsl:when test="@type eq 'concept'">relatedConcepts</xsl:when>
        <xsl:when test="@type eq 'task'">relatedTasks</xsl:when>
        <xsl:when test="@type eq 'reference'">relatedReference</xsl:when>
        <xsl:otherwise>relatedLinks</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <xsl:call-template name="localize">
      <xsl:with-param name="message" select="$key"/>
    </xsl:call-template>
  </xsl:template>

</xsl:stylesheet>
