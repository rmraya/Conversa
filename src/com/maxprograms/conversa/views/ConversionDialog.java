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
import java.util.Date;
import java.util.List;
import java.lang.System.Logger.Level;
import java.lang.System.Logger;

import org.eclipse.swt.SWT;
import org.eclipse.swt.events.SelectionEvent;
import org.eclipse.swt.events.SelectionListener;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.Button;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.DirectoryDialog;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Event;
import org.eclipse.swt.widgets.FileDialog;
import org.eclipse.swt.widgets.Group;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.widgets.Listener;
import org.eclipse.swt.widgets.MessageBox;
import org.eclipse.swt.widgets.Shell;
import org.eclipse.swt.widgets.Text;

import com.maxprograms.conversa.Constants;
import com.maxprograms.conversa.Conversa;
import com.maxprograms.conversa.controllers.ILogger;
import com.maxprograms.conversa.controllers.Publisher;
import com.maxprograms.conversa.models.Publication;
import com.maxprograms.utils.Locator;
import com.maxprograms.utils.Preferences;
import com.maxprograms.widgets.AsyncLogger;
import com.maxprograms.widgets.LogPanel;

public class ConversionDialog implements ILogger {

	protected static final Logger LOGGER = System.getLogger(ConversionDialog.class.getName());

	protected Shell shell;
	private Display display;

	protected Text mapText;
	protected Text outputText;
	protected Text valText;

	private Button pdfButton;
	private Button eclipseHelpButton;
	private Button htmlButton;
	private Button webHelpButton;
	private Button epub2Button;
	private Button docxButton;
	private Button epub3Button;
	private Button foButton;
	private Button webHelp5Button;
	private Button rtfButton;
	private Button htmlHelpButton;
	private Button odtButton;
	private Button psButton;
	protected Button openButton;
	protected Button showLog;

	protected Publication pub;
	protected Button publish;

	protected AsyncLogger alogger;
	protected Button cancel;
	protected boolean cancelled;
	protected LogPanel logPanel;
	protected Listener closeListener;

