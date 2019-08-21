/*********************************************************************** 

Copyright (c) 2016-2019 - Maxprograms,  http://www.maxprograms.com/

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
import java.util.HashMap;
import java.util.Map;
import java.lang.System.Logger.Level;
import java.lang.System.Logger;

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

import com.maxprograms.conversa.Constants;
import com.maxprograms.utils.Preferences;

public class HtmlParametersView extends Composite {

	protected static final Logger LOGGER = System.getLogger(HtmlParametersView.class.getName());
	public static final String PARAMS = "HtmlParameters";

	private Combo addIndexToc;
	private Combo chainPages;
	private Combo chainTopics;
	private Text css;
	private Text cssName;
	private Text defaultTableWidth;
	private Text externalLinkIconHeight;
	private Text externalLinkiconName;
	private Text externalLinkIconWidth;
	private Text formatToType;
	private Text generatorInfo;
	private Combo ignoreNavigationLinks;
	private Text javascripts;
	private Combo mathjax;
	private Text mathjaxUrl;
	private Combo markExternalLinks;
	private Text navigationIconHeight;
	private Text navigationiconName;
	private Text navigationIconWidth;
	private Text screenResolution;
	private Text xhtmlMimeType;
	protected boolean restoringDefaults;

	public HtmlParametersView(Composite parent, int style) {
		super(parent, style);
		GridLayout layout = new GridLayout();
		layout.marginWidth = 0;
		layout.marginHeight = 0;
		setLayout(layout);
		setLayoutData(new GridData(GridData.FILL_BOTH));

		Label title = new Label(this, SWT.NONE);
		title.setText("Parameters common to the stylesheets that generate XHTML or HTML");
		title.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		ScrolledComposite scrolled = new ScrolledComposite(this, SWT.V_SCROLL | SWT.BORDER);
		scrolled.setLayoutData(new GridData(GridData.FILL_BOTH));
		Composite holder = new Composite(scrolled, SWT.NONE);
		holder.setLayout(new GridLayout(2, false));
		holder.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));
		scrolled.setContent(holder);
		scrolled.setExpandHorizontal(true);
		scrolled.setMinHeight(400);

		Label addIndexTocLabel = new Label(holder, SWT.NONE);
		addIndexTocLabel.setText("add-index-toc");

		addIndexToc = new Combo(holder, SWT.DROP_DOWN | SWT.READ_ONLY);
		addIndexToc.setItems(new String[] { "yes", "no" });

		Label chainPagesLabel = new Label(holder, SWT.NONE);
		chainPagesLabel.setText("chain-pages");

		chainPages = new Combo(holder, SWT.DROP_DOWN | SWT.READ_ONLY);
		chainPages.setItems(new String[] { "none", "top", "bottom", "both" });

		Label chainTopicsLabel = new Label(holder, SWT.NONE);
		chainTopicsLabel.setText("chain-topics");

		chainTopics = new Combo(holder, SWT.READ_ONLY | SWT.DROP_DOWN);
		chainTopics.setItems(new String[] { "yes", "no" });

		Label cssLabel = new Label(holder, SWT.NONE);
		cssLabel.setText("css");

		css = new Text(holder, SWT.BORDER);
		GridData data = new GridData(GridData.FILL_HORIZONTAL);
		data.minimumWidth = 300;
		css.setLayoutData(data);

		Label cssNameLabel = new Label(holder, SWT.NONE);
		cssNameLabel.setText("css-name");

		cssName = new Text(holder, SWT.BORDER);
		cssName.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label defaultTableWidthLabel = new Label(holder, SWT.NONE);
		defaultTableWidthLabel.setText("default-table-width");

		defaultTableWidth = new Text(holder, SWT.BORDER);
		defaultTableWidth.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label externalLinkIconheightLabel = new Label(holder, SWT.NONE);
		externalLinkIconheightLabel.setText("external-link-icon-height");

		externalLinkIconHeight = new Text(holder, SWT.BORDER);
		externalLinkIconHeight.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label externalLinkiconNameLabel = new Label(holder, SWT.NONE);
		externalLinkiconNameLabel.setText("external-link-icon-name");

		externalLinkiconName = new Text(holder, SWT.BORDER);
		externalLinkiconName.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label externalLinkIconWidthLabel = new Label(holder, SWT.NONE);
		externalLinkIconWidthLabel.setText("external-link-icon-width");

		externalLinkIconWidth = new Text(holder, SWT.BORDER);
		externalLinkIconWidth.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label formatToTypeLabel = new Label(holder, SWT.NONE);
		formatToTypeLabel.setText("format-to-type");

		formatToType = new Text(holder, SWT.BORDER);
		formatToType.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label generatorInfoLabel = new Label(holder, SWT.NONE);
		generatorInfoLabel.setText("generator-info");

		generatorInfo = new Text(holder, SWT.BORDER);
		generatorInfo.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));
		Label ignoreNavigationLinksLabel = new Label(holder, SWT.NONE);
		ignoreNavigationLinksLabel.setText("ignore-navigation-links");

		ignoreNavigationLinks = new Combo(holder, SWT.DROP_DOWN | SWT.READ_ONLY);
		ignoreNavigationLinks.setItems(new String[] { "yes", "no", "auto" });

		Label javascriptsLabel = new Label(holder, SWT.NONE);
		javascriptsLabel.setText("javascripts");

		javascripts = new Text(holder, SWT.BORDER);
		javascripts.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label mathjaxLabel = new Label(holder, SWT.NONE);
		mathjaxLabel.setText("mathjax");

		mathjax = new Combo(holder, SWT.DROP_DOWN | SWT.READ_ONLY);
		mathjax.setItems(new String[] { "yes", "no", "auto" });

		Label mathjaxUrlLabel = new Label(holder, SWT.NONE);
		mathjaxUrlLabel.setText("mathjax-url");

		mathjaxUrl = new Text(holder, SWT.BORDER);
		mathjaxUrl.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label markExternalLinksLabel = new Label(holder, SWT.NONE);
		markExternalLinksLabel.setText("mark-external-links");

		markExternalLinks = new Combo(holder, SWT.READ_ONLY | SWT.DROP_DOWN);
		markExternalLinks.setItems(new String[] { "yes", "no" });

		Label navigationIconHeightLabel = new Label(holder, SWT.NONE);
		navigationIconHeightLabel.setText("navigation-icon-height");

		navigationIconHeight = new Text(holder, SWT.BORDER);
		navigationIconHeight.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label navigationiconNameLabel = new Label(holder, SWT.NONE);
		navigationiconNameLabel.setText("navigation-icon-suffix");

		navigationiconName = new Text(holder, SWT.BORDER);
		navigationiconName.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label navigationIconWidthLabel = new Label(holder, SWT.NONE);
		navigationIconWidthLabel.setText("navigation-icon-width");

		navigationIconWidth = new Text(holder, SWT.BORDER);
		navigationIconWidth.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label screenResolutionLabel = new Label(holder, SWT.NONE);
		screenResolutionLabel.setText("screen-resolution");

		screenResolution = new Text(holder, SWT.BORDER);
		screenResolution.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label xhtmlMimeTypeLabel = new Label(holder, SWT.NONE);
		xhtmlMimeTypeLabel.setText("xhtml-mime-type");

		xhtmlMimeType = new Text(holder, SWT.BORDER);
		xhtmlMimeType.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		holder.setSize(holder.computeSize(SWT.DEFAULT, SWT.DEFAULT));

		loadValues();

		ModifyListener modifyListener = new ModifyListener() {

			@Override
			public void modifyText(ModifyEvent arg0) {
				if (!restoringDefaults) {
					saveValues();
				}
			}

		};

		addIndexToc.addModifyListener(modifyListener);
		chainPages.addModifyListener(modifyListener);
		chainTopics.addModifyListener(modifyListener);
		css.addModifyListener(modifyListener);
		cssName.addModifyListener(modifyListener);
		defaultTableWidth.addModifyListener(modifyListener);
		externalLinkIconHeight.addModifyListener(modifyListener);
		externalLinkiconName.addModifyListener(modifyListener);
		externalLinkIconWidth.addModifyListener(modifyListener);
		formatToType.addModifyListener(modifyListener);
		generatorInfo.addModifyListener(modifyListener);
		ignoreNavigationLinks.addModifyListener(modifyListener);
		javascripts.addModifyListener(modifyListener);
		mathjax.addModifyListener(modifyListener);
		mathjaxUrl.addModifyListener(modifyListener);
		markExternalLinks.addModifyListener(modifyListener);
		navigationIconHeight.addModifyListener(modifyListener);
		navigationiconName.addModifyListener(modifyListener);
		navigationIconWidth.addModifyListener(modifyListener);
		screenResolution.addModifyListener(modifyListener);
		xhtmlMimeType.addModifyListener(modifyListener);
	}

	protected void loadDefaults() {
		restoringDefaults = true;
		try {
			Preferences prefs = Preferences.getInstance(Constants.PREFERENCES);
			prefs.remove(PARAMS);
		} catch (IOException e) {
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
			Preferences prefs = Preferences.getInstance(Constants.PREFERENCES);
			addIndexToc.setText(prefs.get(PARAMS, "add-index-toc", "yes"));
			chainPages.setText(prefs.get(PARAMS, "chain-pages", "none"));
			chainTopics.setText(prefs.get(PARAMS, "chain-topics", "no"));
			css.setText(prefs.get(PARAMS, "css", ""));
			cssName.setText(prefs.get(PARAMS, "css-name", "basic.css"));
			defaultTableWidth.setText(prefs.get(PARAMS, "default-table-width", ""));
			externalLinkIconHeight.setText(prefs.get(PARAMS, "external-link-icon-height", "10"));
			externalLinkiconName.setText(prefs.get(PARAMS, "external-link-icon-name", "new_window.png"));
			externalLinkIconWidth.setText(prefs.get(PARAMS, "external-link-icon-width", "11"));
			formatToType.setText(prefs.get(PARAMS, "format-to-type", ""));
			generatorInfo.setText(prefs.get(PARAMS, "generator-info", "XMLmind DITA Converter 2.5.6"));
			ignoreNavigationLinks.setText(prefs.get(PARAMS, "ignore-navigation-links", "auto"));
			javascripts.setText(prefs.get(PARAMS, "javascripts", ""));
			mathjax.setText(prefs.get(PARAMS, "mathjax", "no"));
			mathjaxUrl.setText(prefs.get(PARAMS, "mathjax-url", ""));
			markExternalLinks.setText(prefs.get(PARAMS, "mark-external-links", "no"));
			navigationIconHeight.setText(prefs.get(PARAMS, "navigation-icon-height", "16"));
			navigationiconName.setText(prefs.get(PARAMS, "navigation-icon-suffix", ".png"));
			navigationIconWidth.setText(prefs.get(PARAMS, "navigation-icon-width", "16"));
			screenResolution.setText(prefs.get(PARAMS, "screen-resolution", "96"));
			xhtmlMimeType.setText(prefs.get(PARAMS, "xhtml-mime-type", "text/html"));
		} catch (IOException e) {
			LOGGER.log(Level.ERROR, "Error loading values", e);
			MessageBox box = new MessageBox(getShell(), SWT.ICON_ERROR | SWT.OK);
			box.setMessage(e.getMessage());
			box.open();
		}
	}

	protected void saveValues() {
		try {
			Preferences prefs = Preferences.getInstance(Constants.PREFERENCES);
			Map<String, String> values = new HashMap<>();
			values.put("add-index-toc", addIndexToc.getText());
			values.put("chain-pages", chainPages.getText());
			values.put("chain-topics", chainTopics.getText());
			values.put("css", css.getText());
			values.put("css-name", cssName.getText());
			values.put("default-table-width", defaultTableWidth.getText());
			values.put("external-link-icon-height", externalLinkIconHeight.getText());
			values.put("external-link-icon-name", externalLinkiconName.getText());
			values.put("external-link-icon-width", externalLinkIconWidth.getText());
			values.put("format-to-type", formatToType.getText());
			values.put("generator-info", generatorInfo.getText());
			values.put("ignore-navigation-links", ignoreNavigationLinks.getText());
			values.put("javascripts", javascripts.getText());
			values.put("mathjax", mathjax.getText());
			values.put("mathjax-url", mathjaxUrl.getText());
			values.put("mark-external-links", markExternalLinks.getText());
			values.put("navigation-icon-height", navigationIconHeight.getText());
			values.put("navigation-icon-suffix", navigationiconName.getText());
			values.put("navigation-icon-width", navigationIconWidth.getText());
			values.put("screen-resolution", screenResolution.getText());
			values.put("xhtml-mime-type", xhtmlMimeType.getText());
			prefs.save(PARAMS, values);
		} catch (IOException e) {
			LOGGER.log(Level.ERROR, "Error saving values", e);
			MessageBox box = new MessageBox(getShell(), SWT.ICON_ERROR | SWT.OK);
			box.setMessage(e.getMessage());
			box.open();
		}
	}
}
