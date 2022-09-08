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

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class ArgumentsBuilder {

	private List<String> arguments;

	public ArgumentsBuilder() {
		arguments = new ArrayList<>();
	}

	public void append(String string) {
		arguments.add(string);
	}

	public void append(String string1, String string2) {
		arguments.add(string1);
		arguments.add(string2);
	}

	public void append(String string1, String string2, String string3) {
		arguments.add(string1);
		arguments.add(string2);
		arguments.add(string3);
	}

	public String[] getArgumentsArray() {
		if (arguments.isEmpty()) {
			return new String[] {};
		}
		return arguments.toArray(new String[arguments.size()]);
	}

	public List<String> getArguments() {
		return arguments;
	}

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		Iterator<String> it = arguments.iterator();
		while (it.hasNext()) {
			String arg = it.next();
			if (containsSpace(arg)) {
				builder.append('\"');
				builder.append(arg);
				builder.append('\"');
			} else {
				builder.append(arg);
			}
			builder.append(' ');
		}
		return builder.toString().trim();
	}

	private static boolean containsSpace(String string) {
		if (string == null) {
			return false;
		}
		for (int i = 0; i < string.length(); i++) {
			if (Character.isWhitespace(string.charAt(i))) {
				return true;
			}
		}
		return false;
	}

	public boolean containsArgument(String string) {
		for (int i = 0; i < arguments.size(); i++) {
			if (arguments.get(i).equals(string)) {
				return true;
			}
		}
		return false;
	}
}
