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
                xmlns="http://www.daisy.org/z3986/2005/ncx/"
                xmlns:ditac="http://www.xmlmind.com/ditac/schema/ditac"
                xmlns:u="http://www.xmlmind.com/namespace/ditac"
                exclude-result-prefixes="ditac u"
                version="2.0">

  <!-- generateTOC_NCX =================================================== -->

  <!-- It's not mandatory to have a DOCTYPE
       doctype-public="-//NISO//DTD ncx 2005-1//EN"
       doctype-system="http://www.daisy.org/z3986/2005/ncx-2005-1.dtd" -->

  <xsl:output name="tocNCXOutputFormat"
    method="xml" encoding="UTF-8" indent="yes"/>

  <xsl:template name="generateTOC_NCX">
    <xsl:result-document href="{resolve-uri('toc.ncx', base-uri())}"
                         format="tocNCXOutputFormat">

      <xsl:variable name="hasTOCEntries1" 
        select="($extended-toc eq 'frontmatter' or 
                 $extended-toc eq 'both') and
                exists($ditacLists/ditac:frontmatterTOC/ditac:tocEntry)"/>
      <xsl:variable name="tocEntries1"
        select="if ($hasTOCEntries1)
                then $ditacLists/ditac:frontmatterTOC//ditac:tocEntry[not(@role eq 'toc' and starts-with(@id, '__AUTO__'))]
                else ()"/>

      <xsl:variable name="tocEntries2"
        select="$ditacLists/ditac:toc//ditac:tocEntry"/>

      <xsl:variable name="hasTOCEntries3" 
        select="($extended-toc eq 'backmatter' or 
                 $extended-toc eq 'both') and
                exists($ditacLists/ditac:backmatterTOC/ditac:tocEntry)"/>
      <xsl:variable name="tocEntries3"
        select="if ($hasTOCEntries3)
                then $ditacLists/ditac:backmatterTOC//ditac:tocEntry
                else ()"/>

      <xsl:variable name="tocEntries"
                    select="($tocEntries1, $tocEntries2, $tocEntries3)"/>

      <xsl:variable name="tocDepth" 
        select="max(for $e in $tocEntries
                    return
                        count($e/ancestor-or-self::ditac:tocEntry))"/>

      <ncx version="2005-1">
        <head>
          <meta name="dtb:uid">
            <xsl:attribute name="content">
              <xsl:call-template name="epubIdentifier"/>
            </xsl:attribute>
          </meta>
          <meta name="dtb:depth" content="{$tocDepth}"/>
          <meta name="dtb:totalPageCount" content="0"/>
          <meta name="dtb:maxPageNumber" content="0"/>
        </head>

        <docTitle>
          <text><xsl:value-of select="u:documentTitle()"/></text>
        </docTitle>

        <navMap>
          <xsl:if test="$hasTOCEntries1">
            <xsl:apply-templates mode="fmbmTOC_NCX" 
              select="$ditacLists/ditac:frontmatterTOC/ditac:tocEntry">
              <xsl:with-param name="tocEntries" select="$tocEntries"/>
            </xsl:apply-templates>
          </xsl:if>

          <xsl:apply-templates mode="bodyTOC_NCX"
            select="$ditacLists/ditac:toc/ditac:tocEntry">
            <xsl:with-param name="tocEntries" select="$tocEntries"/>
          </xsl:apply-templates>

          <xsl:if test="$hasTOCEntries3">
            <xsl:apply-templates mode="fmbmTOC_NCX"
              select="$ditacLists/ditac:backmatterTOC/ditac:tocEntry">
              <xsl:with-param name="tocEntries" select="$tocEntries"/>
            </xsl:apply-templates>
          </xsl:if>
        </navMap>
      </ncx>
    </xsl:result-document>
  </xsl:template>

  <xsl:template match="ditac:tocEntry" mode="fmbmTOC_NCX">
    <xsl:param name="tocEntries" select="()"/>

    <xsl:if test="not(@role eq 'toc' and starts-with(@id, '__AUTO__'))">
      <xsl:variable name="id" select="u:tocEntryAutoId(.)"/>
      <xsl:variable name="title" select="u:tocEntryAutoTitle(.)"/>

      <xsl:variable name="playOrder" select="u:indexOfNode($tocEntries, .)"/>

      <navPoint id="{concat('__TOCE', $playOrder)}" 
                    playOrder="{$playOrder}">
        <navLabel>
          <text><xsl:value-of select="$title"/></text>
        </navLabel>
        <content src="{concat(@file, '#', $id)}"/>

        <xsl:apply-templates select="./ditac:tocEntry" mode="fmbmTOC_NCX">
          <xsl:with-param name="tocEntries" select="$tocEntries"/>
        </xsl:apply-templates>
      </navPoint>
    </xsl:if>
  </xsl:template>

  <xsl:template match="ditac:tocEntry" mode="bodyTOC_NCX">
    <xsl:param name="tocEntries" select="()"/>

    <xsl:variable name="num" 
                  select="if ($number-toc-entries eq 'yes') 
                          then u:shortTitlePrefix(string(@number), .)
                          else ''"/>

    <xsl:variable name="titlePrefix">
      <xsl:choose>
        <xsl:when test="$num ne ''">
          <xsl:choose>
            <xsl:when test="@role eq 'part' or
                            @role eq 'chapter' or
                            @role eq 'appendix'">
              <xsl:value-of 
                select="concat($num, $title-prefix-separator1)"/>
            </xsl:when>
            <xsl:otherwise>
              <!-- Discard leading 'Section '. -->
              <xsl:value-of 
                select="concat(u:extractNumber($num, .), 
                               $title-prefix-separator1)"/>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:when>
        <xsl:otherwise></xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <xsl:variable name="playOrder" select="u:indexOfNode($tocEntries, .)"/>

    <navPoint id="{concat('__TOCE', $playOrder)}" 
                  playOrder="{$playOrder}">
      <navLabel>
        <text>
          <xsl:value-of select="concat($titlePrefix, u:tocEntryAutoTitle(.))"/>
        </text>
      </navLabel>
      <content src="{concat(@file, '#', @id)}"/>

      <xsl:apply-templates select="./ditac:tocEntry" mode="bodyTOC_NCX">
        <xsl:with-param name="tocEntries" select="$tocEntries"/>
      </xsl:apply-templates>
    </navPoint>
  </xsl:template>

</xsl:stylesheet>
