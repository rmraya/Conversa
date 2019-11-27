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

import org.eclipse.swt.SWT;
import org.eclipse.swt.custom.StyledText;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.Event;
import org.eclipse.swt.widgets.Listener;
import org.eclipse.swt.widgets.Shell;

import java.io.File;

import com.maxprograms.conversa.Conversa;
import com.maxprograms.utils.Locator;

public class ConsoleView {

	protected Shell shell;
	private StyledText styled;

	public ConsoleView(Shell parent, int style) {
		shell = new Shell(parent, style);
		shell.setLayout(new GridLayout());
		if (File.separator.equals("\\")) {
			shell.setImage(Conversa.getResourcemanager().getWinLogo());
		} else if (System.getProperty("os.name").toLowerCase().startsWith("mac")) {
			shell.setImage(Conversa.getResourcemanager().getMacLogo());
		} else {
			shell.setImage(Conversa.getResourcemanager().getLinuxLogo());
		}
		shell.addListener(SWT.Close, new Listener() {

			@Override
			public void handleEvent(Event arg0) {
				Locator.remember(shell, "ConsoleView");
			}
		});
		styled = new StyledText(shell, SWT.READ_ONLY | SWT.V_SCROLL | SWT.H_SCROLL);
		styled.setLayoutData(new GridData(GridData.FILL_BOTH));
	}

	public void show() {
		Locator.setLocation(shell, "ConsoleView");
		shell.open();
	}

	public void showMessage(String message) {
		styled.append(message);
	}

}
