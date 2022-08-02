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

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class FileUtils {

	private FileUtils() {
		// do not instantiate
	}

	public static String getAbsolutePath(String homeFile, String relative) throws IOException {
		File home = new File(homeFile);
		// If home is a file, get the parent
		File result;
		if (!home.isDirectory()) {
			home = home.getParentFile();
		}
		result = new File(home, relative);
		return result.getCanonicalPath();
	}

	public static String getRelativePath(String homeFile, String filename) throws IOException {
		File home = new File(homeFile);
		// If home is a file, get the parent
		if (!home.isDirectory()) {
			if (home.getParent() != null) {
				home = new File(home.getParent());
			} else {
				home = new File(System.getProperty("user.dir"));
			}

		}
		File file = new File(filename);
		if (!file.isAbsolute()) {
			return filename;
		}
		// Check for relative path
		if (!home.isAbsolute()) {
			File f = new File(home.getAbsolutePath());
			home = f;
			if (!home.isAbsolute()) {
				throw new IOException("Path must be absolute.");
			}
		}
		List<String> homelist = getPathList(home);
		List<String> filelist = getPathList(file);

		return matchPathLists(homelist, filelist);
	}

	private static List<String> getPathList(File file) throws IOException {
		List<String> list = new ArrayList<>();
		File r;
		r = file.getCanonicalFile();
		while (r != null) {
			list.add(r.getName());
			r = r.getParentFile();
		}
		return list;
	}

	private static String matchPathLists(List<String> r, List<String> f) {
		int i;
		int j;
		StringBuilder string = new StringBuilder();
		// start at the beginning of the lists
		// iterate while both lists are equal
		i = r.size() - 1;
		j = f.size() - 1;

		// first eliminate common root
		while (i >= 0 && j >= 0 && r.get(i).equals(f.get(j))) {
			i--;
			j--;
		}

		// for each remaining level in the home path, add a ..
		for (; i >= 0; i--) {
			string.append("..");
			string.append(File.separator);
		}

		// for each level in the file path, add the path
		for (; j >= 1; j--) {
			string.append(f.get(j));
			string.append(File.separator);
		}

		// file name
		if (j >= 0 && j < f.size()) {
			string.append(f.get(j));
		}
		return string.toString();
	}

}
