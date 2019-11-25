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
                exclude-result-prefixes="xs"
                version="2.0">

  <!-- Something like '100%' or '90%' -->
  <xsl:param name="default-table-width" select="''"/>

  <!-- 'none', 'top', 'bottom' 'both' -->
  <xsl:param name="chain-pages" select="'none'"/>

  <xsl:param name="chain-topics" select="'no'"/>

  <!-- 'yes', 'no', 
       'auto' (means: 'yes' if chain-topics=yes, otherwise 'no') -->
  <xsl:param name="ignore-navigation-links" select="'auto'"/>

  <xsl:param name="add-index-toc" select="'yes'"/>

  <xsl:param name="defaultXSLResourcesDir" 
             select="resolve-uri('resources/', document-uri(doc('')))"/>
  <xsl:param name="xsl-resources-directory" select="$defaultXSLResourcesDir"/>
  <xsl:variable name="xslResourcesDir" 
                select="if (ends-with($xsl-resources-directory, '/')) then
                            $xsl-resources-directory
                        else
                            concat($xsl-resources-directory, '/')"/>

  <xsl:param name="cssResourceName" select="'base.css'"/>

  <xsl:param name="css" select="''"/>
  <xsl:param name="custom-css" select="''"/>

  <!-- By default, serve XHTML as HTML.
       Specify 'application/xhtml+xml' if you prefer to serve XHTML as XML.
       Specify an empty string if you want to suppress the 
       meta http-equiv="Content-Type". -->
  <xsl:param name="xhtml-mime-type" select="'text/html'"/>

  <xsl:param name="generator-info" select="'XMLmind DITA Converter 3.7.0_01'"/>

  <!-- Do not redefine unless you change the files found in
       $xsl-resources-directory. -->
  <xsl:param name="note-icon-suffix" select="'.png'"/>
  <!-- Dimension unit is pixels. -->
  <xsl:param name="note-icon-width" select="'32'"/>
  <xsl:param name="note-icon-height" select="'32'"/>

  <xsl:param name="navigation-icon-suffix" select="'.png'"/>
  <xsl:param name="navigation-icon-width" select="'16'"/>
  <xsl:param name="navigation-icon-height" select="'16'"/>

  <xsl:param name="media-icon-suffix" select="'.png'"/>
  <xsl:param name="media-icon-width" select="'16'"/>
  <xsl:param name="media-icon-height" select="'16'"/>

  <xsl:param name="mark-external-links" select="'no'"/>
  <xsl:param name="external-link-icon-name" select="'new_window.png'"/>
  <xsl:param name="external-link-icon-width" select="'10'"/>
  <xsl:param name="external-link-icon-height" select="'10'"/>

  <!-- Unit: DPI -->
  <xsl:param name="screen-resolution" select="96"/>
  <!-- Unit: points (like a font size) -->
  <xsl:param name="em-size" select="10"/>

  <!-- One or more URLs separated by space characters.
       An URL may end with ';async', ';defer' or both. -->
  <xsl:param name="javascripts" select="''"/>
  <xsl:variable name="javascriptList" select="tokenize($javascripts, '\s+')"/>

  <!-- 'yes', 'no', 'auto' -->
  <xsl:param name="mathjax" select="'no'"/>

  <xsl:param name="mathjax-url" 
   select="'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=MML_CHTML;async'"/>

  <!-- DITA @format to HTML @type map. Contains DITA format/MIME type pairs.
       Example: 'txt text/plain xml application/xml html text/html'.
       By default, this map is empty, that is, 
       @format is not translated to @type. -->
  <xsl:param name="format-to-type" select="''"/>
  <xsl:variable name="formatToType"
    select="tokenize(lower-case(normalize-space($format-to-type)), '\s+')"/>

</xsl:stylesheet>
