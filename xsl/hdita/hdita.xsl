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

  <xsl:include href="table.xsl"/>

  <xsl:output method="xml" encoding="UTF-8" indent="no"/>

  <xsl:template match="/">
    <xsl:variable name="root" select="h:html/h:body/*[1]"/>
    <xsl:choose>
      <xsl:when test="$root/self::h:nav">
        <xsl:call-template name="processMap">
          <xsl:with-param name="root" select="$root"/>
        </xsl:call-template>
      </xsl:when>

      <xsl:when test="$root/self::h:article[@data-class eq 'concept']">
        <xsl:call-template name="processConcept">
          <xsl:with-param name="root" select="$root"/>
        </xsl:call-template>
      </xsl:when>

      <xsl:when test="$root/self::h:article">
        <!-- Support code for MDITA Extended Profile. -->
        <xsl:variable name="h1Classes" 
          select="tokenize($root/*[position() eq 1 and self::h:h1]/@class,
                           '\s+')"/>

        <xsl:choose>
          <xsl:when test="$h1Classes = 'map'">
            <xsl:call-template name="processMap">
              <xsl:with-param name="root" select="$root"/>
            </xsl:call-template>
          </xsl:when>

          <xsl:when test="$h1Classes = 'concept'">
            <xsl:call-template name="processConcept">
              <xsl:with-param name="root" select="$root"/>
            </xsl:call-template>
          </xsl:when>

          <xsl:otherwise>
            <xsl:call-template name="processTopic">
              <xsl:with-param name="root" select="$root"/>
            </xsl:call-template>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:when>

      <xsl:otherwise>
        <xsl:message terminate="yes"><xsl:value-of select="base-uri(.)"/>::: body must contain nav (to specify a map) or article (to specify a topic).</xsl:message>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="processMap">
    <xsl:param name="root" select="()"/>

    <xsl:text disable-output-escaping="yes">&lt;!DOCTYPE map PUBLIC "-//OASIS//DTD DITA Map//EN" "map.dtd"&gt;</xsl:text>

    <xsl:apply-templates select="$root" mode="map"/>
  </xsl:template>

  <xsl:template name="processConcept">
    <xsl:param name="root" select="()"/>

    <xsl:text disable-output-escaping="yes">&lt;!DOCTYPE concept PUBLIC "-//OASIS//DTD DITA Concept//EN" "concept.dtd"&gt;</xsl:text>

    <xsl:apply-templates select="$root"/>
  </xsl:template>

  <xsl:template name="processTopic">
    <xsl:param name="root" select="()"/>

    <xsl:text disable-output-escaping="yes">&lt;!DOCTYPE topic PUBLIC "-//OASIS//DTD DITA Topic//EN" "topic.dtd"&gt;</xsl:text>

    <xsl:apply-templates select="$root"/>
  </xsl:template>

  <!-- =======================================================================
       Map
       =================================================================== -->

  <!-- |h:body/h:article is support code for MDITA Extended Profile. -->
  <xsl:template match="h:body/h:nav | h:body/h:article" mode="map">
    <map>
      <xsl:call-template name="processCommonAttributes"/>

      <xsl:if test="empty(@lang)">
        <xsl:variable name="lang" select="(ancestor::*/@lang)[last()]"/>
        <xsl:if test="$lang ne ''">
          <xsl:attribute name="xml:lang" select="$lang"/>
        </xsl:if>
      </xsl:if>

      <xsl:variable name="h1" 
                    select="child::*[position() eq 1 and self::h:h1]"/>
      <xsl:variable name="metas" 
                    select="/h:html/h:head/h:meta[exists(@name)]"/>
      <xsl:choose>
        <xsl:when test="exists($h1)">
          <topicmeta>
            <xsl:for-each select="$h1">
              <xsl:call-template name="processMapTitle"/>
            </xsl:for-each>

            <xsl:if test="exists($metas)">
              <xsl:call-template name="processMapMeta"/>
            </xsl:if>
          </topicmeta>

          <xsl:apply-templates select="child::*[position() gt 1]" mode="map"/>
        </xsl:when>

        <xsl:otherwise>
          <xsl:if test="exists(/h:html/h:head/h:title) or exists($metas)">
            <topicmeta>
              <xsl:if test="exists(/h:html/h:head/h:title)">
                <navtitle>
                  <xsl:value-of select="/h:html/h:head/h:title"/>
                </navtitle>
              </xsl:if>

              <xsl:if test="exists($metas)">
                <xsl:call-template name="processMapMeta"/>
              </xsl:if>
            </topicmeta>
          </xsl:if>

          <xsl:apply-templates mode="map"/>
        </xsl:otherwise>
      </xsl:choose>
    </map>
  </xsl:template>

  <xsl:template name="processMapTitle">
    <navtitle>
      <xsl:call-template name="processCommonAttributes1"/>
      <xsl:apply-templates/>
    </navtitle>
  </xsl:template>

  <xsl:template name="processMapMeta">
    <xsl:apply-templates
      select="/h:html/h:head/h:meta[@name eq 'author']"/>

    <xsl:apply-templates 
      select="(/h:html/h:head/h:meta[@name eq 'source'])[1]"/>

    <xsl:apply-templates 
      select="(/h:html/h:head/h:meta[@name = ('publisher', 
                                              'dcterms.publisher')])[1]"/>

    <xsl:if test="exists(/h:html/h:head/h:meta[@name = ('created', 
                                                       'dcterms.created',
                                                       'revised',
                                                       'dcterms.modified')])">
      <critdates>
        <xsl:apply-templates
          select="(/h:html/h:head/h:meta[@name = ('created',
                                                  'dcterms.created')])[1]"/>

        <xsl:apply-templates
          select="/h:html/h:head/h:meta[@name = ('revised',
                                                 'dcterms.modified')]"/>
      </critdates>
    </xsl:if>

    <xsl:apply-templates 
      select="(/h:html/h:head/h:meta[@name eq 'permissions'])[1]"/>

    <xsl:apply-templates
      select="/h:html/h:head/h:meta[@name = 'audience']"/>

    <xsl:apply-templates
      select="/h:html/h:head/h:meta[@name = 'category']"/>

    <xsl:if test="exists(/h:html/h:head/h:meta[@name eq 'keyword'])">
      <keywords>
        <xsl:apply-templates
          select="/h:html/h:head/h:meta[@name = 'keyword']"/>
      </keywords>
    </xsl:if>

    <xsl:apply-templates
      select="/h:html/h:head/h:meta[@name eq 'resourceid']"/>

    <xsl:apply-templates
      select="/h:html/h:head/h:meta[not(@name = ('author', 
                                                 'source', 
                                                 'publisher', 
                                                 'dcterms.publisher', 
                                                 'created', 
                                                 'dcterms.created', 
                                                 'revised', 
                                                 'dcterms.modified',
                                                 'permissions',
                                                 'audience',
                                                 'category',
                                                 'keyword',
                                                 'resourceid'))]"/>
  </xsl:template>

  <!-- keydef ========================= -->

  <xsl:template match="h:div[@data-class eq 'keydef']" mode="map">
    <xsl:variable name="firstChild" select="child::*[1]"/>

    <xsl:variable name="a"
      select="$firstChild/self::h:a[@href ne '' and @data-keys ne '']"/>

    <xsl:variable name="span"
      select="$firstChild/self::h:span[@data-class eq 'linktext' and 
                                       @data-keys ne '']"/>

    <xsl:if test="exists($a) or exists($span)">
      <keydef keys="{$firstChild/@data-keys}">
        <xsl:call-template name="processCommonAttributes"/>

        <xsl:apply-templates select="$firstChild" mode="map"/>
      </keydef>
    </xsl:if>
  </xsl:template>

  <xsl:template match="h:a" mode="map">
    <xsl:copy-of select="@href"/>

    <xsl:call-template name="processCommonAttributes"/>
    <xsl:call-template name="processLinkAttributes"/>
    <xsl:call-template name="processKeyrefAttribute"/>

    <!-- We generate DITA, not XDITA. 
         Hence even a keydef may have processing-role=normal. -->
    <xsl:if test="@data-processing-role ne ''">
      <xsl:attribute name="processing-role" select="@data-processing-role"/>
    </xsl:if>

    <xsl:variable name="text" select="./node()"/>
    <xsl:if test="exists($text)">
      <topicmeta>
        <navtitle>
          <xsl:apply-templates select="$text"/>
        </navtitle>
      </topicmeta>
    </xsl:if>
  </xsl:template>

  <xsl:template match="h:span[@data-class eq 'linktext']" mode="map">
    <topicmeta>
      <linktext>
        <xsl:call-template name="processCommonAttributes"/>
        <xsl:apply-templates/>
      </linktext>
    </topicmeta>
  </xsl:template>

  <!-- topicref ========================= -->

  <xsl:template match="h:ul" mode="map">
    <xsl:apply-templates mode="map"/>
  </xsl:template>

  <xsl:template match="h:li" mode="map">
    <topicref>
      <!-- If li/p/a, ignore p. -->
      <xsl:variable name="a"
        select="(child::*[1]/descendant-or-self::h:a[@href ne ''])[1]"/>
      <xsl:choose>
        <xsl:when test="exists($a)">
          <xsl:apply-templates select="$a" mode="map"/>

          <xsl:apply-templates select="child::*[position() gt 1]" mode="map"/>
        </xsl:when>

        <xsl:otherwise>
          <xsl:call-template name="processCommonAttributes"/>

          <xsl:apply-templates mode="map"/>
        </xsl:otherwise>
      </xsl:choose>
    </topicref>
  </xsl:template>

  <xsl:template match="*" mode="map">
    <xsl:message><xsl:value-of select="base-uri(.)"/>::: ignoring element "<xsl:value-of select="name(.)"/>".</xsl:message>
  </xsl:template>

  <!-- =======================================================================
       Attributes
       =================================================================== -->

  <xsl:template name="processCommonAttributes0">
    <xsl:if test="@lang ne ''">
      <xsl:attribute name="xml:lang" select="@lang"/>
    </xsl:if>

    <xsl:if test="@translate eq '' or @translate = ('no', 'yes')">
      <xsl:attribute name="translate"
                     select="if (@translate eq '') then 'yes' else @translate"/>
    </xsl:if>

    <xsl:if test="@dir = ('rtl', 'ltr')">
      <xsl:attribute name="dir" select="@dir"/>
    </xsl:if>

    <xsl:if test="@data-props ne ''">
      <xsl:attribute name="props" select="@data-props"/>
    </xsl:if>

    <xsl:if test="@data-conref ne ''">
      <xsl:attribute name="conref" select="@data-conref"/>
    </xsl:if>
  </xsl:template>

  <xsl:template name="processCommonAttributes1">
    <xsl:copy-of select="@id"/>

    <xsl:call-template name="processCommonAttributes0"/>
  </xsl:template>

  <xsl:template name="processCommonAttributes">
    <xsl:param name="addRole" select="false()"/>

    <xsl:call-template name="processCommonAttributes1"/>

    <!-- Support code for MDITA Extended Profile. -->
    <xsl:variable name="class">
      <xsl:choose>
        <xsl:when test="self::h:h1 and 
                        ../self::h:article and ../../self::h:body">
          <xsl:value-of
            select="replace(@class, '(^|\s+)(map|topic|concept|task|reference)(\s+|$)', '')"/>
        </xsl:when>
        <xsl:when test="self::h:h2 and
                        ../self::h:article and ../../self::h:body">
          <xsl:value-of
            select="replace(@class, '(^|\s+)(section|example)(\s+|$)', '')"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:value-of select="@class"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>

    <xsl:if test="$class ne '' or $addRole">
      <xsl:attribute name="outputclass" 
                     select="if ($addRole) 
                             then normalize-space(concat($class, ' role-', 
                                                         local-name()))
                             else $class"/>
    </xsl:if>
  </xsl:template>

  <xsl:template name="processLinkAttributes">
    <xsl:if test="@type ne ''">
      <xsl:attribute name="format" select="@type"/>
    </xsl:if>

    <xsl:if test="@rel ne ''">
      <xsl:attribute name="scope" select="@rel"/>
    </xsl:if>
  </xsl:template>

  <xsl:template name="processKeyrefAttribute">
    <xsl:if test="@data-keyref ne ''">
      <xsl:attribute name="keyref" select="@data-keyref"/>
    </xsl:if>
  </xsl:template>

  <!-- =======================================================================
       Topic
       =================================================================== -->

  <xsl:template match="h:body/h:article">
    <!-- Top-level article. -->

    <xsl:variable name="h1" 
                  select="child::*[position() eq 1 and self::h:h1]"/>
    <!-- Support code for MDITA Extended Profile. -->
    <xsl:variable name="h1Classes" select="tokenize($h1/@class, '\s+')"/>

    <xsl:variable name="topicName" 
                  select="if (@data-class eq 'concept' or 
                              $h1Classes = 'concept') 
                          then 'concept' else 'topic'"/>
    <xsl:variable name="bodyName"
                  select="if (@data-class eq 'concept' or 
                              $h1Classes = 'concept') 
                          then 'conbody' else 'body'"/>

    <xsl:element name="{$topicName}">
      <xsl:call-template name="processCommonAttributes"/>

      <xsl:if test="empty(@lang)">
        <xsl:variable name="lang" select="(ancestor::*/@lang)[last()]"/>
        <xsl:if test="$lang ne ''">
          <xsl:attribute name="xml:lang" select="$lang"/>
        </xsl:if>
      </xsl:if>

      <xsl:if test="empty(@id)">
        <xsl:attribute name="id" 
          select="if (normalize-space($h1) ne '') 
                  then u:checkId($h1)
                  else
                      if (normalize-space(/h:html/h:head/h:title) ne '') 
                      then u:checkId(/h:html/h:head/h:title)
                      else $topicName"/>
      </xsl:if>

      <xsl:choose>
        <xsl:when test="exists($h1)">
          <xsl:for-each select="$h1">
            <xsl:call-template name="processTitle"/>
          </xsl:for-each>

          <xsl:variable name="p" 
                        select="child::*[position() eq 2 and self::h:p]"/>
          <xsl:call-template name="processDescription">
            <xsl:with-param name="firstP" select="$p"/>
          </xsl:call-template>

          <xsl:call-template name="processMeta"/>

          <xsl:variable name="first" select="if (exists($p)) then 2 else 1"/>
          <xsl:call-template name="processTopicBody">
            <xsl:with-param name="bodyName" select="$bodyName"/>
            <xsl:with-param name="after" select="$first"/>
          </xsl:call-template>
        </xsl:when>

        <xsl:otherwise>
          <xsl:if test="exists(/h:html/h:head/h:title)">
            <title>
              <xsl:value-of select="/h:html/h:head/h:title"/>
            </title>
          </xsl:if>

          <xsl:variable name="p" 
                        select="child::*[position() eq 1 and self::h:p]"/>
          <xsl:call-template name="processDescription">
            <xsl:with-param name="firstP" select="$p"/>
          </xsl:call-template>

          <xsl:call-template name="processMeta"/>

          <xsl:variable name="first" select="if (exists($p)) then 1 else 0"/>
          <xsl:call-template name="processTopicBody">
            <xsl:with-param name="bodyName" select="$bodyName"/>
            <xsl:with-param name="after" select="$first"/>
          </xsl:call-template>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:element>
  </xsl:template>

  <xsl:function name="u:checkId" as="xs:string">
    <xsl:param name="text" as="xs:string"/>

    <xsl:variable name="text2" select="normalize-space($text)"/>
    <xsl:variable name="text3" select="if ($text2 eq '') then '_' else $text2"/>
    <!-- [\C] means: not a NameChar -->
    <xsl:variable name="text4" select="replace($text3, '[\C]+', '_')"/>

    <xsl:sequence
        select="if (not(matches(substring($text4, 1, 1), '[\p{L}_:]')))
                then concat('_', $text4) 
                else $text4"/>
  </xsl:function>

  <xsl:template name="processTitle">
    <title>
      <xsl:call-template name="processCommonAttributes"/>
      <xsl:apply-templates/>
    </title>
  </xsl:template>

  <xsl:template name="processDescription">
    <xsl:param name="firstP" select="()"/>

    <xsl:choose>
      <xsl:when test="exists($firstP)">
        <!-- Empty p means: no shortdesc. -->
        <xsl:if test="exists($firstP/node())">
          <xsl:for-each select="$firstP">
            <xsl:call-template name="processShortdesc"/>
          </xsl:for-each>
        </xsl:if>
      </xsl:when>

      <xsl:otherwise>
        <xsl:variable name="description" 
          select="(/h:html/h:head/h:meta[@name eq 'description'])[1]"/>
        <xsl:if test="exists($description)">
          <shortdesc>
            <xsl:value-of select="$description/@content"/>
          </shortdesc>
        </xsl:if>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="processShortdesc">
    <shortdesc>
      <xsl:call-template name="processCommonAttributes"/>
      <xsl:apply-templates/>
    </shortdesc>
  </xsl:template>

  <xsl:template name="processMeta">
    <xsl:variable name="prologContent">
      <xsl:apply-templates
        select="/h:html/h:head/h:meta[@name eq 'author']"/>

      <xsl:apply-templates 
        select="(/h:html/h:head/h:meta[@name eq 'source'])[1]"/>

      <xsl:apply-templates 
        select="(/h:html/h:head/h:meta[@name = ('publisher', 
                                                'dcterms.publisher')])[1]"/>

      <xsl:if test="exists(/h:html/h:head/h:meta[@name = ('created', 
                                                         'dcterms.created',
                                                         'revised',
                                                         'dcterms.modified')])">
        <critdates>
          <xsl:apply-templates
            select="(/h:html/h:head/h:meta[@name = ('created',
                                                    'dcterms.created')])[1]"/>

          <xsl:apply-templates
            select="/h:html/h:head/h:meta[@name = ('revised',
                                                   'dcterms.modified')]"/>
        </critdates>
      </xsl:if>

      <xsl:apply-templates 
        select="(/h:html/h:head/h:meta[@name eq 'permissions'])[1]"/>

      <xsl:if test="exists(/h:html/h:head/h:meta[@name = ('audience', 
                                                          'category', 
                                                          'keyword')])">
        <metadata>
          <xsl:apply-templates
            select="/h:html/h:head/h:meta[@name = 'audience']"/>

          <xsl:apply-templates
            select="/h:html/h:head/h:meta[@name = 'category']"/>

          <xsl:if test="exists(/h:html/h:head/h:meta[@name eq 'keyword'])">
            <keywords>
              <xsl:apply-templates
                  select="/h:html/h:head/h:meta[@name = 'keyword']"/>
            </keywords>
          </xsl:if>
        </metadata>
      </xsl:if>

      <xsl:apply-templates
        select="/h:html/h:head/h:meta[@name eq 'resourceid']"/>

      <xsl:apply-templates
        select="/h:html/h:head/h:meta[not(@name = ('description', 
                                                   'author', 
                                                   'source', 
                                                   'publisher', 
                                                   'dcterms.publisher', 
                                                   'created', 
                                                   'dcterms.created', 
                                                   'revised', 
                                                   'dcterms.modified',
                                                   'permissions',
                                                   'audience',
                                                   'category',
                                                   'keyword',
                                                   'resourceid'))]"/>
    </xsl:variable>

    <xsl:if test="exists($prologContent/*)">
      <prolog>
        <xsl:copy-of select="$prologContent"/>
      </prolog>
    </xsl:if>
  </xsl:template>

  <xsl:template match="h:meta[@name = ('author', 
                                       'source',
                                       'category',
                                       'keyword')]">
    <xsl:element name="{@name}">
      <xsl:value-of select="normalize-space(@content)"/>
    </xsl:element>
  </xsl:template>

  <xsl:template match="h:meta[@name = ('publisher', 'dcterms.publisher')]">
    <publisher>
      <xsl:value-of select="normalize-space(@content)"/>
    </publisher>
  </xsl:template>

  <xsl:template match="h:meta[@name = ('created', 'dcterms.created')]">
    <created date="{normalize-space(@content)}"/>
  </xsl:template>

  <xsl:template match="h:meta[@name = ('revised', 'dcterms.modified')]">
    <revised modified="{normalize-space(@content)}"/>
  </xsl:template>

  <xsl:template match="h:meta[@name eq 'permissions']">
    <permissions view="{normalize-space(@content)}"/>
  </xsl:template>

  <xsl:template match="h:meta[@name eq 'audience']">
    <audience type="{normalize-space(@content)}"/>
  </xsl:template>

  <xsl:template match="h:meta[@name eq 'resourceid']">
    <resourceid appid="{normalize-space(@content)}"/>
  </xsl:template>

  <xsl:template match="h:meta">
    <xsl:if test="@name ne ''">
      <data name="{@name}" value="{normalize-space(@content)}"/>
    </xsl:if>
  </xsl:template>

  <xsl:template name="processTopicBody">
    <xsl:param name="bodyName" select="'body'"/>
    <xsl:param name="after" select="1"/>
    
    <xsl:element name="{$bodyName}">
      <!-- Support of implicit sections. -->
      <xsl:variable name="h2" 
        select="(child::*[position() gt $after and self::h:h2])[1]"/>

      <xsl:choose>
        <xsl:when test="exists($h2)">
          <xsl:variable name="beforeH2" select="$h2/preceding-sibling::*"/>
          <xsl:variable name="afterH2" 
                        select="$h2 | $h2/following-sibling::*"/>

          <xsl:apply-templates
              select="child::*[position() gt $after] intersect $beforeH2"/>

          <xsl:for-each-group select="$afterH2" group-starting-with="h:h2">
            <!-- Support code for MDITA Extended Profile. -->
            <xsl:variable name="h2" select="current-group()[1]"/>
            <xsl:variable name="sectionName"
                          select="if (tokenize(@class, '\s+') = 'example') 
                                  then 'example'
                                  else 'section'"/>

            <xsl:element name="{$sectionName}">
              <xsl:for-each select="$h2">
                <xsl:call-template name="processTitle"/>
              </xsl:for-each>

              <xsl:apply-templates select="subsequence(current-group(), 2)"/>
            </xsl:element>
          </xsl:for-each-group>
        </xsl:when>

        <xsl:otherwise>
          <xsl:apply-templates select="child::*[position() gt $after]"/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:element>
  </xsl:template>

  <!-- section ========================= -->

  <xsl:template match="h:article/h:section">
    <!-- Top-level section. -->

    <xsl:variable name="sectionName" select="if (@data-class eq 'example') 
                                             then 'example'
                                             else 'section'"/>
    <xsl:element name="{$sectionName}">
      <xsl:call-template name="processCommonAttributes"/>

      <xsl:variable name="heading" 
                    select="child::*[position() eq 1 and 
                                     (self::h:h1 or
                                      self::h:h2 or
                                      self::h:h3 or
                                      self::h:h4 or
                                      self::h:h5 or
                                      self::h:h6)]"/>
      <xsl:choose>
        <xsl:when test="exists($heading)">
          <xsl:for-each select="$heading">
            <xsl:call-template name="processTitle"/>
          </xsl:for-each>

          <xsl:apply-templates select="child::*[position() gt 1]"/>
        </xsl:when>

        <xsl:otherwise>
          <xsl:apply-templates/>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:element>
  </xsl:template>

  <!-- dl ========================= -->

  <xsl:template match="h:dl">
    <!-- Works only if the dl contains sequences comprising
         one or more dt followed by one or more dd. That is, a real dl. -->

    <dl>
      <xsl:call-template name="processCommonAttributes"/>

      <xsl:for-each-group select="./h:dt | ./h:dd" 
        group-starting-with="h:dt[empty(preceding-sibling::*[1]) or 
                                  exists(preceding-sibling::*[1]/self::h:dd)]">
        <dlentry>
          <xsl:apply-templates select="current-group()"/>
        </dlentry>
      </xsl:for-each-group>
    </dl>
  </xsl:template>

  <!-- ol ========================= -->

  <xsl:template match="h:ol">
    <ol>
      <xsl:call-template name="processCommonAttributes"/>

      <xsl:if test="exists(@type) or exists(@start)">
        <xsl:variable name="outputclass">
          <xsl:if test="exists(@type)">
            <xsl:choose>
              <xsl:when test="@type eq 'a'">lower-alpha</xsl:when>
              <xsl:when test="@type eq 'A'">upper-alpha</xsl:when>
              <xsl:when test="@type eq 'i'">lower-roman</xsl:when>
              <xsl:when test="@type eq 'I'">upper-roman</xsl:when>
              <xsl:otherwise>decimal</xsl:otherwise>
            </xsl:choose>
          </xsl:if>

          <xsl:text> </xsl:text>

          <xsl:if test="exists(@start) and number(@start) ge 0">
            <xsl:value-of select="concat('start(', @start, ')')"/>
          </xsl:if>
        </xsl:variable>

        <xsl:attribute name="outputclass"
          select="normalize-space(concat(@class, ' ', $outputclass))"/>
      </xsl:if>

      <xsl:apply-templates/>
    </ol>
  </xsl:template>

  <!-- figure ========================= -->

  <xsl:template match="h:figure">
    <fig>
      <xsl:call-template name="processCommonAttributes"/>
      
      <xsl:for-each select="./h:figcaption[1]">
        <xsl:call-template name="processTitle"/>
      </xsl:for-each>

      <xsl:apply-templates select="* except ./h:figcaption"/>
    </fig>
  </xsl:template>

  <!-- table ========================= -->

  <xsl:template match="h:table">
    <xsl:choose>
      <xsl:when test="parent::h:td or parent::h:th or 
                      parent::h:figure or
                      parent::h:div[@data-class = 'fn']">
        <!-- Keep DITA validator quiet. -->
        <p>
          <xsl:call-template name="processTable"/>
        </p>
      </xsl:when>
      <xsl:otherwise>
        <xsl:call-template name="processTable"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- notes ========================= -->

  <xsl:template match="h:div[@data-class eq 'note']">
    <note>
      <xsl:if test="@data-type = ('note', 'attention', 'caution', 
                                  'danger', 'fastpath', 'important',
                                  'notice', 'remember', 'restriction',
                                  'tip', 'trouble', 'warning')">
        <xsl:attribute name="type" select="@data-type"/>
      </xsl:if>

      <xsl:call-template name="processCommonAttributes"/>
      <xsl:apply-templates/>
    </note>
  </xsl:template>

  <!-- blockquote ========================= -->

  <xsl:template match="h:blockquote">
    <lq>
      <xsl:call-template name="processCommonAttributes"/>
      <xsl:call-template name="processKeyrefAttribute"/>
      <xsl:apply-templates/>
    </lq>
  </xsl:template>

  <!-- pre ========================= -->

  <xsl:template match="h:pre">
    <!-- A pre only containing a single code child is translated 
         to a 'codeblock'.-->

    <xsl:choose>
      <xsl:when test="exists(./h:code) and count(./node()) eq 1">
        <codeblock>
          <xsl:call-template name="processCommonAttributes"/>
          <xsl:apply-templates select="./h:code/node()"/>
        </codeblock>
      </xsl:when>

      <xsl:otherwise>
        <pre>
          <xsl:call-template name="processCommonAttributes"/>
          <xsl:apply-templates/>
        </pre>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- fn ========================= -->

  <xsl:template match="h:div[@data-class eq 'fn']">
    <xsl:choose>
      <xsl:when test="not(parent::h:pre or
                          parent::h:dd or
                          parent::h:div or
                          parent::h:td or parent::h:th or
                          parent::h:figure or
                          parent::h:li or
                          parent::h:blockquote or
                          parent::h:p or
                          parent::h:span or
                          parent::h:section)">
        <!-- Keep DITA validator quiet. -->
        <div>
          <xsl:call-template name="processFootnote"/>
        </div>
      </xsl:when>
      <xsl:otherwise>
        <xsl:call-template name="processFootnote"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="processFootnote">
    <fn>
      <xsl:call-template name="processCommonAttributes0"/>

      <xsl:if test="exists(@id)">
        <xsl:variable name="href" select="concat('^#([^/]+/)?(', @id, ')$')"/>
        <xsl:variable name="link" select="//h:a[matches(@href, $href)]"/>
        <xsl:if test="exists($link)">
          <xsl:copy-of select="@id"/>
        </xsl:if>
      </xsl:if>
      <!-- Otherwise, do not copy id attribute.
           A footnote that specifies an @id attribute is a use-by-reference
           footnote. Upon output, it does not appear anywhere unless it has
           been referenced using an <xref> with the @type attribute set to
           "fn". -->

      <xsl:apply-templates/>
    </fn>
  </xsl:template>

  <xsl:template match="h:span[@data-class eq 'fn']">
    <xsl:choose>
      <xsl:when test="not(parent::h:pre or
                          parent::h:dd or
                          parent::h:div or
                          parent::h:td or parent::h:th or
                          parent::h:figure or
                          parent::h:li or
                          parent::h:blockquote or
                          parent::h:p or
                          parent::h:span or
                          parent::h:section)">
        <!-- Keep DITA validator quiet. -->
        <ph>
          <xsl:call-template name="processFootnote"/>
        </ph>
      </xsl:when>
      <xsl:otherwise>
        <xsl:call-template name="processFootnote"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- a ========================= -->

  <xsl:template match="h:a">
    <xsl:choose>
      <xsl:when test="exists(@href)">
        <xref>
          <xsl:variable name="isMDITAKeyRef"
                        select="@data-keyref ne '' and @href eq '' and 
                                normalize-space(.) eq @data-keyref"/>

          <!-- Normalize "#foo" to "#./foo". -->
          <xsl:variable name="href" 
                        select="if (starts-with(@href, '#'))
                                then if (contains(@href, '/'))
                                     then string(@href)
                                     else concat('#./', 
                                                 substring-after(@href, '#'))
                                else string(@href)"/>

          <xsl:if test="not($isMDITAKeyRef)">
            <xsl:attribute name="href" select="$href"/>
          </xsl:if>

          <xsl:call-template name="processCommonAttributes"/>
          <xsl:call-template name="processLinkAttributes"/>
          <xsl:call-template name="processKeyrefAttribute"/>

          <xsl:variable name="type">
            <xsl:if test="starts-with($href, '#')">
              <xsl:variable name="ref" select="substring-after($href, '/')"/>

              <xsl:variable name="target" select="(//*[@id eq $ref])[1]"/>
              <xsl:if test="exists($target) and 
                            $target/self::h:*[@data-class eq 'fn' and 
                                              local-name() =  ('span', 'div')]">
                <xsl:sequence select="'fn'"/>
              </xsl:if>
            </xsl:if>
          </xsl:variable>

          <xsl:choose>
            <xsl:when test="$type ne ''">
              <xsl:attribute name="type" select="$type"/>
              <!-- No need to keep the text of this link. -->
            </xsl:when>

            <xsl:otherwise>
              <xsl:if test="not($isMDITAKeyRef)">
                <xsl:apply-templates/>
              </xsl:if>
            </xsl:otherwise>
          </xsl:choose>
        </xref>
      </xsl:when>
      <xsl:otherwise>
        <ph>
          <xsl:call-template name="processCommonAttributes"/>
          <xsl:call-template name="processKeyrefAttribute"/>
          <xsl:apply-templates/>
        </ph>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- object ========================= -->

  <xsl:template match="h:object">
    <object>
      <xsl:call-template name="processCommonAttributes"/>

      <xsl:for-each select="@data | @type | @name | @tabindex">
        <xsl:copy/>
      </xsl:for-each>

      <xsl:call-template name="processMediaContent0"/>

      <xsl:apply-templates select="./h:param"/>
    </object>
  </xsl:template>

  <xsl:template name="processMediaContent0">
    <xsl:for-each select="@width | @height">
      <xsl:if test="number(.) gt 0">
        <xsl:copy/>
      </xsl:if>
    </xsl:for-each>

    <xsl:if test="@title ne ''">
      <desc>
        <xsl:value-of select="@title"/>
      </desc>
    </xsl:if>
  </xsl:template>

  <xsl:template match="h:param[exists(@name)]">
    <param>
      <xsl:call-template name="processCommonAttributes1"/>

      <xsl:for-each select="@name | @value">
        <xsl:copy/>
      </xsl:for-each>
    </param>
  </xsl:template>

  <!-- audio ========================= -->

  <xsl:template match="h:audio">
    <audio>
      <xsl:call-template name="processCommonAttributes"/>
      <xsl:call-template name="processMediaContent"/>
    </audio>
  </xsl:template>

  <xsl:template name="processMediaContent">
    <xsl:call-template name="processMediaContent0"/>

    <xsl:if test="@poster ne ''">
      <video-poster value="{@poster}"/>
    </xsl:if>

    <xsl:if test="exists(@controls)">
      <media-controls value="true"/>
    </xsl:if>

    <xsl:if test="exists(@autoplay)">
      <media-autoplay value="true"/>
    </xsl:if>

    <xsl:if test="exists(@loop)">
      <media-loop value="true"/>
    </xsl:if>

    <xsl:if test="exists(@muted)">
      <media-muted value="true"/>
    </xsl:if>

    <xsl:if test="@src ne ''">
      <media-source value="{@src}"/>
    </xsl:if>

    <xsl:apply-templates select="./h:source"/>
    <xsl:apply-templates select="./h:track"/>
  </xsl:template>

  <xsl:template match="h:source[exists(@src)]">
    <media-source value="{@src}"/>
  </xsl:template>

  <xsl:template match="h:track[exists(@src)]">
    <media-track value="{@src}">
      <xsl:if test="@kind ne ''">
        <xsl:attribute name="type" select="@kind"/>
      </xsl:if>
    </media-track>
  </xsl:template>

  <!-- video ========================= -->

  <xsl:template match="h:video">
    <video>
      <xsl:call-template name="processCommonAttributes"/>
      <xsl:call-template name="processMediaContent"/>
    </video>
  </xsl:template>

  <!-- img ========================= -->

  <!-- Support code for MDITA Core Profile. -->
  <xsl:template match="h:p[count(./node()) eq 1 and exists(./h:img) and 
                           empty(@*)]">
    <xsl:variable name="img" select="./h:img"/>
    <xsl:variable name="title" select="normalize-space($img/@title)"/>

    <xsl:choose>
      <xsl:when test="$title ne ''">
        <fig>
          <title><xsl:value-of select="$title"/></title>
          <xsl:for-each select="$img">
            <xsl:call-template name="processImage">
              <xsl:with-param name="placement" select="'break'"/>
            </xsl:call-template>
          </xsl:for-each>
        </fig>
      </xsl:when>

      <xsl:otherwise>
        <xsl:for-each select="$img">
          <xsl:call-template name="processImage">
            <xsl:with-param name="placement" select="'break'"/>
          </xsl:call-template>
        </xsl:for-each>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="h:img">
    <xsl:choose>
      <xsl:when
       test="parent::h:em or
             parent::h:strong or
             parent::h:dfn or
             parent::h:abbr or
             parent::h:acronym or
             parent::h:code or
             parent::h:var or
             parent::h:kdb or
             parent::h:samp or
             parent::h:cite or
             parent::h:b or
             parent::h:i or
             parent::h:q or
             parent::h:sub or
             parent::h:sup or
             parent::h:tt or
             parent::h:u or
             parent::h:s or
             parent::h:strike">
        <!-- Keep DITA validator quiet. -->
        <ph>
          <xsl:call-template name="processImage"/>
        </ph>
      </xsl:when>
      <xsl:otherwise>
        <xsl:call-template name="processImage"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="processImage">
    <xsl:param name="placement" select="''"/>

    <image>
      <xsl:call-template name="processCommonAttributes"/>
      <xsl:call-template name="processKeyrefAttribute"/>

      <xsl:variable name="isMDITAKeyRef"
                    select="@data-keyref ne '' and @src eq '' and 
                            normalize-space(@alt) eq @data-keyref"/>

      <xsl:if test="not($isMDITAKeyRef)">
        <xsl:attribute name="href" select="@src"/>
      </xsl:if>

      <xsl:for-each select="@width | @height">
        <xsl:if test="number(.) gt 0">
          <xsl:copy/>
        </xsl:if>
      </xsl:for-each>

      <xsl:variable name="placement2" 
                    select="if ($placement ne '') 
                            then $placement
                            else if (exists(parent::h:figure))
                                 then 'break'
                                 else ''"/>
      <xsl:if test="$placement2 ne ''">
        <xsl:attribute name="placement" select="$placement2"/>
      </xsl:if>

      <xsl:if test="@alt ne '' and not($isMDITAKeyRef)">
        <alt>
          <xsl:value-of select="@alt"/>
        </alt>
      </xsl:if>
    </image>
  </xsl:template>

  <!-- Text-level elements ========================= -->

  <xsl:template match="h:strong">
    <b>
      <xsl:call-template name="processCommonAttributes"/>
      <xsl:apply-templates/>
    </b>
  </xsl:template>

  <xsl:template match="h:em">
    <i>
      <xsl:call-template name="processCommonAttributes"/>
      <xsl:apply-templates/>
    </i>
  </xsl:template>

  <xsl:template match="h:span">
    <ph>
      <xsl:call-template name="processCommonAttributes"/>
      <xsl:call-template name="processKeyrefAttribute"/>
      <xsl:apply-templates/>
    </ph>
  </xsl:template>

  <xsl:template match="h:s |
                       h:strike">
    <line-through>
      <xsl:call-template name="processCommonAttributes"/>
      <xsl:apply-templates/>
    </line-through>
  </xsl:template>

  <xsl:template match="h:dfn">
    <term>
      <xsl:call-template name="processCommonAttributes"/>
      <xsl:call-template name="processKeyrefAttribute"/>
      <xsl:apply-templates/>
    </term>
  </xsl:template>

  <xsl:template match="h:abbr | 
                       h:acronym">
    <keyword>
      <xsl:call-template name="processCommonAttributes"/>
      <xsl:call-template name="processKeyrefAttribute"/>
      <xsl:apply-templates/>
    </keyword>
  </xsl:template>

  <xsl:template match="h:code">
    <codeph>
      <xsl:call-template name="processCommonAttributes"/>
      <xsl:call-template name="processKeyrefAttribute"/>
      <xsl:apply-templates/>
    </codeph>
  </xsl:template>

  <xsl:template match="h:var">
    <varname>
      <xsl:call-template name="processCommonAttributes"/>
      <xsl:call-template name="processKeyrefAttribute"/>
      <xsl:apply-templates/>
    </varname>
  </xsl:template>

  <xsl:template match="h:kbd">
    <userinput>
      <xsl:call-template name="processCommonAttributes"/>
      <xsl:call-template name="processKeyrefAttribute"/>
      <xsl:apply-templates/>
    </userinput>
  </xsl:template>

  <xsl:template match="h:samp">
    <systemoutput>
      <xsl:call-template name="processCommonAttributes"/>
      <xsl:call-template name="processKeyrefAttribute"/>
      <xsl:apply-templates/>
    </systemoutput>
  </xsl:template>

  <!-- Other elements ========================= -->

  <xsl:template match="h:cite |
                       h:dt">
    <xsl:element name="{local-name()}">
      <xsl:call-template name="processCommonAttributes"/>
      <xsl:call-template name="processKeyrefAttribute"/>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

  <xsl:template match="h:dd |
                       h:li |
                       h:div |
                       h:p |
                       h:ul |
                       h:sub | h:sup |
                       h:u |
                       h:q |
                       h:b |
                       h:i |
                       h:tt">
    <xsl:element name="{local-name()}">
      <xsl:call-template name="processCommonAttributes"/>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

  <!-- An article has flow content. -->

  <xsl:template match="h:del |
                       h:ins">
    <xsl:variable name="containerName" 
                  select="if (exists(.//h:h1 |
                                     .//h:h2 |
                                     .//h:h3 |
                                     .//h:h4 |
                                     .//h:h5 |
                                     .//h:h6 |
                                     .//h:div |
                                     .//h:section |
                                     .//h:nav |
                                     .//h:aside |
                                     .//h:header |
                                     .//h:footer |
                                     .//h:blockquote |
                                     .//h:address |
                                     .//h:hr |
                                     .//h:p |
                                     .//h:pre |
                                     .//h:ul |
                                     .//h:ol |
                                     .//h:dl |
                                     .//h:table |
                                     .//h:figure |
                                     .//h:fieldset |
                                     .//h:form |
                                     .//h:details |
                                     .//h:dialog |
                                     .//h:script |
                                     .//h:template)) 
                          then 'div'
                          else 'ph'"/>
    <xsl:element name="{$containerName}">
      <xsl:call-template name="processCommonAttributes">
        <xsl:with-param name="addRole" select="true()"/>
      </xsl:call-template>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

  <!-- Including nested article and section. -->
  <xsl:template match="h:address |
                       h:aside |
                       h:article |
                       h:section |
                       h:nav | 
                       h:h1 |
                       h:h2 |
                       h:h3 |
                       h:h4 |
                       h:h5 |
                       h:h6">
    <div>
      <xsl:call-template name="processCommonAttributes">
        <xsl:with-param name="addRole" select="true()"/>
      </xsl:call-template>
      <xsl:apply-templates/>
    </div>
  </xsl:template>

  <xsl:template match="h:bdi |
                       h:bdo | 
                       h:mark |
                       h:big |
                       h:small |
                       h:time">
    <ph>
      <xsl:call-template name="processCommonAttributes">
        <xsl:with-param name="addRole" select="true()"/>
      </xsl:call-template>
      <xsl:apply-templates/>
    </ph>
  </xsl:template>

  <!-- Fallback ========================= -->

  <!-- Flow content also contains:
       area, br, button, canvas, data, datalist, details, dialog, 
       embed, fieldset, footer, form, header, hr, iframe, input, label, 
       link, main, map, math, meter, noscript, output, picture, progress,
       ruby, script, select, style, svg, template, textarea, wbr. -->

  <xsl:template match="*">
    <xsl:message><xsl:value-of select="base-uri(.)"/>::: ignoring element "<xsl:value-of select="name(.)"/>".</xsl:message>
  </xsl:template>

</xsl:stylesheet>
