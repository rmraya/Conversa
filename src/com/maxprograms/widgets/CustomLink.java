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
package com.maxprograms.widgets;

import java.lang.System.Logger.Level;
import java.lang.System.Logger;

import org.eclipse.swt.SWT;
import org.eclipse.swt.events.MouseEvent;
import org.eclipse.swt.events.MouseListener;
import org.eclipse.swt.graphics.Color;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.widgets.MessageBox;

import com.maxprograms.conversa.views.HTMLViewer;

public class CustomLink {

	Label link;
	private String url;
	private Composite parent;

	public CustomLink(Composite parent, int style) {

		link = new Label(parent, style);

		this.parent = parent;

		link.setCursor(parent.getDisplay().getSystemCursor(SWT.CURSOR_HAND));
		link.setForeground(parent.getDisplay().getSystemColor(SWT.COLOR_LINK_FOREGROUND));
		link.addMouseListener(new MouseListener() {

			@Override
			public void mouseUp(MouseEvent arg0) {
				// do nothing
			}

			@Override
			public void mouseDown(MouseEvent arg0) {
				displayLink();
			}

			@Override
			public void mouseDoubleClick(MouseEvent arg0) {
				// do nothing
			}
		});
	}

	protected void displayLink() {
		try {
			HTMLViewer viewer = new HTMLViewer(link.getShell());
			viewer.setTitle(link.getText());
			viewer.display(url);
			viewer.show();
		} catch (Exception e) {
			Logger logger = System.getLogger(CustomLink.class.getName());
			logger.log(Level.ERROR, "Error displaying link", e);
			MessageBox box = new MessageBox(parent.getShell(), SWT.ICON_ERROR);
			box.setMessage(e.getMessage());
			box.open();
		}
	}

	public void setURL(String value) {
		url = value;
	}

	public void setForeground(Color value) {
		link.setForeground(value);
	}

	public void setText(String string) {
		link.setText(string);
	}
}
