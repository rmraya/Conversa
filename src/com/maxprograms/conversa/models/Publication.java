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
package com.maxprograms.conversa.models;

import java.io.Serializable;
import java.util.Date;

public class Publication implements Serializable {

	private static final long serialVersionUID = -2931016549562401932L;
	private String ditamap;
	private String outputFolder;
	private String ditaval;
	private int formats;
	private Date lastPublised;

	public static final int PDF = 0x1;
	public static final int HTML = 0x2;
	public static final int XSLFO = 0x4;
	public static final int ECLIPSE = 0x8;
	public static final int WEB_HELP = 0x10;
	public static final int WEB_HELP5 = 0x20;
	public static final int HTML_HELP = 0x40;
	public static final int DOCX = 0x80;
	public static final int RTF = 0x100;
	public static final int ODT = 0x200;
	public static final int EPUB2 = 0x400;
	public static final int EPUB3 = 0x800;
	public static final int POSTSCRIPT = 0x1000;

	public Publication(String ditamap, String outputFolder, String ditaval, int formats, Date lastPublished) {
		this.ditamap = ditamap;
		this.outputFolder = outputFolder;
		this.ditaval = ditaval;
		this.formats = formats;
		this.lastPublised = lastPublished;
	}

	public String getDitamap() {
		return ditamap;
	}

	public String getOutputFolder() {
		return outputFolder;
	}

	public String getDitaval() {
		return ditaval;
	}

	public int getFormats() {
		return formats;
	}

	public void setDitamap(String ditamap) {
		this.ditamap = ditamap;
	}

	public void setOutputFolder(String outputFolder) {
		this.outputFolder = outputFolder;
	}

	public void setDitaval(String ditaval) {
		this.ditaval = ditaval;
	}

	public void setFormats(int formats) {
		this.formats = formats;
	}

	public Date getLastPublised() {
		return lastPublised;
	}

	public void setLastPublised(Date lastPublised) {
		this.lastPublised = lastPublised;
	}

	public boolean isPDF() {
		return (formats & PDF) != 0;
	}

	public boolean isHTML() {
		return (formats & HTML) != 0;
	}

	public boolean isXSLFO() {
		return (formats & XSLFO) != 0;
	}

	public boolean isEclipse() {
		return (formats & ECLIPSE) != 0;
	}

	public boolean isWebHelp() {
		return (formats & WEB_HELP) != 0;
	}

	public boolean isWebHelp5() {
		return (formats & WEB_HELP5) != 0;
	}

	public boolean isHTMLHelp() {
		return (formats & HTML_HELP) != 0;
	}

	public boolean isDocx() {
		return (formats & DOCX) != 0;
	}

	public boolean isRTF() {
		return (formats & RTF) != 0;
	}

	public boolean isODT() {
		return (formats & ODT) != 0;
	}

	public boolean isEPUB2() {
		return (formats & EPUB2) != 0;
	}

	public boolean isEPUB3() {
		return (formats & EPUB3) != 0;
	}

	public boolean isPostScript() {
		return (formats & POSTSCRIPT) != 0;
	}

}
