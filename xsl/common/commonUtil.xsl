<?xml version="1.0" encoding="UTF-8"?>
<!--
| Copyright (c) 2017-2020 XMLmind Software. All rights reserved.
|
| Author: Hussein Shafie
|
| This file is part of the XMLmind DITA Converter project.
| For conditions of distribution and use, see the accompanying LEGAL.txt file.
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                xmlns:u="http://www.xmlmind.com/namespace/ditac"
                xmlns:Highlight="java:com.xmlmind.ditac.xslt.Highlight"
                xmlns:Image="java:com.xmlmind.ditac.xslt.Image"
                exclude-result-prefixes="xs u Image Highlight"
                version="2.0">

  <!-- loadElement ======================================================= -->

  <!-- document(uri_with_fragment) works fine with a document 
       using xml:id attributes but not with a document using id attributes. -->

  <xsl:function name="u:loadElement" as="element()?">
    <xsl:param name="uri" as="xs:string"/>

    <xsl:variable name="location" select="if (contains($uri, '#')) 
                                          then substring-before($uri, '#')
                                          else $uri"/>
    <xsl:variable name="ref" select="if (contains($uri, '#')) 
                                     then substring-after($uri, '#')
                                     else ''"/>

    <xsl:variable name="root" select="document($location)/*"/>

    <xsl:choose>
      <xsl:when test="exists($root) and $ref ne ''">
        <xsl:variable name="result"
                      select="$root/descendant-or-self::*[@xml:id eq $ref]"/>
        <xsl:choose>
          <xsl:when test="exists($result)">
            <xsl:sequence select="$result[1]"/>
          </xsl:when>
          <xsl:otherwise>
            <xsl:sequence select="($root/descendant-or-self::*[@id eq $ref])[1]"/>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:when>
      <xsl:otherwise>
        <xsl:sequence select="$root"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:function>

  <!-- basename ========================================================== -->

  <xsl:function name="u:basename" as="xs:string">
    <xsl:param name="path" as="xs:string"/>

    <xsl:sequence select="if ($path ne '') 
                          then tokenize($path, '/')[last()]
                          else ''" />
  </xsl:function>

  <!-- extension ========================================================= -->

  <xsl:function name="u:extension" as="xs:string">
    <xsl:param name="path" as="xs:string"/>

    <xsl:variable name="basename" select="u:basename($path)" />
    <xsl:sequence select="if ($basename ne '') 
                          then tokenize($basename, '\.')[last()]
                          else ''" />
  </xsl:function>

  <!-- suffix ============================================================ -->

  <xsl:function name="u:suffix" as="xs:string">
    <xsl:param name="path" as="xs:string"/>

    <xsl:variable name="ext" select="u:extension($path)" />
    <xsl:sequence select="if ($ext ne '') 
                          then concat('.', $ext)
                          else ''" />
  </xsl:function>

  <!-- indexOfNode ======================================================= -->

  <xsl:function name="u:indexOfNode" as="xs:integer*">
    <xsl:param name="nodeSequence" as="node()*"/>
    <xsl:param name="searchedNode" as="node()"/>

    <xsl:for-each select="$nodeSequence">
      <xsl:if test=". is $searchedNode">
        <xsl:sequence select="position()"/>
      </xsl:if>
    </xsl:for-each>
  </xsl:function>

  <!-- classToElementName ================================================ -->

  <xsl:function name="u:classToElementName" as="xs:string">
    <xsl:param name="class" as="xs:string"/>

    <xsl:sequence select="tokenize(normalize-space($class), '/|\s+')[last()]"/>
  </xsl:function>

  <!-- imageWidth ======================================================== -->

  <xsl:template name="imageWidth">
    <xsl:param name="path" select="''"/>

    <xsl:sequence select="Image:getWidth(resolve-uri($path, base-uri()))"/>
  </xsl:template>

  <!-- imageHeight ======================================================= -->

  <xsl:template name="imageHeight">
    <xsl:param name="path" select="''"/>

    <xsl:sequence select="Image:getHeight(resolve-uri($path, base-uri()))"/>
  </xsl:template>

  <!-- objectIsAudioVideo ================================================ -->

  <xsl:function name="u:objectIsAudioVideo" as="xs:boolean">
    <xsl:param name="object" as="element()"/>

    <!-- @width, @height OK. Deprecated @longdescref ignored. -->
    <xsl:sequence select="$detect-audio-video eq 'yes' and
                          string-length($object/@data) gt 0 and
                          (starts-with($object/@type, 'audio/') or 
                           starts-with($object/@type, 'video/')) and
                          empty($object/@declare) and
                          empty($object/@classid) and
                          empty($object/@codebase) and
                          empty($object/@codetype) and
                          empty($object/@archive) and
                          empty($object/@standby) and
                          empty($object/@usemap) and
                          empty($object/@name) and
                          empty($object/@tabindex)"/>
  </xsl:function>

  <!-- resolveExternalHref =============================================== -->

  <xsl:template name="resolveExternalHref">
    <!-- Note that in some cases the preprocessor may have removed the href. -->
    <xsl:variable name="href" select="normalize-space(@href)"/>

    <xsl:if test="$href ne '' and $href ne '???'">
      <xsl:choose>
        <xsl:when test="@scope eq 'external' and 
                        not(matches($href, '^[a-zA-Z][a-zA-Z0-9.+-]*:/'))">
          <xsl:if test="not(starts-with($external-resource-base, '#'))">
            <xsl:variable name="externalResourceBase" 
              select="if ($external-resource-base ne '' and 
                          not(ends-with($external-resource-base, '/')))
                      then concat($external-resource-base, '/')
                      else $external-resource-base"/>

            <xsl:value-of select="concat($externalResourceBase, $href)"/>
          </xsl:if>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="$href"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:if>
  </xsl:template>

  <!-- noteType ========================================================== -->

  <xsl:template name="noteType">
    <xsl:choose>
      <xsl:when test="@type eq 'other' and @othertype">
        <xsl:value-of select="normalize-space(@othertype)"/>
      </xsl:when>
      <xsl:when test="@type and @type ne 'other'">
        <xsl:value-of select="@type"/>
      </xsl:when>
      <xsl:otherwise>note</xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- Contents of a title =============================================== -->

  <xsl:template name="titleContents">
    <xsl:variable name="text" select="string(.)"/>
    <xsl:choose>
      <xsl:when test="starts-with($text, '__AUTO__')">
        <xsl:value-of select="u:autoTitle($text, .)"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:apply-templates/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- ol numbering ====================================================== -->

  <xsl:template name="olType">
    <xsl:choose>
      <xsl:when test="contains(@outputclass, 'lower-alpha')">
        <xsl:sequence select="'a'"/>
      </xsl:when>
      <xsl:when test="contains(@outputclass, 'upper-alpha')">
        <xsl:sequence select="'A'"/>
      </xsl:when>
      <xsl:when test="contains(@outputclass, 'lower-roman')">
        <xsl:sequence select="'i'"/>
      </xsl:when>
      <xsl:when test="contains(@outputclass, 'upper-roman')">
        <xsl:sequence select="'I'"/>
      </xsl:when>
      <xsl:when test="contains(@outputclass, 'decimal')">
        <xsl:sequence select="'1'"/>
      </xsl:when>

      <xsl:otherwise>
        <xsl:variable name="nesting"
          select="count(ancestor::*[contains(@class,' topic/ol ')])"/>
        <xsl:sequence select="if ($nesting eq 0) then ''
                              else if (($nesting mod 2) eq 1) then 'a' 
                              else '1'"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="olStart">
    <xsl:choose>
      <xsl:when test="contains(@outputclass, 'start(')">
        <xsl:sequence select="u:parseOlStart(string(@outputclass))"/>
      </xsl:when>

      <xsl:when test="contains(@outputclass, 'continue')">
        <xsl:variable name="olNesting" select="u:olNesting(.)"/>
        <xsl:variable name="prevList"
          select="(preceding::*[contains(@class,' topic/ol ') and 
                                u:olNesting(.) eq $olNesting])[last()]"/>

        <xsl:sequence select="u:computeOlStart($prevList, 1, $olNesting)"/>
      </xsl:when>
      <!-- Otherwise, an empty string. -->
    </xsl:choose>
  </xsl:template>

  <xsl:function name="u:parseOlStart" as="xs:integer">
    <xsl:param name="outputclass" as="xs:string"/>

    <xsl:variable name="start" 
      select="substring-before(substring-after($outputclass, 'start('), ')')"/>
    <xsl:sequence select="if (number($start) ge 0) 
                          then xs:integer($start)
                          else 1"/>
  </xsl:function>

  <xsl:function name="u:olNesting" as="xs:integer">
    <xsl:param name="list" as="element()"/>
    <xsl:sequence 
      select="count($list/ancestor::*[contains(@class,' topic/ol ')])"/>
  </xsl:function>

  <xsl:function name="u:computeOlStart" as="xs:integer">
    <xsl:param name="list" as="element()?"/>
    <xsl:param name="olStart" as="xs:integer"/>
    <xsl:param name="olNesting" as="xs:integer"/>
    
    <xsl:choose>
      <xsl:when test="empty($list)">
        <xsl:sequence select="$olStart"/>
      </xsl:when>

      <xsl:otherwise>
        <xsl:variable name="itemCount"
          select="count($list/*[contains(@class,' topic/li ')])"/>

        <xsl:choose>
          <xsl:when test="contains($list/@outputclass, 'start(')">
            <xsl:sequence 
                select="u:parseOlStart(string($list/@outputclass)) +
                        $itemCount - 1 + $olStart"/>
          </xsl:when>

          <xsl:when test="contains($list/@outputclass, 'continue')">
            <xsl:variable name="prevList"
              select="($list/preceding::*[contains(@class,' topic/ol ') and 
                                          u:olNesting(.) eq $olNesting])[last()]"/>

            <xsl:sequence
              select="u:computeOlStart($prevList, $itemCount + $olStart, $olNesting)"/>
          </xsl:when>

          <xsl:otherwise>
            <xsl:sequence select="$itemCount + $olStart"/>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:function>

  <!-- Table processing utilities ======================================== -->

  <xsl:template name="processCellContents">
    <xsl:choose>
      <xsl:when test="exists(./text()|./*)">
        <xsl:apply-templates/>
      </xsl:when>
      <xsl:otherwise>&#xA0;</xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:function name="u:entryRowSpan" as="xs:integer">
    <xsl:param name="entry" as="element()"/>

    <xsl:for-each select="$entry">
      <xsl:choose>
        <!-- number() returns NaN instead of raising an error. -->
        <xsl:when test="number(@morerows) gt 0">
          <xsl:sequence select="xs:integer(@morerows) + 1"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:sequence select="1"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:for-each>
  </xsl:function>

  <xsl:function name="u:entryColSpan" as="xs:integer">
    <xsl:param name="entry" as="element()"/>

    <xsl:for-each select="$entry">
      <!-- Remember that a table can contain another table. -->
      <xsl:variable name="tgroup" 
        select="(ancestor::*[contains(@class,' topic/tgroup ')])[last()]"/>
      <xsl:variable name="colspecs" 
        select="$tgroup/*[contains(@class,' topic/colspec ')]"/>

      <xsl:variable name="namest" select="@namest"/>
      <xsl:variable name="nameend" select="@nameend"/>

      <xsl:choose>
        <xsl:when test="exists($colspecs) and 
                        exists($namest) and exists($nameend)">
          <xsl:variable name="colst" 
                        select="($colspecs[./@colname eq $namest])[1]"/>
          <xsl:variable name="colend" 
                        select="($colspecs[./@colname eq $nameend])[1]"/>
          
          <xsl:choose>
            <xsl:when test="exists($colst) and exists($colend)">
              <xsl:variable name="colnumst" 
                            select="u:colspecNumber($colst)"/>
              <xsl:variable name="colnumend" 
                            select="u:colspecNumber($colend)"/>

              <xsl:choose>
                <xsl:when test="$colnumend gt $colnumst">
                  <xsl:sequence select="$colnumend - $colnumst + 1"/>
                </xsl:when>
                <xsl:otherwise>
                  <xsl:sequence select="1"/>
                </xsl:otherwise>
              </xsl:choose>
            </xsl:when>
            <xsl:otherwise>
              <xsl:sequence select="1"/>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:when>
        <xsl:otherwise>
          <xsl:sequence select="1"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:for-each>
  </xsl:function>

  <xsl:function name="u:colspecNumber" as="xs:integer">
    <xsl:param name="colspec" as="element()"/>

    <xsl:for-each select="$colspec">
      <xsl:variable name="previousColspec" 
        select="(preceding-sibling::*[contains(@class,' topic/colspec ')])[last()]"/>

      <xsl:variable name="nextColspecNumber" as="xs:integer">
        <xsl:choose>
          <xsl:when test="exists($previousColspec)">
            <xsl:sequence select="u:colspecNumber($previousColspec) + 1"/>
          </xsl:when>
          <xsl:otherwise>
            <xsl:sequence select="1"/>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:variable>

      <xsl:choose>
        <!-- number() returns NaN instead of raising an error. -->
        <xsl:when test="exists(@colnum) and 
                        (number(@colnum) ge $nextColspecNumber)">
          <xsl:sequence select="xs:integer(@colnum)"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:sequence select="$nextColspecNumber"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:for-each>
  </xsl:function>

  <xsl:function name="u:bodyLayout" as="xs:string*">
    <xsl:param name="body" as="element()"/>

    <xsl:for-each select="$body">
      <xsl:variable name="firstRow" 
                    select="(*[contains(@class,' topic/row ')])[1]"/>
      <xsl:sequence select="if (exists($firstRow))
                            then u:rowLayout($firstRow, 1, ())
                            else ()"/>
    </xsl:for-each>
  </xsl:function>

  <xsl:function name="u:rowLayout" as="xs:string*">
    <xsl:param name="row" as="element()"/>
    <xsl:param name="rowIndex" as="xs:integer"/>
    <xsl:param name="bodyLayout" as="xs:string*"/>

    <xsl:for-each select="$row">
      <xsl:variable name="firstEntry" 
                    select="(*[contains(@class,' topic/entry ')])[1]"/>
      <xsl:variable name="bodyLayout2" 
        select="if (exists($firstEntry))
                then u:entryLayout($firstEntry, $rowIndex, $bodyLayout)
                else ()"/>

      <xsl:variable name="nextRow" 
        select="(following-sibling::*[contains(@class,' topic/row ')])[1]"/>
      <xsl:choose>
        <xsl:when test="exists($nextRow)">
          <xsl:sequence
            select="u:rowLayout($nextRow, $rowIndex + 1, $bodyLayout2)"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:sequence select="$bodyLayout2"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:for-each>
  </xsl:function>

  <xsl:function name="u:entryLayout" as="xs:string*">
    <xsl:param name="entry" as="element()"/>
    <xsl:param name="rowIndex" as="xs:integer"/>
    <xsl:param name="bodyLayout" as="xs:string*"/>

    <xsl:for-each select="$entry">
      <xsl:variable name="id" select="generate-id($entry)"/>
      <xsl:variable name="rowSpan" select="u:entryRowSpan($entry)"/>
      <xsl:variable name="colSpan" select="u:entryColSpan($entry)"/>

      <xsl:variable name="explicitColspec" select="u:entryColspec(., ())"/>
      <xsl:variable name="colIndex" as="xs:integer">
        <xsl:choose>
          <xsl:when test="exists($explicitColspec)">
            <xsl:sequence select="u:colspecNumber($explicitColspec)"/>
          </xsl:when>
          <xsl:otherwise>
            <xsl:variable name="previousEntry" 
              select="(preceding-sibling::*[contains(@class,' topic/entry ')])[last()]"/>
            <xsl:variable name="colIndex0" 
              select="if (exists($previousEntry))
                      then (u:entryEndColumn($previousEntry, $bodyLayout) + 1)
                      else 1"/>

            <xsl:sequence
              select="u:nextFreeColIndex($bodyLayout, $rowIndex, $colIndex0)"/>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:variable>

      <xsl:variable name="added"
        select="for $r in ($rowIndex to ($rowIndex + $rowSpan - 1))
                return
                  for $c in ($colIndex to ($colIndex + $colSpan - 1))
                  return concat($id, '_', $r, '_', $c)"/>

      <xsl:variable name="bodyLayout2" select="($bodyLayout, $added)"/>

      <xsl:variable name="nextEntry" 
        select="(following-sibling::*[contains(@class,' topic/entry ')])[1]"/>
      <xsl:choose>
        <xsl:when test="exists($nextEntry)">
          <xsl:sequence
            select="u:entryLayout($nextEntry, $rowIndex, $bodyLayout2)"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:sequence select="$bodyLayout2"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:for-each>
  </xsl:function>

  <xsl:function name="u:nextFreeColIndex" as="xs:integer">
    <xsl:param name="bodyLayout" as="xs:string*"/>
    <xsl:param name="rowIndex" as="xs:integer"/>
    <xsl:param name="colIndex" as="xs:integer"/>

    <xsl:variable name="tail"
                  select="concat('_', $rowIndex, '_', $colIndex)"/>
    <xsl:variable name="match" 
                  select="for $s in $bodyLayout
                          return
                            if (ends-with($s, $tail))
                            then $s
                            else ()"/>

    <xsl:sequence
      select="if (exists($match))
              then u:nextFreeColIndex($bodyLayout, $rowIndex, $colIndex + 1)
              else $colIndex"/>
  </xsl:function>

  <xsl:function name="u:bodyLayoutContains" as="xs:boolean">
    <xsl:param name="bodyLayout" as="xs:string*"/>
    <xsl:param name="rowIndex" as="xs:integer"/>
    <xsl:param name="colIndex" as="xs:integer"/>

    <xsl:variable name="tail"
                  select="concat('_', $rowIndex, '_', $colIndex)"/>
    <xsl:variable name="match" 
                  select="for $s in $bodyLayout
                          return
                            if (ends-with($s, $tail))
                            then $s
                            else ()"/>

    <xsl:sequence select="exists($match)"/>
  </xsl:function>

  <xsl:function name="u:entryStartColumn" as="xs:integer">
    <xsl:param name="entry" as="element()"/>
    <xsl:param name="bodyLayout" as="xs:string*"/>

    <xsl:sequence select="u:entryColumn($entry, $bodyLayout, false())"/>
  </xsl:function>

  <xsl:function name="u:entryEndColumn" as="xs:integer">
    <xsl:param name="entry" as="element()"/>
    <xsl:param name="bodyLayout" as="xs:string*"/>

    <xsl:sequence select="u:entryColumn($entry, $bodyLayout, true())"/>
  </xsl:function>

  <xsl:function name="u:entryColumn" as="xs:integer">
    <xsl:param name="entry" as="element()"/>
    <xsl:param name="bodyLayout" as="xs:string*"/>
    <xsl:param name="isEndColumn" as="xs:boolean"/>

    <xsl:variable name="id" select="generate-id($entry)"/>
    <xsl:variable name="head" select="concat($id, '_')"/>
    <xsl:variable name="cols" as="xs:integer*"
                  select="for $s in $bodyLayout
                          return
                            if (starts-with($s, $head))
                            then u:parseEntryColumn($s)
                            else ()"/>

    <xsl:variable name="uniqueCols" select="distinct-values($cols)"/>
    <xsl:variable name="sortedCols" as="xs:integer*">
      <xsl:choose>
        <xsl:when test="count($uniqueCols) gt 1">
          <xsl:perform-sort select="$uniqueCols">
            <xsl:sort select="." data-type="number"/>
          </xsl:perform-sort>
        </xsl:when>
        <xsl:otherwise>
          <xsl:sequence select="$uniqueCols"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <xsl:choose>
      <xsl:when test="empty($sortedCols)">
        <xsl:message
          terminate="yes">Internal error in u:entryColumn().</xsl:message>
      </xsl:when>
      <xsl:otherwise>
        <xsl:choose>
          <xsl:when test="$isEndColumn">
            <xsl:sequence select="$sortedCols[last()]"/>
          </xsl:when>
          <xsl:otherwise>
            <xsl:sequence select="$sortedCols[1]"/>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:function>

  <xsl:function name="u:parseEntryColumn" as="xs:integer">
    <xsl:param name="spec" as="xs:string"/>

    <xsl:variable name="split" select="tokenize($spec, '_')"/>
    <xsl:sequence select="xs:integer($split[3])"/>
  </xsl:function>

  <xsl:function name="u:entryColspec" as="element()?">
    <xsl:param name="entry" as="element()"/>
    <xsl:param name="bodyLayout" as="xs:string*"/>

    <xsl:for-each select="$entry">
      <!-- Remember that a table can contain another table. -->
      <xsl:variable name="tgroup" 
        select="(ancestor::*[contains(@class,' topic/tgroup ')])[last()]"/>
      <xsl:variable name="colspecs" 
                    select="$tgroup/*[contains(@class,' topic/colspec ')]"/>

      <xsl:choose>
        <xsl:when test="exists($colspecs)">
          <xsl:variable name="colname" select="@colname"/>
          <xsl:variable name="namest" select="@namest"/>

          <xsl:choose>
            <xsl:when test="exists($colname)">
              <xsl:sequence select="($colspecs[./@colname eq $colname])[1]"/>
            </xsl:when>
            <xsl:when test="exists($namest)">
              <xsl:sequence select="($colspecs[./@colname eq $namest][1])"/>
            </xsl:when>
            <xsl:otherwise>
              <xsl:choose>
                <xsl:when test="count($bodyLayout) gt 0">
                  <xsl:variable name="startColumn" 
                    select="u:entryStartColumn($entry, $bodyLayout)"/>
                  <xsl:sequence
                      select="for $colspec in $colspecs
                              return
                                if (u:colspecNumber($colspec) eq $startColumn)
                                then $colspec
                                else ()"/>
                </xsl:when>
                <xsl:otherwise>
                  <xsl:sequence select="()"/>
                </xsl:otherwise>
              </xsl:choose>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:when>

        <xsl:otherwise>
          <xsl:sequence select="()"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:for-each>
  </xsl:function>

  <!-- syntaxHighlight =================================================== -->

  <xsl:template name="syntaxHighlight">
    <xsl:param name="language" as="xs:string" select="''" />
    <xsl:param name="source" as="node()*" select="()" />
    <xsl:param name="config" as="xs:string" select="''" />

    <xsl:variable name="highlighted" 
                  select="Highlight:highlight($language, $source, $config)" 
                  use-when="function-available('Highlight:highlight')" />

    <xsl:variable name="highlighted" 
                  select="$source/*|$source/text()" 
                  use-when="not(function-available('Highlight:highlight'))" />

    <xsl:apply-templates select="$highlighted" />
  </xsl:template>

  <xsl:template name="highlightCode" as="xs:string?">
    <xsl:for-each select="tokenize(@outputclass, '\s+')">
      <xsl:if test="starts-with(., 'language-')">
        <xsl:variable name="hlCode" 
                      select="lower-case(substring-after(., '-'))" />

        <!-- Support a few aliases here. -->
        <xsl:sequence select="if ($hlCode eq 'shell' or 
                                  $hlCode eq 'sh') then 'bourne'
                              else if ($hlCode eq 'make' or 
                                       $hlCode eq 'makefile') then 'cmake'
                              else if ($hlCode eq 'c#') then 'csharp'
                              else if ($hlCode eq 'css') then 'css21'
                              else if ($hlCode eq 'sql') then 'sql92'
                              else $hlCode" />
      </xsl:if>
    </xsl:for-each>
  </xsl:template>

  <!-- formatCharset ===================================================== -->

  <xsl:template name="formatCharset" as="xs:string?">
    <xsl:sequence
      select="if (contains(@format, 'charset=')) 
              then normalize-space(substring-after(@format, 'charset='))
              else ''"/>
  </xsl:template>

  <!-- localize ========================================================== -->

  <xsl:param name="messageFileNames"
    select="'cs', 'de', 'en', 'es', 'fr', 'it', 'pl', 'ru', 'nn', 'nb', 'ja',
            'nl', 'tlh'"/>

  <xsl:template name="localize">
    <xsl:param name="message" select="''"/>

    <xsl:variable name="lang">
      <xsl:call-template name="lang"/>
    </xsl:variable>

    <xsl:variable name="lang2" select="lower-case($lang)"/>

    <xsl:variable name="messageFileName">
      <xsl:choose>
        <xsl:when test="index-of($messageFileNames, $lang2) ge 1">
          <xsl:value-of select="$lang2"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:variable name="lang3" select="substring-before($lang2, '-')"/>
          <xsl:choose>
            <xsl:when test="index-of($messageFileNames, $lang3) ge 1">
              <xsl:value-of select="$lang3"/>
            </xsl:when>
            <xsl:otherwise>en</xsl:otherwise>
          </xsl:choose>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <xsl:variable name="messageFile"
                  select="concat('messages/', $messageFileName, '.xml')"/>

    <!-- Documents loaded using doc() are cached. -->
    <xsl:variable name="messages"
                  select="if (doc-available($messageFile)) 
                          then doc($messageFile)/messages
                          else ()"/>

    <xsl:choose>
      <xsl:when test="exists($messages/message[@name eq $message])">
        <xsl:value-of select="string($messages/message[@name eq $message])"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:variable name="enMessages"
                      select="doc('messages/en.xml')/messages"/>
        <xsl:choose>
          <xsl:when test="exists($enMessages/message[@name eq $message])">
            <xsl:value-of
              select="string($enMessages/message[@name eq $message])"/>
          </xsl:when>
          <xsl:otherwise>
            <xsl:value-of select="$message"/>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="lang">
    <xsl:variable name="lang"
      select="lower-case(if (ancestor-or-self::*/@xml:lang) 
                         then string((ancestor-or-self::*/@xml:lang)[last()])
                         else 'en')"/>
    
    <!-- Fix a common error. -->
    <xsl:variable name="lang2" select="translate($lang, '_', '-')"/>

    <!-- Get rid of variant. Example: fr-CA-Windows. -->
    <xsl:choose>
      <xsl:when test="string-length($lang2) gt 5">
        <xsl:value-of select="substring($lang2, 1, 5)"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$lang2"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- Function variant -->

  <xsl:function name="u:localize" as="xs:string">
    <xsl:param name="message" as="xs:string"/>
    <xsl:param name="context" as="element()"/>

    <xsl:for-each select="$context">
      <xsl:call-template name="localize">
        <xsl:with-param name="message" select="$message"/>
      </xsl:call-template>
    </xsl:for-each>
  </xsl:function>

  <!-- Insert section number into message returned by localize. -->

  <xsl:param name="labelNumberSeparator" select="'&#xA0;'"/>

  <xsl:function name="u:insertNumber" as="xs:string">
    <xsl:param name="message" as="xs:string"/>
    <xsl:param name="num" as="xs:string"/>
    <xsl:param name="context" as="element()"/>

    <xsl:sequence select="if (contains($message, '%{N}'))
                          then replace($message, '%\{N\}', $num)
                          else concat($message, $labelNumberSeparator, $num)"/>
  </xsl:function>

  <!-- Extract section number from message numbered using u:insertNumber. -->

  <xsl:function name="u:extractNumber" as="xs:string">
    <xsl:param name="message" as="xs:string"/>
    <xsl:param name="context" as="element()"/>

    <xsl:variable name="num"
                  select="substring-after($message, $labelNumberSeparator)"/>
    <xsl:sequence select="if ($num ne '') then $num else $message"/>
  </xsl:function>

</xsl:stylesheet>