	public ConversionDialog(Shell parent, int style) {
		shell = new Shell(parent, style);
		if (File.separator.equals("\\")) {
			shell.setImage(Conversa.getResourcemanager().getWinLogo());
		} else if (System.getProperty("os.name").toLowerCase().startsWith("mac")) {
			shell.setImage(Conversa.getResourcemanager().getMacLogo());
		} else {
			shell.setImage(Conversa.getResourcemanager().getLinuxLogo());
		}
		shell.setText("Publish DITA Map");
		GridLayout shellLayout = new GridLayout();
		shellLayout.marginWidth = 0;
		shellLayout.marginHeight = 0;
		shell.setLayout(shellLayout);
		shell.addListener(SWT.Close, new Listener() {

			@Override
			public void handleEvent(Event arg0) {
				Locator.remember(shell, "ConversionDialog");
				try {
					Preferences.getInstance(Constants.PREFERENCES).save("ConversionDialog", "openFiles",
							openButton.getSelection() ? "Yes" : "No");
					Preferences.getInstance(Constants.PREFERENCES).save("ConversionDialog", "showLog",
							showLog.getSelection() ? "Yes" : "No");
				} catch (IOException e) {
					LOGGER.log(Level.ERROR, "Error saving loation", e);
				}
			}
		});
		display = shell.getDisplay();

		alogger = new AsyncLogger(this);

		shell.setLayout(new GridLayout());
		shell.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Composite top = new Composite(shell, SWT.NONE);
		top.setLayout(new GridLayout(3, false));
		top.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label mapLabel = new Label(top, SWT.NONE);
		mapLabel.setText("DITA Map");

		mapText = new Text(top, SWT.BORDER);
		GridData mapData = new GridData(GridData.FILL_HORIZONTAL);
		mapData.widthHint = 250;
		mapText.setLayoutData(mapData);

		Button mapButton = new Button(top, SWT.PUSH);
		mapButton.setText("Browse...");
		mapButton.addSelectionListener(new SelectionListener() {

			@Override
			public void widgetSelected(SelectionEvent arg0) {
				FileDialog fd = new FileDialog(shell, SWT.OPEN);
				fd.setFilterNames(new String[] { "DITA Map Files [*.ditamap]", "All Files [*.*]" });
				fd.setFilterExtensions(new String[] { "*.ditamap", "*.*" });
				if (mapText.getText() != null) {
					try {
						File f = new File(mapText.getText());
						fd.setFileName(f.getName());
						fd.setFilterPath(f.getParent());
					} catch (Exception e) {
						// do nothing
					}
				}
				String map = fd.open();
				if (map != null) {
					File f = new File(map);
					if (f.exists()) {
						mapText.setText(map);
						if (outputText.getText().equals("")) {
							File out = new File(f.getParentFile(), "out");
							outputText.setText(out.getAbsolutePath());
						}
					}
				}
			}

			@Override
			public void widgetDefaultSelected(SelectionEvent arg0) {
				// do nothing
			}
		});

		Label outLabel = new Label(top, SWT.NONE);
		outLabel.setText("Output Folder");

		outputText = new Text(top, SWT.BORDER);
		outputText.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Button outputButton = new Button(top, SWT.PUSH);
		outputButton.setText("Browse...");
		outputButton.addSelectionListener(new SelectionListener() {

			@Override
			public void widgetSelected(SelectionEvent arg0) {
				DirectoryDialog dialog = new DirectoryDialog(shell, SWT.OPEN);
				if (outputText.getText() != null) {
					try {
						File f = new File(outputText.getText());
						dialog.setFilterPath(f.getParent());
					} catch (Exception e) {
						// do nothing
					}
				}
				String out = dialog.open();
				if (out != null) {
					outputText.setText(out);
				}
			}

			@Override
			public void widgetDefaultSelected(SelectionEvent arg0) {
				// do nothing
			}
		});

		Label valLabel = new Label(top, SWT.NONE);
		valLabel.setText("DITAVAL File");

		valText = new Text(top, SWT.BORDER);
		valText.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Button valButton = new Button(top, SWT.PUSH);
		valButton.setText("Browse...");
		valButton.addSelectionListener(new SelectionListener() {

			@Override
			public void widgetSelected(SelectionEvent arg0) {
				FileDialog fd = new FileDialog(shell, SWT.OPEN);
				fd.setFilterNames(new String[] { "DITAVAL Files [*.ditaval]", "All Files [*.*]" });
				fd.setFilterExtensions(new String[] { "*.ditaval", "*.*" });
				if (valText.getText() != null) {
					try {
						File f = new File(valText.getText());
						fd.setFileName(f.getName());
						fd.setFilterPath(f.getParent());
					} catch (Exception e) {
						// do nothing
					}
				}
				String val = fd.open();
				if (val != null) {
					File f = new File(val);
					if (f.exists()) {
						valText.setText(val);
					}
				}
			}

			@Override
			public void widgetDefaultSelected(SelectionEvent arg0) {
				// do nothing
			}
		});

		Group formatsGroup = new Group(shell, SWT.NONE);
		formatsGroup.setText("Output Formats");
		formatsGroup.setLayout(new GridLayout(4, true));
		formatsGroup.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		pdfButton = new Button(formatsGroup, SWT.CHECK);
		pdfButton.setText("PDF");

		eclipseHelpButton = new Button(formatsGroup, SWT.CHECK);
		eclipseHelpButton.setText("Eclipse Help");

		epub2Button = new Button(formatsGroup, SWT.CHECK);
		epub2Button.setText("EPUB 2");

		rtfButton = new Button(formatsGroup, SWT.CHECK);
		rtfButton.setText("RTF");
		rtfButton.setToolTipText("Rich Text Format (can be opened in MS Word 2000+)");

		htmlButton = new Button(formatsGroup, SWT.CHECK);
		htmlButton.setText("HTML");
		htmlButton.setToolTipText("HTML version 4.01");

		webHelpButton = new Button(formatsGroup, SWT.CHECK);
		webHelpButton.setText("Web Help");
		webHelpButton.setToolTipText("Web Help (containing XHTML)");

		epub3Button = new Button(formatsGroup, SWT.CHECK);
		epub3Button.setText("EPUB 3");

		docxButton = new Button(formatsGroup, SWT.CHECK);
		docxButton.setText("DOCX");
		docxButton.setToolTipText("Office Open XML (.docx, can be opened in Word 2007+)");

		foButton = new Button(formatsGroup, SWT.CHECK);
		foButton.setText("XSL-FO");

		webHelp5Button = new Button(formatsGroup, SWT.CHECK);
		webHelp5Button.setText("Web Help 5");
		webHelp5Button.setToolTipText("Web Help (containing XHTML5)");

		htmlHelpButton = new Button(formatsGroup, SWT.CHECK);
		htmlHelpButton.setText("HTML Help");
		htmlHelpButton.setToolTipText("Windows HTML Help");

		odtButton = new Button(formatsGroup, SWT.CHECK);
		odtButton.setText("ODT");
		odtButton.setToolTipText("OpenOffice (.odt, can be opened in OpenOffice.org 2+)");

		psButton = new Button(formatsGroup, SWT.CHECK);
		psButton.setText("PostScript");

		openButton = new Button(shell, SWT.CHECK);
		openButton.setText("Open Publications Using Default Viewers");

		showLog = new Button(shell, SWT.CHECK);
		showLog.setText("Show Log on Success");

		try {
			openButton.setSelection("Yes".equals(
					Preferences.getInstance(Constants.PREFERENCES).get("ConversionDialog", "openFiles", "Yes")));
			showLog.setSelection("Yes"
					.equals(Preferences.getInstance(Constants.PREFERENCES).get("ConversionDialog", "showLog", "Yes")));
		} catch (IOException e) {
			LOGGER.log(Level.ERROR, "Error saving preferences", e);
		}

		logPanel = new LogPanel(shell, SWT.BORDER);
		logPanel.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Composite bottom = new Composite(shell, SWT.BORDER);
		bottom.setLayout(new GridLayout(3, false));
		bottom.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label filler = new Label(bottom, SWT.NONE);
		filler.setText("");
		filler.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		cancel = new Button(bottom, SWT.PUSH);
		cancel.setText("Cancel");
		cancel.setEnabled(false);
		cancel.addSelectionListener(new SelectionListener() {

			@Override
			public void widgetSelected(SelectionEvent arg0) {
				cancelled = true;
			}

			@Override
			public void widgetDefaultSelected(SelectionEvent arg0) {
				cancelled = true;
			}
		});

		publish = new Button(bottom, SWT.PUSH);
		publish.setText("Publish");
		publish.addSelectionListener(new SelectionListener() {

			@Override
			public void widgetSelected(SelectionEvent arg0) {
				String mapFile = mapText.getText();
				if (mapFile == null || mapFile.equals("")) {
					MessageBox box = new MessageBox(shell, SWT.OK | SWT.ICON_WARNING);
					box.setMessage("Select DITA map.");
					box.open();
					return;
				}
				File in = new File(mapFile);
				if (!in.exists()) {
					MessageBox box = new MessageBox(shell, SWT.OK | SWT.ICON_WARNING);
					box.setMessage("DITA map does not exist.");
					box.open();
					return;
				}
				String outputFolder = outputText.getText();
				if (outputFolder == null || outputFolder.equals("")) {
					MessageBox box = new MessageBox(shell, SWT.OK | SWT.ICON_WARNING);
					box.setMessage("Select output folder.");
					box.open();
					return;
				}
				File out = new File(outputFolder);
				String val = valText.getText();
				if (val != null && !val.equals("")) {
					File v = new File(val);
					if (!v.exists()) {
						MessageBox box = new MessageBox(shell, SWT.OK | SWT.ICON_WARNING);
						box.setMessage("DITAVAL file does not exist.");
						box.open();
						return;
					}
					val = v.getAbsolutePath();
				} else {
					val = null;
				}
				int formats = getFormats();
				if (formats == 0) {
					MessageBox box = new MessageBox(shell, SWT.OK | SWT.ICON_WARNING);
					box.setMessage("Select output format.");
					box.open();
					return;
				}
				pub = new Publication(mapFile, out.getAbsolutePath(), val, getFormats(), new Date());
				publish.setEnabled(false);
				cancel.setEnabled(true);
				cancelled = false;
				closeListener = new Listener() {

					@Override
					public void handleEvent(Event ev) {
						cancelled = true;
						ev.doit = false;
					}
				};
				shell.addListener(SWT.Close, closeListener);
				boolean open = openButton.getSelection();
				Thread thread = new Thread() {
					@Override
					public void run() {
						Publisher.convert(pub, open, alogger);
					}
				};
				thread.start();
			}

			@Override
			public void widgetDefaultSelected(SelectionEvent arg0) {
				// do nothing
			}
		});

		checkEnabledFormats();

		shell.pack();
	}

