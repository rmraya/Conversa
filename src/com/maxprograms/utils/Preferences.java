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

import java.io.File;
import java.io.IOError;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import org.mapdb.DB;
import org.mapdb.DBMaker;
import org.mapdb.HTreeMap;

public class Preferences {

	private DB mapdb;
	private HTreeMap<String, Map<String, String>> hashmap;
	private static Map<String, Preferences> instances;

	public static Preferences getInstance(String file) throws IOException {
		if (instances == null) {
			instances = new HashMap<>();
		}
		Preferences instance = instances.get(file);
		if (instance == null) {
			instance = new Preferences(file);
			instances.put(file, instance);
		}
		return instance;
	}

	private Preferences(String file) throws IOException {
		File out = new File(getPreferencesDir(), file);
		try {
			mapdb = DBMaker.newFileDB(out).closeOnJvmShutdown().asyncWriteEnable().make();
		} catch (IOError ex) {
			if (out.exists()) {
				try {
					Files.delete(Paths.get(out.toURI()));
					File p = new File(getPreferencesDir(), file + ".p"); //$NON-NLS-1$
					if (p.exists()) {
						Files.delete(Paths.get(p.toURI()));
					}
					File t = new File(getPreferencesDir(), file + ".t"); //$NON-NLS-1$
					if (t.exists()) {
						Files.delete(Paths.get(t.toURI()));
					}
					mapdb = DBMaker.newFileDB(out).closeOnJvmShutdown().asyncWriteEnable().make();
				} catch (IOError ex2) {
					throw new IOException(ex2.getMessage());
				}
			} else {
				throw new IOException(ex.getMessage());
			}
		}
		hashmap = mapdb.getHashMap("preferences"); //$NON-NLS-1$
	}

	public static synchronized File getPreferencesDir() throws IOException {
		String directory;
		if (File.separator.equals("\\")) { //$NON-NLS-1$ //$NON-NLS-2$
			// Windows
			directory = System.getenv("AppData") + "\\Conversa\\"; //$NON-NLS-1$ //$NON-NLS-2$
		} else if (System.getProperty("os.name").toLowerCase().startsWith("mac")) { //$NON-NLS-1$ //$NON-NLS-2$
			// Mac
			directory = System.getProperty("user.home") + "/Library/Preferences/Conversa/"; //$NON-NLS-1$ //$NON-NLS-2$
		} else {
			// Linux
			directory = System.getProperty("user.home") + "/.conversa/"; //$NON-NLS-1$ //$NON-NLS-2$
		}
		File dir = new File(directory);
		if (!dir.exists() && !dir.mkdirs()) {
			throw new IOException("Error creating preferences directory.");
		}
		return dir;
	}

	public synchronized void save(String group, String name, String value) {
		Map<String, String> g = hashmap.get(group);
		if (g == null) {
			g = new HashMap<>();
		}
		g.put(name, value);
		hashmap.put(group, g);
		mapdb.commit();
	}

	public String get(String group, String name, String defaultValue) {
		Map<String, String> g = hashmap.get(group);
		if (g == null) {
			return defaultValue;
		}
		String value = g.get(name);
		if (value == null) {
			return defaultValue;
		}
		return value;
	}

	public synchronized void save(String group, Map<String, String> values) {
		Map<String, String> g = hashmap.get(group);
		if (g != null) {
			Set<String> keys = values.keySet();
			Iterator<String> it = keys.iterator();
			while (it.hasNext()) {
				String key = it.next();
				g.put(key, values.get(key));
			}
			hashmap.put(group, g);
		} else {
			hashmap.put(group, values);
		}
		mapdb.commit();
	}

	public Map<String, String> get(String group) {
		Map<String, String> g = hashmap.get(group);
		if (g == null) {
			g = new HashMap<>();
		}
		return g;
	}

	public synchronized void remove(String group) {
		Map<String, String> g = hashmap.get(group);
		if (g != null) {
			hashmap.remove(group);
			mapdb.commit();
		}
	}

	public void close() {
		mapdb.commit();
		mapdb.close();
	}
}
