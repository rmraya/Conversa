/*********************************************************************** 

Copyright (c) 2016-2023 - Maxprograms,  http://www.maxprograms.com/

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
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.widgets.MessageBox;
import org.eclipse.swt.widgets.Text;
import org.json.JSONException;
import org.json.JSONObject;

import com.maxprograms.utils.Preferences;

public class EclipseHelpParametersView extends Composite {

	private static Logger logger = System.getLogger(EclipseHelpParametersView.class.getName());
	public static final String PARAMS = "EclipseHelp";

	protected boolean restoringDefaults;
	private Text pluginId;
	private Text pluginIndexBasename;
	private Text pluginName;
	private Text pluginProvider;
	private Text pluginTocBasename;
	private Text pluginVersion;

	public EclipseHelpParametersView(Composite parent, int style) {
		super(parent, style);
		GridLayout layout = new GridLayout();
		layout.marginWidth = 0;
		layout.marginHeight = 0;
		setLayout(layout);
		setLayoutData(new GridData(GridData.FILL_BOTH));

		Label title = new Label(this, SWT.BORDER);
		title.setText("Parameters specific to the stylesheets that generate Eclipse Help");
		title.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		ScrolledComposite scrolled = new ScrolledComposite(this, SWT.V_SCROLL | SWT.BORDER);
		scrolled.setLayoutData(new GridData(GridData.FILL_BOTH));
		Composite holder = new Composite(scrolled, SWT.NONE);
		holder.setLayout(new GridLayout(2, false));
		holder.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));
		scrolled.setContent(holder);
		scrolled.setExpandHorizontal(true);
		scrolled.setMinHeight(370);

		Label pluginIdLabel = new Label(holder, SWT.NONE);
		pluginIdLabel.setText("plugin-id");

		pluginId = new Text(holder, SWT.BORDER);
		pluginId.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label pluginIndexBasenameLabel = new Label(holder, SWT.NONE);
		pluginIndexBasenameLabel.setText("plugin-index-basename");

		pluginIndexBasename = new Text(holder, SWT.BORDER);
		pluginIndexBasename.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label pluginNameLabel = new Label(holder, SWT.NONE);
		pluginNameLabel.setText("plugin-name");

		pluginName = new Text(holder, SWT.BORDER);
		pluginName.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label pluginProviderLabel = new Label(holder, SWT.NONE);
		pluginProviderLabel.setText("plugin-provider");

		pluginProvider = new Text(holder, SWT.BORDER);
		pluginProvider.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label pluginTocBasenameLabel = new Label(holder, SWT.NONE);
		pluginTocBasenameLabel.setText("plugin-toc-basename");

		pluginTocBasename = new Text(holder, SWT.BORDER);
		pluginTocBasename.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label pluginVersionLabel = new Label(holder, SWT.NONE);
		pluginVersionLabel.setText("plugin-version");

		pluginVersion = new Text(holder, SWT.BORDER);
		pluginVersion.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

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

		pluginId.addModifyListener(modifyListener);
		pluginIndexBasename.addModifyListener(modifyListener);
		pluginName.addModifyListener(modifyListener);
		pluginProvider.addModifyListener(modifyListener);
		pluginTocBasename.addModifyListener(modifyListener);
		pluginVersion.addModifyListener(modifyListener);
	}

	protected void saveValues() {
		try {
			Preferences prefs = Preferences.getInstance();
			JSONObject values = new JSONObject();
			values.put("plugin-id", pluginId.getText());
			values.put("plugin-index-basename", pluginIndexBasename.getText());
			values.put("plugin-name", pluginName.getText());
			values.put("plugin-provider", pluginProvider.getText());
			values.put("plugin-toc-basename", pluginTocBasename.getText());
			values.put("plugin-version", pluginVersion.getText());
			prefs.save(PARAMS, values);
		} catch (IOException | JSONException e) {
			logger.log(Level.ERROR, "Error saving defaults", e);
			MessageBox box = new MessageBox(getShell(), SWT.ICON_ERROR | SWT.OK);
			box.setMessage(e.getMessage());
			box.open();
		}
	}

	protected void loadValues() {
		try {
			Preferences prefs = Preferences.getInstance();
			pluginId.setText(prefs.get(PARAMS, "plugin-id", ""));
			pluginIndexBasename.setText(prefs.get(PARAMS, "plugin-index-basename", "index.xml"));
			pluginName.setText(prefs.get(PARAMS, "plugin-name", ""));
			pluginProvider.setText(prefs.get(PARAMS, "plugin-provider", ""));
			pluginTocBasename.setText(prefs.get(PARAMS, "plugin-toc-basename", "toc.xml"));
			pluginVersion.setText(prefs.get(PARAMS, "plugin-version", "1.0.0"));
		} catch (IOException | JSONException e) {
			logger.log(Level.ERROR, "Error loading values", e);
			MessageBox box = new MessageBox(getShell(), SWT.ICON_ERROR | SWT.OK);
			box.setMessage(e.getMessage());
			box.open();
		}
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

}
