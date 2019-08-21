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

import com.maxprograms.conversa.Constants;
import com.maxprograms.utils.Preferences;

public class HelpCommonParametersView extends Composite {

	protected static final Logger LOGGER = System.getLogger(HelpCommonParametersView.class.getName());
	public static final String PARAMS = "HelpCommonParameters";

	protected boolean restoringDefaults;
	private Combo addTocRoot;
	private Combo numberTocEntries;

	public HelpCommonParametersView(Composite parent, int style) {
		super(parent, style);
		GridLayout layout = new GridLayout();
		layout.marginWidth = 0;
		layout.marginHeight = 0;
		setLayout(layout);
		setLayoutData(new GridData(GridData.FILL_BOTH));

		Label title = new Label(this, SWT.BORDER);
		title.setText("Parameters common to the stylesheets that generate Web Help, HTML Help, Eclipse Help and EPUB");
		title.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		ScrolledComposite scrolled = new ScrolledComposite(this, SWT.V_SCROLL | SWT.BORDER);
		scrolled.setLayoutData(new GridData(GridData.FILL_BOTH));
		Composite holder = new Composite(scrolled, SWT.NONE);
		holder.setLayout(new GridLayout(2, false));
		holder.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));
		scrolled.setContent(holder);
		scrolled.setExpandHorizontal(true);
		scrolled.setMinHeight(370);

		Label addTocRootLabel = new Label(holder, SWT.NONE);
		addTocRootLabel.setText("add-toc-root");

		addTocRoot = new Combo(holder, SWT.DROP_DOWN | SWT.READ_ONLY);
		addTocRoot.setItems(new String[] { "yes", "no" });

		Label numberTocEntriesLabel = new Label(holder, SWT.NONE);
		numberTocEntriesLabel.setText("number-toc-entries");

		numberTocEntries = new Combo(holder, SWT.DROP_DOWN | SWT.READ_ONLY);
		numberTocEntries.setItems(new String[] { "yes", "no" });

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

		addTocRoot.addModifyListener(modifyListener);
		numberTocEntries.addModifyListener(modifyListener);
	}

	protected void saveValues() {
		try {
			Preferences prefs = Preferences.getInstance(Constants.PREFERENCES);
			Map<String, String> values = new HashMap<>();
			values.put("add-toc-root", addTocRoot.getText());
			values.put("number-toc-entries", numberTocEntries.getText());
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
			addTocRoot.setText(prefs.get(PARAMS, "add-toc-root", "yes"));
			numberTocEntries.setText(prefs.get(PARAMS, "number-toc-entries", "yes"));
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
