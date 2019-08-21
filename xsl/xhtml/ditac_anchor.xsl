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
                xmlns:ditac="http://www.xmlmind.com/ditac/schema/ditac"
                exclude-result-prefixes="xs ditac"
                version="2.0">

  <xsl:template match="ditac:anchor">
    <p>
      <a id="{@xml:id}">
        <xsl:if test="$xhtmlVersion ne '1.1' and $xhtmlVersion ne '5.0'">
          <xsl:attribute name="name" select="string(@xml:id)"/>
        </xsl:if>
      </a>
    </p>
  </xsl:template>

</xsl:stylesheet>