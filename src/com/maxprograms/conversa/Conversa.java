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
package com.maxprograms.conversa;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.io.RandomAccessFile;
import java.nio.channels.FileChannel;
import java.nio.channels.FileLock;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Date;
import java.lang.System.Logger.Level;
import java.lang.System.Logger;

import org.eclipse.swt.SWT;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.MessageBox;
import org.eclipse.swt.widgets.Shell;

import com.maxprograms.conversa.controllers.Controller;
import com.maxprograms.conversa.views.resources.ResourceManager;
import com.maxprograms.utils.Preferences;

public class Conversa {

	private static File lock;
	private static FileChannel channel;
	private static FileLock flock;
	private static FileOutputStream lockStream;
	private static MainView main;
	private static Controller controller;
	private static ResourceManager resourceManager;
	private static Display display;

	private static Logger logger = System.getLogger(Conversa.class.getName());

	public static void main(String[] args) {
		Display.setAppName("Conversa");
		Display.setAppVersion(Constants.VERSION);
		display = Display.getDefault();
		resourceManager = new ResourceManager(display);
		System.setProperty("xml.catalog.files", System.getProperty("user.dir") + File.separator + "schema" + File.separator + "catalog.xml" );
		try {
			checkLock();
			lock();
			controller = new Controller();
			main = new MainView(display);
			main.show();
			if (!display.isDisposed()) {
				display.dispose();
			}
			unlock();
		} catch (Exception e) {
			logger.log(Level.ERROR, "Error starting conversa", e);
			try {
				File log = new File(Preferences.getPreferencesDir().getParentFile(), "Conversa_error.log");
				try (PrintStream stream = new PrintStream(log)) {
					e.printStackTrace(stream);
				}
			} catch (Exception e2) {
				logger.log(Level.ERROR, "Error writing log", e2);
			}
		}
	}

	public static MainView getMainView() {
		return main;
	}

	public static Controller getController() {
		return controller;
	}

	public static ResourceManager getResourcemanager() {
		return resourceManager;
	}

	public static String getCatalogFile() throws IOException {
		File preferencesFolder = Preferences.getPreferencesDir();
		File catalogFolder = new File(preferencesFolder, "schema");
		if (!catalogFolder.exists()) {
			copyFolder(new File("schema"), catalogFolder);
		}
		File catalog = new File(catalogFolder, "catalog.xml");
		return catalog.getAbsolutePath();
	}

	private static void copyFolder(File sourceFolder, File targetFolder) throws IOException {
		if (!targetFolder.exists()) {
			targetFolder.mkdirs();
		}
		File[] list = sourceFolder.listFiles();
		for (int i = 0; i < list.length; i++) {
			File f = list[i];
			if (f.isDirectory()) {
				copyFolder(f, new File(targetFolder, f.getName()));
			} else {
				copyFile(f, new File(targetFolder, f.getName()));
			}
		}
	}

	private static void copyFile(File source, File target) throws IOException {
		if (!target.getParentFile().exists()) {
			target.getParentFile().mkdirs();
		}
		try (FileInputStream in = new FileInputStream(source)) {
			try (FileOutputStream output = new FileOutputStream(target)) {
				byte[] buf = new byte[1024];
				int len;
				while ((len = in.read(buf)) > 0) {
					output.write(buf, 0, len);
				}
			}
		}
	}

	private static void lock() throws IOException {
		lock = new File(Preferences.getPreferencesDir(), "lock"); //$NON-NLS-1$
		lockStream = new FileOutputStream(lock);
		Date d = new Date(System.currentTimeMillis());
		lockStream.write(d.toString().getBytes(StandardCharsets.UTF_8));
		channel = lockStream.getChannel();
		flock = channel.lock();
	}

	private static void unlock() throws IOException {
		flock.release();
		channel.close();
		lockStream.close();
		Files.delete(Paths.get(lock.toURI()));
	}

	private static void checkLock() throws IOException {
		File old = new File(Preferences.getPreferencesDir(), "lock"); //$NON-NLS-1$
		if (old.exists()) {
			try (RandomAccessFile file = new RandomAccessFile(old, "rw")) { //$NON-NLS-1$
				try (FileChannel oldchannel = file.getChannel()) {
					try (FileLock newlock = oldchannel.tryLock()) {
						if (newlock == null) {
							Shell shell = new Shell(display);
							if (File.separator.equals("\\")) {
								shell.setImage(getResourcemanager().getWinLogo());
							} else if (System.getProperty("os.name").toLowerCase().startsWith("mac")) {
								shell.setImage(getResourcemanager().getMacLogo());
							} else {
								shell.setImage(getResourcemanager().getLinuxLogo());
							}
							MessageBox box = new MessageBox(shell, SWT.ICON_WARNING);
							box.setText("Conversa DITA Publisher");
							box.setMessage("An instance of this application is already running.");
							box.open();
							display.dispose();
							System.exit(1);
						} else {
							newlock.release();
						}
					}
				}
			}
			Files.delete(Paths.get(old.toURI()));
		}
	}
}
