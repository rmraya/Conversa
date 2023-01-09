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
import org.eclipse.swt.widgets.Combo;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.widgets.MessageBox;
import org.eclipse.swt.widgets.Text;
import org.json.JSONException;
import org.json.JSONObject;

import com.maxprograms.utils.Preferences;

public class EpubParametersView extends Composite {

	private static Logger logger = System.getLogger(EpubParametersView.class.getName());
	public static final String PARAMS = "Epub";

	protected boolean restoringDefaults;
	private Text coverImage;
	private Text epubIdentifier;
	private Combo epub2Compatible;
	private Combo generateEpubTrigger;

	public EpubParametersView(Composite parent, int style) {
		super(parent, style);
		GridLayout layout = new GridLayout();
		layout.marginWidth = 0;
		layout.marginHeight = 0;
		setLayout(layout);
		setLayoutData(new GridData(GridData.FILL_BOTH));

		Label title = new Label(this, SWT.NONE);
		title.setText("Parameters specific to the stylesheets that generate EPUB");
		title.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		ScrolledComposite scrolled = new ScrolledComposite(this, SWT.V_SCROLL | SWT.BORDER);
		scrolled.setLayoutData(new GridData(GridData.FILL_BOTH));
		Composite holder = new Composite(scrolled, SWT.NONE);
		holder.setLayout(new GridLayout(2, false));
		holder.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));
		scrolled.setContent(holder);
		scrolled.setExpandHorizontal(true);
		scrolled.setMinHeight(400);

		Label coverImageLabel = new Label(holder, SWT.NONE);
		coverImageLabel.setText("cover-image");

		coverImage = new Text(holder, SWT.BORDER);
		coverImage.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label epubIdentifierLabel = new Label(holder, SWT.NONE);
		epubIdentifierLabel.setText("epub-identifier");

		epubIdentifier = new Text(holder, SWT.BORDER);
		epubIdentifier.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label epub2CompatibleLabel = new Label(holder, SWT.NONE);
		epub2CompatibleLabel.setText("epub2-compatible");

		epub2Compatible = new Combo(holder, SWT.READ_ONLY | SWT.DROP_DOWN);
		epub2Compatible.setItems("yes", "no");

		Label generateEpubTriggerLabel = new Label(holder, SWT.NONE);
		generateEpubTriggerLabel.setText("generate-epub-trigger");

		generateEpubTrigger = new Combo(holder, SWT.READ_ONLY | SWT.DROP_DOWN);
		generateEpubTrigger.setItems("yes", "no");

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

		coverImage.addModifyListener(modifyListener);
		epubIdentifier.addModifyListener(modifyListener);
		epub2Compatible.addModifyListener(modifyListener);
		generateEpubTrigger.addModifyListener(modifyListener);
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
			coverImage.setText(prefs.get(PARAMS, "cover-image", ""));
			epubIdentifier.setText(prefs.get(PARAMS, "epub-identifier", ""));
			epub2Compatible.setText(prefs.get(PARAMS, "epub2-compatible", "yes"));
			generateEpubTrigger.setText(prefs.get(PARAMS, "generate-epub-trigger", "yes"));
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
			values.put("cover-image", coverImage.getText());
			values.put("epub-identifier", epubIdentifier.getText());
			values.put("epub2-compatible", epub2Compatible.getText());
			values.put("generate-epub-trigger", generateEpubTrigger.getText());
			prefs.save(PARAMS, values);
		} catch (IOException | JSONException e) {
			logger.log(Level.ERROR, "Error saving defaults", e);
			MessageBox box = new MessageBox(getShell(), SWT.ICON_ERROR | SWT.OK);
			box.setMessage(e.getMessage());
			box.open();
		}
	}

}
