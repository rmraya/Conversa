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

public class CommonParametersView extends Composite {

	private static  Logger logger = System.getLogger(CommonParametersView.class.getName());
	public static final String PARAMS = "Common";

	private Combo appendixNumberFormat;
	private Combo causeNumberFormat;
	private Text centerText;
	private Combo extendedToc;
	private Text equationNumberBefore;
	private Text equationNumberAfter;
	private Text externalResourceBase;
	private Combo highlightSource;
	private Text indexRangeSeparator;
	private Text linkAutoText;
	private Text noteIconList;
	private Text numberText;
	private Text numberSeparator1;
	private Text numberSeparator2;
	private Combo markImportantSteps;
	private Combo partNumberFormat;
	private Combo prependChapterToSectionNumber;
	private Combo remedyNumberFormat;
	private Combo showDraftComments;
	private Combo troubleshootingNumberFormat;
	private Text titleAfter;
	private Text titlePage;
	private Text titlePrefixSeparator1;
	private Combo useNoteIcon;
	private Text watermarkImage;
	private Text xrefAutoText;
	private Text xslResourcesDirectory;
	protected boolean restoringDefaults;

	public CommonParametersView(Composite parent, int style) {
		super(parent, style);
		GridLayout layout = new GridLayout();
		layout.marginWidth = 0;
		layout.marginHeight = 0;
		setLayout(layout);
		setLayoutData(new GridData(GridData.FILL_BOTH));

		Label title = new Label(this, SWT.NONE);
		title.setText("Parameters common to all stylesheets");
		title.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		ScrolledComposite scrolled = new ScrolledComposite(this, SWT.V_SCROLL | SWT.BORDER);
		scrolled.setLayoutData(new GridData(GridData.FILL_BOTH));
		Composite holder = new Composite(scrolled, SWT.NONE);
		holder.setLayout(new GridLayout(2, false));
		holder.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));
		scrolled.setContent(holder);
		scrolled.setExpandHorizontal(true);
		scrolled.setMinHeight(400);

		Label appendixFnumberFormatLabel = new Label(holder, SWT.NONE);
		appendixFnumberFormatLabel.setText("appendix-number-format");

		appendixNumberFormat = new Combo(holder, SWT.DROP_DOWN | SWT.READ_ONLY);
		appendixNumberFormat.setItems("I", "i", "A", "a", "1");

		Label causeNumberFormatLabel = new Label(holder, SWT.NONE);
		causeNumberFormatLabel.setText("cause-number-format");

		causeNumberFormat = new Combo(holder, SWT.DROP_DOWN | SWT.READ_ONLY);
		causeNumberFormat.setItems("I", "i", "A", "a", "1");

		Label centerLabel = new Label(holder, SWT.NONE);
		centerLabel.setText("center");

		centerText = new Text(holder, SWT.BORDER);
		GridData data = new GridData(GridData.FILL_HORIZONTAL);
		data.minimumWidth = 300;
		centerText.setLayoutData(data);

		Label equationNumberAfterLabel = new Label(holder, SWT.NONE);
		equationNumberAfterLabel.setText("equation-number-after");

		equationNumberAfter = new Text(holder, SWT.BORDER);
		equationNumberAfter.setLayoutData(data);

		Label equationNumberBeforeLabel = new Label(holder, SWT.NONE);
		equationNumberBeforeLabel.setText("equation-number-before");

		equationNumberBefore = new Text(holder, SWT.BORDER);
		equationNumberBefore.setLayoutData(data);

		Label extendedTocLabel = new Label(holder, SWT.NONE);
		extendedTocLabel.setText("extended-toc");

		extendedToc = new Combo(holder, SWT.DROP_DOWN | SWT.READ_ONLY);
		extendedToc.setItems("frontmatter", "backmatter", "both", "none");

		Label externalResourceBaseLabel = new Label(holder, SWT.NONE);
		externalResourceBaseLabel.setText("external-resource-base");

		externalResourceBase = new Text(holder, SWT.BORDER);
		externalResourceBase.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label highlightSourceLabel = new Label(holder, SWT.NONE);
		highlightSourceLabel.setText("highlight-source");

		highlightSource = new Combo(holder, SWT.DROP_DOWN | SWT.READ_ONLY);
		highlightSource.setItems("yes", "no");

		Label indexRangeSeparatorLabel = new Label(holder, SWT.NONE);
		indexRangeSeparatorLabel.setText("index-range-separator");

		indexRangeSeparator = new Text(holder, SWT.BORDER);
		indexRangeSeparator.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label linkAutoTextLabel = new Label(holder, SWT.NONE);
		linkAutoTextLabel.setText("link-auto-text");

		linkAutoText = new Text(holder, SWT.BORDER);
		linkAutoText.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label noteIconListLabel = new Label(holder, SWT.NONE);
		noteIconListLabel.setText("note-icon-list");

		noteIconList = new Text(holder, SWT.BORDER);
		noteIconList.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label numberLabel = new Label(holder, SWT.NONE);
		numberLabel.setText("number");

		numberText = new Text(holder, SWT.BORDER);
		numberText.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label numberSeparator1Label = new Label(holder, SWT.NONE);
		numberSeparator1Label.setText("number-separator1");

		numberSeparator1 = new Text(holder, SWT.BORDER);
		numberSeparator1.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label numberSeparator2Label = new Label(holder, SWT.NONE);
		numberSeparator2Label.setText("number-separator2");

		numberSeparator2 = new Text(holder, SWT.BORDER);
		numberSeparator2.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label markImportantStepsLabel = new Label(holder, SWT.NONE);
		markImportantStepsLabel.setText("mark-important-steps");

		markImportantSteps = new Combo(holder, SWT.READ_ONLY | SWT.DROP_DOWN);
		markImportantSteps.setItems("yes", "no");

		Label partNumberFormatLabel = new Label(holder, SWT.NONE);
		partNumberFormatLabel.setText("part-number-format");

		partNumberFormat = new Combo(holder, SWT.DROP_DOWN | SWT.READ_ONLY);
		partNumberFormat.setItems("I", "i", "A", "a", "1");

		Label prependChapterToSectionNumberLabel = new Label(holder, SWT.NONE);
		prependChapterToSectionNumberLabel.setText("prepend-chapter-to-section-number");

		prependChapterToSectionNumber = new Combo(holder, SWT.READ_ONLY | SWT.DROP_DOWN);
		prependChapterToSectionNumber.setItems("yes", "no");

		Label remedyNumberFormatLabel = new Label(holder, SWT.NONE);
		remedyNumberFormatLabel.setText("remedy-number-format");

		remedyNumberFormat = new Combo(holder, SWT.DROP_DOWN | SWT.READ_ONLY);
		remedyNumberFormat.setItems("I", "i", "A", "a", "1");

		Label showDraftCommentsLabel = new Label(holder, SWT.NONE);
		showDraftCommentsLabel.setText("show-draft-comments");

		showDraftComments = new Combo(holder, SWT.READ_ONLY | SWT.DROP_DOWN);
		showDraftComments.setItems("yes", "no");

		Label troubleshootingNumberFormatLabel = new Label(holder, SWT.NONE);
		troubleshootingNumberFormatLabel.setText("troubleSolution-number-format");

		troubleshootingNumberFormat = new Combo(holder, SWT.DROP_DOWN | SWT.READ_ONLY);
		troubleshootingNumberFormat.setItems("I", "i", "A", "a", "1");

		Label titleAfterLabel = new Label(holder, SWT.NONE);
		titleAfterLabel.setText("title-after");

		titleAfter = new Text(holder, SWT.BORDER);
		titleAfter.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label titlePageLabel = new Label(holder, SWT.NONE);
		titlePageLabel.setText("title-page");

		titlePage = new Text(holder, SWT.BORDER);
		titlePage.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label titlePrefixSeparator1Label = new Label(holder, SWT.NONE);
		titlePrefixSeparator1Label.setText("title-prefix-separator1");

		titlePrefixSeparator1 = new Text(holder, SWT.BORDER);
		titlePrefixSeparator1.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label useNoteIconLabel = new Label(holder, SWT.NONE);
		useNoteIconLabel.setText("use-note-icon");

		useNoteIcon = new Combo(holder, SWT.READ_ONLY | SWT.DROP_DOWN);
		useNoteIcon.setItems("yes", "no");

		Label watermarkImageLabel = new Label(holder, SWT.NONE);
		watermarkImageLabel.setText("watermark-image");

		watermarkImage = new Text(holder, SWT.BORDER);
		watermarkImage.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label xrefAutoTextLabel = new Label(holder, SWT.NONE);
		xrefAutoTextLabel.setText("xref-auto-text");

		xrefAutoText = new Text(holder, SWT.BORDER);
		xrefAutoText.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label xslResourcesDirectoryLabel = new Label(holder, SWT.NONE);
		xslResourcesDirectoryLabel.setText("xsl-resources-directory");

		xslResourcesDirectory = new Text(holder, SWT.BORDER);
		xslResourcesDirectory.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

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

		appendixNumberFormat.addModifyListener(modifyListener);
		causeNumberFormat.addModifyListener(modifyListener);
		centerText.addModifyListener(modifyListener);
		equationNumberBefore.addModifyListener(modifyListener);
		equationNumberAfter.addModifyListener(modifyListener);
		extendedToc.addModifyListener(modifyListener);
		externalResourceBase.addModifyListener(modifyListener);
		highlightSource.addModifyListener(modifyListener);
		indexRangeSeparator.addModifyListener(modifyListener);
		linkAutoText.addModifyListener(modifyListener);
		noteIconList.addModifyListener(modifyListener);
		numberText.addModifyListener(modifyListener);
		numberSeparator1.addModifyListener(modifyListener);
		numberSeparator2.addModifyListener(modifyListener);
		markImportantSteps.addModifyListener(modifyListener);
		partNumberFormat.addModifyListener(modifyListener);
		prependChapterToSectionNumber.addModifyListener(modifyListener);
		remedyNumberFormat.addModifyListener(modifyListener);
		showDraftComments.addModifyListener(modifyListener);
		troubleshootingNumberFormat.addModifyListener(modifyListener);
		titleAfter.addModifyListener(modifyListener);
		titlePage.addModifyListener(modifyListener);
		titlePrefixSeparator1.addModifyListener(modifyListener);
		useNoteIcon.addModifyListener(modifyListener);
		watermarkImage.addModifyListener(modifyListener);
		xrefAutoText.addModifyListener(modifyListener);
		xslResourcesDirectory.addModifyListener(modifyListener);
	}

	protected void loadDefaults() {
		restoringDefaults = true;
		try {
			Preferences prefs = Preferences.getInstance();
			prefs.remove(PARAMS);
		} catch (IOException | JSONException e) {
			logger.log(Level.ERROR, "Error loading defaults", e);
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
			appendixNumberFormat.setText(prefs.get(PARAMS, "appendix-number-format", "A"));
			causeNumberFormat.setText(prefs.get(PARAMS, "cause-number-format", "A"));
			centerText.setText(prefs.get(PARAMS, "center", ""));
			equationNumberBefore.setText(prefs.get(PARAMS, "equation-number-before", "("));
			equationNumberAfter.setText(prefs.get(PARAMS, "equation-number-after", ")"));
			extendedToc.setText(prefs.get(PARAMS, "extended-toc", "none"));
			externalResourceBase.setText(prefs.get(PARAMS, "external-resource-base", ""));
			highlightSource.setText(prefs.get(PARAMS, "highlight-source", "yes"));
			indexRangeSeparator.setText(prefs.get(PARAMS, "index-range-separator", "&#x2013;"));
			linkAutoText.setText(prefs.get(PARAMS, "link-auto-text", "number text"));
			noteIconList.setText(prefs.get(PARAMS, "note-icon-list",
					"attention caution danger fastpath important note notes remember restriction tip"));
			numberText.setText(prefs.get(PARAMS, "number", ""));
			numberSeparator1.setText(prefs.get(PARAMS, "number-separator1", "."));
			numberSeparator2.setText(prefs.get(PARAMS, "number-separator2", "-"));
			markImportantSteps.setText(prefs.get(PARAMS, "mark-important-steps", "no"));
			partNumberFormat.setText(prefs.get(PARAMS, "part-number-format", "I"));
			prependChapterToSectionNumber.setText(prefs.get(PARAMS, "prepend-chapter-to-section-number", "no"));
			remedyNumberFormat.setText(prefs.get(PARAMS, "remedy-number-format", "A"));
			showDraftComments.setText(prefs.get(PARAMS, "show-draft-comments", "no"));
			troubleshootingNumberFormat.setText(prefs.get(PARAMS, "troubleSolution-number-format", "1"));
			titleAfter.setText(prefs.get(PARAMS, "title-after", ""));
			titlePage.setText(prefs.get(PARAMS, "title-page", "auto"));
			titlePrefixSeparator1.setText(prefs.get(PARAMS, "title-prefix-separator1", ". "));
			useNoteIcon.setText(prefs.get(PARAMS, "use-note-icon", "no"));
			watermarkImage.setText(prefs.get(PARAMS, "watermark-image", ""));
			xrefAutoText.setText(prefs.get(PARAMS, "xref-auto-text", "number"));
			xslResourcesDirectory.setText(prefs.get(PARAMS, "xsl-resources-directory", "resources/"));
		} catch (IOException | JSONException e) {
			logger.log(Level.ERROR, "Error loading values", e);
			MessageBox box = new MessageBox(getShell(), SWT.ICON_ERROR | SWT.OK);
			box.setMessage(e.getMessage());
			box.open();
		}
	}

	protected void saveValues() {
		try {
			Preferences prefs = Preferences.getInstance();
			JSONObject values = new JSONObject();
			values.put("appendix-number-format", appendixNumberFormat.getText());
			values.put("cause-number-format", causeNumberFormat.getText());
			values.put("center", centerText.getText());
			values.put("equation-number-before", equationNumberBefore.getText());
			values.put("equation-number-after", equationNumberAfter.getText());
			values.put("extended-toc", extendedToc.getText());
			values.put("external-resource-base", externalResourceBase.getText());
			values.put("highlight-source", highlightSource.getText());
			values.put("index-range-separator", indexRangeSeparator.getText());
			values.put("link-auto-text", linkAutoText.getText());
			values.put("note-icon-list", noteIconList.getText());
			values.put("number", numberText.getText());
			values.put("number-separator1", numberSeparator1.getText());
			values.put("number-separator2", numberSeparator2.getText());
			values.put("mark-important-steps", markImportantSteps.getText());
			values.put("part-number-format", partNumberFormat.getText());
			values.put("prepend-chapter-to-section-number", prependChapterToSectionNumber.getText());
			values.put("remedy-number-format", remedyNumberFormat.getText());
			values.put("show-draft-comments", showDraftComments.getText());
			values.put("troubleSolution-number-format", troubleshootingNumberFormat.getText());
			values.put("title-after", titleAfter.getText());
			values.put("title-page", titlePage.getText());
			values.put("title-prefix-separator1", titlePrefixSeparator1.getText());
			values.put("use-note-icon", useNoteIcon.getText());
			values.put("watermark-image", watermarkImage.getText());
			values.put("xref-auto-text", xrefAutoText.getText());
			values.put("xsl-resources-directory", xslResourcesDirectory.getText());
			prefs.save(PARAMS, values);
		} catch (IOException | JSONException e) {
			logger.log(Level.ERROR, "Error saving defaults", e);
			MessageBox box = new MessageBox(getShell(), SWT.ICON_ERROR | SWT.OK);
			box.setMessage(e.getMessage());
			box.open();
		}
	}
}
