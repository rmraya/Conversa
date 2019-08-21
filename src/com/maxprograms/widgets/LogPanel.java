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
package com.maxprograms.widgets;

import java.util.ArrayList;
import java.util.List;

import org.eclipse.swt.SWT;
import org.eclipse.swt.custom.StyledText;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Label;

import com.maxprograms.conversa.controllers.ILogger;

public class LogPanel extends Composite implements ILogger {

	private Display display;
	private Label stage;
	private StyledText log;
	private String home = System.getProperty("user.home"); //$NON-NLS-1$
	private List<String> errors;

	public LogPanel(Composite parent, int style) {
		super(parent, style);

		setLayout(new GridLayout());
		display = parent.getDisplay();

		stage = new Label(this, SWT.NONE);
		GridData data = new GridData(GridData.FILL_HORIZONTAL);
		data.widthHint = 300;
		stage.setLayoutData(data);
		stage.setBackground(display.getSystemColor(SWT.COLOR_LIST_SELECTION));

		log = new StyledText(this, SWT.WRAP | SWT.READ_ONLY);
		GridData labelData = new GridData(GridData.FILL_HORIZONTAL);
		labelData.heightHint = log.getLineHeight() * 4;
		log.setLayoutData(labelData);

		setBackground(log.getBackground());
	}

	@Override
	public void log(String message) {
		if (message.indexOf(home) != -1) {
			log.setText(replaceAllHome(message));
		} else {
			log.setText(message);
		}
		display.update();
		display.sleep();
	}

	private String replaceAllHome(String string) {
		int start = string.indexOf(home);
		StringBuilder result = new StringBuilder(string.substring(0, start));
		result.append('~');
		String message = string.substring(start + home.length());
		start = message.indexOf(home);
		while (start != -1) {
			result.append(message.substring(0, start));
			result.append('~');
			message = message.substring(start + home.length());
			start = message.indexOf(home);
		}
		result.append(message);
		return result.toString();
	}

	@Override
	public void setStage(String value) {
		stage.setText(value);
		display.update();
	}

	@Override
	public boolean isCancelled() {
		return false;
	}

	@Override
	public void logError(String error) {
		if (errors == null) {
			errors = new ArrayList<>();
		}
		errors.add(error);
	}

	@Override
	public List<String> getErrors() {
		return errors;
	}

	@Override
	public void displayError(String string) {
		// do nothing
	}

	@Override
	public void displaySuccess(String string) {
		// do nothing
	}

}
