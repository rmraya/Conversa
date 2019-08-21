<?xml version="1.0" encoding="UTF-8"?>
<!--
| Copyright (c) 2018 XMLmind Software. All rights reserved.
|
| Author: Hussein Shafie
|
| This file is part of the XMLmind DITA Converter project.
| For conditions of distribution and use, see the accompanying LEGAL.txt file.
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                xmlns:u="http://www.xmlmind.com/namespace/ditac"
                xmlns:h="http://www.w3.org/1999/xhtml"
                exclude-result-prefixes="xs u h"
                version="2.0">

  <xsl:template name="processTable">
    <table>
      <xsl:call-template name="processCommonAttributes"/>
      <xsl:call-template name="processTableBorderAttributes"/>

      <xsl:apply-templates select="./h:caption"/>
      <xsl:call-template name="processTableContent"/>
    </table>
  </xsl:template>

  <xsl:template name="processTableBorderAttributes">
    <!-- Note that, by default, an HTML table has no borders. -->

    <xsl:variable name="frame"
                  select="if (exists(@frame)) 
                          then normalize-space(@frame)
                          else if (exists(@border))
                               then if (normalize-space(@border) eq '0')
                                    then 'void'
                                    else 'border'
                               else 'void'"/>

    <xsl:variable name="rules"
                  select="if (exists(@rules)) 
                          then normalize-space(@rules)
                          else if (exists(@border))
                               then if (normalize-space(@border) eq '0')
                                    then 'none'
                                    else 'all'
                               else 'none'"/>

    <xsl:if test="$frame eq 'void' and $rules eq 'none'">
      <xsl:attribute name="rowsep" select="0"/>
      <xsl:attribute name="colsep" select="0"/>
    </xsl:if>
  </xsl:template>

  <xsl:template name="processTableContent">
    <tgroup>
      <!-- Tables may be nested. -->
      <xsl:variable name="columnCount"
        select="u:columnCount(./h:tr | ./h:thead/h:tr | ./h:tbody/h:tr)"/>

      <xsl:variable name="colspecs">
        <xsl:apply-templates select="h:colgroup | h:col"/>
      </xsl:variable>

      <xsl:variable name="cols"
                    select="max(($columnCount, count($colspecs/*)))"/>
      <xsl:attribute name="cols" select="$cols"/>

      <!-- We support both HTML4 and HTML5 tables.
           HTML4 tables use attributes. HTML5 tables use CSS properties.
           HTML4 tables are expected to be found in Markdown documents. -->

      <xsl:call-template name="processAlignStyle"/>
      <!-- When set on an HTML4 table, the align attribute has no effect
           on cells. -->

      <xsl:if test="exists($colspecs/*) or 
                    exists(./h:tr/*/@colspan | 
                           ./h:thead/*/*/@colspan | 
                           ./h:tbody/*/*/@colspan)">

        <!-- Convert percentages to proportional units. -->

        <xsl:variable name="totalPercent" 
                      select="sum(((0),
                                   for $w in $colspecs/*/@colwidth
                                   return if (ends-with($w, '%')) 
                                          then number(substring-before($w, '%'))
                                          else 0))"/>

        <xsl:variable name="noColwidthCount" 
                      select="$cols - count($colspecs/*/@colwidth)"/>

        <xsl:variable name="defaultColwidth">
          <xsl:choose>
            <xsl:when test="$noColwidthCount gt 0 and
                            $totalPercent gt 0 and $totalPercent lt 100">
              <xsl:value-of 
                select="concat(max(((1), 
                                   ((100.0 - $totalPercent) div $noColwidthCount))), 
                               '*')"/>
            </xsl:when>
            <xsl:when test="$noColwidthCount gt 0 and $totalPercent ge 100">
              <xsl:value-of select="'1*'"/>
            </xsl:when>
            <xsl:otherwise>
              <xsl:value-of select="''"/>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:variable>

        <xsl:for-each select="$colspecs/*">
          <colspec colname="{concat('c', position())}">
            <xsl:copy-of select="./@*"/>

            <xsl:choose>
              <xsl:when test="ends-with(@colwidth, '%')">
                <xsl:attribute name="colwidth" 
                  select="concat(substring-before(@colwidth, '%'), '*')"/>
              </xsl:when>

              <xsl:otherwise>
                <xsl:choose>
                  <xsl:when test="empty(@colwidth) and $defaultColwidth ne ''">
                    <xsl:attribute name="colwidth" select="$defaultColwidth"/>
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:copy-of select="@colwidth"/>
                  </xsl:otherwise>
                </xsl:choose>
              </xsl:otherwise>
            </xsl:choose>
          </colspec>
        </xsl:for-each>

        <xsl:for-each select="((count($colspecs/*) + 1) to $cols)">
          <colspec colname="{concat('c', .)}">
            <xsl:if test="$defaultColwidth ne ''">
              <xsl:attribute name="colwidth" select="$defaultColwidth"/>
            </xsl:if>
          </colspec>
        </xsl:for-each>
      </xsl:if>

      <xsl:apply-templates select="./h:thead"/>
      <xsl:apply-templates select="./h:tfoot"/> <!--Not supported by DITA-->

      <xsl:variable name="rows" select="./h:tr"/>
      <xsl:choose>
        <xsl:when test="exists($rows)">
          <tbody>
            <xsl:apply-templates select="$rows"/>
          </tbody>
        </xsl:when>

        <xsl:otherwise>
          <xsl:variable name="bodies" select="./h:tbody"/>
          <xsl:if test="count($bodies) gt 1">
            <xsl:message><xsl:value-of select="base-uri($bodies[1])"/>::: ignoring all "tbody" elements but first one.</xsl:message>
          </xsl:if>

          <xsl:apply-templates select="$bodies[1]"/>
        </xsl:otherwise>
      </xsl:choose>
    </tgroup>
  </xsl:template>

  <xsl:function name="u:columnCount" as="xs:integer">
    <xsl:param name="rows" as="element()*"/>

    <xsl:variable name="counts" as="xs:integer*"
      select="for $row in $rows
              return sum(((0), 
                          for $cell in ($row/h:th | $row/h:td)
                          return if (number($cell/@colspan) gt 1) 
                                 then xs:integer($cell/@colspan) 
                                 else 1))"/>

    <xsl:sequence select="max(((1), $counts))"/>
  </xsl:function>

  <xsl:template name="processAlignStyle">
    <xsl:variable name="align" select="u:alignStyle(.)"/>
    <xsl:if test="$align ne ''">
      <xsl:attribute name="align" select="$align"/>
    </xsl:if>
  </xsl:template>

  <xsl:function name="u:alignStyle" as="xs:string*">
    <xsl:param name="cell" as="element()*"/>

    <xsl:variable name="align"
      select="if (contains($cell/@style, 'text-align:'))
              then replace($cell/@style, 
                           '^(.*)text-align:\s*(left|center|right|justify)(.*)$', 
                           '$2')
              else ''"/>
    <xsl:sequence select="if ($align eq 'justify')
                          then 'left'
                          else $align"/>
  </xsl:function>

  <xsl:template match="h:colgroup | h:col">
    <xsl:choose>
      <xsl:when test="exists(./h:col)">
        <!-- Ignore span if any -->
        <xsl:apply-templates/>
      </xsl:when>

      <xsl:otherwise>
        <xsl:variable name="width1" select="u:width(.)"/>
        <xsl:variable name="width" 
                      select="if ($width1 eq '' and exists(parent::h:colgroup))
                              then u:width(..)
                              else $width1"/>

        <xsl:variable name="span" select="if (number(@span) gt 0) 
                                          then xs:integer(@span)
                                          else 1"/>

        <xsl:variable name="colspecTemplate">
          <colspec>
            <xsl:call-template name="processCommonAttributes1"/>
          </colspec>
        </xsl:variable>

        <xsl:for-each select="(1 to $span)">
          <colspec>
            <xsl:copy-of select="$colspecTemplate/*/@*"/>

            <xsl:if test="$width ne ''">
              <xsl:attribute name="colwidth" select="$width"/>
            </xsl:if>
          </colspec>
        </xsl:for-each>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:function name="u:width" as="xs:string*">
    <xsl:param name="col" as="element()"/>

    <!-- Match 'width:' but not something like 'border-width:'. -->
    <xsl:variable name="w"
      select="if (matches($col/@style, '^width:|([; ]width:)'))
              then replace($col/@style, 
                          '^(width:|((.*)[; ]width:))\s*([0-9.%*a-zA-Z]+)(.*)$',
                          '$4')
              else if ($col/@width ne '') 
                   then normalize-space($col/@width) 
                   else ''"/>

    <!-- 96.0 = CSS DPI -->

    <xsl:variable name="width"
      select="if ($w eq '*') then '1*'
              else if (ends-with($w, '*') and 
                       number(substring-before($w, '*')) gt 0) then $w
              else if (ends-with($w, '%') and 
                       number(substring-before($w, '%')) gt 0) then $w
              else if (ends-with($w, 'in') and 
                       number(substring-before($w, 'in')) gt 0) then $w
              else if (ends-with($w, 'cm') and 
                       number(substring-before($w, 'cm')) gt 0) then $w
              else if (ends-with($w, 'mm') and 
                       number(substring-before($w, 'mm')) gt 0) then $w
              else if (ends-with($w, 'pt') and 
                       number(substring-before($w, 'pt')) gt 0) then $w
              else if (ends-with($w, 'pc') and 
                       number(substring-before($w, 'pc')) gt 0) 
                   then concat(substring-before($w, 'pc'), 'pi')
              else if (ends-with($w, 'px') and 
                       number(substring-before($w, 'px')) gt 0) 
                   then concat(round((number(substring-before($w, 'px')) 
                                      div 96.0) * 72.0), 'pt')
              else if (number($w) gt 0) 
                   then concat(round((number($w) div 96.0) * 72.0), 'pt')
              else if ($w ne '') then '???'
              else ''"/>

    <xsl:choose>
      <xsl:when test="$width eq '???'">
        <xsl:message><xsl:value-of select="base-uri($col)"/>::: "<xsl:value-of select="$w"/>", unsupported value for a column width</xsl:message>
        <xsl:sequence select="''"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:sequence select="$width"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:function>

  <!-- caption ========================= -->

  <xsl:template match="h:caption">
    <xsl:call-template name="processTitle"/>
  </xsl:template>

  <!-- thead ========================= -->

  <xsl:template match="h:thead">
    <thead>
      <xsl:call-template name="processCommonAttributes"/>
      <!-- Here we do not consider the vertical-align style because 
           it cannot be inherited. -->
      <xsl:call-template name="processValignAttribute"/>
      <xsl:apply-templates/>
    </thead>
  </xsl:template>

  <xsl:template name="processValignAttribute">
    <xsl:variable name="valign" select="u:valignAttribute(.)"/>
    <xsl:if test="$valign ne ''">
      <xsl:attribute name="valign" select="$valign"/>
    </xsl:if>
  </xsl:template>

  <xsl:function name="u:valignAttribute" as="xs:string*">
    <xsl:param name="cell" as="element()*"/>

    <xsl:variable name="valign" select="normalize-space($cell/@valign)"/>
    <xsl:sequence select="if ($valign = ('top', 'middle', 'bottom'))
                          then $valign
                          else if ($valign eq 'baseline')
                               then 'top'
                               else ''"/>
  </xsl:function>

  <!-- tbody ========================= -->

  <xsl:template match="h:tbody">
    <tbody>
      <xsl:call-template name="processCommonAttributes"/>
      <xsl:call-template name="processValignAttribute"/>
      <xsl:apply-templates/>
    </tbody>
  </xsl:template>

  <!-- tr ========================= -->

  <xsl:template match="h:tr">
    <row>
      <xsl:call-template name="processCommonAttributes"/>

      <xsl:call-template name="processValignAttribute"/>
      <!-- a td has an implicit valign=middle. 
           Here we do not consider the vertical-align style because 
           it cannot be inherited. -->
      <xsl:if test="u:valignAttribute(.) eq '' and 
            u:valignAttribute(parent::*[self::h:tbody or self::h:thead]) eq ''">
        <xsl:attribute name="valign" select="'middle'"/>
      </xsl:if>

      <xsl:apply-templates/>
    </row>
  </xsl:template>

  <!-- td, th ========================= -->

  <xsl:template match="h:th | h:td">
    <entry>
      <xsl:call-template name="processCommonAttributes"/>

      <xsl:if test="number(@colspan) gt 1">
        <xsl:variable name="colnum" select="u:columnNumber(.)" />

        <xsl:attribute name="namest" select="concat('c', $colnum)"/>
        <xsl:attribute name="nameend"
          select="concat('c', $colnum + xs:integer(@colspan) - 1)"/>
      </xsl:if>

      <xsl:if test="number(@rowspan) gt 1">
        <xsl:attribute name="morerows" select="xs:integer(@rowspan) - 1"/>
      </xsl:if>

      <!-- a th has an implicit align=center. -->
      <xsl:if test="exists(self::h:th)">
        <xsl:attribute name="align" select="'center'"/>
      </xsl:if>

      <!-- align may be inherited from the align attribute or 
           text-align style of the tr, tbody or thead ancestors of 
           this cell. -->

      <xsl:variable name="align1"
        select="u:alignAttribute(ancestor::*[self::h:tbody or self::h:thead])"/>
      <xsl:if test="$align1 ne ''">
        <xsl:attribute name="align" select="$align1"/>
      </xsl:if>

      <xsl:variable name="align2"
        select="u:alignStyle(ancestor::*[self::h:tbody or self::h:thead])"/>
      <xsl:if test="$align2 ne ''">
        <xsl:attribute name="align" select="$align2"/>
      </xsl:if>

      <xsl:variable name="align3" select="u:alignAttribute(parent::h:tr)"/>
      <xsl:if test="$align3 ne ''">
        <xsl:attribute name="align" select="$align3"/>
      </xsl:if>

      <xsl:variable name="align4" select="u:alignStyle(parent::h:tr)"/>
      <xsl:if test="$align4 ne ''">
        <xsl:attribute name="align" select="$align4"/>
      </xsl:if>

      <xsl:call-template name="processAlignAttribute"/>
      <xsl:call-template name="processAlignStyle"/>

      <xsl:call-template name="processValignAttribute"/>
      <!-- vertical-align style is not inherited, so consider it only here. -->
      <xsl:call-template name="processValignStyle"/>

      <xsl:apply-templates/>
    </entry>
  </xsl:template>

  <xsl:function name="u:columnNumber" as="xs:integer">
    <xsl:param name="cell" as="element()"/>

    <!-- An approximation which does not support rowspan. -->

    <xsl:sequence
      select="sum(((1), 
                   for $prevCell in $cell/preceding-sibling::*[self::h:th or self::h:td]
                   return if (number($prevCell/@colspan) gt 1) 
                          then xs:integer($prevCell/@colspan) 
                          else 1))"/>
  </xsl:function>

  <xsl:template name="processAlignAttribute">
    <xsl:variable name="align" select="u:alignAttribute(.)"/>
    <xsl:if test="$align ne ''">
      <xsl:attribute name="align" select="$align"/>
    </xsl:if>
  </xsl:template>

  <xsl:function name="u:alignAttribute" as="xs:string*">
    <xsl:param name="cell" as="element()*"/>

    <xsl:variable name="align" select="normalize-space($cell/@align)"/>
    <xsl:sequence select="if ($align = ('left', 'center', 'right'))
                          then $align
                          else if ($align eq 'justify')
                               then 'left'
                               else ''"/>
  </xsl:function>

  <xsl:template name="processValignStyle">
    <xsl:variable name="valign" select="u:valignStyle(.)"/>
    <xsl:if test="$valign ne ''">
      <xsl:attribute name="valign" select="$valign"/>
    </xsl:if>
  </xsl:template>

  <xsl:function name="u:valignStyle" as="xs:string*">
    <xsl:param name="cell" as="element()*"/>

    <xsl:variable name="valign"
      select="if (contains($cell/@style, 'vertical-align:'))
              then replace($cell/@style, 
                           '^(.*)vertical-align:\s*(baseline|top|middle|bottom)(.*)$', 
                           '$2')
              else ''"/>
    <xsl:sequence select="if ($valign eq 'baseline')
                          then 'top'
                          else $valign"/>
  </xsl:function>
</xsl:stylesheet>
