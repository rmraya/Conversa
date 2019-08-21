<?xml version="1.0" encoding="UTF-8"?>
<!--
| Copyright (c) 2017-2019 XMLmind Software. All rights reserved.
|
| Author: Hussein Shafie (hussein@xmlmind.com)
|
| This file is part of the XMLmind DITA Converter project.
| For conditions of distribution and use, see the accompanying LEGAL.txt file.
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                xmlns:fo="http://www.w3.org/1999/XSL/Format"
                xmlns:ditac="http://www.xmlmind.com/ditac/schema/ditac"
                xmlns:u="http://www.xmlmind.com/namespace/ditac"
                exclude-result-prefixes="xs u ditac"
                version="2.0">

  <xsl:template match="ditac:chunk">
    <xsl:variable name="pageSequenceNameList">
      <xsl:for-each-group 
        select="if ($title-page eq 'none') then * except ditac:titlePage else *" 
        group-adjacent="u:pageSequenceName(.)">
        <xsl:if test="position() gt 1">;</xsl:if>
        <xsl:value-of select="current-grouping-key()"/>
      </xsl:for-each-group>
    </xsl:variable>

    <xsl:variable name="pageSequenceNames" 
                  select="tokenize($pageSequenceNameList, ';')"/>

    <xsl:variable name="bodyPos" 
      select="for $n in $pageSequenceNames
              return 
                  if (substring-before($n, '.') eq 'part' or
                      substring-before($n, '.') eq 'chapter' or
                      substring-before($n, '.') eq 'appendices' or
                      substring-before($n, '.') eq 'appendix' or
                      substring-before($n, '.') eq 'section1' or
                      substring-before($n, '.') eq 'section2' or
                      substring-before($n, '.') eq 'section3' or
                      substring-before($n, '.') eq 'section4' or
                      substring-before($n, '.') eq 'section5' or
                      substring-before($n, '.') eq 'section6' or
                      substring-before($n, '.') eq 'section7' or
                      substring-before($n, '.') eq 'section8' or
                      substring-before($n, '.') eq 'section9') then
                      index-of($pageSequenceNames, $n)
                  else
                      ()"/>

    <xsl:variable name="hasBody" select="count($bodyPos) gt 0"/>

    <xsl:variable name="bodyNames"
      select="if ($hasBody) then
                  subsequence($pageSequenceNames, $bodyPos[1], 
                              $bodyPos[last()] - $bodyPos[1] + 1)
              else
                  ()"/>

    <xsl:variable name="frontmatterNames"
      select="if ($hasBody) then
                  subsequence($pageSequenceNames, 1, $bodyPos[1] - 1)
              else
                  $pageSequenceNames"/>

    <xsl:variable name="backmatterNames"
      select="if ($hasBody) then
                  subsequence($pageSequenceNames, $bodyPos[last()] + 1)
              else
                  ()"/>

    <xsl:variable name="documentTitle" select="u:documentTitle()"/>

    <xsl:variable name="documentDate">
      <xsl:for-each select="$ditacLists/ditac:titlePage">
        <xsl:call-template name="lastCritdate">
          <xsl:with-param name="defaulted" select="true()"/>
        </xsl:call-template>
      </xsl:for-each>
    </xsl:variable>

    <xsl:for-each-group
      select="if ($title-page eq 'none') then * except ditac:titlePage else *"
      group-adjacent="u:pageSequenceName(.)">
      <xsl:variable name="chunkEntry" select="current-group()[1]"/>

      <xsl:variable name="chunkEntryName" select="local-name($chunkEntry)"/>

      <!-- Unwrap the topic wrapped in a ditac:flags-block. -->
      <xsl:variable name="topic" 
                    select="if ($chunkEntryName eq 'flags-block') 
                            then $chunkEntry/*[1]
                            else $chunkEntry"/>

      <xsl:variable name="topicInfo" 
        select="if ($topic[contains(@class,' topic/topic ')]) 
                then
                  $ditacLists/ditac:chunkList/ditac:chunk/*[@id eq $topic/@id]
                else
                  $ditacLists/ditac:chunkList/ditac:chunk/*[local-name() eq 
                                                            $chunkEntryName]"/>

      <fo:page-sequence>
        <xsl:variable name="sequenceName" select="current-grouping-key()"/>
        <xsl:for-each select="$topic">
          <xsl:call-template name="configurePageSequence">
            <xsl:with-param name="sequenceName" 
                            select="$sequenceName"/>
            <xsl:with-param name="frontmatterNames" 
                            select="$frontmatterNames"/>
            <xsl:with-param name="bodyNames" 
                            select="$bodyNames"/>
            <xsl:with-param name="backmatterNames" 
                            select="$backmatterNames"/>
            <xsl:with-param name="topicInfo" 
                            select="$topicInfo"/>
            <xsl:with-param name="documentTitle" 
                            select="$documentTitle"/>
            <xsl:with-param name="documentDate" 
                            select="$documentDate"/>
          </xsl:call-template>
        </xsl:for-each>

        <fo:flow flow-name="xsl-region-body"
                 xsl:use-attribute-sets="base-style">
          <xsl:apply-templates select="current-group()"/>

          <!-- Used to implement %page-count%. -->
          <xsl:choose>
            <xsl:when test="index-of($frontmatterNames, $sequenceName) eq 
                            count($frontmatterNames)">
              <fo:block id="__EOFM" hyphenate="false"/>
            </xsl:when>
            <xsl:when test="index-of($bodyNames, $sequenceName) eq 
                            count($bodyNames)">
              <fo:block id="__EOBO" hyphenate="false"/>
            </xsl:when>
            <xsl:when test="index-of($backmatterNames, $sequenceName) eq 
                            count($backmatterNames)">
              <fo:block id="__EOBM" hyphenate="false"/>
            </xsl:when>
          </xsl:choose>
        </fo:flow>
      </fo:page-sequence>
    </xsl:for-each-group>
  </xsl:template>

  <xsl:function name="u:pageSequenceName" as="xs:string">
    <xsl:param name="chunkEntry" as="element()"/>

    <xsl:variable name="chunkEntryName" select="local-name($chunkEntry)"/>

    <!-- Unwrap the topic wrapped in a ditac:flags-block. -->
    <xsl:variable name="topic" 
                  select="if ($chunkEntryName eq 'flags-block') 
                          then $chunkEntry/*[1]
                          else $chunkEntry"/>

    <xsl:choose>
      <xsl:when test="$topic[contains(@class,' topic/topic ')]">
        <xsl:variable name="topicInfo" 
         select="$ditacLists/ditac:chunkList/ditac:chunk/*[@id eq $topic/@id]"/>
        <xsl:variable name="role" select="$topicInfo/@role"/>

        <xsl:choose>
          <xsl:when test="$role eq 'section1' or 
                          $role eq 'section2' or 
                          $role eq 'section3' or 
                          $role eq 'section4' or 
                          $role eq 'section5' or 
                          $role eq 'section6' or 
                          $role eq 'section7' or 
                          $role eq 'section8' or 
                          $role eq 'section9'">
            <xsl:variable name="preceding"
              select="($topicInfo/preceding-sibling::*[exists(@role) and 
                                               @role ne 'section1' and 
                                               @role ne 'section2' and 
                                               @role ne 'section3' and 
                                               @role ne 'section4' and 
                                               @role ne 'section5' and 
                                               @role ne 'section6' and 
                                               @role ne 'section7' and 
                                               @role ne 'section8' and 
                                               @role ne 'section9'])[last()]"/>
            <xsl:choose>
              <xsl:when test="exists($preceding)">
                <!-- Example: chapter, glossarylist, etc. These act 
                     as a division. -->
                <xsl:sequence select="concat($preceding/@role, '.', 
                                             generate-id($preceding))"/>
              </xsl:when>
              <xsl:otherwise>
                <!-- When there is no other division, the first section1 
                     of the document acts as a division. -->
                <xsl:variable name="preceding2"
                  select="($topicInfo/preceding-sibling::*[@role eq 'section1'])[1]"/>

                <xsl:choose>
                  <xsl:when test="exists($preceding2)">
                    <xsl:sequence select="concat('section1.', 
                                                  generate-id($preceding2))"/>
                  </xsl:when>
                  <xsl:otherwise>
                    <!-- First section of the document. -->
                    <xsl:sequence select="concat($role, '.',
                                                 generate-id($topicInfo))"/>
                  </xsl:otherwise>
                </xsl:choose>
              </xsl:otherwise>
            </xsl:choose>
          </xsl:when>

          <xsl:otherwise>
            <!-- Example: chapter, glossarylist, etc. -->
            <xsl:sequence select="concat($role, '.',
                                         generate-id($topicInfo))"/>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:when>

      <xsl:otherwise>
        <!-- Non-topics. Example: titlePage, toc, etc. -->
        <xsl:sequence select="concat($chunkEntryName, '.', 
                                     generate-id($chunkEntry))"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:function>
</xsl:stylesheet>
