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
                version="2.0">

  <xsl:import href="fo.xsl"/>

  <!-- All blocks but topic and section titles are indented 
       by $body-start-indent. -->

  <!-- Set to '0' (without any unit) to suppress. -->
  <xsl:param name="body-start-indent" select="'2pc'"/>

  <xsl:attribute-set name="topic">
    <xsl:attribute name="start-indent" select="$body-start-indent"/>
  </xsl:attribute-set>

  <xsl:attribute-set name="any-topic-title">
    <xsl:attribute name="start-indent" select="'0'"/>
  </xsl:attribute-set>

  <xsl:attribute-set name="section-title">
    <xsl:attribute name="start-indent" select="'0'"/>
  </xsl:attribute-set>

  <xsl:attribute-set name="glossentry">
    <xsl:attribute name="start-indent" select="$body-start-indent"/>
  </xsl:attribute-set>

  <xsl:attribute-set name="toc">
    <xsl:attribute name="start-indent" select="$body-start-indent"/>
  </xsl:attribute-set>

  <xsl:attribute-set name="booklist-container">
    <xsl:attribute name="start-indent" select="$body-start-indent"/>
  </xsl:attribute-set>

  <xsl:attribute-set name="booklist-title">
    <xsl:attribute name="start-indent" select="'0'"/>
  </xsl:attribute-set>

  <xsl:attribute-set name="index">
    <xsl:attribute name="start-indent" select="$body-start-indent"/>
  </xsl:attribute-set>

  <!-- More vertical space after topic and section titles. 
       Only part, appendices, chapter and appendix titles are underlined. -->

  <xsl:attribute-set name="frontmattersection-title">
    <xsl:attribute name="space-after.optimum">0.74em</xsl:attribute>
    <xsl:attribute name="space-after.minimum">0.7em</xsl:attribute>
    <xsl:attribute name="space-after.maximum">0.8em</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="topic-title">
    <xsl:attribute name="border-bottom-style">none</xsl:attribute>
    <xsl:attribute name="padding-bottom">0</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="part-title">
    <xsl:attribute name="border-bottom-style">solid</xsl:attribute>
    <xsl:attribute name="padding-bottom">0.21em</xsl:attribute>
    <xsl:attribute name="space-after.optimum">0.74em</xsl:attribute>
    <xsl:attribute name="space-after.minimum">0.7em</xsl:attribute>
    <xsl:attribute name="space-after.maximum">0.8em</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="chapter-title">
    <xsl:attribute name="border-bottom-style">solid</xsl:attribute>
    <xsl:attribute name="padding-bottom">0.21em</xsl:attribute>
    <xsl:attribute name="space-after.optimum">0.74em</xsl:attribute>
    <xsl:attribute name="space-after.minimum">0.7em</xsl:attribute>
    <xsl:attribute name="space-after.maximum">0.8em</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="appendices-title">
    <xsl:attribute name="border-bottom-style">solid</xsl:attribute>
    <xsl:attribute name="padding-bottom">0.21em</xsl:attribute>
    <xsl:attribute name="space-after.optimum">0.74em</xsl:attribute>
    <xsl:attribute name="space-after.minimum">0.7em</xsl:attribute>
    <xsl:attribute name="space-after.maximum">0.8em</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="appendix-title">
    <xsl:attribute name="border-bottom-style">solid</xsl:attribute>
    <xsl:attribute name="padding-bottom">0.21em</xsl:attribute>
    <xsl:attribute name="space-after.optimum">0.74em</xsl:attribute>
    <xsl:attribute name="space-after.minimum">0.7em</xsl:attribute>
    <xsl:attribute name="space-after.maximum">0.8em</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="section1-title">
    <xsl:attribute name="space-after.optimum">0.83em</xsl:attribute>
    <xsl:attribute name="space-after.minimum">0.8em</xsl:attribute>
    <xsl:attribute name="space-after.maximum">0.9em</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="section2-title">
    <xsl:attribute name="space-after.optimum">0.95em</xsl:attribute>
    <xsl:attribute name="space-after.minimum">0.9em</xsl:attribute>
    <xsl:attribute name="space-after.maximum">1em</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="section3-title">
    <xsl:attribute name="space-after.optimum">1.11em</xsl:attribute>
    <xsl:attribute name="space-after.minimum">1em</xsl:attribute>
    <xsl:attribute name="space-after.maximum">1.2em</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="section4-title">
    <xsl:attribute name="space-after.optimum">1.11em</xsl:attribute>
    <xsl:attribute name="space-after.minimum">1em</xsl:attribute>
    <xsl:attribute name="space-after.maximum">1.2em</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="section5-title">
    <xsl:attribute name="space-after.optimum">1.11em</xsl:attribute>
    <xsl:attribute name="space-after.minimum">1em</xsl:attribute>
    <xsl:attribute name="space-after.maximum">1.2em</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="section6-title">
    <xsl:attribute name="space-after.optimum">1.11em</xsl:attribute>
    <xsl:attribute name="space-after.minimum">1em</xsl:attribute>
    <xsl:attribute name="space-after.maximum">1.2em</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="section7-title">
    <xsl:attribute name="space-after.optimum">1.11em</xsl:attribute>
    <xsl:attribute name="space-after.minimum">1em</xsl:attribute>
    <xsl:attribute name="space-after.maximum">1.2em</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="section8-title">
    <xsl:attribute name="space-after.optimum">1.11em</xsl:attribute>
    <xsl:attribute name="space-after.minimum">1em</xsl:attribute>
    <xsl:attribute name="space-after.maximum">1.2em</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="section9-title">
    <xsl:attribute name="space-after.optimum">1.11em</xsl:attribute>
    <xsl:attribute name="space-after.minimum">1em</xsl:attribute>
    <xsl:attribute name="space-after.maximum">1.2em</xsl:attribute>
  </xsl:attribute-set>

  <xsl:attribute-set name="section-title">
    <xsl:attribute name="space-after.optimum">1.11em</xsl:attribute>
    <xsl:attribute name="space-after.minimum">1em</xsl:attribute>
    <xsl:attribute name="space-after.maximum">1.2em</xsl:attribute>
  </xsl:attribute-set>

</xsl:stylesheet>
