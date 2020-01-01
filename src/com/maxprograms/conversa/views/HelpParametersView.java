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

import org.eclipse.swt.SWT;
import org.eclipse.swt.custom.CTabFolder;
import org.eclipse.swt.custom.CTabItem;
import org.eclipse.swt.events.SelectionEvent;
import org.eclipse.swt.events.SelectionListener;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.Composite;

public class HelpParametersView extends Composite {

	private HelpCommonParametersView common;
	private WebHelpParametersView webHelp;
	private HtmlHelpParametersView htmlHelp;
	private EclipseHelpParametersView eclipseHelp;

	public HelpParametersView(Composite parent, int style) {
		super(parent, style);
		GridLayout layout = new GridLayout();
		layout.marginWidth = 0;
		layout.marginHeight = 0;
		setLayout(layout);
		setLayoutData(new GridData(GridData.FILL_BOTH));

		CTabFolder folder = new CTabFolder(this, SWT.BORDER);
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

		CTabItem commonItem = new CTabItem(folder, SWT.NONE);
		commonItem.setText("Common");
		common = new HelpCommonParametersView(folder, SWT.BORDER);
		commonItem.setControl(common);

		CTabItem webHelpItem = new CTabItem(folder, SWT.NONE);
		webHelpItem.setText("Web Help");
		webHelp = new WebHelpParametersView(folder, SWT.BORDER);
		webHelpItem.setControl(webHelp);

		CTabItem htmlHelpItem = new CTabItem(folder, SWT.NONE);
		htmlHelpItem.setText("HTML Help");
		htmlHelp = new HtmlHelpParametersView(folder, SWT.BORDER);
		htmlHelpItem.setControl(htmlHelp);

		CTabItem eclipseHelpItem = new CTabItem(folder, SWT.NONE);
		eclipseHelpItem.setText("Eclipse Help");
		eclipseHelp = new EclipseHelpParametersView(folder, SWT.BORDER);
		eclipseHelpItem.setControl(eclipseHelp);

		folder.getItem(0).getControl().setFocus();
	}

	public void loadDefaults() {
		common.loadDefaults();
		webHelp.loadDefaults();
		htmlHelp.loadDefaults();
		eclipseHelp.loadDefaults();
	}

	public void loadValues() {
		common.loadValues();
		webHelp.loadValues();
		htmlHelp.loadValues();
		eclipseHelp.loadValues();
	}

}
