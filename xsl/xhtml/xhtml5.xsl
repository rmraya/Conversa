<?xml version="1.0" encoding="UTF-8"?>
<!--
| Copyright (c) 2017-2021 XMLmind Software. All rights reserved.
|
| Author: Hussein Shafie
|
| This file is part of the XMLmind DITA Converter project.
| For conditions of distribution and use, see the accompanying LEGAL.txt file.
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                exclude-result-prefixes="xs"
                version="2.0">

  <xsl:import href="xhtmlBase.xsl"/>

  <!-- Output ============================================================ -->

  <xsl:param name="xhtmlVersion" select="'5.0'"/>

  <!-- By default, we generate a meta charset= -->
  <xsl:param name="xhtml-mime-type" select="''"/>

  <!-- Specify the output encoding here and also below. -->
  <!-- Important: if encoding is not UTF-8, change below 
       omit-xml-declaration from yes to no. -->
  <xsl:param name="xhtmlEncoding" select="'UTF-8'"/>

  <!-- Note that doctype-public="" doctype-system="" will not generate
       the HTML5 DOCTYPE. -->
  <xsl:output method="xhtml" encoding="UTF-8" omit-xml-declaration="yes"/>

  <!-- Overrides ========================================================= -->

  <xsl:param name="sectionQName" select="'section'"/>
  <xsl:param name="navQName" select="'nav'"/>

</xsl:stylesheet>
