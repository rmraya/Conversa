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

import org.eclipse.swt.SWT;
import org.eclipse.swt.SWTError;
import org.eclipse.swt.browser.Browser;
import org.eclipse.swt.events.KeyEvent;
import org.eclipse.swt.events.KeyListener;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.Dialog;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Event;
import org.eclipse.swt.widgets.Listener;
import org.eclipse.swt.widgets.Shell;

import com.maxprograms.conversa.Conversa;
import com.maxprograms.utils.Locator;

public class HTMLViewer extends Dialog {

	protected Shell shell;
	private Display display;
	private Browser browser;

	public HTMLViewer(Shell parent) throws IOException {
		super(parent, SWT.NONE);
		shell = new Shell(parent, SWT.CLOSE | SWT.TITLE | SWT.MODELESS | SWT.BORDER | SWT.RESIZE);
		if (System.getProperty("file.separator").equals("\\")) {
			shell.setImage(Conversa.getResourcemanager().getWinLogo());
		} else if (System.getProperty("os.name").startsWith("Mac")) {
			shell.setImage(Conversa.getResourcemanager().getMacLogo());
		} else {
			shell.setImage(Conversa.getResourcemanager().getLinuxLogo());
		}
		display = shell.getDisplay();
		GridLayout layout = new GridLayout();
		layout.marginHeight = 0;
		layout.marginWidth = 0;
		shell.setLayout(layout);
		shell.addListener(SWT.Close, new Listener() {
			@Override
			public void handleEvent(Event event) {
				Locator.remember(shell, "HTMLViewer");
			}
		});

		try {
			if (System.getProperty("file.separator").equals("/")) {
				browser = new Browser(shell, SWT.WEBKIT);
			} else {
				browser = new Browser(shell, SWT.NONE);
			}
		} catch (SWTError e) {
			e.printStackTrace();
			String message = "";
			if (System.getProperty("file.separator").equals("/")) {
				if (System.getProperty("os.name").startsWith("Mac")) {
					// Mac
					message = "Error embedding browser. Check Safari's configuration.";
				} else {
					// Linux
					message = "Error embedding browser. WebKitGTK+ 1.2.x is required.";
				}
			} else {
				message = "Error embedding browser.";
			}

			throw new IOException(message);
		}
		browser.setLayoutData(new GridData(GridData.GRAB_HORIZONTAL | GridData.GRAB_VERTICAL | GridData.FILL_BOTH));

		shell.addKeyListener(new KeyListener() {

			@Override
			public void keyReleased(KeyEvent arg0) {
				// do nothing
			}

			@Override
			public void keyPressed(KeyEvent arg0) {
				if (arg0.keyCode == SWT.ESC) {
					shell.dispose();
				}
			}
		});
	}

	public void show() {
		Locator.position(shell, "HTMLViewer");
		shell.open();
		while (!shell.isDisposed()) {
			if (!display.readAndDispatch()) {
				display.sleep();
			}
		}
	}

	public void display(String string) {
		browser.setUrl(string);
	}

	public void setTitle(String title) {
		shell.setText(title);
	}
}
