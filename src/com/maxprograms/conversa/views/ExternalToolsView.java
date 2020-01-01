/*********************************************************************** 

Copyright (c) 2016-2020 - Maxprograms,  http://www.maxprograms.com/

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

import java.io.File;
import java.io.IOException;
import java.lang.System.Logger.Level;
import java.lang.System.Logger;

import org.eclipse.swt.SWT;
import org.eclipse.swt.events.SelectionAdapter;
import org.eclipse.swt.events.SelectionEvent;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.Button;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Event;
import org.eclipse.swt.widgets.FileDialog;
import org.eclipse.swt.widgets.Group;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.widgets.Listener;
import org.eclipse.swt.widgets.MessageBox;
import org.eclipse.swt.widgets.Text;

import com.maxprograms.conversa.Constants;
import com.maxprograms.utils.Preferences;

public class ExternalToolsView extends Composite {

	protected static final Logger LOGGER = System.getLogger(ExternalToolsView.class.getName());

	private Button fopRadio;
	private Button otherFopRadio;
	private Button xepRadio;
	private Button ahRadio;
	protected Text fopText;
	protected Text xepText;
	protected Text ahText;
	protected Text mhcText;
	protected Text xmlMindText;

	public ExternalToolsView(Composite parent, int style) {
		super(parent, style);
		GridLayout layout = new GridLayout();
		layout.marginWidth = 0;
		layout.marginHeight = 0;
		setLayout(layout);
		setLayoutData(new GridData(GridData.FILL_BOTH));

		Group foGroup = new Group(this, SWT.NONE);
		foGroup.setText("Default XSL-FO Processor for PDF");
		foGroup.setLayout(new GridLayout());
		foGroup.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));
		fopRadio = new Button(foGroup, SWT.RADIO);
		fopRadio.setText("Built-in Apache FOP");
		otherFopRadio = new Button(foGroup, SWT.RADIO);
		otherFopRadio.setText("External Apache FOP");
		xepRadio = new Button(foGroup, SWT.RADIO);
		xepRadio.setText("RenderX XEP");
		ahRadio = new Button(foGroup, SWT.RADIO);
		ahRadio.setText("Antenna House XSL Formatter");

		Group toolsComposite = new Group(this, SWT.NONE);
		toolsComposite.setText("External Tools");
		toolsComposite.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));
		toolsComposite.setLayout(new GridLayout(3, false));

		Label externalFopLabel = new Label(toolsComposite, SWT.NONE);
		externalFopLabel.setText("External Apache FOP");

		fopText = new Text(toolsComposite, SWT.BORDER);
		fopText.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Button browseFop = new Button(toolsComposite, SWT.PUSH);
		browseFop.setText("Browse...");
		browseFop.addSelectionListener(new SelectionAdapter() {
			@Override
			public void widgetSelected(SelectionEvent event) {
				FileDialog fd = new FileDialog(getShell(), SWT.OPEN);
				if (System.getProperty("os.name").startsWith("Windows")) {
					fd.setFilterExtensions(new String[] { "*.bat;*.exe" });
				}
				if (fopText.getText() != null) {
					try {
						File f = new File(fopText.getText());
						fd.setFilterPath(f.getParentFile().getAbsolutePath());
						fd.setFileName(f.getName());
					} catch (Exception ex) {
						// do nothing
					}
				}
				String exe = fd.open();
				if (exe != null) {
					fopText.setText(exe);
				}
			}
		});

		Label externalXepLabel = new Label(toolsComposite, SWT.NONE);
		externalXepLabel.setText("RenderX XEP");

		xepText = new Text(toolsComposite, SWT.BORDER);
		xepText.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Button browseXep = new Button(toolsComposite, SWT.PUSH);
		browseXep.setText("Browse...");
		browseXep.addSelectionListener(new SelectionAdapter() {
			@Override
			public void widgetSelected(SelectionEvent event) {
				FileDialog fd = new FileDialog(getShell(), SWT.OPEN);
				if (System.getProperty("os.name").startsWith("Windows")) {
					fd.setFilterExtensions(new String[] { "*.bat;*.exe" });
				}
				if (xepText.getText() != null) {
					try {
						File f = new File(xepText.getText());
						fd.setFilterPath(f.getParentFile().getAbsolutePath());
						fd.setFileName(f.getName());
					} catch (Exception ex) {
						// do nothing
					}
				}
				String exe = fd.open();
				if (exe != null) {
					xepText.setText(exe);
				}
			}
		});

		Label externalAhLabel = new Label(toolsComposite, SWT.NONE);
		externalAhLabel.setText("Antenna House XSL Formatter");

		ahText = new Text(toolsComposite, SWT.BORDER);
		ahText.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Button browseAh = new Button(toolsComposite, SWT.PUSH);
		browseAh.setText("Browse...");
		browseAh.addSelectionListener(new SelectionAdapter() {
			@Override
			public void widgetSelected(SelectionEvent event) {
				FileDialog fd = new FileDialog(getShell(), SWT.OPEN);
				if (System.getProperty("os.name").startsWith("Windows")) {
					fd.setFilterExtensions(new String[] { "hhc.exe", "*.exe", "*.*" });
				}
				if (ahText.getText() != null) {
					try {
						File f = new File(ahText.getText());
						fd.setFilterPath(f.getParentFile().getAbsolutePath());
						fd.setFileName(f.getName());
					} catch (Exception ex) {
						// do nothing
					}
				}
				String exe = fd.open();
				if (exe != null) {
					ahText.setText(exe);
				}
			}
		});

		Label xmlMindLabel = new Label(toolsComposite, SWT.NONE);
		xmlMindLabel.setText("XMLmind XSL-FO Converter");

		xmlMindText = new Text(toolsComposite, SWT.BORDER);
		xmlMindText.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Button browseXmlMind = new Button(toolsComposite, SWT.PUSH);
		browseXmlMind.setText("Browse...");
		browseXmlMind.addSelectionListener(new SelectionAdapter() {
			@Override
			public void widgetSelected(SelectionEvent event) {
				FileDialog fd = new FileDialog(getShell(), SWT.OPEN);
				if (System.getProperty("os.name").startsWith("Windows")) {
					fd.setFilterExtensions(new String[] { "*.bat;*.exe" });
				}
				if (xmlMindText.getText() != null) {
					try {
						File f = new File(xmlMindText.getText());
						fd.setFilterPath(f.getParentFile().getAbsolutePath());
						fd.setFileName(f.getName());
					} catch (Exception ex) {
						// do nothing
					}
				}
				String exe = fd.open();
				if (exe != null) {
					xmlMindText.setText(exe);
				}
			}
		});

		Label externalMhcLabel = new Label(toolsComposite, SWT.NONE);
		externalMhcLabel.setText("Microsoft Help Compiler");

		mhcText = new Text(toolsComposite, SWT.BORDER);
		mhcText.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Button browseMhc = new Button(toolsComposite, SWT.PUSH);
		browseMhc.setText("Browse...");
		browseMhc.addSelectionListener(new SelectionAdapter() {
			@Override
			public void widgetSelected(SelectionEvent event) {
				FileDialog fd = new FileDialog(getShell(), SWT.OPEN);
				if (System.getProperty("os.name").startsWith("Windows")) {
					fd.setFilterExtensions(new String[] { "*.bat;*.exe" });
				}
				if (mhcText.getText() != null) {
					try {
						File f = new File(mhcText.getText());
						fd.setFilterPath(f.getParentFile().getAbsolutePath());
						fd.setFileName(f.getName());
					} catch (Exception ex) {
						// do nothing
					}
				}
				String exe = fd.open();
				if (exe != null) {
					mhcText.setText(exe);
				}
			}
		});

		loadSettings();

		getShell().addListener(SWT.Close, new Listener() {

			@Override
			public void handleEvent(Event arg0) {
				try {
					saveSettings();
				} catch (Exception e) {
					LOGGER.log(Level.ERROR, "Error saving preferences", e);
					MessageBox box = new MessageBox(getShell(), SWT.OK | SWT.ICON_ERROR);
					box.setMessage("There was an error saving preferences.");
					box.open();
				}
			}
		});
	}

	private void loadSettings() {
		try {
			Preferences preferences = Preferences.getInstance(Constants.PREFERENCES);
			String defaultProcessor = preferences.get("foProcessor", "default", "builtin-FOP");
			switch (defaultProcessor) {
			case "builtin-FOP":
				fopRadio.setSelection(true);
				break;
			case "externalFop":
				otherFopRadio.setSelection(true);
				break;
			case "XEP":
				xepRadio.setSelection(true);
				break;
			case "AH":
				ahRadio.setSelection(true);
				break;
			default:
				// force FOP as default
				fopRadio.setSelection(true);
				break;
			}
			fopText.setText(preferences.get("foProcessor", "externalFOP", ""));
			xepText.setText(preferences.get("foProcessor", "XEP", "")); //
			ahText.setText(preferences.get("foProcessor", "AH", ""));
			xmlMindText.setText(preferences.get("foProcessor", "XMFC", ""));
			mhcText.setText(preferences.get("foProcessor", "MHC", ""));
		} catch (IOException e) {
			LOGGER.log(Level.ERROR, "Error loading preferences", e);
			MessageBox box = new MessageBox(getShell(), SWT.OK | SWT.ICON_ERROR);
			box.setMessage("There was an error getting preferences.");
			box.open();
		}
	}

	protected void saveSettings() throws IOException {
		String defaultProcessor = "builtin-FOP";
		if (otherFopRadio.getSelection()) {
			defaultProcessor = "externalFop";
		}
		if (xepRadio.getSelection()) {
			defaultProcessor = "XEP";
		}
		if (ahRadio.getSelection()) {
			defaultProcessor = "AH";
		}
		Preferences preferences = Preferences.getInstance(Constants.PREFERENCES);
		preferences.save("foProcessor", "default", defaultProcessor);
		preferences.save("foProcessor", "externalFOP", fopText.getText());
		preferences.save("foProcessor", "XEP", xepText.getText());
		preferences.save("foProcessor", "AH", ahText.getText());
		preferences.save("foProcessor", "XMFC", xmlMindText.getText());
		preferences.save("foProcessor", "MHC", mhcText.getText());
	}

}
