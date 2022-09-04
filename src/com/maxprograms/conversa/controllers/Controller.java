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
package com.maxprograms.conversa.controllers;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.json.JSONException;
import org.json.JSONObject;

import com.maxprograms.conversa.Constants;
import com.maxprograms.conversa.models.Publication;
import com.maxprograms.utils.Preferences;

public class Controller {

	JSONObject publications;

	public Controller() throws IOException {
		publications = new JSONObject();
		File file = new File(Preferences.getPreferencesDir(), Constants.PUBLICATIONS);
		if (file.exists()) {
			StringBuffer sb = new StringBuffer();
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
			publications = new JSONObject(sb.toString());
		}
	}

	public List<Publication> getPublications() throws JSONException, IOException {
		List<Publication> result = new ArrayList<>();
		Set<String> set = publications.keySet();
		Iterator<String> it = set.iterator();
		while (it.hasNext()) {
			Publication p = new Publication(publications.getJSONObject(it.next()));
			File map = new File(p.getDitamap());
			if (map.exists()) {
				result.add(p);
			} else {
				removePublication(p);
			}
		}
		return result;
	}

	public void addPublication(Publication pub) throws IOException, JSONException {
		pub.setLastPublised(new Date());
		publications.put(pub.getDitamap(), pub.toJSON());
		File file = new File(Preferences.getPreferencesDir(), Constants.PUBLICATIONS);
		try (FileOutputStream out = new FileOutputStream(file)) {
			out.write(publications.toString(2).getBytes(StandardCharsets.UTF_8));
		}
	}

	public void removePublication(Publication p) throws IOException, JSONException {
		publications.remove(p.getDitamap());
		File file = new File(Preferences.getPreferencesDir(), Constants.PUBLICATIONS);
		try (FileOutputStream out = new FileOutputStream(file)) {
			out.write(publications.toString(2).getBytes(StandardCharsets.UTF_8));
		}
	}

}
