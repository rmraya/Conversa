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

public class WebHelpParametersView extends Composite {

	protected static final Logger LOGGER = System.getLogger(WebHelpParametersView.class.getName());
	public static final String PARAMS = "WebHelpParameters";

	protected boolean restoringDefaults;
	private Combo whCollapseToc;
	private Combo whIndexNumbers;
	private Text whJquery;
	private Text whJqueryCss;
	private Text whJqueryCustomTheme;
	private Text whJqueryTheme;
	private Text whJqueryUi;
	private Combo whLocalJquery;
	private Combo whLayout;
	private Combo whUseStemming;
	private Text whUserCss;
	private Text whUserFooter;
	private Text whUserHeader;
	private Text whUserResources;
	private Text whcIndexBasename;

	private Text whcTocBasename;

	public WebHelpParametersView(Composite parent, int style) {
		super(parent, style);
		GridLayout layout = new GridLayout();
		layout.marginWidth = 0;
		layout.marginHeight = 0;
		setLayout(layout);
		setLayoutData(new GridData(GridData.FILL_BOTH));

		Label title = new Label(this, SWT.BORDER);
		title.setText("Parameters specific to the stylesheets that generate Web Help");
		title.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		ScrolledComposite scrolled = new ScrolledComposite(this, SWT.V_SCROLL | SWT.BORDER);
		scrolled.setLayoutData(new GridData(GridData.FILL_BOTH));
		Composite holder = new Composite(scrolled, SWT.NONE);
		holder.setLayout(new GridLayout(2, false));
		holder.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));
		scrolled.setContent(holder);
		scrolled.setExpandHorizontal(true);
		scrolled.setMinHeight(370);

		Label whCollapseTocLabel = new Label(holder, SWT.NONE);
		whCollapseTocLabel.setText("wh-collapse-toc");

		whCollapseToc = new Combo(holder, SWT.DROP_DOWN | SWT.READ_ONLY);
		whCollapseToc.setItems(new String[] { "yes", "no" });

		Label whIndexNumbersLabel = new Label(holder, SWT.NONE);
		whIndexNumbersLabel.setText("wh-index-numbers");

		whIndexNumbers = new Combo(holder, SWT.READ_ONLY | SWT.DROP_DOWN);
		whIndexNumbers.setItems(new String[] { "yes", "no" });

		Label whJqueryLabel = new Label(holder, SWT.NONE);
		whJqueryLabel.setText("wh-jquery");

		whJquery = new Text(holder, SWT.BORDER);
		whJquery.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label whJqueryCssLabel = new Label(holder, SWT.NONE);
		whJqueryCssLabel.setText("wh-jquery-css");

		whJqueryCss = new Text(holder, SWT.BORDER);
		whJqueryCss.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label whJqueryCustomThemeLabel = new Label(holder, SWT.NONE);
		whJqueryCustomThemeLabel.setText("wh-jquery-custom-theme");

		whJqueryCustomTheme = new Text(holder, SWT.BORDER);
		whJqueryCustomTheme.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label whJqueryThemeLabel = new Label(holder, SWT.NONE);
		whJqueryThemeLabel.setText("wh-jquery-theme");

		whJqueryTheme = new Text(holder, SWT.BORDER);
		whJqueryTheme.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label whJqueryUiLabel = new Label(holder, SWT.NONE);
		whJqueryUiLabel.setText("wh-jquery-ui");

		whJqueryUi = new Text(holder, SWT.BORDER);
		whJqueryUi.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label whLocalJqueryLabel = new Label(holder, SWT.NONE);
		whLocalJqueryLabel.setText("wh-local-jquery");

		whLocalJquery = new Combo(holder, SWT.DROP_DOWN | SWT.READ_ONLY);
		whLocalJquery.setItems(new String[] { "yes", "no" });

		Label whLayoutLabel = new Label(holder, SWT.NONE);
		whLayoutLabel.setText("wh-layout");

		whLayout = new Combo(holder, SWT.READ_ONLY | SWT.DROP_DOWN);
		whLayout.setItems(new String[] { "classic", "simple" });

		Label whUseStemmingLabel = new Label(holder, SWT.NONE);
		whUseStemmingLabel.setText("wh-use-stemming");

		whUseStemming = new Combo(holder, SWT.READ_ONLY | SWT.DROP_DOWN);
		whUseStemming.setItems(new String[] { "yes", "no" });

		Label whUserCssLabel = new Label(holder, SWT.NONE);
		whUserCssLabel.setText("wh-user-css");

		whUserCss = new Text(holder, SWT.BORDER);
		whUserCss.setText("wh-user-css");

		Label whUserFooterLabel = new Label(holder, SWT.NONE);
		whUserFooterLabel.setText("wh-user-footer");

		whUserFooter = new Text(holder, SWT.BORDER);
		whUserFooter.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label whUserHeaderLabel = new Label(holder, SWT.NONE);
		whUserHeaderLabel.setText("wh-user-header");

		whUserHeader = new Text(holder, SWT.BORDER);
		whUserHeader.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label whUserResourcesLabel = new Label(holder, SWT.NONE);
		whUserResourcesLabel.setText("wh-user-resources");

		whUserResources = new Text(holder, SWT.BORDER);
		whUserResources.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label whcIndexBasenameLabel = new Label(holder, SWT.NONE);
		whcIndexBasenameLabel.setText("whc-index-basename");

		whcIndexBasename = new Text(holder, SWT.BORDER);
		whcIndexBasename.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label whcTocBasenameLabel = new Label(holder, SWT.NONE);
		whcTocBasenameLabel.setText("whc-toc-basename");

		whcTocBasename = new Text(holder, SWT.BORDER);
		whcTocBasename.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

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

		whCollapseToc.addModifyListener(modifyListener);
		whIndexNumbers.addModifyListener(modifyListener);
		whJquery.addModifyListener(modifyListener);
		whJqueryCss.addModifyListener(modifyListener);
		whJqueryCustomTheme.addModifyListener(modifyListener);
		whJqueryTheme.addModifyListener(modifyListener);
		whJqueryUi.addModifyListener(modifyListener);
		whLocalJquery.addModifyListener(modifyListener);
		whLayout.addModifyListener(modifyListener);
		whUseStemming.addModifyListener(modifyListener);
		whUserCss.addModifyListener(modifyListener);
		whUserFooter.addModifyListener(modifyListener);
		whUserHeader.addModifyListener(modifyListener);
		whUserResources.addModifyListener(modifyListener);
		whcIndexBasename.addModifyListener(modifyListener);
		whcTocBasename.addModifyListener(modifyListener);
	}

	protected void saveValues() {
		try {
			Preferences prefs = Preferences.getInstance(Constants.PREFERENCES);
			Map<String, String> values = new HashMap<>();
			values.put("wh-collapse-toc", whCollapseToc.getText());
			values.put("wh-index-numbers", whIndexNumbers.getText());
			values.put("wh-jquery", whJquery.getText());
			values.put("wh-jquery-css", whJqueryCss.getText());
			values.put("wh-jquery-custom-theme", whJqueryCustomTheme.getText());
			values.put("wh-jquery-theme", whJqueryTheme.getText());
			values.put("wh-jquery-ui", whJqueryUi.getText());
			values.put("wh-local-jquery", whLocalJquery.getText());
			values.put("wh-layout", whLayout.getText());
			values.put("wh-use-stemming", whUseStemming.getText());
			values.put("wh-user-css", whUserCss.getText());
			values.put("wh-user-footer", whUserFooter.getText());
			values.put("wh-user-header", whUserHeader.getText());
			values.put("wh-user-resources", whUserResources.getText());
			values.put("whc-index-basename", whcIndexBasename.getText());
			values.put("whc-toc-basename", whcTocBasename.getText());
			prefs.save(PARAMS, values);
		} catch (IOException e) {
			LOGGER.log(Level.ERROR, "Error saving defaults", e);
			MessageBox box = new MessageBox(getShell(), SWT.ICON_ERROR | SWT.OK);
			box.setMessage(e.getMessage());
			box.open();
		}
	}

	protected void loadValues() {
		try {
			Preferences prefs = Preferences.getInstance(Constants.PREFERENCES);
			whCollapseToc.setText(prefs.get(PARAMS, "wh-collapse-toc", "yes"));
			whIndexNumbers.setText(prefs.get(PARAMS, "wh-index-numbers", "no"));
			whJquery.setText(prefs.get(PARAMS, "wh-jquery", ""));
			whJqueryCss.setText(prefs.get(PARAMS, "wh-jquery-css", ""));
			whJqueryTheme.setText(prefs.get(PARAMS, "wh-jquery-custom-theme", ""));
			whJqueryTheme.setText(prefs.get(PARAMS, "wh-jquery-theme", "smoothness"));
			whJqueryUi.setText(prefs.get(PARAMS, "wh-jquery-ui", ""));
			whLocalJquery.setText(prefs.get(PARAMS, "wh-local-jquery", "no"));
			whLayout.setText(prefs.get(PARAMS, "wh-layout", "classic"));
			whUseStemming.setText(prefs.get(PARAMS, "wh-use-stemming", "yes"));
			whUserCss.setText(prefs.get(PARAMS, "wh-user-css", ""));
			whUserFooter.setText(prefs.get(PARAMS, "wh-user-footer", ""));
			whUserHeader.setText(prefs.get(PARAMS, "wh-user-header", ""));
			whUserResources.setText(prefs.get(PARAMS, "wh-user-resources", ""));
			whcIndexBasename.setText(prefs.get(PARAMS, "whc-index-basename", "whc_index.xml"));
			whcTocBasename.setText(prefs.get(PARAMS, "whc-toc-basename", "whc_toc.xml"));
		} catch (IOException e) {
			LOGGER.log(Level.ERROR, "Error loading values", e);
			MessageBox box = new MessageBox(getShell(), SWT.ICON_ERROR | SWT.OK);
			box.setMessage(e.getMessage());
			box.open();
		}
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

}
