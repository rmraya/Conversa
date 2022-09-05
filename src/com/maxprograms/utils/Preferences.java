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
package com.maxprograms.utils;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.json.JSONException;
import org.json.JSONObject;

import com.maxprograms.conversa.Constants;

public class Preferences {

	private JSONObject json;
	private static Preferences instance;

	public static Preferences getInstance() throws IOException, JSONException {
		if (instance == null) {
			instance = new Preferences();
		}
		return instance;
	}

	private Preferences() throws IOException, JSONException {
		File file = new File(getPreferencesDir(), Constants.PREFERENCES);
		if (!file.exists()) {
			try (FileOutputStream out = new FileOutputStream(file)) {
				out.write(new JSONObject().toString().getBytes(StandardCharsets.UTF_8));
			}
		}
		StringBuilder sb = new StringBuilder();
		try (FileReader reader = new FileReader(file, StandardCharsets.UTF_8)) {
			try (BufferedReader buffered = new BufferedReader(reader)) {
				String line = "";
				while ((line = buffered.readLine()) != null) {
					if (!sb.isEmpty()) {
						sb.append('\n');
					}
					sb.append(line);
				}
			}
		}
		json = new JSONObject(sb.toString());
	}

	public static synchronized File getPreferencesDir() throws IOException {
		String directory;
		if (File.separator.equals("\\")) { //$NON-NLS-1$ //$NON-NLS-2$
			// Windows
			directory = System.getenv("AppData") + "\\Conversa\\"; //$NON-NLS-1$ //$NON-NLS-2$
		} else if (System.getProperty("os.name").toLowerCase().startsWith("mac")) { //$NON-NLS-1$ //$NON-NLS-2$
			// Mac
			directory = System.getProperty("user.home") + "/Library/Application Support/Conversa/"; //$NON-NLS-1$ //$NON-NLS-2$
		} else {
			// Linux
			directory = System.getProperty("user.home") + "/.config/conversa/"; //$NON-NLS-1$ //$NON-NLS-2$
		}
		File dir = new File(directory);
		if (!dir.exists() && !dir.mkdirs()) {
			throw new IOException("Error creating preferences directory.");
		}
		return dir;
	}

	public synchronized void save(String groupName, String name, String value) throws IOException, JSONException {
		if (!json.has(groupName)) {
			json.put(groupName, new JSONObject());
		}
		JSONObject group = json.getJSONObject(groupName);
		group.put(name, value);
		File file = new File(getPreferencesDir(), Constants.PREFERENCES);
		try (FileOutputStream out = new FileOutputStream(file)) {
			out.write(json.toString(2).getBytes(StandardCharsets.UTF_8));
		}
	}

	public String get(String groupName, String name, String defaultValue) {
		if (!json.has(groupName)) {
			json.put(groupName, new JSONObject());
		}
		JSONObject group = json.getJSONObject(groupName);
		if (!group.has(name)) {
			group.put(name, defaultValue);
		}
		return group.getString(name);
	}

	public synchronized void save(String groupName, JSONObject values) throws IOException, JSONException {
		json.put(groupName, values);
		File file = new File(getPreferencesDir(), Constants.PREFERENCES);
		try (FileOutputStream out = new FileOutputStream(file)) {
			out.write(json.toString(2).getBytes(StandardCharsets.UTF_8));
		}
	}

	public JSONObject get(String groupName) {
		if (json.has(groupName)) {
			return json.getJSONObject(groupName);
		}
		return new JSONObject();
	}

	public synchronized void remove(String group) throws IOException, JSONException {
		if (json.has(group)) {
			json.remove(group);
			File file = new File(getPreferencesDir(), Constants.PREFERENCES);
			try (FileOutputStream out = new FileOutputStream(file)) {
				out.write(json.toString(2).getBytes(StandardCharsets.UTF_8));
			}
		}
	}
}
