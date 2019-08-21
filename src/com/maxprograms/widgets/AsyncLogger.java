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

import org.eclipse.swt.widgets.Display;

import com.maxprograms.conversa.controllers.ILogger;

public class AsyncLogger implements ILogger {

	protected ILogger parent;

	private List<String> errors;

	private Display display;

	public AsyncLogger(ILogger parent) {
		this.parent = parent;
		display = Display.getCurrent();
	}

	@Override
	public synchronized void log(String message) {
		display.asyncExec(new Runnable() {

			@Override
			public void run() {
				parent.log(message);
			}
		});
	}

	@Override
	public synchronized void setStage(String stage) {
		display.asyncExec(new Runnable() {

			@Override
			public void run() {
				parent.setStage(stage);
			}
		});
	}

	@Override
	public synchronized boolean isCancelled() {
		return parent.isCancelled();
	}

	@Override
	public synchronized void logError(String error) {
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
		parent.displayError(string);
	}

	@Override
	public void displaySuccess(String string) {
		parent.displaySuccess(string);
	}

}
