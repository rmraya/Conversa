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
                exclude-result-prefixes="xs"
                version="2.0">
  
  <!-- imagemap ========================================================== -->

  <xsl:template match="*[contains(@class,' ut-d/imagemap ')]">
    <div>
      <xsl:call-template name="commonAttributes"/>
      <xsl:call-template name="displayAttributes"/>
      <xsl:call-template name="namedAnchor"/>

      <xsl:variable name="id" select="concat('I_', generate-id(), '_')"/>

      <xsl:for-each select="./*[contains(@class,' topic/image ')]">
        <div class="image-container">
          <xsl:if test="@align eq 'left' or
                        @align eq 'right' or
                        @align eq 'center'">
            <xsl:attribute name="style"
              select="concat('text-align: ', string(@align), ';')"/>
          </xsl:if>
          
          <xsl:call-template name="namedAnchor"/>
          <xsl:call-template name="imageToImg">
            <xsl:with-param name="usemap" select="concat('#', $id)"/>
          </xsl:call-template>
        </div>
      </xsl:for-each>

      <map id="{$id}">
        <xsl:if test="$xhtmlVersion ne '1.1'">
          <xsl:attribute name="name" select="$id"/><!--Allowed by XHTML5-->
        </xsl:if>

        <xsl:apply-templates select="./*[contains(@class,' ut-d/area ')]"/>
      </map>
    </div>
  </xsl:template>

  <!-- area ============================================================== -->

  <xsl:template match="*[contains(@class,' ut-d/area ')]">
    <xsl:variable name="shape"
                  select="./*[contains(@class,' ut-d/shape ')]"/>
    <xsl:variable name="coords"
                  select="./*[contains(@class,' ut-d/coords ')]"/>
    <xsl:variable name="xref"
                  select="./*[contains(@class,' topic/xref ')]"/>

    <area>
      <xsl:call-template name="commonAttributes"/>

      <xsl:variable name="shapeValue" 
                    select="if (exists($shape)) 
                            then normalize-space($shape[1])
                            else ''"/>
      <xsl:attribute name="shape"
        select="if ($shapeValue ne '') then $shapeValue else 'rect'"/>

      <xsl:if test="$shape ne 'default'">
        <xsl:attribute name="coords" select="normalize-space($coords[1])"/>
      </xsl:if>

      <xsl:variable name="href"
                    select="if (exists($xref)) 
                            then normalize-space($xref[1]/@href)
                            else ''"/>
      <xsl:if test="$href ne '' and $href ne '???'">
        <xsl:attribute name="href" select="$href"/>
      </xsl:if>

      <!-- Use the text contained in the xref and/or in its desc child. -->
      <xsl:variable name="alt"
                    select="if (exists($xref)) 
                            then normalize-space($xref[1])
                            else ''"/>

      <!-- Attribute alt is required by all versions of XHTML but V5.0. -->
      <xsl:attribute name="alt" 
                     select="if ($alt ne '') 
                             then $alt 
                             else
                                 if ($href ne '')
                                 then tokenize($href, '/')[last()]
                                 else '???'"/>

      <!-- Used as a tooltip by Web browsers. -->
      <xsl:if test="$alt ne ''">
        <xsl:attribute name="title" select="$alt"/>
      </xsl:if>
    </area>
  </xsl:template>

  <!-- sort-as =========================================================== -->

  <xsl:template match="*[contains(@class,' ut-d/sort-as ')]" />

</xsl:stylesheet>
