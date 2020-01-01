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
package com.maxprograms.conversa.controllers;

import java.io.File;
import java.io.IOError;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.mapdb.DB;
import org.mapdb.DBMaker;
import org.mapdb.HTreeMap;

import com.maxprograms.conversa.models.Publication;
import com.maxprograms.utils.Preferences;

public class Controller {

	private DB mapdb;
	private HTreeMap<String, Publication> hashmap;

	public Controller() throws IOException {
		File out = new File(Preferences.getPreferencesDir(), "Publications");
		try {
			mapdb = DBMaker.newFileDB(out).closeOnJvmShutdown().asyncWriteEnable().make();
		} catch (IOError ex) {
			if (out.exists()) {
				try {
					Files.delete(Paths.get(out.toURI()));
					File p = new File(Preferences.getPreferencesDir(), "Publications" + ".p"); //$NON-NLS-1$
					if (p.exists()) {
						Files.delete(Paths.get(p.toURI()));
					}
					File t = new File(Preferences.getPreferencesDir(), "Publications" + ".t"); //$NON-NLS-1$
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
		hashmap = mapdb.getHashMap("publications"); //$NON-NLS-1$
	}

	public void close() {
		if (mapdb != null) {
			mapdb.commit();
			mapdb.compact();
			mapdb.close();
		}
	}

	public List<Publication> getPublications() {
		List<Publication> result = new ArrayList<>();
		Set<String> set = hashmap.keySet();
		Iterator<String> it = set.iterator();
		while (it.hasNext()) {
			Publication p = hashmap.get(it.next());
			File map = new File(p.getDitamap());
			if (map.exists()) {
				result.add(p);
			} else {
				removePublication(p);
			}
		}
		return result;
	}

	public void addPublication(Publication pub) {
		pub.setLastPublised(new Date());
		hashmap.put(pub.getDitamap(), pub);
		mapdb.commit();
	}

	public void removePublication(Publication p) {
		hashmap.remove(p.getDitamap());
		mapdb.commit();
	}

}
