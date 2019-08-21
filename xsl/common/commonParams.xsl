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
                xmlns:u="http://www.xmlmind.com/namespace/ditac"
                exclude-result-prefixes="xs u"
                version="2.0">

  <!-- 'auto', 'none', 
        URI (if relative, relative to the current working directory) -->
  <xsl:param name="title-page" select="'auto'"/>

  <!-- 'frontmatter', 'backmatter', 'both', 'none'. -->
  <xsl:param name="extended-toc" select="'none'"/>

  <!-- One or more of: 'topic', 'chapter-only', 'table', 'fig', 
       'example', 'equation-figure', 'all'. -->
  <xsl:param name="number" select="''"/>
  <xsl:variable name="numberList" select="tokenize($number, '\s+')"/>

  <!-- 'I', 'i', 'A', 'a', '1' -->
  <xsl:param name="part-number-format" select="'I'"/>
  <xsl:param name="appendix-number-format" select="'A'"/>

  <xsl:param name="prepend-chapter-to-section-number" select="'no'"/>

  <xsl:param name="number-separator1" select="'.'"/>
  <xsl:param name="number-separator2" select="'-'"/>
  <xsl:param name="title-prefix-separator1" select="'. '"/>

  <xsl:param name="center" select="''"/>
  <xsl:variable name="centerList" select="tokenize($center, '\s+')"/>

  <xsl:param name="title-after" select="''"/>
  <xsl:variable name="titleAfterList" select="tokenize($title-after, '\s+')"/>

  <xsl:param name="use-note-icon" select="'no'"/>
  <xsl:param name="note-icon-list" select="'attention
                                            caution
                                            danger
                                            fastpath
                                            important
                                            note
                                            notice
                                            remember
                                            restriction
                                            tip
                                            warning
                                            trouble'"/>
  <xsl:variable name="noteIconList" select="tokenize($note-icon-list, '\s+')"/>

  <!-- One or more of: 'number', 'text'. -->
  <xsl:param name="xref-auto-text" select="'number'"/>
  <xsl:variable name="xrefAutoText" select="tokenize($xref-auto-text, '\s+')"/>

  <!-- One or more of: 'number', 'text'. -->
  <xsl:param name="link-auto-text" select="'number text'"/>
  <xsl:variable name="linkAutoText" select="tokenize($link-auto-text, '\s+')"/>

  <xsl:param name="mark-important-steps" select="'no'"/>

  <xsl:param name="highlight-source" select="'yes'"/>

  <xsl:param name="show-draft-comments" select="'no'"/>

  <xsl:param name="index-range-separator" select="'&#x2013;'"/>

  <!-- Default value means: keep relative href to external resource as is.
       This implies that such relative external resources are to be copied
       ``by hand'' to the output directory. -->
  <xsl:param name="external-resource-base" select="''"/>

  <xsl:param name="detect-audio-video" select="'yes'"/>

  <!-- URI of an image file. If the URI is relative, it is relative 
       to the current working directory. -->
  <xsl:param name="watermark-image" select="''" />
  <xsl:param name="watermarkImageName" 
             select="if ($watermark-image ne '') 
                     then concat('watermark.', u:extension($watermark-image))
                     else ''" />

  <xsl:param name="troubleSolution-number-format" select="' 1'"/>
  <xsl:param name="cause-number-format" select="' A'"/>
  <xsl:param name="remedy-number-format" select="' A'"/>

  <xsl:param name="equation-number-before" select="'('"/>
  <xsl:param name="equation-number-after" select="')'"/>

</xsl:stylesheet>