	protected int getFormats() {
		int formats = 0;
		if (pdfButton.getSelection()) {
			formats = formats | Publication.PDF;
		}
		if (eclipseHelpButton.getSelection()) {
			formats = formats | Publication.ECLIPSE;
		}
		if (epub2Button.getSelection()) {
			formats = formats | Publication.EPUB2;
		}
		if (htmlButton.getSelection()) {
			formats = formats | Publication.HTML;
		}
		if (webHelpButton.getSelection()) {
			formats = formats | Publication.WEB_HELP;
		}
		if (docxButton.getSelection()) {
			formats = formats | Publication.DOCX;
		}
		if (epub3Button.getSelection()) {
			formats = formats | Publication.EPUB3;
		}
		if (foButton.getSelection()) {
			formats = formats | Publication.XSL_FO;
		}
		if (webHelp5Button.getSelection()) {
			formats = formats | Publication.WEB_HELP5;
		}
		if (rtfButton.getSelection()) {
			formats = formats | Publication.RTF;
		}
		if (htmlHelpButton.getSelection()) {
			formats = formats | Publication.HTML_HELP;
		}
		if (odtButton.getSelection()) {
			formats = formats | Publication.ODT;
		}
		if (psButton.getSelection()) {
			formats = formats | Publication.POSTSCRIPT;
		}
		return formats;
	}

