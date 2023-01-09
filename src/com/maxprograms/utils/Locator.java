/*********************************************************************** 

Copyright (c) 2016-2023 - Maxprograms,  http://www.maxprograms.com/

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
import java.lang.System.Logger;
import java.lang.System.Logger.Level;

import org.eclipse.swt.graphics.Point;
import org.eclipse.swt.widgets.Shell;
import org.json.JSONException;
import org.json.JSONObject;

public class Locator {

	private static Logger logger = System.getLogger(Locator.class.getName());

	private Locator() {
		// don't instantiate this class
	}

	public static void setLocation(Shell shell, String type) {
		try {
			JSONObject values = Preferences.getInstance().get(type);
			if (values.has("X") && values.has("Y")) {
				Point location = new Point(Integer.parseInt(values.getString("X")),
						Integer.parseInt(values.getString("Y")));
				shell.setLocation(location);
			}
		} catch (IOException | JSONException e) {
			logger.log(Level.ERROR, "Error setting location", e);
		}
	}

	public static void position(Shell shell, String type) {
		try {
			JSONObject values = Preferences.getInstance().get(type);
			if (values.has("X") && values.has("Y") && values.has("Width") && values.has("Height")) {
				Point location = new Point(Integer.parseInt(values.getString("X")),
						Integer.parseInt(values.getString("Y")));
				shell.setLocation(location);
				Point size = new Point(Integer.parseInt(values.getString("Width")),
						Integer.parseInt(values.getString("Height")));
				shell.setSize(size);
			} else if (type.equals("MainView")) {
				shell.setSize(650, 550);
			}
		} catch (IOException | JSONException e) {
			logger.log(Level.ERROR, "Error setting position", e);
		}
	}

	public static void position(Shell shell, String type, Point defaultSize) {
		try {
			JSONObject values = Preferences.getInstance().get(type);
			if (values.has("X") && values.has("Y") && values.has("Width") && values.has("Height")) {
				Point location = new Point(Integer.parseInt(values.getString("X")),
						Integer.parseInt(values.getString("Y")));
				shell.setLocation(location);
				Point size = new Point(Integer.parseInt(values.getString("Width")),
						Integer.parseInt(values.getString("Height")));
				shell.setSize(size);
			} else {
				shell.setSize(defaultSize);
			}
		} catch (IOException | JSONException e) {
			logger.log(Level.ERROR, "Error setting position", e);
		}
	}

	public static void remember(Shell shell, String type) {
		try {
			JSONObject values = new JSONObject();
			values.put("X", "" + shell.getLocation().x);
			values.put("Y", "" + shell.getLocation().y);
			values.put("Width", "" + shell.getSize().x);
			values.put("Height", "" + shell.getSize().y);
			Preferences.getInstance().save(type, values);
		} catch (IOException | JSONException e) {
			logger.log(Level.ERROR, "Error saving location", e);
		}
	}

}
