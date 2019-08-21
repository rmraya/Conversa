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
package com.maxprograms.utils;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.lang.System.Logger.Level;
import java.lang.System.Logger;

import org.eclipse.swt.graphics.Point;
import org.eclipse.swt.widgets.Shell;

import com.maxprograms.conversa.Constants;

public class Locator {

	protected static final Logger LOGGER = System.getLogger(Locator.class.getName());

	private Locator() {
		// don't instantiate this class
	}

	public static void setLocation(Shell shell, String type) {
		try {
			Map<String, String> values = Preferences.getInstance(Constants.PREFERENCES).get(type);
			if (values.size() > 0) {
				Point location = new Point(Integer.parseInt(values.get("X")), Integer.parseInt(values.get("Y")));
				shell.setLocation(location);
			}
		} catch (IOException ioe) {
			LOGGER.log(Level.ERROR, "Error setting location", ioe);
		}
	}

	public static void position(Shell shell, String type) {
		try {
			Map<String, String> values = Preferences.getInstance(Constants.PREFERENCES).get(type);
			if (values.size() > 0) {
				Point location = new Point(Integer.parseInt(values.get("X")), Integer.parseInt(values.get("Y")));
				shell.setLocation(location);
				Point size = new Point(Integer.parseInt(values.get("Width")), Integer.parseInt(values.get("Height")));
				shell.setSize(size);
			} else if (type.equals("MainView")) {
				shell.setSize(650, 550);
			}
		} catch (IOException ioe) {
			LOGGER.log(Level.ERROR, "Error setting position", ioe);
		}
	}

	public static void position(Shell shell, String type, Point defaultSize) {
		try {
			Map<String, String> values = Preferences.getInstance(Constants.PREFERENCES).get(type);
			if (values.size() > 0) {
				Point location = new Point(Integer.parseInt(values.get("X")), Integer.parseInt(values.get("Y")));
				shell.setLocation(location);
				Point size = new Point(Integer.parseInt(values.get("Width")), Integer.parseInt(values.get("Height")));
				shell.setSize(size);
			} else {
				shell.setSize(defaultSize);
			}
		} catch (IOException ioe) {
			LOGGER.log(Level.ERROR, "Error setting position", ioe);
		}
	}

	public static void remember(Shell shell, String type) {
		try {
			Map<String, String> values = new HashMap<>();
			values.put("X", "" + shell.getLocation().x);
			values.put("Y", "" + shell.getLocation().y);
			values.put("Width", "" + shell.getSize().x);
			values.put("Height", "" + shell.getSize().y);
			Preferences.getInstance(Constants.PREFERENCES).save(type, values);
		} catch (IOException ioe) {
			LOGGER.log(Level.ERROR, "Error saving location", ioe);
		}
	}

}
