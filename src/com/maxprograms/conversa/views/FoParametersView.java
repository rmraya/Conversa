/*********************************************************************** 

Copyright (c) 2016-2022 - Maxprograms,  http://www.maxprograms.com/

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
***********************************************************************/
package com.maxprograms.conversa.views;

import java.io.IOException;
import java.lang.System.Logger;
import java.lang.System.Logger.Level;

import org.eclipse.swt.SWT;
import org.eclipse.swt.custom.ScrolledComposite;
import org.eclipse.swt.events.ModifyEvent;
import org.eclipse.swt.events.ModifyListener;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.Combo;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.widgets.MessageBox;
import org.eclipse.swt.widgets.Text;
import org.json.JSONException;
import org.json.JSONObject;

import com.maxprograms.utils.Preferences;

public class FoParametersView extends Composite {

	protected static final Logger LOGGER = System.getLogger(FoParametersView.class.getName());
	public static final String PARAMS = "XSL-FO";

	protected boolean restoringDefaults;
	private Text baseFontSize;
	private Text bodyBottomMargin;
	private Text bodyFontFamily;
	private Text bodyStartIndent;
	private Text bodyTopMargin;
	private Text choiceBullets;
	private Text equationBlockEquationWidth;
	private Text equationBlockNumberWidth;
	private Text externalHrefAfter;
	private Text externalHrefBefore;
	private Text footerCenter;
	private Text footerCenterWidth;
	private Text footerHeight;
	private Text footerLeft;
	private Text footerLeftWidth;
	private Text footerRight;
	private Text footerRightWidth;
	private Combo footerSeparator;
	private Text headerCenter;
	private Text headerCenterWidth;
	private Text headerHeight;
	private Text headerLeft;
	private Text headerLeftWidth;
	private Text headerRight;
	private Text headerRightWidth;
	private Combo headerSeparator;
	private Combo hyphenate;
	private Text indexColumnCount;
	private Text indexColumnGap;
	private Combo justified;
	private Text linkBullet;
	private Text menucascadeSeparator;
	private Text noteIconHeight;
	private Text noteIconSuffix;
	private Text noteIconWidth;
	private Text pageBottomMargin;
	private Text pageHeight;
	private Text pageInnerMargin;
	private Combo pageOrientation;
	private Text pageOuterMargin;
	private Text pageRefAfter;
	private Text pageRefBefore;
	private Text pageTopMargin;
	private Text pageWidth;
	private Combo paperType;
	private Combo pdfOutline;
	private Combo showExternalLinks;
	private Combo showImageMapLinks;
	private Combo showLinkPage;
	private Combo showXrefPage;
	private Text titleColor;
	private Text titleFontFamily;
	private Combo twoSided;
	private Text ulLiBullets;
	private Text unorderedStepBullets;
	private Combo useMultimediaExtensions;
	private Text watermark;
	private Text xfcRenderAsTable;

