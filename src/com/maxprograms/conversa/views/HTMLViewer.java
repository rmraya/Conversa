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

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.eclipse.swt.SWT;
import org.eclipse.swt.browser.Browser;
import org.eclipse.swt.custom.StyledText;
import org.eclipse.swt.events.KeyEvent;
import org.eclipse.swt.events.KeyListener;
import org.eclipse.swt.layout.FillLayout;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.widgets.Dialog;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Shell;
import org.jsoup.Jsoup;

import com.maxprograms.conversa.Conversa;
import com.maxprograms.utils.Locator;

public class HTMLViewer extends Dialog {

	protected Shell shell;
	private Display display;

	public HTMLViewer(Shell parent, String page) throws IOException {
		super(parent, SWT.NONE);
		shell = new Shell(parent, SWT.CLOSE | SWT.TITLE | SWT.MODELESS | SWT.BORDER | SWT.RESIZE);
		shell.setImage(Conversa.getResourcemanager().getLogo());
		display = shell.getDisplay();
		shell.setLayout(new FillLayout());
		shell.addListener(SWT.Close, event -> Locator.remember(shell, "HTMLViewer"));

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

		if (System.getProperty("file.separator").equals("/")
				&& !System.getProperty("os.name").toLowerCase().startsWith("mac")) {
			StyledText text = new StyledText(shell, SWT.V_SCROLL | SWT.H_SCROLL | SWT.MULTI);
			text.setEditable(false);
			text.setMargins(12, 12, 12, 12);
			text.setLayoutData(new GridData(GridData.GRAB_HORIZONTAL | GridData.GRAB_VERTICAL | GridData.FILL_BOTH));
			text.setAlwaysShowScrollBars(true);

			StringBuilder sb = new StringBuilder();
			try (FileReader reader = new FileReader(new File(page), StandardCharsets.UTF_8)) {
				try (BufferedReader buffer = new BufferedReader(reader)) {
					String line = "";
					while ((line = buffer.readLine()) != null) {
						if (!sb.isEmpty()) {
							sb.append('\n');
						}
						sb.append(line);
					}
				}
			}
			text.setText(Jsoup.parse(sb.toString()).wholeText());
		} else {
			Browser browser = new Browser(shell, SWT.NONE);
			browser.setLayoutData(new GridData(GridData.GRAB_HORIZONTAL | GridData.GRAB_VERTICAL | GridData.FILL_BOTH));
			browser.setUrl(new File(page).toURI().toURL().toString());
		}
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

	public void setTitle(String title) {
		shell.setText(title);
	}

}