	public void show() {
		Locator.setLocation(shell, "ConversionDialog");
		shell.open();
		while (!shell.isDisposed()) {
			if (!display.readAndDispatch()) {
				display.sleep();
			}
		}
	}

	public void setPublication(Publication data) {
		mapText.setText(data.getDitamap());
		outputText.setText(data.getOutputFolder());
		if (data.getDitaval() != null) {
			valText.setText(data.getDitaval());
		}
		pdfButton.setSelection(data.isPDF());
		htmlButton.setSelection(data.isHTML());
		foButton.setSelection(data.isXSL_FO());
		psButton.setSelection(data.isPostScript());
		eclipseHelpButton.setSelection(data.isEclipse());
		webHelpButton.setSelection(data.isWebHelp());
		webHelp5Button.setSelection(data.isWebHelp5());
		htmlHelpButton.setSelection(data.isHTMLHelp());
		docxButton.setSelection(data.isDocx());
		rtfButton.setSelection(data.isRTF());
		odtButton.setSelection(data.isODT());
		epub2Button.setSelection(data.isEPUB2());
		epub3Button.setSelection(data.isEPUB3());
	}

	public void checkEnabledFormats() {
		try {
			Preferences preferences = Preferences.getInstance(Constants.PREFERENCES);
			String xmfc = preferences.get("foProcessor", "XMFC", "");
			if (xmfc.equals("")) {
				rtfButton.setEnabled(false);
				docxButton.setEnabled(false);
				odtButton.setEnabled(false);
			}
			String mhc = preferences.get("foProcessor", "MHC", "");
			if (mhc.equals("")) {
				htmlHelpButton.setEnabled(false);
			}
		} catch (Exception ex) {
			MessageBox box = new MessageBox(shell, SWT.OK | SWT.ICON_WARNING);
			box.setMessage("Error checking enabled output formats.");
			box.open();
		}
	}

	@Override
	public void log(String message) {
		logPanel.log(message);
	}

	@Override
	public void setStage(String stage) {
		logPanel.setStage(stage);
	}

	@Override
	public boolean isCancelled() {
		return cancelled;
	}

	@Override
	public void logError(String error) {
		logPanel.logError(error);
	}

	@Override
	public List<String> getErrors() {
		return logPanel.getErrors();
	}

	@Override
	public void displayError(String string) {
		display.asyncExec(new Runnable() {

			@Override
			public void run() {
				shell.removeListener(SWT.Close, closeListener);
				ConsoleView console = new ConsoleView(shell, SWT.CLOSE | SWT.RESIZE);
				console.showMessage(Publisher.getLog());
				console.show();
				logPanel.setStage("Process Failed");
				logPanel.log(string);
				publish.setEnabled(true);
				cancel.setEnabled(false);
				MessageBox box = new MessageBox(shell, SWT.ICON_ERROR | SWT.OK);
				if (string != null) {
					box.setMessage(string);
				} else {
					box.setMessage("Unknown error. Please check logs.");
				}
				box.open();
			}
		});
	}

	@Override
	public void displaySuccess(String string) {
		display.asyncExec(new Runnable() {

			@Override
			public void run() {
				shell.removeListener(SWT.Close, closeListener);
				Conversa.getController().addPublication(pub);
				Conversa.getMainView().loadPublications();
				if (showLog.getSelection()) {
					ConsoleView console = new ConsoleView(shell, SWT.CLOSE | SWT.RESIZE);
					console.showMessage(Publisher.getLog());
					console.show();
				}
				logPanel.setStage("Process Finished");
				logPanel.log(string);
				publish.setEnabled(true);
				cancel.setEnabled(false);
			}
		});

	}

	public void setMap(File f) {
		mapText.setText(f.getAbsolutePath());
		outputText.setText(new File(f.getParentFile(), "out").getAbsolutePath());
	}

}
