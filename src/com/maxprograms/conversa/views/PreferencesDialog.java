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

import org.eclipse.swt.SWT;
import org.eclipse.swt.custom.CTabFolder;
import org.eclipse.swt.custom.CTabItem;
import org.eclipse.swt.events.SelectionEvent;
import org.eclipse.swt.events.SelectionListener;
import org.eclipse.swt.graphics.Point;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Shell;

import com.maxprograms.conversa.Conversa;
import com.maxprograms.utils.Locator;

public class PreferencesDialog {

	protected Shell shell;
	private Display display;

	public PreferencesDialog(Shell parent, int style) {
		shell = new Shell(parent, style);
		shell.setImage(Conversa.getResourcemanager().getLogo());
		shell.setText("Preferences");
		GridLayout shellLayout = new GridLayout();
		shellLayout.marginHeight = 0;
		shellLayout.marginWidth = 0;
		shell.setLayout(shellLayout);
		shell.addListener(SWT.Close, event -> Locator.remember(shell, "PreferencesDialog"));
		display = shell.getDisplay();

		CTabFolder folder = new CTabFolder(shell, SWT.BORDER);
		folder.setLayoutData(new GridData(GridData.FILL_BOTH));
		folder.addSelectionListener(new SelectionListener() {

			@Override
			public void widgetSelected(SelectionEvent arg0) {
				((CTabItem) arg0.item).getControl().setFocus();
			}

			@Override
			public void widgetDefaultSelected(SelectionEvent arg0) {
				// do nothing
			}
		});

		CTabItem toolsItem = new CTabItem(folder, SWT.NONE);
		toolsItem.setText("External Tools");
		ExternalToolsView external = new ExternalToolsView(folder, SWT.NONE);
		toolsItem.setControl(external);

		CTabItem xmlItem = new CTabItem(folder, SWT.NONE);
		xmlItem.setText("XML Catalog");
		XmlCatalogView xmlPreferences = new XmlCatalogView(folder, SWT.NONE);
		xmlItem.setControl(xmlPreferences);

		CTabItem xslSettingsItem = new CTabItem(folder, SWT.NONE);
		xslSettingsItem.setText("XSL Parameters");
		XSLView xslView = new XSLView(folder, SWT.NONE);
		xslSettingsItem.setControl(xslView);

		folder.setSelection(0);
		external.setFocus();

		shell.pack();
	}

	public void show() {
		Locator.position(shell, "PreferencesDialog", new Point(750, 450));
		shell.open();
		while (!shell.isDisposed()) {
			if (!display.readAndDispatch()) {
				display.sleep();
			}
		}
	}

}
