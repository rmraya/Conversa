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
                xmlns:u="http://www.xmlmind.com/namespace/ditac"
                xmlns:ditac="http://www.xmlmind.com/ditac/schema/ditac"
                exclude-result-prefixes="xs u ditac"
                version="2.0">

  <xsl:template match="ditac:flags-block">
    <div class="ditac-flags-div-container">
      <xsl:if test="@startImage or @startText">
        <p class="ditac-flags-div-start-p">
          <xsl:if test="@startImage">
            <img src="{@startImage}" 
                 alt="{tokenize(string(@startImage), '/')[last()]}"
                 class="ditac-flags-div-start-image"/>
          </xsl:if>

          <xsl:if test="@startText">
            <span class="ditac-flags-div-start-text">
              <xsl:value-of select="@startText"/>
            </span>
          </xsl:if>
        </p>
      </xsl:if>

      <xsl:choose>
        <xsl:when test="$xhtmlVersion eq '-3.2' and u:hasChangebar(.)">
          <!-- Use 2 nested divs and a colored margin to simulate a
               border. -->
          <div class="ditac-flags-div1">
            <div class="ditac-flags-div2">
              <xsl:call-template name="flagsStyle">
                <xsl:with-param name="setChangebar" select="false()"/>
              </xsl:call-template>

              <xsl:apply-templates/>
            </div>
          </div>
        </xsl:when>
        <xsl:otherwise>
          <div class="ditac-flags-div">
            <xsl:call-template name="flagsStyle">
              <xsl:with-param name="setChangebar" select="true()"/>
            </xsl:call-template>

            <xsl:apply-templates/>
          </div>
        </xsl:otherwise>
      </xsl:choose>

      <xsl:if test="@endImage or @endText">
        <p class="ditac-flags-div-end-p">
          <xsl:if test="@endImage">
            <img src="{@endImage}" 
                 alt="{tokenize(string(@endImage), '/')[last()]}"
                 class="ditac-flags-div-end-image"/>
          </xsl:if>

          <xsl:if test="@endText">
            <span class="ditac-flags-div-end-text">
              <xsl:value-of select="@endText"/>
            </span>
          </xsl:if>
        </p>
      </xsl:if>
    </div>
  </xsl:template>

  <xsl:template match="ditac:flags-inline">
    <span class="ditac-flags-span-container">
      <xsl:if test="@startImage">
        <img src="{@startImage}" 
             alt="{tokenize(string(@startImage), '/')[last()]}"
             class="ditac-flags-span-start-image"/>
      </xsl:if>

      <xsl:if test="@startText">
        <span class="ditac-flags-span-start-text">
          <xsl:value-of select="@startText"/>
        </span>
      </xsl:if>

      <span class="ditac-flags-span">
        <xsl:call-template name="flagsStyle">
          <xsl:with-param name="setChangebar" select="false()"/>
        </xsl:call-template>

        <xsl:apply-templates/>
      </span>

      <xsl:if test="@endImage">
        <img src="{@endImage}" 
             alt="{tokenize(string(@endImage), '/')[last()]}"
             class="ditac-flags-span-end-image" />
      </xsl:if>

      <xsl:if test="@endText">
        <span class="ditac-flags-span-end-text">
          <xsl:value-of select="@endText"/>
        </span>
      </xsl:if>
    </span>
  </xsl:template>

  <xsl:template name="flagsStyle">
    <xsl:param name="setChangebar" select="false()"/>

    <xsl:variable name="style" select="u:flagsStyle(., $setChangebar)"/>
    <xsl:if test="$style ne ''">
      <xsl:attribute name="style" select="$style"/>
    </xsl:if>
  </xsl:template>

  <xsl:function name="u:flagsStyle" as="xs:string">
    <xsl:param name="flagsContainer" as="element()"/>
    <xsl:param name="setChangebar" as="xs:boolean"/>

    <xsl:variable name="style">
      <xsl:if test="$flagsContainer/@color">
        color: <xsl:value-of select="$flagsContainer/@color"/>;
      </xsl:if>

      <xsl:if test="$flagsContainer/@background-color">
        background-color: <xsl:value-of
          select="$flagsContainer/@background-color"/>;
      </xsl:if>

      <xsl:if test="$flagsContainer/@font-weight">
        font-weight: <xsl:value-of
          select="$flagsContainer/@font-weight"/>;
      </xsl:if>

      <xsl:if test="$flagsContainer/@font-style">
        font-style: <xsl:value-of
          select="$flagsContainer/@font-style"/>;
      </xsl:if>

      <xsl:if test="$flagsContainer/@text-decoration">
        text-decoration: <xsl:value-of
          select="$flagsContainer/@text-decoration"/>;
      </xsl:if>

      <xsl:if test="$setChangebar and u:hasChangebar($flagsContainer)">
        <xsl:choose>
          <xsl:when test="$flagsContainer/@change-bar-placement eq 'start' or 
                          $flagsContainer/@change-bar-placement eq 'left' or 
                          $flagsContainer/@change-bar-placement eq 'inside'">
            <xsl:if test="exists($flagsContainer/@change-bar-color)">
              border-left-color: <xsl:value-of
                select="$flagsContainer/@change-bar-color"/>;
            </xsl:if>
            border-left-width:
            <xsl:value-of
              select="if (exists($flagsContainer/@change-bar-width)) 
                      then $flagsContainer/@change-bar-width
                      else 'medium'"/>;
            border-left-style: 
            <xsl:value-of
              select="if (exists($flagsContainer/@change-bar-style)) 
                      then $flagsContainer/@change-bar-style
                      else 'solid'"/>;
            padding-left: 1em;
          </xsl:when>
          <xsl:otherwise>
            <xsl:if test="exists($flagsContainer/@change-bar-color)">
              border-right-color: <xsl:value-of
                select="$flagsContainer/@change-bar-color"/>;
            </xsl:if>
            border-right-width:
            <xsl:value-of
              select="if (exists($flagsContainer/@change-bar-width)) 
                      then $flagsContainer/@change-bar-width
                      else 'medium'"/>;
            border-right-style: 
            <xsl:value-of
              select="if (exists($flagsContainer/@change-bar-style)) 
                      then $flagsContainer/@change-bar-style
                      else 'solid'"/>;
            padding-right: 1em;
          </xsl:otherwise>
        </xsl:choose>
      </xsl:if>
    </xsl:variable>

    <xsl:sequence select="normalize-space($style)"/>
  </xsl:function>

</xsl:stylesheet>
