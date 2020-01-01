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

import org.eclipse.swt.SWT;
import org.eclipse.swt.graphics.Color;
import org.eclipse.swt.graphics.Image;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Label;

public class CustomBar extends Composite {

	private GridLayout layout;
	private int count;
	private Image imageSeparator;

	Color defaultForeground = getDisplay().getSystemColor(SWT.COLOR_WIDGET_FOREGROUND);
	Color defaultBackground = getDisplay().getSystemColor(SWT.COLOR_WIDGET_BACKGROUND);
	Color separatorForeground = getDisplay().getSystemColor(SWT.COLOR_WIDGET_FOREGROUND);

	public CustomBar(Composite parent, int style) {
		super(parent, style);
		layout = new GridLayout();
		layout.marginWidth = 1;
		layout.marginHeight = 0;
		layout.horizontalSpacing = 1;
		setLayout(layout);

		setForeground(defaultForeground);
		setBackground(defaultBackground);
	}

	public CustomItem addItem(int style) {
		count++;
		setItemCount(count);
		return new CustomItem(this, style);
	}

	public void addSeparator() {
		count++;
		Label separator = new Label(this, SWT.NONE);
		separator.setText("|"); //$NON-NLS-1$
		separator.setForeground(separatorForeground);
		separator.setBackground(defaultBackground);
		setItemCount(count);
	}

	public void addImageSeparator() {
		count++;
		Label separator = new Label(this, SWT.NONE);
		separator.setImage(getImageSeparator());
		separator.setBackground(defaultBackground);
		setItemCount(count);
	}

	private Image getImageSeparator() {
		if (imageSeparator == null) {
			imageSeparator = new Image(getDisplay(), CustomBar.class.getResourceAsStream("separator.png")); //$NON-NLS-1$
		}
		return imageSeparator;
	}

	public void addFiller() {
		count++;
		setItemCount(count);
		Label separator = new Label(this, SWT.NONE);
		separator.setBackground(defaultBackground);
		separator.setText(" "); //$NON-NLS-1$
		separator.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));
	}

	private void setItemCount(int value) {
		count = value;
		layout.numColumns = count;
		layout();
	}

	public Composite addWidget() {
		count++;
		setItemCount(count);
		return this;
	}

	@Override
	public Color getForeground() {
		return defaultForeground;
	}

	@Override
	public Color getBackground() {
		return defaultBackground;
	}

}