	public FoParametersView(Composite parent, int style) {
		super(parent, style);
		GridLayout layout = new GridLayout();
		layout.marginWidth = 0;
		layout.marginHeight = 0;
		setLayout(layout);
		setLayoutData(new GridData(GridData.FILL_BOTH));

		Label title = new Label(this, SWT.NONE);
		title.setText("Parameters specific to the stylesheets that generate XSL-FO");
		title.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		ScrolledComposite scrolled = new ScrolledComposite(this, SWT.V_SCROLL | SWT.BORDER);
		scrolled.setLayoutData(new GridData(GridData.FILL_BOTH));
		Composite holder = new Composite(scrolled, SWT.NONE);
		holder.setLayout(new GridLayout(2, false));
		holder.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));
		scrolled.setContent(holder);
		scrolled.setExpandHorizontal(true);
		scrolled.setMinHeight(400);

		Label baseFontSizeLabel = new Label(holder, SWT.NONE);
		baseFontSizeLabel.setText("base-font-size");

		baseFontSize = new Text(holder, SWT.BORDER);
		baseFontSize.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label bodyBottomMarginLabel = new Label(holder, SWT.NONE);
		bodyBottomMarginLabel.setText("body-bottom-margin");

		bodyBottomMargin = new Text(holder, SWT.BORDER);
		bodyBottomMargin.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label bodyFontFamilyLabel = new Label(holder, SWT.NONE);
		bodyFontFamilyLabel.setText("body-font-family");

		bodyFontFamily = new Text(holder, SWT.BORDER);
		bodyFontFamily.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label bodyStartIndentLabel = new Label(holder, SWT.NONE);
		bodyStartIndentLabel.setText("body-start-indent");

		bodyStartIndent = new Text(holder, SWT.BORDER);
		bodyStartIndent.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label bodyTopMarginLabel = new Label(holder, SWT.NONE);
		bodyTopMarginLabel.setText("body-top-margin");

		bodyTopMargin = new Text(holder, SWT.BORDER);
		bodyTopMargin.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label choiceBulletsLabel = new Label(holder, SWT.NONE);
		choiceBulletsLabel.setText("choice-bullets");

		choiceBullets = new Text(holder, SWT.BORDER);
		choiceBullets.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label equationBlockEquationWidthLabel = new Label(holder, SWT.NONE);
		equationBlockEquationWidthLabel.setText("equation-block-equation-width");

		equationBlockEquationWidth = new Text(holder, SWT.BORDER);
		equationBlockEquationWidth.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label equationBlockNumberWidthLabel = new Label(holder, SWT.NONE);
		equationBlockNumberWidthLabel.setText("equation-block-number-width");

		equationBlockNumberWidth = new Text(holder, SWT.BORDER);
		equationBlockNumberWidth.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label externalHrefAfterLabel = new Label(holder, SWT.NONE);
		externalHrefAfterLabel.setText("external-href-after");

		externalHrefAfter = new Text(holder, SWT.BORDER);
		externalHrefAfter.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label externalHrefBeforeLabel = new Label(holder, SWT.NONE);
		externalHrefBeforeLabel.setText("external-href-before");

		externalHrefBefore = new Text(holder, SWT.BORDER);
		externalHrefBefore.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label footerCenterLabel = new Label(holder, SWT.NONE);
		footerCenterLabel.setText("footer-center");

		footerCenter = new Text(holder, SWT.BORDER);
		footerCenter.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label footerCenterWidthLabel = new Label(holder, SWT.NONE);
		footerCenterWidthLabel.setText("footer-center-width");

		footerCenterWidth = new Text(holder, SWT.BORDER);
		footerCenterWidth.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label footerHeightLabel = new Label(holder, SWT.NONE);
		footerHeightLabel.setText("footer-height");

		footerHeight = new Text(holder, SWT.BORDER);
		footerHeight.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label footerLeftLabel = new Label(holder, SWT.NONE);
		footerLeftLabel.setText("footer-left");

		footerLeft = new Text(holder, SWT.BORDER);
		footerLeft.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label footerLeftWidthLabel = new Label(holder, SWT.NONE);
		footerLeftWidthLabel.setText("footer-left-width");

		footerLeftWidth = new Text(holder, SWT.BORDER);
		footerLeftWidth.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label footerRightLabel = new Label(holder, SWT.NONE);
		footerRightLabel.setText("footer-right");

		footerRight = new Text(holder, SWT.BORDER);
		footerRight.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label footerRightWidthLabel = new Label(holder, SWT.NONE);
		footerRightWidthLabel.setText("footer-right-width");

		footerRightWidth = new Text(holder, SWT.BORDER);
		footerRightWidth.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label footerSeparatorLabel = new Label(holder, SWT.NONE);
		footerSeparatorLabel.setText("footer-separator");

		footerSeparator = new Combo(holder, SWT.READ_ONLY | SWT.DROP_DOWN);
		footerSeparator.setItems("yes", "no");

		Label headerCenterLabel = new Label(holder, SWT.NONE);
		headerCenterLabel.setText("header-center");

		headerCenter = new Text(holder, SWT.BORDER);
		headerCenter.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label headerCenterWidthLabel = new Label(holder, SWT.NONE);
		headerCenterWidthLabel.setText("header-center-width");

		headerCenterWidth = new Text(holder, SWT.BORDER);
		headerCenterWidth.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label headerHeightLabel = new Label(holder, SWT.NONE);
		headerHeightLabel.setText("header-height");

		headerHeight = new Text(holder, SWT.BORDER);
		headerHeight.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label headerLeftLabel = new Label(holder, SWT.NONE);
		headerLeftLabel.setText("header-left");

		headerLeft = new Text(holder, SWT.BORDER);
		headerLeft.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label headerLeftWidthLabel = new Label(holder, SWT.NONE);
		headerLeftWidthLabel.setText("header-left-width");

		headerLeftWidth = new Text(holder, SWT.NONE);
		headerLeftWidth.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label headerRightLabel = new Label(holder, SWT.NONE);
		headerRightLabel.setText("header-right");

		headerRight = new Text(holder, SWT.BORDER);
		headerRight.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label headerRightWidthLabel = new Label(holder, SWT.NONE);
		headerRightWidthLabel.setText("header-right-width");

		headerRightWidth = new Text(holder, SWT.BORDER);
		headerRightWidth.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label headerSeparatorLabel = new Label(holder, SWT.NONE);
		headerSeparatorLabel.setText("header-separator");

		headerSeparator = new Combo(holder, SWT.READ_ONLY | SWT.DROP_DOWN);
		headerSeparator.setItems("yes", "no");

		Label hyphenateLabel = new Label(holder, SWT.NONE);
		hyphenateLabel.setText("hyphenate");

		hyphenate = new Combo(holder, SWT.READ_ONLY | SWT.DROP_DOWN);
		hyphenate.setItems("yes", "no");

		Label indexColumnCountLabel = new Label(holder, SWT.NONE);
		indexColumnCountLabel.setText("index-column-count");

		indexColumnCount = new Text(holder, SWT.BORDER);
		indexColumnCount.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label indexColumnGapLabel = new Label(holder, SWT.NONE);
		indexColumnGapLabel.setText("index-column-gap");

		indexColumnGap = new Text(holder, SWT.BORDER);
		indexColumnGap.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label justifiedLabel = new Label(holder, SWT.NONE);
		justifiedLabel.setText("justified");

		justified = new Combo(holder, SWT.READ_ONLY | SWT.DROP_DOWN);
		justified.setItems("yes", "no");

		Label linkBulletLabel = new Label(holder, SWT.NONE);
		linkBulletLabel.setText("link-bullet");

		linkBullet = new Text(holder, SWT.BORDER);
		linkBullet.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label menucascadeSeparatorLabel = new Label(holder, SWT.NONE);
		menucascadeSeparatorLabel.setText("menucascade-separator");

		menucascadeSeparator = new Text(holder, SWT.BORDER);
		menucascadeSeparator.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label noteIconHeightLabel = new Label(holder, SWT.NONE);
		noteIconHeightLabel.setText("note-icon-height");

		noteIconHeight = new Text(holder, SWT.BORDER);
		noteIconHeight.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label noteIconSuffixLabel = new Label(holder, SWT.NONE);
		noteIconSuffixLabel.setText("note-icon-suffix");

		noteIconSuffix = new Text(holder, SWT.BORDER);
		noteIconSuffix.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label noteIconWidthLabel = new Label(holder, SWT.NONE);
		noteIconWidthLabel.setText("note-icon-width");

		noteIconWidth = new Text(holder, SWT.BORDER);
		noteIconWidth.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label pageBottomMarginLabel = new Label(holder, SWT.NONE);
		pageBottomMarginLabel.setText("page-bottom-margin");

		pageBottomMargin = new Text(holder, SWT.BORDER);
		pageBottomMargin.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label pageHeightLabel = new Label(holder, SWT.NONE);
		pageHeightLabel.setText("page-height");

		pageHeight = new Text(holder, SWT.BORDER);
		pageHeight.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label pageInnerMarginLabel = new Label(holder, SWT.NONE);
		pageInnerMarginLabel.setText("page-inner-margin");

		pageInnerMargin = new Text(holder, SWT.BORDER);
		pageInnerMargin.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label pageOrientationLabel = new Label(holder, SWT.NONE);
		pageOrientationLabel.setText("page-orientation");

		pageOrientation = new Combo(holder, SWT.READ_ONLY | SWT.DROP_DOWN);
		pageOrientation.setItems("portrait", "landscape");

		Label pageOuterMarginLabel = new Label(holder, SWT.NONE);
		pageOuterMarginLabel.setText("page-outer-margin");

		pageOuterMargin = new Text(holder, SWT.BORDER);
		pageOuterMargin.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label pageRefAfterLabel = new Label(holder, SWT.NONE);
		pageRefAfterLabel.setText("page-ref-after");

		pageRefAfter = new Text(holder, SWT.BORDER);
		pageRefAfter.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label pageRefBeforeLabel = new Label(holder, SWT.NONE);
		pageRefBeforeLabel.setText("page-ref-before");

		pageRefBefore = new Text(holder, SWT.BORDER);
		pageRefBefore.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label pageTopMarginLabel = new Label(holder, SWT.NONE);
		pageTopMarginLabel.setText("page-top-margin");

		pageTopMargin = new Text(holder, SWT.BORDER);
		pageTopMargin.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label pageWidthLabel = new Label(holder, SWT.NONE);
		pageWidthLabel.setText("page-width");

		pageWidth = new Text(holder, SWT.BORDER);
		pageWidth.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label paperTypeLabel = new Label(holder, SWT.NONE);
		paperTypeLabel.setText("paper-type");

		paperType = new Combo(holder, SWT.READ_ONLY | SWT.DROP_DOWN);
		paperType.setItems("Letter", "Legal", "Ledger", "Tabloid", "A0", "A1", "A2", "A3", "A4", "A5",
				"A6", "A7", "A8", "A9", "A10", "B0", "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "C0",
				"C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10");

		Label pdfOutlineLabel = new Label(holder, SWT.NONE);
		pdfOutlineLabel.setText("pdf-outline");

		pdfOutline = new Combo(holder, SWT.READ_ONLY | SWT.DROP_DOWN);
		pdfOutline.setItems("yes", "no");

		Label showExternalLinksLabel = new Label(holder, SWT.NONE);
		showExternalLinksLabel.setText("show-external-links");

		showExternalLinks = new Combo(holder, SWT.READ_ONLY | SWT.DROP_DOWN);
		showExternalLinks.setItems("yes", "no");

		Label showImageMapLinksLabel = new Label(holder, SWT.NONE);
		showImageMapLinksLabel.setText("show-imagemap-links");

		showImageMapLinks = new Combo(holder, SWT.READ_ONLY | SWT.DROP_DOWN);
		showImageMapLinks.setItems("yes", "no");

		Label showLinkPageLabel = new Label(holder, SWT.NONE);
		showLinkPageLabel.setText("show-link-page");

		showLinkPage = new Combo(holder, SWT.READ_ONLY | SWT.DROP_DOWN);
		showLinkPage.setItems("yes", "no");

		Label showXrefPageLabel = new Label(holder, SWT.NONE);
		showXrefPageLabel.setText("show-xref-page");

		showXrefPage = new Combo(holder, SWT.READ_ONLY | SWT.DROP_DOWN);
		showXrefPage.setItems("yes", "no");

		Label titleColorLabel = new Label(holder, SWT.NONE);
		titleColorLabel.setText("title-color");

		titleColor = new Text(holder, SWT.BORDER);
		titleColor.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label titleFontFamilyLabel = new Label(holder, SWT.NONE);
		titleFontFamilyLabel.setText("title-font-family");

		titleFontFamily = new Text(holder, SWT.BORDER);
		titleFontFamily.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label twoSidedLabel = new Label(holder, SWT.NONE);
		twoSidedLabel.setText("two-sided");

		twoSided = new Combo(holder, SWT.READ_ONLY | SWT.DROP_DOWN);
		twoSided.setItems("yes", "no");

		Label ulLiBulletsLabel = new Label(holder, SWT.NONE);
		ulLiBulletsLabel.setText("ul-li-bullets");

		ulLiBullets = new Text(holder, SWT.BORDER);
		ulLiBullets.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label unorderedStepBulletsLabel = new Label(holder, SWT.NONE);
		unorderedStepBulletsLabel.setText("unordered-step-bullets");

		unorderedStepBullets = new Text(holder, SWT.BORDER);
		unorderedStepBullets.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label useMultimediaExtensionsLabel = new Label(holder, SWT.NONE);
		useMultimediaExtensionsLabel.setText("use-multimedia-extensions");

		useMultimediaExtensions = new Combo(holder, SWT.READ_ONLY | SWT.DROP_DOWN);
		useMultimediaExtensions.setItems("yes", "no");

		Label watermarkLabel = new Label(holder, SWT.NONE);
		watermarkLabel.setText("watermark");

		watermark = new Text(holder, SWT.BORDER);
		watermark.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label xfcRenderAsTableLabel = new Label(holder, SWT.NONE);
		xfcRenderAsTableLabel.setText("xfc-render-as-table");

		xfcRenderAsTable = new Text(holder, SWT.BORDER);
		xfcRenderAsTable.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		holder.setSize(holder.computeSize(SWT.DEFAULT, SWT.DEFAULT));
		scrolled.setSize(holder.getSize().x + 20, 450);

		loadValues();

		ModifyListener modifyListener = new ModifyListener() {

			@Override
			public void modifyText(ModifyEvent arg0) {
				if (!restoringDefaults) {
					saveValues();
				}
			}
		};

		baseFontSize.addModifyListener(modifyListener);
		bodyBottomMargin.addModifyListener(modifyListener);
		bodyFontFamily.addModifyListener(modifyListener);
		bodyStartIndent.addModifyListener(modifyListener);
		bodyTopMargin.addModifyListener(modifyListener);
		choiceBullets.addModifyListener(modifyListener);
		equationBlockEquationWidth.addModifyListener(modifyListener);
		equationBlockNumberWidth.addModifyListener(modifyListener);
		externalHrefAfter.addModifyListener(modifyListener);
		externalHrefBefore.addModifyListener(modifyListener);
		footerCenter.addModifyListener(modifyListener);
		footerCenterWidth.addModifyListener(modifyListener);
		footerHeight.addModifyListener(modifyListener);
		footerLeft.addModifyListener(modifyListener);
		footerLeftWidth.addModifyListener(modifyListener);
		footerRight.addModifyListener(modifyListener);
		footerRightWidth.addModifyListener(modifyListener);
		footerSeparator.addModifyListener(modifyListener);
		headerCenter.addModifyListener(modifyListener);
		headerCenterWidth.addModifyListener(modifyListener);
		headerHeight.addModifyListener(modifyListener);
		headerLeft.addModifyListener(modifyListener);
		headerLeftWidth.addModifyListener(modifyListener);
		headerRight.addModifyListener(modifyListener);
		headerRightWidth.addModifyListener(modifyListener);
		headerSeparator.addModifyListener(modifyListener);
		hyphenate.addModifyListener(modifyListener);
		indexColumnCount.addModifyListener(modifyListener);
		indexColumnGap.addModifyListener(modifyListener);
		justified.addModifyListener(modifyListener);
		linkBullet.addModifyListener(modifyListener);
		menucascadeSeparator.addModifyListener(modifyListener);
		noteIconHeight.addModifyListener(modifyListener);
		noteIconSuffix.addModifyListener(modifyListener);
		noteIconWidth.addModifyListener(modifyListener);
		pageBottomMargin.addModifyListener(modifyListener);
		pageHeight.addModifyListener(modifyListener);
		pageInnerMargin.addModifyListener(modifyListener);
		pageOrientation.addModifyListener(modifyListener);
		pageOuterMargin.addModifyListener(modifyListener);
		pageRefAfter.addModifyListener(modifyListener);
		pageRefBefore.addModifyListener(modifyListener);
		pageTopMargin.addModifyListener(modifyListener);
		pageWidth.addModifyListener(modifyListener);
		paperType.addModifyListener(modifyListener);
		pdfOutline.addModifyListener(modifyListener);
		showExternalLinks.addModifyListener(modifyListener);
		showImageMapLinks.addModifyListener(modifyListener);
		showLinkPage.addModifyListener(modifyListener);
		showXrefPage.addModifyListener(modifyListener);
		titleColor.addModifyListener(modifyListener);
		titleFontFamily.addModifyListener(modifyListener);
		twoSided.addModifyListener(modifyListener);
		ulLiBullets.addModifyListener(modifyListener);
		unorderedStepBullets.addModifyListener(modifyListener);
		useMultimediaExtensions.addModifyListener(modifyListener);
		watermark.addModifyListener(modifyListener);
		xfcRenderAsTable.addModifyListener(modifyListener);
	}

	protected void loadDefaults() {
		restoringDefaults = true;
		try {
			Preferences prefs = Preferences.getInstance();
			prefs.remove(PARAMS);
		} catch (IOException | JSONException e) {
			LOGGER.log(Level.ERROR, "Error loading defaults", e);
			MessageBox box = new MessageBox(getShell(), SWT.ICON_ERROR | SWT.OK);
			box.setMessage(e.getMessage());
			box.open();
		}
		loadValues();
		restoringDefaults = false;
		saveValues();
	}

	protected void loadValues() {
		try {
			Preferences prefs = Preferences.getInstance();
			baseFontSize.setText(prefs.get(PARAMS, "base-font-size", "10pt"));
			bodyBottomMargin.setText(prefs.get(PARAMS, "body-bottom-margin", "0.5in"));
			bodyFontFamily.setText(prefs.get(PARAMS, "body-font-family", "serif"));
			bodyStartIndent.setText(prefs.get(PARAMS, "body-start-indent", "2pc"));
			bodyTopMargin.setText(prefs.get(PARAMS, "body-top-margin", "0.5in"));
			choiceBullets.setText(prefs.get(PARAMS, "choice-bullets", "&#x2022;"));
			equationBlockEquationWidth.setText(prefs.get(PARAMS, "equation-block-equation-width", "90%"));
			equationBlockNumberWidth.setText(prefs.get(PARAMS, "equation-block-number-width", "10%"));
			externalHrefAfter.setText(prefs.get(PARAMS, "external-href-after", "]"));
			externalHrefBefore.setText(prefs.get(PARAMS, "external-href-before", "["));
			footerCenter.setText(prefs.get(PARAMS, "footer-center",
					"two-sides even:: {{chapter-title}};;" + "two-sides part||chapter||appendices||appendix odd::¬"
							+ "{{section1-title}};;" + "one-side even||odd:: {{chapter-title}}"));
			footerCenterWidth.setText(prefs.get(PARAMS, "footer-center-width", "6"));
			footerHeight.setText(prefs.get(PARAMS, "footer-height", "0.4in"));
			footerLeft.setText(prefs.get(PARAMS, "footer-left", "two-sides even:: {{page-number}}"));
			footerLeftWidth.setText(prefs.get(PARAMS, "footer-left-width", "2"));
			footerRight.setText(prefs.get(PARAMS, "footer-right",
					"two-sides first||odd:: {{page-number}};;" + "one-side:: {{page-number}}"));
			footerRightWidth.setText(prefs.get(PARAMS, "footer-right-width", "2"));
			footerSeparator.setText(prefs.get(PARAMS, "footer-separator", "yes"));
			headerCenter.setText(prefs.get(PARAMS, "header-center", "{{document-title}}"));
			headerCenterWidth.setText(prefs.get(PARAMS, "header-center-width", "6"));
			headerHeight.setText(prefs.get(PARAMS, "header-height", "0.4in"));
			headerLeft.setText(prefs.get(PARAMS, "header-left", ""));
			headerLeftWidth.setText(prefs.get(PARAMS, "header-left-width", "2"));
			headerRight.setText(prefs.get(PARAMS, "header-right", ""));
			headerRightWidth.setText(prefs.get(PARAMS, "header-right-width", "2"));
			headerSeparator.setText(prefs.get(PARAMS, "header-separator", "yes"));
			hyphenate.setText(prefs.get(PARAMS, "hyphenate", "no"));
			indexColumnCount.setText(prefs.get(PARAMS, "index-column-count", "2"));
			indexColumnGap.setText(prefs.get(PARAMS, "index-column-gap", "2em"));
			justified.setText(prefs.get(PARAMS, "justified", "no"));
			linkBullet.setText(prefs.get(PARAMS, "link-bullet", "&#x2022;"));
			menucascadeSeparator.setText(prefs.get(PARAMS, "menucascade-separator", "&#x2192;"));
			noteIconHeight.setText(prefs.get(PARAMS, "note-icon-height", "7mm"));
			noteIconSuffix.setText(prefs.get(PARAMS, "note-icon-suffix", ".png"));
			noteIconWidth.setText(prefs.get(PARAMS, "note-icon-width", "7mm"));
			pageBottomMargin.setText(prefs.get(PARAMS, "page-bottom-margin", "0.5in"));
			pageHeight.setText(prefs.get(PARAMS, "page-height", ""));
			pageInnerMargin.setText(prefs.get(PARAMS, "page-inner-margin", "1.25in")); // TODO depends on two-sided
			pageOrientation.setText(prefs.get(PARAMS, "page-orientation", "portrait"));
			pageOuterMargin.setText(prefs.get(PARAMS, "page-outer-margin", "1in")); // TODO depends on two-sided
			pageRefAfter.setText(prefs.get(PARAMS, "page-ref-after", ""));
			pageRefBefore.setText(prefs.get(PARAMS, "page-ref-before", ""));
			pageTopMargin.setText(prefs.get(PARAMS, "page-top-margin", "0.5in"));
			pageWidth.setText(prefs.get(PARAMS, "page-width", ""));
			paperType.setText(prefs.get(PARAMS, "paper-type", "A4"));
			pdfOutline.setText(prefs.get(PARAMS, "pdf-outline", "no"));
			showExternalLinks.setText(prefs.get(PARAMS, "show-external-links", "no"));
			showImageMapLinks.setText(prefs.get(PARAMS, "show-imagemap-links", "yes"));
			showLinkPage.setText(prefs.get(PARAMS, "show-link-page", "no"));
			showXrefPage.setText(prefs.get(PARAMS, "show-xref-page", "no"));
			titleColor.setText(prefs.get(PARAMS, "title-color", "black"));
			titleFontFamily.setText(prefs.get(PARAMS, "title-font-family", "sans-serif"));
			twoSided.setText(prefs.get(PARAMS, "two-sided", "no"));
			ulLiBullets.setText(prefs.get(PARAMS, "ul-li-bullets", "&#x2022; &#x2013;"));
			unorderedStepBullets.setText(prefs.get(PARAMS, "unordered-step-bullets", "&#x2022;"));
			useMultimediaExtensions.setText(prefs.get(PARAMS, "use-multimedia-extensions", "no"));
			watermark.setText(prefs.get(PARAMS, "watermark", "all"));
			xfcRenderAsTable.setText(prefs.get(PARAMS, "xfc-render-as-table", "note"));
		} catch (IOException e) {
			LOGGER.log(Level.ERROR, "Error loading values", e);
			MessageBox box = new MessageBox(getShell(), SWT.ICON_ERROR | SWT.OK);
			box.setMessage(e.getMessage());
			box.open();
		}
	}

	protected void saveValues() {
		try {
			Preferences prefs = Preferences.getInstance();
			JSONObject defaults = new JSONObject();
			defaults.put("base-font-size", baseFontSize.getText());
			defaults.put("body-bottom-margin", bodyBottomMargin.getText());
			defaults.put("body-font-family", bodyFontFamily.getText());
			defaults.put("body-start-indent", bodyStartIndent.getText());
			defaults.put("body-top-margin", bodyTopMargin.getText());
			defaults.put("choice-bullets", choiceBullets.getText());
			defaults.put("equation-block-equation-width", equationBlockEquationWidth.getText());
			defaults.put("equation-block-number-width", equationBlockNumberWidth.getText());
			defaults.put("external-href-after", externalHrefAfter.getText());
			defaults.put("external-href-before", externalHrefBefore.getText());
			defaults.put("footer-center", footerCenter.getText());
			defaults.put("footer-center-width", footerCenterWidth.getText());
			defaults.put("footer-height", footerHeight.getText());
			defaults.put("footer-left", footerLeft.getText());
			defaults.put("footer-left-width", footerLeftWidth.getText());
			defaults.put("footer-right", footerRight.getText());
			defaults.put("footer-right-width", footerRightWidth.getText());
			defaults.put("footer-separator", footerSeparator.getText());
			defaults.put("header-center", headerCenter.getText());
			defaults.put("header-center-width", headerCenterWidth.getText());
			defaults.put("header-height", headerHeight.getText());
			defaults.put("header-left", headerLeft.getText());
			defaults.put("header-left-width", headerLeftWidth.getText());
			defaults.put("header-right", headerRight.getText());
			defaults.put("header-right-width", headerRightWidth.getText());
			defaults.put("header-separator", headerSeparator.getText());
			defaults.put("hyphenate", hyphenate.getText());
			defaults.put("index-column-count", indexColumnCount.getText());
			defaults.put("index-column-gap", indexColumnGap.getText());
			defaults.put("justified", justified.getText());
			defaults.put("link-bullet", linkBullet.getText());
			defaults.put("menucascade-separator", menucascadeSeparator.getText());
			defaults.put("note-icon-height", noteIconHeight.getText());
			defaults.put("note-icon-suffix", noteIconSuffix.getText());
			defaults.put("note-icon-width", noteIconWidth.getText());
			defaults.put("page-bottom-margin", pageBottomMargin.getText());
			defaults.put("page-height", pageHeight.getText());
			defaults.put("page-inner-margin", pageInnerMargin.getText());
			defaults.put("page-orientation", pageOrientation.getText());
			defaults.put("page-outer-margin", pageOuterMargin.getText());
			defaults.put("page-ref-after", pageRefAfter.getText());
			defaults.put("page-ref-before", pageRefBefore.getText());
			defaults.put("page-top-margin", pageTopMargin.getText());
			defaults.put("page-width", pageWidth.getText());
			defaults.put("paper-type", paperType.getText());
			defaults.put("pdf-outline", pdfOutline.getText());
			defaults.put("show-external-links", showExternalLinks.getText());
			defaults.put("show-imagemap-links", showImageMapLinks.getText());
			defaults.put("show-link-page", showLinkPage.getText());
			defaults.put("show-xref-page", showXrefPage.getText());
			defaults.put("title-color", titleColor.getText());
			defaults.put("title-font-family", titleFontFamily.getText());
			defaults.put("two-sided", twoSided.getText());
			defaults.put("&#x2022; &#x2013;", ulLiBullets.getText());
			defaults.put("unordered-step-bullets", unorderedStepBullets.getText());
			defaults.put("use-multimedia-extensions", useMultimediaExtensions.getText());
			defaults.put("watermark", watermark.getText());
			defaults.put("xfc-render-as-table", xfcRenderAsTable.getText());
			prefs.save(PARAMS, defaults);
		} catch (IOException | JSONException e) {
			LOGGER.log(Level.ERROR, "Error saving defaults", e);
			MessageBox box = new MessageBox(getShell(), SWT.ICON_ERROR | SWT.OK);
			box.setMessage(e.getMessage());
			box.open();
		}
	}
}
