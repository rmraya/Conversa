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
                exclude-result-prefixes="xs"
                version="2.0">

  <xsl:param name="base-font-size" select="'10pt'"/>
  <xsl:param name="body-font-family" select="'serif'"/>
  <xsl:param name="title-font-family" select="'sans-serif'"/>
  <xsl:param name="title-color" select="'black'"/>

  <xsl:param name="justified" select="'no'"/>
  <xsl:param name="hyphenate" select="'no'"/>

  <!-- Changing parameter "ul-li-bullets" probably implies
       adding a font-family to attribute-set "ul-li-label".

       Few glyphs are supported by the combination of XSL-FO
       processor/built-in PDF fonts. These are supported by FOP and
       XEP with font serif or sans-serif. -->
  <xsl:param name="ul-li-bullets" select="'&#x2022; &#x2013;'"/>
  <xsl:param name="ulLiBullets" select="tokenize($ul-li-bullets, '\s+')" />

  <!-- Changing parameter "unordered-step-bullets" probably implies
       adding a font-family to attribute-set "unordered-step-label". -->
  <xsl:param name="unordered-step-bullets" select="'&#x2022;'"/>
  <xsl:param name="unorderedStepBullets" 
             select="tokenize($unordered-step-bullets, '\s+')" />

  <!-- Changing parameter "choice-bullets" probably implies
       adding a font-family to attribute-set "choice-label". -->
  <xsl:param name="choice-bullets" select="'&#x2022;'"/>
  <xsl:param name="choiceBullets" select="tokenize($choice-bullets, '\s+')" />

  <!-- Changing parameter "link-bullet" probably implies
       adding a font-family to attribute-set "link-bullet". -->
  <xsl:param name="link-bullet" select="'&#x2022;'"/>

  <!-- Changing parameter "menucascade-separator" probably implies
       adding a font-family to attribute-set "menucascade-separator". -->
  <xsl:param name="menucascade-separator" select="'&#x2192;'"/>

  <xsl:param name="show-external-links" select="'no'"/>
  <xsl:param name="external-href-before" select="' ['"/>
  <xsl:param name="external-href-after" select="']'"/>

  <xsl:param name="show-xref-page" select="'no'"/>
  <xsl:param name="show-link-page" select="'no'"/>

  <xsl:param name="show-imagemap-links" select="'yes'"/>

  <!-- When page-ref-before and page-ref-after are both empty,
       use a standard string taken from common/messages/*.xml. -->
  <xsl:param name="page-ref-before" select="''"/>
  <xsl:param name="page-ref-after" select="''"/>

  <xsl:param name="xsl-resources-directory" 
             select="resolve-uri('resources/', document-uri(doc('')))"/>
  <xsl:variable name="xslResourcesDir" 
                select="if (ends-with($xsl-resources-directory, '/')) then 
                            $xsl-resources-directory
                        else 
                            concat($xsl-resources-directory, '/')"/>

  <!-- Do not redefine unless you change the files found in
       $xsl-resources-directory. -->
  <xsl:param name="note-icon-suffix" select="'.svg'"/>
  <!-- A dimension may have a unit. Default is px. 
       (32px at 96DPI gives 0.333in) -->
  <xsl:param name="note-icon-width" select="'0.333in'"/>
  <xsl:param name="note-icon-height" select="'0.333in'"/>

  <!-- Workaround an XFC limitation. -->
  <xsl:param name="xfc-render-as-table" select="'note'"/>
  <xsl:param name="xfcRenderAsTable"
             select="tokenize($xfc-render-as-table, '\s+')"/>

  <xsl:param name="media-icon-suffix" select="'.svg'"/>
  <xsl:param name="media-icon-width" select="'0.167in'"/>
  <xsl:param name="media-icon-height" select="'0.167in'"/>

  <xsl:param name="list-item-indent" select="'2em'"/>

  <xsl:param name="pdf-outline" select="'no'"/>

  <!-- One or more of: 'blank', 'title', 'toc', 'booklist', 'frontmatter', 
       'body', 'backmatter', 'index', 'all'. -->
  <xsl:param name="watermark" select="'all'"/>
  <xsl:variable name="watermarkList" select="tokenize($watermark, '\s+')"/>

  <xsl:param name="equation-block-equation-width" select="'90%'"/>
  <xsl:param name="equation-block-number-width" select="'10%'"/>

  <xsl:param name="header-left" select="''"/>
  <xsl:param name="header-center" select="'{{document-title}}'"/>
  <xsl:param name="header-right" select="''"/>

  <xsl:param name="footer-left">
    two-sides even:: {{page-number}}
  </xsl:param>

  <xsl:param name="footer-right">
    two-sides first||odd:: {{page-number}};;
    one-side:: {{page-number}}
  </xsl:param>

  <!-- ====================
       About footer-center:

       * One-sided bookmap:

         part, chapter, appendices or appendix title.

       * Two-sided bookmap:

         First page: nothing.
         Even page: part, chapter, appendices or appendix title 
         Odd page: running ``chapter title'' which retrieves
                   part, chapter, appendices, appendix or 
                   part|chapter|appendix/section1 title.

       * Plain map:

         Nothing.

       Note that
       * chapter-title is non-empty only inside part, chapter, appendices 
         or appendix (therefore no need to specify 
         part||chapter||appendices||appendix).
       * section1-title is not empty also for any top-level topic 
         in a plain map. 
       ==================== -->

  <xsl:param name="footer-center">
    two-sides even:: {{chapter-title}};;
    two-sides part||chapter||appendices||appendix odd:: {{section1-title}};;
    one-side:: {{chapter-title}}
  </xsl:param>

  <xsl:param name="header-separator" select="'yes'"/>
  <xsl:param name="footer-separator" select="'yes'"/>

  <xsl:param name="header-left-width" select="'2'"/>
  <xsl:param name="header-center-width" select="'6'"/>
  <xsl:param name="header-right-width" select="'2'"/>

  <xsl:param name="footer-left-width"  select="'2'"/>
  <xsl:param name="footer-center-width" select="'6'"/>
  <xsl:param name="footer-right-width" select="'2'"/>

  <!-- Page dimension and orientation ==================================== -->

  <xsl:param name="paper-type">A4</xsl:param>

  <xsl:param name="page-orientation">portrait</xsl:param>

  <xsl:param name="page-width"
             select="if ($page-orientation eq 'portrait') then 
                         $paper-width
                     else 
                         $paper-height"/>
  <xsl:param name="page-height" 
             select="if ($page-orientation eq 'portrait') then
                         $paper-height 
                     else 
                         $paper-width"/>

  <xsl:param name="paper-width">
    <xsl:variable name="paperType" select="lower-case($paper-type)"/>
    <xsl:choose>
      <xsl:when test="$paperType eq 'letter'">8.5in</xsl:when>
      <xsl:when test="$paperType eq 'legal'">8.5in</xsl:when>
      <xsl:when test="$paperType eq 'ledger'">17in</xsl:when>
      <xsl:when test="$paperType eq 'tabloid'">11in</xsl:when>
      <xsl:when test="$paperType eq 'a0'">841mm</xsl:when>
      <xsl:when test="$paperType eq 'a1'">594mm</xsl:when>
      <xsl:when test="$paperType eq 'a2'">420mm</xsl:when>
      <xsl:when test="$paperType eq 'a3'">297mm</xsl:when>
      <xsl:when test="$paperType eq 'a4'">210mm</xsl:when>
      <xsl:when test="$paperType eq 'a5'">148mm</xsl:when>
      <xsl:when test="$paperType eq 'a6'">105mm</xsl:when>
      <xsl:when test="$paperType eq 'a7'">74mm</xsl:when>
      <xsl:when test="$paperType eq 'a8'">52mm</xsl:when>
      <xsl:when test="$paperType eq 'a9'">37mm</xsl:when>
      <xsl:when test="$paperType eq 'a10'">26mm</xsl:when>
      <xsl:when test="$paperType eq 'b0'">1000mm</xsl:when>
      <xsl:when test="$paperType eq 'b1'">707mm</xsl:when>
      <xsl:when test="$paperType eq 'b2'">500mm</xsl:when>
      <xsl:when test="$paperType eq 'b3'">353mm</xsl:when>
      <xsl:when test="$paperType eq 'b4'">250mm</xsl:when>
      <xsl:when test="$paperType eq 'b5'">176mm</xsl:when>
      <xsl:when test="$paperType eq 'b6'">125mm</xsl:when>
      <xsl:when test="$paperType eq 'b7'">88mm</xsl:when>
      <xsl:when test="$paperType eq 'b8'">62mm</xsl:when>
      <xsl:when test="$paperType eq 'b9'">44mm</xsl:when>
      <xsl:when test="$paperType eq 'b10'">31mm</xsl:when>
      <xsl:when test="$paperType eq 'c0'">917mm</xsl:when>
      <xsl:when test="$paperType eq 'c1'">648mm</xsl:when>
      <xsl:when test="$paperType eq 'c2'">458mm</xsl:when>
      <xsl:when test="$paperType eq 'c3'">324mm</xsl:when>
      <xsl:when test="$paperType eq 'c4'">229mm</xsl:when>
      <xsl:when test="$paperType eq 'c5'">162mm</xsl:when>
      <xsl:when test="$paperType eq 'c6'">114mm</xsl:when>
      <xsl:when test="$paperType eq 'c7'">81mm</xsl:when>
      <xsl:when test="$paperType eq 'c8'">57mm</xsl:when>
      <xsl:when test="$paperType eq 'c9'">40mm</xsl:when>
      <xsl:when test="$paperType eq 'c10'">28mm</xsl:when>
      <xsl:otherwise>210mm</xsl:otherwise>
    </xsl:choose>
  </xsl:param>
  <xsl:param name="paper-height">
    <xsl:variable name="paperType" select="lower-case($paper-type)"/>
    <xsl:choose>
      <xsl:when test="$paperType eq 'letter'">11in</xsl:when>
      <xsl:when test="$paperType eq 'legal'">14in</xsl:when>
      <xsl:when test="$paperType eq 'ledger'">11in</xsl:when>
      <xsl:when test="$paperType eq 'tabloid'">17in</xsl:when>
      <xsl:when test="$paperType eq 'a0'">1189mm</xsl:when>
      <xsl:when test="$paperType eq 'a1'">841mm</xsl:when>
      <xsl:when test="$paperType eq 'a2'">594mm</xsl:when>
      <xsl:when test="$paperType eq 'a3'">420mm</xsl:when>
      <xsl:when test="$paperType eq 'a4'">297mm</xsl:when>
      <xsl:when test="$paperType eq 'a5'">210mm</xsl:when>
      <xsl:when test="$paperType eq 'a6'">148mm</xsl:when>
      <xsl:when test="$paperType eq 'a7'">105mm</xsl:when>
      <xsl:when test="$paperType eq 'a8'">74mm</xsl:when>
      <xsl:when test="$paperType eq 'a9'">52mm</xsl:when>
      <xsl:when test="$paperType eq 'a10'">37mm</xsl:when>
      <xsl:when test="$paperType eq 'b0'">1414mm</xsl:when>
      <xsl:when test="$paperType eq 'b1'">1000mm</xsl:when>
      <xsl:when test="$paperType eq 'b2'">707mm</xsl:when>
      <xsl:when test="$paperType eq 'b3'">500mm</xsl:when>
      <xsl:when test="$paperType eq 'b4'">353mm</xsl:when>
      <xsl:when test="$paperType eq 'b5'">250mm</xsl:when>
      <xsl:when test="$paperType eq 'b6'">176mm</xsl:when>
      <xsl:when test="$paperType eq 'b7'">125mm</xsl:when>
      <xsl:when test="$paperType eq 'b8'">88mm</xsl:when>
      <xsl:when test="$paperType eq 'b9'">62mm</xsl:when>
      <xsl:when test="$paperType eq 'b10'">44mm</xsl:when>
      <xsl:when test="$paperType eq 'c0'">1297mm</xsl:when>
      <xsl:when test="$paperType eq 'c1'">917mm</xsl:when>
      <xsl:when test="$paperType eq 'c2'">648mm</xsl:when>
      <xsl:when test="$paperType eq 'c3'">458mm</xsl:when>
      <xsl:when test="$paperType eq 'c4'">324mm</xsl:when>
      <xsl:when test="$paperType eq 'c5'">229mm</xsl:when>
      <xsl:when test="$paperType eq 'c6'">162mm</xsl:when>
      <xsl:when test="$paperType eq 'c7'">114mm</xsl:when>
      <xsl:when test="$paperType eq 'c8'">81mm</xsl:when>
      <xsl:when test="$paperType eq 'c9'">57mm</xsl:when>
      <xsl:when test="$paperType eq 'c10'">40mm</xsl:when>
      <xsl:otherwise>297mm</xsl:otherwise>
    </xsl:choose>
  </xsl:param>

  <xsl:param name="two-sided" select="'no'"/>

  <xsl:param name="page-top-margin">0.5in</xsl:param>
  <xsl:param name="page-bottom-margin">0.5in</xsl:param>
  <xsl:param name="page-inner-margin"
             select="if ($two-sided eq 'yes') then '1.25in' else '1in'"/>
  <xsl:param name="page-outer-margin"
             select="if ($two-sided eq 'yes') then '0.75in' else '1in'"/>

  <xsl:param name="body-top-margin">0.5in</xsl:param>
  <xsl:param name="body-bottom-margin">0.5in</xsl:param>

  <xsl:param name="header-height">0.4in</xsl:param>
  <xsl:param name="footer-height">0.4in</xsl:param>

  <xsl:param name="index-column-count">2</xsl:param>
  <xsl:param name="index-column-gap">2em</xsl:param>
</xsl:stylesheet>
