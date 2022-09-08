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
package com.maxprograms.conversa.views.resources;

import java.io.File;

import org.eclipse.swt.graphics.Image;
import org.eclipse.swt.widgets.Display;

public class ResourceManager {

	private Display display;
	private Image winLogo;
	private Image linuxLogo;
	private Image macLogo;
	private Image paper;
	private Image gear;
	private Image conversa;
	private Image background;
	private Image macBackground;
	private Image help;

	public ResourceManager(Display display) {
		this.display = display;
	}

	public Image getLogo() {
		if (File.separator.equals("\\")) {
			return getWinLogo();
		} else if (System.getProperty("os.name").toLowerCase().startsWith("mac")) {
			return getMacLogo();
		} else {
			return getLinuxLogo();
		}
	}

	private Image getWinLogo() {
		if (winLogo == null) {
			winLogo = new Image(display, ResourceManager.class.getResourceAsStream("winLogo.png")); //$NON-NLS-1$
		}
		return winLogo;
	}

	private Image getLinuxLogo() {
		if (linuxLogo == null) {
			linuxLogo = new Image(display, ResourceManager.class.getResourceAsStream("linuxLogo.png")); //$NON-NLS-1$
		}
		return linuxLogo;
	}

	private Image getMacLogo() {
		if (macLogo == null) {
			macLogo = new Image(display, ResourceManager.class.getResourceAsStream("macLogo.png")); //$NON-NLS-1$
		}
		return macLogo;
	}

	public Image getPaper() {
		if (paper == null) {
			paper = new Image(display, ResourceManager.class.getResourceAsStream("paper.png")); //$NON-NLS-1$
		}
		return paper;
	}

	public Image getGear() {
		if (gear == null) {
			gear = new Image(display, ResourceManager.class.getResourceAsStream("gear.png")); //$NON-NLS-1$
		}
		return gear;
	}

	public Image getConversa() {
		if (conversa == null) {
			conversa = new Image(display, ResourceManager.class.getResourceAsStream("conversa.png")); //$NON-NLS-1$
		}
		return conversa;
	}

	public Image getBackground() {
		if (background == null) {
			background = new Image(display, ResourceManager.class.getResourceAsStream("background.png")); //$NON-NLS-1$
		}
		return background;
	}

	public Image getMacBackground() {
		if (macBackground == null) {
			macBackground = new Image(display, ResourceManager.class.getResourceAsStream("macBackground.png")); //$NON-NLS-1$
		}
		return macBackground;
	}

	public Image getHelp() {
		if (help == null) {
			help = new Image(display, ResourceManager.class.getResourceAsStream("help.png")); //$NON-NLS-1$
		}
		return help;
	}

}
