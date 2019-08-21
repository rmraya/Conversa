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
                xmlns="http://www.w3.org/1999/xhtml"                
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                xmlns:u="http://www.xmlmind.com/namespace/ditac"
                exclude-result-prefixes="xs u"
                version="2.0">

  <!-- audio ============================================================= -->
 
  <xsl:template match="*[contains(@class,' media-d/audio ')]">
    <xsl:choose>
      <xsl:when test="$xhtmlVersion eq '5.0'"> 
        <audio>
          <xsl:call-template name="commonAttributes"/>

          <xsl:variable name="desc" 
                        select="./*[contains(@class,' topic/desc ')]"/>
          <xsl:apply-templates select="./* except $desc"/>

          <xsl:call-template name="processMediaDesc"/>
        </audio>
      </xsl:when>
      <xsl:otherwise>
        <xsl:call-template name="processMediaDesc">
          <xsl:with-param name="mediaId" select="normalize-space(@id)"/>
        </xsl:call-template>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- video ============================================================= -->
 
  <xsl:template match="*[contains(@class,' media-d/video ')]">
    <xsl:choose>
      <xsl:when test="$xhtmlVersion eq '5.0'"> 
        <video>
          <xsl:call-template name="commonAttributes"/>

          <!-- Unlike XHTML, DITA supports the following  units: 
               px, pc, pt, cm, mm, in. -->
          <xsl:if test="exists(@width)">
            <xsl:attribute name="width" select="u:toPixels(@width)"/>
          </xsl:if>
          <xsl:if test="exists(@height)">
            <xsl:attribute name="height" select="u:toPixels(@height)"/>
          </xsl:if>

          <xsl:variable name="desc" 
                        select="./*[contains(@class,' topic/desc ')]"/>
          <xsl:apply-templates select="./* except $desc"/>

          <xsl:call-template name="processMediaDesc"/>
        </video>
      </xsl:when>
      <xsl:otherwise>
        <xsl:call-template name="processMediaDesc">
          <xsl:with-param name="mediaId" select="normalize-space(@id)"/>
        </xsl:call-template>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="processMediaDesc">
    <xsl:param name="mediaId" select="''"/>

    <xsl:call-template name="namedAnchor"/>

    <xsl:variable name="desc" select="./*[contains(@class,' topic/desc ')]"/>
    <xsl:choose>
      <!-- desc exists and is not empty. -->
      <xsl:when test="exists($desc/node())">
        <div class="object-fallback">
          <xsl:if test="$mediaId ne ''">
            <xsl:attribute name="id" select="$mediaId"/>
          </xsl:if>

          <xsl:apply-templates select="$desc/node()"/>
        </div>
      </xsl:when>

      <xsl:otherwise>
        <xsl:variable name="source" 
          select="normalize-space(./*[contains(@class,' media-d/media-source ')][1]/@value)"/>

        <xsl:call-template name="generateObjectFallback">
          <xsl:with-param name="objectId" select="$mediaId"/>
          <xsl:with-param name="download" select="$source"/>
        </xsl:call-template>
      </xsl:otherwise>
    </xsl:choose>

  </xsl:template>

  <!-- video-poster,..., media-track ===================================== -->

  <xsl:template match="*[contains(@class,' media-d/video-poster ')]">
    <xsl:if test="normalize-space(@value) ne ''">
      <xsl:for-each select="parent::video">
        <xsl:attribute name="poster" select="normalize-space(@value)"/>
      </xsl:for-each>
    </xsl:if>
  </xsl:template>

  <xsl:template match="*[contains(@class,' media-d/media-controls ')]">
    <!-- No value means: add controls -->
    <xsl:if test="normalize-space(@value) ne 'false'">
      <xsl:for-each select="parent::*">
        <xsl:attribute name="controls" select="''"/>
      </xsl:for-each>
    </xsl:if>
  </xsl:template>

  <xsl:template match="*[contains(@class,' media-d/media-autoplay ')]">
    <xsl:if test="normalize-space(@value) ne 'false'">
      <xsl:for-each select="parent::*">
        <xsl:attribute name="autoplay" select="''"/>
      </xsl:for-each>
    </xsl:if>
  </xsl:template>

  <xsl:template match="*[contains(@class,' media-d/media-loop ')]">
    <xsl:if test="normalize-space(@value) ne 'false'">
      <xsl:for-each select="parent::*">
        <xsl:attribute name="loop" select="''"/>
      </xsl:for-each>
    </xsl:if>
  </xsl:template>

  <xsl:template match="*[contains(@class,' media-d/media-muted ')]">
    <xsl:if test="normalize-space(@value) ne 'false'">
      <xsl:for-each select="parent::*">
        <xsl:attribute name="muted" select="''"/>
      </xsl:for-each>
    </xsl:if>
  </xsl:template>

  <xsl:template match="*[contains(@class,' media-d/media-source ')]">
    <xsl:if test="normalize-space(@value) ne ''">
      <source src="{normalize-space(@value)}">
        <xsl:call-template name="commonAttributes"/>
      </source>
    </xsl:if>
  </xsl:template>

  <xsl:template match="*[contains(@class,' media-d/media-track ')]">
    <xsl:if test="normalize-space(@value) ne ''">
      <track src="{normalize-space(@value)}">
        <xsl:call-template name="commonAttributes"/>

        <xsl:variable name="kind" select="normalize-space(@type)"/>
        <xsl:if test="$kind ne ''">
          <xsl:attribute name="kind" select="$kind"/>
        </xsl:if>

        <!-- No way to specify @srclang which is required when @kind=subtitles.
             No way to specify @label which is useful when @kind=subtitles,
             captions, descriptions. -->
      </track>
    </xsl:if>
  </xsl:template>

</xsl:stylesheet>
