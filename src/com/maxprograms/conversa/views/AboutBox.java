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

import java.io.File;
import java.net.MalformedURLException;
import java.text.MessageFormat;
import java.lang.System.Logger.Level;
import java.lang.System.Logger;

import org.eclipse.swt.SWT;
import org.eclipse.swt.custom.CTabFolder;
import org.eclipse.swt.custom.CTabItem;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Event;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.widgets.Listener;
import org.eclipse.swt.widgets.Shell;

import com.maxprograms.conversa.Constants;
import com.maxprograms.conversa.Conversa;
import com.maxprograms.utils.Locator;
import com.maxprograms.utils.Preferences;
import com.maxprograms.widgets.CustomLink;

public class AboutBox {

	protected static final Logger LOGGER = System.getLogger(AboutBox.class.getName());

	protected Shell shell;
	private Display display;

	public AboutBox(Shell parent, int style) {
		shell = new Shell(parent, style);
		if (System.getProperty("file.separator").equals("\\")) {
			shell.setImage(Conversa.getResourcemanager().getWinLogo());
		} else if (System.getProperty("os.name").startsWith("Mac")) {
			shell.setImage(Conversa.getResourcemanager().getMacLogo());
		} else {
			shell.setImage(Conversa.getResourcemanager().getLinuxLogo());
		}
		MessageFormat mf = new MessageFormat("Version {0} - Build {1}");
		shell.setText(mf.format(new Object[] { Constants.VERSION, Constants.BUILD }));
		GridLayout shellLayout = new GridLayout();
		shellLayout.marginWidth = 0;
		shellLayout.marginHeight = 0;
		shell.setLayout(shellLayout);
		shell.addListener(SWT.Close, new Listener() {

			@Override
			public void handleEvent(Event arg0) {
				Locator.remember(shell, "AboutBox");
			}
		});
		display = shell.getDisplay();
		shell.setBackground(display.getSystemColor(SWT.COLOR_WHITE));

		Label image = new Label(shell, SWT.NONE);
		image.setAlignment(SWT.CENTER);
		image.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));
		image.setImage(Conversa.getResourcemanager().getConversa());
		image.setBackground(display.getSystemColor(SWT.COLOR_WHITE));

		Label copyright = new Label(shell, SWT.NONE);
		copyright.setText("Copyright \u00A9 2016-2019 Maxprograms");
		copyright.setAlignment(SWT.CENTER);
		copyright.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));
		copyright.setBackground(display.getSystemColor(SWT.COLOR_WHITE));

		CTabFolder folder = new CTabFolder(shell, SWT.BORDER);
		folder.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		CTabItem systemTab = new CTabItem(folder, SWT.NONE);
		systemTab.setText("System Information");

		Composite info = new Composite(folder, SWT.NONE);
		info.setLayout(new GridLayout());
		systemTab.setControl(info);

		Label os1 = new Label(info, SWT.NONE);
		MessageFormat mf3 = new MessageFormat("Operating System: {0} ({1})");
		os1.setText(mf3.format(new Object[] { System.getProperty("os.name"), System.getProperty("os.version") }));

		Label java1 = new Label(info, SWT.NONE);
		MessageFormat mf1 = new MessageFormat("Java Version: {0} {1}");
		java1.setText(
				mf1.format(new Object[] { System.getProperty("java.version"), System.getProperty("java.vendor") }));

		Label java2 = new Label(info, SWT.NONE);
		MessageFormat mf2 = new MessageFormat("Maximum / Allocated / Free JVM Memory: {0} / {1} / {2}");
		java2.setText(mf2.format(new Object[] { Runtime.getRuntime().maxMemory() / (1024 * 1024) + "MB",
				Runtime.getRuntime().totalMemory() / (1024 * 1024) + "MB",
				Runtime.getRuntime().freeMemory() / (1024 * 1024) + "MB" }));

		try {
			Label userData = new Label(info, SWT.NONE);
			MessageFormat mf4 = new MessageFormat("Data Folder: {0}");
			userData.setText(mf4.format(new Object[] { Preferences.getPreferencesDir() }));
		} catch (Exception e) {
			LOGGER.log(Level.ERROR, "Error getting preferences dir", e);
		}

		CTabItem licensesTab = new CTabItem(folder, SWT.NONE);
		licensesTab.setText("Licenses");

		Composite licenses = new Composite(folder, SWT.NONE);
		licenses.setLayout(new GridLayout(2, false));
		licensesTab.setControl(licenses);

		Label conversa = new Label(licenses, SWT.NONE);
		conversa.setText("Conversa DITA Publisher");

		CustomLink conversaLink = new CustomLink(licenses, SWT.NONE);
		conversaLink.setText("MIT License");
		try {
			conversaLink.setURL(new File("lib/licenses/conversa.txt").toURI().toURL().toString());
		} catch (MalformedURLException e) {
			LOGGER.log(Level.ERROR, "Error getting license", e);
		}

		Label java = new Label(licenses, SWT.NONE);
		java.setText("Java Runtime Environment");

		CustomLink javaLink = new CustomLink(licenses, SWT.NONE);
		javaLink.setText("GPL2 With Classpath Exception");
			javaLink.setURL("https://openjdk.java.net/legal/gplv2+ce.html");
		Label swt = new Label(licenses, SWT.NONE);
		swt.setText("SWT");

		CustomLink swtLink = new CustomLink(licenses, SWT.NONE);
		swtLink.setText("Eclipse Public License Version 1.0");
		try {
			swtLink.setURL(new File("lib/licenses/EclipsePublicLicense1.0.html").toURI().toURL().toString());
		} catch (MalformedURLException e) {
			LOGGER.log(Level.ERROR, "Error getting license", e);
		}

		Label ditac = new Label(licenses, SWT.NONE);
		ditac.setText("DITA Converter");

		CustomLink ditacLink = new CustomLink(licenses, SWT.NONE);
		ditacLink.setText("Mozilla Public License, version 2.0");
		try {
			ditacLink.setURL(new File("LEGAL/MPL-2.0.html").toURI().toURL().toString());
		} catch (MalformedURLException e) {
			LOGGER.log(Level.ERROR, "Error getting license", e);
		}

		Label resolver = new Label(licenses, SWT.NONE);
		resolver.setText("Apache XML Resolver");

		CustomLink resolverLink = new CustomLink(licenses, SWT.NONE);
		resolverLink.setText("Apache License 2.0");
		try {
			resolverLink.setURL(new File("lib/licenses/Apache2.0.html").toURI().toURL().toString());
		} catch (MalformedURLException e) {
			LOGGER.log(Level.ERROR, "Error getting license", e);
		}

		Label saxon = new Label(licenses, SWT.NONE);
		saxon.setText("Saxon HE");

		CustomLink saxonLink = new CustomLink(licenses, SWT.NONE);
		saxonLink.setText("Mozilla Public License, version 2.0");
		try {
			saxonLink.setURL(new File("LEGAL/MPL-2.0.html").toURI().toURL().toString());
		} catch (MalformedURLException e) {
			LOGGER.log(Level.ERROR, "Error getting license", e);
		}

		Label whc = new Label(licenses, SWT.NONE);
		whc.setText("Web Help Compiler");

		CustomLink whcLink = new CustomLink(licenses, SWT.NONE);
		whcLink.setText("MIT License");
		try {
			whcLink.setURL(new File("LEGAL/whc.LICENSE").toURI().toURL().toString());
		} catch (MalformedURLException e) {
			LOGGER.log(Level.ERROR, "Error getting license", e);
		}

		Label xslthl = new Label(licenses, SWT.NONE);
		xslthl.setText("XSLT Syntax Highlighting");

		CustomLink xslthlLink = new CustomLink(licenses, SWT.NONE);
		xslthlLink.setText("MIT License");
		try {
			xslthlLink.setURL(new File("LEGAL/xslthl.LICENSE").toURI().toURL().toString());
		} catch (MalformedURLException e) {
			LOGGER.log(Level.ERROR, "Error getting license", e);
		}

		Label fop = new Label(licenses, SWT.NONE);
		fop.setText("Apache FOP 2.3");

		CustomLink fopLink = new CustomLink(licenses, SWT.NONE);
		fopLink.setText("Apache License 2.0");
		try {
			fopLink.setURL(new File("lib/licenses/Apache2.0.html").toURI().toURL().toString());
		} catch (MalformedURLException e) {
			LOGGER.log(Level.ERROR, "Error getting license", e);
		}

		Label mapDB = new Label(licenses, SWT.NONE);
		mapDB.setText("MapDB");

		CustomLink mapdbLink = new CustomLink(licenses, SWT.NONE);
		mapdbLink.setText("Apache License 2.0");
		try {
			mapdbLink.setURL(new File("lib/licenses/Apache2.0.html").toURI().toURL().toString());
		} catch (MalformedURLException e) {
			LOGGER.log(Level.ERROR, "Error getting license", e);
		}

		folder.setSelection(systemTab);
		systemTab.getControl().setFocus();

		shell.pack();
	}

	public void show() {
		Locator.setLocation(shell, "AboutBox");
		shell.open();
		while (!shell.isDisposed()) {
			if (!display.readAndDispatch()) {
				display.sleep();
			}
		}
	}

}
