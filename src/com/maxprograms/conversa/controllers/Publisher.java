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
import java.io.IOException;
import java.lang.System.Logger;
import java.lang.System.Logger.Level;
import java.net.MalformedURLException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import com.maxprograms.conversa.Constants;
import com.maxprograms.conversa.models.Publication;
import com.maxprograms.conversa.views.CommonParametersView;
import com.maxprograms.conversa.views.EclipseHelpParametersView;
import com.maxprograms.conversa.views.EpubParametersView;
import com.maxprograms.conversa.views.FoParametersView;
import com.maxprograms.conversa.views.HelpCommonParametersView;
import com.maxprograms.conversa.views.HtmlHelpParametersView;
import com.maxprograms.conversa.views.HtmlParametersView;
import com.maxprograms.conversa.views.WebHelpParametersView;
import com.maxprograms.utils.ArgumentsBuilder;
import com.maxprograms.utils.Preferences;
import com.maxprograms.widgets.AsyncLogger;
import com.xmlmind.ditac.convert.Converter;
import com.xmlmind.ditac.convert.StyleSheetCache;
import com.xmlmind.util.Console;
import com.xmlmind.util.Console.MessageType;

import org.eclipse.swt.program.Program;

public class Publisher {

	protected static final Logger LOGGER = System.getLogger(Publisher.class.getName());

	private static String defaultFoProcessor;
	private static String externalFop;
	private static String xepPath;
	private static String ahPath;
	private static String hhcPath;
	private static String xfcPath;
	protected static StringBuilder log;
	private static String pluginId;

	private Publisher() {
		// do not instantiate
	}

	public static void convert(Publication publication, boolean openFiles, AsyncLogger logger) {
		StyleSheetCache cache = new StyleSheetCache();

		log = new StringBuilder();

		Console console = new Console() {
			@Override
			public void showMessage(String message, MessageType messageType) {
				log.append(message + "\n");
				if (messageType.equals(MessageType.ERROR)) {
					logger.logError(message);
				}
				if (messageType.equals(MessageType.INFO)) {
					logger.log(message);
				}
				if (messageType.equals(MessageType.WARNING)) {
					logger.log(message);
				}
			}
		};

		Converter converter = new Converter(cache, console);

		logger.setStage("Loading Settings");

		loadSettings();

		File inFile = new File(publication.getDitamap());
		File outFolder = new File(publication.getOutputFolder());
		if (!outFolder.exists()) {
			outFolder.mkdirs();
		}
		File outFile = null;
		File ditaval = publication.getDitaval() != null ? new File(publication.getDitaval()) : null;

		if (logger.isCancelled()) {
			logger.displayError("Process cancelled.");
			return;
		}

		//
		// PDF
		//
		if (publication.isPDF()) {
			logger.setStage("Generating PDF");
			switch (defaultFoProcessor) {
			case "XEP":
				if (!converter.registerXEP(path(xepPath))) {
					logger.displayError("Error registering XEP.");
					return;
				}
				break;
			case "AH":
				if (!converter.registerAHF(path(ahPath))) {
					logger.displayError("Error registering Antenna House.");
					return;
				}
				break;
			case "externalFOP":
				if (!converter.registerFOP(path(externalFop))) {
					logger.displayError("Error registering FOP.");
					return;
				}
				break;
			default:
				String path = System.getProperty("user.dir") + File.separator + "fop-2.3" + File.separator;
				System.setProperty("FOP_HOME", path);
				String javaHome = System.getProperty("user.dir") + File.separator + "jre";
				System.setProperty("JAVA_HOME", javaHome);

				if (System.getProperty("os.name").startsWith("Windows")) {
					path = path + "fop.bat";
				} else {
					path = path + "fop.sh";
				}
				if (!converter.registerFOP(path(path))) {
					logger.displayError("Error registering internal FOP.");
					return;
				}
			}
			File folder = new File(outFolder, "pdf");
			if (!folder.exists()) {
				folder.mkdirs();
			}
			outFile = new File(folder, inFile.getName().substring(0, inFile.getName().lastIndexOf('.')) + ".pdf");
			ArgumentsBuilder argsBuilder = new ArgumentsBuilder();
			argsBuilder.append("-v");
			argsBuilder.append("-f", "pdf");
			getCommonParameters(argsBuilder);
			getFOParameters(argsBuilder);

			if (ditaval != null) {
				argsBuilder.append("-filter", ditaval.getPath());
			}
			argsBuilder.append(outFile.getAbsolutePath());
			argsBuilder.append(inFile.getAbsolutePath());

			console.showMessage("Parameters:", MessageType.INFO);
			console.showMessage(argsBuilder.toString(), MessageType.INFO);
			LOGGER.log(Level.INFO, argsBuilder.toString());
			console.showMessage("", MessageType.INFO);

			int result = converter.run(argsBuilder.getArguments());
			if (result != 0) {
				logger.displayError("Error generating PDF.");
				return;
			}
			if (openFiles) {
				try {
					Program.launch(outFile.toURI().toURL().toString());
				} catch (MalformedURLException e) {
					LOGGER.log(Level.ERROR, "Error opening PDF", e);
				}
			}
		}

		if (logger.isCancelled()) {
			logger.displayError("Process cancelled.");
			return;
		}

		//
		// HTML
		//

		if (publication.isHTML()) {
			logger.setStage("Generating HTML");
			File folder = new File(outFolder, "html");
			if (!folder.exists()) {
				folder.mkdirs();
			}
			outFile = new File(folder, inFile.getName().substring(0, inFile.getName().lastIndexOf('.')) + ".html");
			ArgumentsBuilder argsBuilder = new ArgumentsBuilder();
			argsBuilder.append("-v");
			argsBuilder.append("-images", "img");
			argsBuilder.append("-f", "html");
			getCommonParameters(argsBuilder);
			getHtmlParameters(argsBuilder);

			if (ditaval != null) {
				argsBuilder.append("-filter", ditaval.getPath());
			}
			argsBuilder.append(outFile.getAbsolutePath());
			argsBuilder.append(inFile.getAbsolutePath());

			console.showMessage("Parameters:", MessageType.INFO);
			console.showMessage(argsBuilder.toString(), MessageType.INFO);
			LOGGER.log(Level.INFO, argsBuilder.toString());
			console.showMessage("", MessageType.INFO);

			int result = converter.run(argsBuilder.getArguments());
			if (result != 0) {
				logger.displayError("Error generating HTML.");
				return;
			}
			if (openFiles) {
				try {
					Program.launch(outFile.toURI().toURL().toString());
				} catch (MalformedURLException e) {
					LOGGER.log(Level.ERROR, "Error opening HTML", e);
				}
			}
		}

		if (logger.isCancelled()) {
			logger.displayError("Process cancelled.");
			return;
		}

		//
		// XSL-FO
		//

		if (publication.isXSL_FO()) {
			logger.setStage("Generating XSL-FO");
			File folder = new File(outFolder, "fo");
			if (!folder.exists()) {
				folder.mkdirs();
			}
			outFile = new File(folder, inFile.getName().substring(0, inFile.getName().lastIndexOf('.')) + ".fo");
			ArgumentsBuilder argsBuilder = new ArgumentsBuilder();
			argsBuilder.append("-v");
			argsBuilder.append("-f", "fo");
			getCommonParameters(argsBuilder);
			getFOParameters(argsBuilder);

			if (ditaval != null) {
				argsBuilder.append("-filter", ditaval.getPath());
			}
			argsBuilder.append(outFile.getAbsolutePath());
			argsBuilder.append(inFile.getAbsolutePath());

			console.showMessage("Parameters:", MessageType.INFO);
			console.showMessage(argsBuilder.toString(), MessageType.INFO);
			LOGGER.log(Level.INFO, argsBuilder.toString());
			console.showMessage("", MessageType.INFO);

			int result = converter.run(argsBuilder.getArguments());
			if (result != 0) {
				logger.displayError("Error generating XSL-FO.");
				return;
			}
			if (openFiles) {
				try {
					Program.launch(outFile.toURI().toURL().toString());
				} catch (MalformedURLException e) {
					LOGGER.log(Level.ERROR, "Error opening XSL-FO", e);
				}
			}
		}

		if (logger.isCancelled()) {
			logger.displayError("Process cancelled.");
			return;
		}

		//
		// Postscript
		//

		if (publication.isPostScript()) {
			logger.setStage("Generating PostScript");
			File folder = new File(outFolder, "ps");
			if (!folder.exists()) {
				folder.mkdirs();
			}
			outFile = new File(folder, inFile.getName().substring(0, inFile.getName().lastIndexOf('.')) + ".ps");
			ArgumentsBuilder argsBuilder = new ArgumentsBuilder();
			argsBuilder.append("-v");
			argsBuilder.append("-f", "ps");
			getCommonParameters(argsBuilder);
			getFOParameters(argsBuilder);

			if (ditaval != null) {
				argsBuilder.append("-filter", ditaval.getPath());
			}
			argsBuilder.append(outFile.getAbsolutePath());
			argsBuilder.append(inFile.getAbsolutePath());

			console.showMessage("Parameters:", MessageType.INFO);
			console.showMessage(argsBuilder.toString(), MessageType.INFO);
			LOGGER.log(Level.INFO, argsBuilder.toString());
			console.showMessage("", MessageType.INFO);

			int result = converter.run(argsBuilder.getArguments());
			if (result != 0) {
				logger.displayError("Error generating PostScript.");
				return;
			}
			if (openFiles) {
				try {
					Program.launch(outFile.toURI().toURL().toString());
				} catch (MalformedURLException e) {
					LOGGER.log(Level.ERROR, "Error opening PostScript file", e);
				}
			}
		}

		if (logger.isCancelled()) {
			logger.displayError("Process cancelled.");
			return;
		}

		//
		// Eclipse Help
		//

		if (publication.isEclipse()) {
			logger.setStage("Generating Eclipse Help");
			File folder = new File(outFolder, "eclipse");
			if (!folder.exists()) {
				folder.mkdirs();
			}
			if (pluginId.equals("")) {
				outFile = new File(folder, "_.html");
			} else {
				outFile = new File(folder, pluginId + File.separator + "_.html");
				if (!outFile.getParentFile().exists()) {
					outFile.getParentFile().mkdirs();
				}
			}
			ArgumentsBuilder argsBuilder = new ArgumentsBuilder();
			argsBuilder.append("-v");
			argsBuilder.append("-images", "img");
			argsBuilder.append("-f", "eclipsehelp");
			getCommonParameters(argsBuilder);
			getHelpCommonParameters(argsBuilder);
			getHtmlParameters(argsBuilder);
			getEclipseHelpParameters(argsBuilder);

			if (ditaval != null) {
				argsBuilder.append("-filter", ditaval.getPath());
			}
			argsBuilder.append(outFile.getAbsolutePath());
			argsBuilder.append(inFile.getAbsolutePath());

			console.showMessage("Parameters:", MessageType.INFO);
			console.showMessage(argsBuilder.toString(), MessageType.INFO);
			LOGGER.log(Level.INFO, argsBuilder.toString());
			console.showMessage("", MessageType.INFO);

			int result = converter.run(argsBuilder.getArguments());
			if (result != 0) {
				logger.displayError("Error generating Eclipse Help.");
				return;
			}
			if (openFiles) {
				try {
					Program.launch(outFile.getParentFile().toURI().toURL().toString());
				} catch (MalformedURLException e) {
					LOGGER.log(Level.ERROR, "Error opening Eclipse Help", e);
				}
			}
		}

		if (logger.isCancelled()) {
			logger.displayError("Process cancelled.");
			return;
		}

		//
		// Web Help
		//

		if (publication.isWebHelp()) {
			logger.setStage("Generating Web Help");
			File folder = new File(outFolder, "webhelp");
			if (!folder.exists()) {
				folder.mkdirs();
			}
			outFile = new File(folder, inFile.getName().substring(0, inFile.getName().lastIndexOf('.')) + ".html");
			ArgumentsBuilder argsBuilder = new ArgumentsBuilder();
			argsBuilder.append("-v");
			argsBuilder.append("-images", "img");
			argsBuilder.append("-f", "webhelp");
			getCommonParameters(argsBuilder);
			getHtmlParameters(argsBuilder);
			getHelpCommonParameters(argsBuilder);
			getWebHelpParameters(argsBuilder);

			if (ditaval != null) {
				argsBuilder.append("-filter", ditaval.getPath());
			}
			argsBuilder.append(outFile.getAbsolutePath());
			argsBuilder.append(inFile.getAbsolutePath());

			console.showMessage("Parameters:", MessageType.INFO);
			console.showMessage(argsBuilder.toString(), MessageType.INFO);
			LOGGER.log(Level.INFO, argsBuilder.toString());
			console.showMessage("", MessageType.INFO);

			int result = converter.run(argsBuilder.getArguments());
			if (result != 0) {
				logger.displayError("Error generating Web Help.");
				return;
			}
			if (openFiles) {
				try {
					Program.launch(outFile.toURI().toURL().toString());
				} catch (MalformedURLException e) {
					LOGGER.log(Level.ERROR, "Error opening Web Help", e);
				}
			}
		}

		if (logger.isCancelled()) {
			logger.displayError("Process cancelled.");
			return;
		}

		//
		// Web Help 5
		//

		if (publication.isWebHelp5()) {
			logger.setStage("Generating Web Help HTML 5");
			File folder = new File(outFolder, "webhelp5");
			if (!folder.exists()) {
				folder.mkdirs();
			}
			outFile = new File(folder, inFile.getName().substring(0, inFile.getName().lastIndexOf('.')) + ".html");
			ArgumentsBuilder argsBuilder = new ArgumentsBuilder();
			argsBuilder.append("-v");
			argsBuilder.append("-images", "img");
			argsBuilder.append("-f", "webhelp5");
			getCommonParameters(argsBuilder);
			getHtmlParameters(argsBuilder);
			getHelpCommonParameters(argsBuilder);
			getWebHelpParameters(argsBuilder);

			if (ditaval != null) {
				argsBuilder.append("-filter", ditaval.getPath());
			}
			argsBuilder.append(outFile.getAbsolutePath());
			argsBuilder.append(inFile.getAbsolutePath());

			console.showMessage("Parameters:", MessageType.INFO);
			console.showMessage(argsBuilder.toString(), MessageType.INFO);
			LOGGER.log(Level.INFO, argsBuilder.toString());
			console.showMessage("", MessageType.INFO);

			int result = converter.run(argsBuilder.getArguments());
			if (result != 0) {
				logger.displayError("Error generating Web Help HTML 5.");
				return;
			}
			if (openFiles) {
				try {
					Program.launch(outFile.toURI().toURL().toString());
				} catch (MalformedURLException e) {
					LOGGER.log(Level.ERROR, "Error opening Web Help HTML 5", e);
				}
			}
		}

		if (logger.isCancelled()) {
			logger.displayError("Process cancelled.");
			return;
		}

		//
		// HTML Help
		//

		if (publication.isHTMLHelp()) {
			logger.setStage("Generating HTML Help");
			File folder = new File(outFolder, "htmlhelp");
			if (!folder.exists()) {
				folder.mkdirs();
			}
			outFile = new File(folder, inFile.getName().substring(0, inFile.getName().lastIndexOf('.')) + ".chm");
			ArgumentsBuilder argsBuilder = new ArgumentsBuilder();
			argsBuilder.append("-v");
			argsBuilder.append("-hhc", hhcPath);
			argsBuilder.append("-images", "img");
			argsBuilder.append("-f", "htmlhelp");
			getCommonParameters(argsBuilder);
			getHtmlParameters(argsBuilder);
			getHelpCommonParameters(argsBuilder);
			getHtmlHelpParameters(argsBuilder);

			if (ditaval != null) {
				argsBuilder.append("-filter", ditaval.getPath());
			}
			argsBuilder.append(outFile.getAbsolutePath());
			argsBuilder.append(inFile.getAbsolutePath());

			console.showMessage("Parameters:", MessageType.INFO);
			console.showMessage(argsBuilder.toString(), MessageType.INFO);
			LOGGER.log(Level.INFO, argsBuilder.toString());
			console.showMessage("", MessageType.INFO);

			int result = converter.run(argsBuilder.getArguments());
			if (result != 0) {
				logger.displayError("Error generating HTML Help.");
				return;
			}
			if (openFiles) {
				try {
					Program.launch(outFile.toURI().toURL().toString());
				} catch (MalformedURLException e) {
					LOGGER.log(Level.ERROR, "Error opening HTML Help", e);
				}
			}
		}

		if (logger.isCancelled()) {
			logger.displayError("Process cancelled.");
			return;
		}

		//
		// Docx
		//

		if (publication.isDocx()) {
			logger.setStage("Generating DOCX");
			File folder = new File(outFolder, "docx");
			if (!folder.exists()) {
				folder.mkdirs();
			}
			outFile = new File(folder, inFile.getName().substring(0, inFile.getName().lastIndexOf('.')) + ".docx");
			ArgumentsBuilder argsBuilder = new ArgumentsBuilder();
			argsBuilder.append("-v");
			argsBuilder.append("-xfc", xfcPath);
			argsBuilder.append("-f", "docx");
			getCommonParameters(argsBuilder);
			getFOParameters(argsBuilder);

			if (ditaval != null) {
				argsBuilder.append("-filter", ditaval.getPath());
			}
			argsBuilder.append(outFile.getAbsolutePath());
			argsBuilder.append(inFile.getAbsolutePath());

			console.showMessage("Parameters:", MessageType.INFO);
			console.showMessage(argsBuilder.toString(), MessageType.INFO);
			LOGGER.log(Level.INFO, argsBuilder.toString());
			console.showMessage("", MessageType.INFO);

			int result = converter.run(argsBuilder.getArguments());
			if (result != 0) {
				logger.displayError("Error generating DOCX.");
				return;
			}
			if (openFiles) {
				try {
					Program.launch(outFile.toURI().toURL().toString());
				} catch (MalformedURLException e) {
					LOGGER.log(Level.ERROR, "Error opening Docx", e);
				}
			}
		}

		if (logger.isCancelled()) {
			logger.displayError("Process cancelled.");
			return;
		}

		//
		// RTF
		//

		if (publication.isRTF()) {
			logger.setStage("Generating RTF");
			File folder = new File(outFolder, "rtf");
			if (!folder.exists()) {
				folder.mkdirs();
			}
			outFile = new File(folder, inFile.getName().substring(0, inFile.getName().lastIndexOf('.')) + ".rtf");
			ArgumentsBuilder argsBuilder = new ArgumentsBuilder();
			argsBuilder.append("-v");
			argsBuilder.append("-xfc", xfcPath);
			argsBuilder.append("-f", "rtf");
			getCommonParameters(argsBuilder);
			getFOParameters(argsBuilder);

			if (ditaval != null) {
				argsBuilder.append("-filter", ditaval.getPath());
			}
			argsBuilder.append(outFile.getAbsolutePath());
			argsBuilder.append(inFile.getAbsolutePath());

			console.showMessage("Parameters:", MessageType.INFO);
			console.showMessage(argsBuilder.toString(), MessageType.INFO);
			LOGGER.log(Level.INFO, argsBuilder.toString());
			console.showMessage("", MessageType.INFO);

			int result = converter.run(argsBuilder.getArguments());
			if (result != 0) {
				logger.displayError("Error generating RTF.");
				return;
			}
			if (openFiles) {
				try {
					Program.launch(outFile.toURI().toURL().toString());
				} catch (MalformedURLException e) {
					LOGGER.log(Level.ERROR, "Error opening RTF", e);
				}
			}
		}

		if (logger.isCancelled()) {
			logger.displayError("Process cancelled.");
			return;
		}

		//
		// ODT
		//

		if (publication.isODT()) {
			logger.setStage("Generating ODT");
			File folder = new File(outFolder, "odt");
			if (!folder.exists()) {
				folder.mkdirs();
			}
			outFile = new File(folder, inFile.getName().substring(0, inFile.getName().lastIndexOf('.')) + ".odt");
			ArgumentsBuilder argsBuilder = new ArgumentsBuilder();
			argsBuilder.append("-v");
			argsBuilder.append("-xfc", xfcPath);
			argsBuilder.append("-f", "odt");
			getCommonParameters(argsBuilder);
			getFOParameters(argsBuilder);

			if (ditaval != null) {
				argsBuilder.append("-filter", ditaval.getPath());
			}
			argsBuilder.append(outFile.getAbsolutePath());
			argsBuilder.append(inFile.getAbsolutePath());

			console.showMessage("Parameters:", MessageType.INFO);
			console.showMessage(argsBuilder.toString(), MessageType.INFO);
			LOGGER.log(Level.INFO, argsBuilder.toString());
			console.showMessage("", MessageType.INFO);

			int result = converter.run(argsBuilder.getArguments());
			if (result != 0) {
				logger.displayError("Error generating ODT.");
				return;
			}
			if (openFiles) {
				try {
					Program.launch(outFile.toURI().toURL().toString());
				} catch (MalformedURLException e) {
					LOGGER.log(Level.ERROR, "Error opening ODT", e);
				}
			}
		}

		if (logger.isCancelled()) {
			logger.displayError("Process cancelled.");
			return;
		}

		//
		// EPUB 2
		//

		if (publication.isEPUB2()) {
			logger.setStage("Generating EPUB 2");
			File folder = new File(outFolder, "epub");
			if (!folder.exists()) {
				folder.mkdirs();
			}
			outFile = new File(folder, inFile.getName().substring(0, inFile.getName().lastIndexOf('.')) + ".epub");
			ArgumentsBuilder argsBuilder = new ArgumentsBuilder();
			argsBuilder.append("-v");
			argsBuilder.append("-images", "img");
			argsBuilder.append("-f", "epub");
			getCommonParameters(argsBuilder);
			getHtmlParameters(argsBuilder);
			getEpubParameters(argsBuilder);
			getHelpCommonParameters(argsBuilder);

			if (ditaval != null) {
				argsBuilder.append("-filter", ditaval.getPath());
			}
			argsBuilder.append(outFile.getAbsolutePath());
			argsBuilder.append(inFile.getAbsolutePath());

			console.showMessage("Parameters:", MessageType.INFO);
			console.showMessage(argsBuilder.toString(), MessageType.INFO);
			LOGGER.log(Level.INFO, argsBuilder.toString());
			console.showMessage("", MessageType.INFO);

			int result = converter.run(argsBuilder.getArguments());
			if (result != 0) {
				logger.displayError("Error generating EPUB 2.");
				return;
			}
			if (openFiles) {
				try {
					Program.launch(outFile.toURI().toURL().toString());
				} catch (MalformedURLException e) {
					LOGGER.log(Level.ERROR, "Error opening EPUB 2", e);
				}
			}
		}

		if (logger.isCancelled()) {
			logger.displayError("Process cancelled.");
			return;
		}

		//
		// EPUB 3
		//

		if (publication.isEPUB3()) {
			logger.setStage("Generating EPUB 3");
			File folder = new File(outFolder, "epub3");
			if (!folder.exists()) {
				folder.mkdirs();
			}
			outFile = new File(folder, inFile.getName().substring(0, inFile.getName().lastIndexOf('.')) + ".epub");
			ArgumentsBuilder argsBuilder = new ArgumentsBuilder();
			argsBuilder.append("-v");
			argsBuilder.append("-images", "img");
			argsBuilder.append("-f", "epub3");
			getCommonParameters(argsBuilder);
			getHtmlParameters(argsBuilder);
			getEpubParameters(argsBuilder);
			getHelpCommonParameters(argsBuilder);

			if (ditaval != null) {
				argsBuilder.append("-filter", ditaval.getPath());
			}
			argsBuilder.append(outFile.getAbsolutePath());
			argsBuilder.append(inFile.getAbsolutePath());

			console.showMessage("Parameters:", MessageType.INFO);
			console.showMessage(argsBuilder.toString(), MessageType.INFO);
			LOGGER.log(Level.INFO, argsBuilder.toString());
			console.showMessage("", MessageType.INFO);

			int result = converter.run(argsBuilder.getArguments());
			if (result != 0) {
				logger.displayError("Error generating EPUB 3.");
				return;
			}
			if (openFiles) {
				try {
					Program.launch(outFile.toURI().toURL().toString());
				} catch (MalformedURLException e) {
					LOGGER.log(Level.ERROR, "Error opening EPUB 3", e);
				}
			}
		}
		logger.displaySuccess("Done!");
	}

	private static void getWebHelpParameters(ArgumentsBuilder argsBuilder) {
		Map<String, String> defaults = new HashMap<>();
		defaults.put("wh-collapse-toc", "no");
		defaults.put("wh-index-numbers", "no");
		defaults.put("wh-inherit-font-and-colors", "yes");
		defaults.put("wh-jquery", "");
		defaults.put("wh-local-jquery", "no");
		defaults.put("wh-layout", "classic");
		defaults.put("wh-responsive-ui", "yes");
		defaults.put("wh-ui-language", "browser");
		defaults.put("wh-use-stemming", "yes");
		defaults.put("wh-user-css", "");
		defaults.put("wh-user-footer", "");
		defaults.put("wh-user-header", "");
		defaults.put("wh-user-resources", "");
		defaults.put("whc-index-basename", "whc_index.xml");
		defaults.put("whc-toc-basename", "whc_toc.xml");
		Map<String, String> custom = new HashMap<>();
		try {
			Preferences preferences = Preferences.getInstance(Constants.PREFERENCES);
			custom.putAll(preferences.get(WebHelpParametersView.PARAMS));
		} catch (IOException e) {
			LOGGER.log(Level.ERROR, "Error saving preferences", e);
		}
		if (custom.size() == 0) {
			return;
		}
		Set<String> keys = defaults.keySet();
		Iterator<String> it = keys.iterator();
		while (it.hasNext()) {
			String key = it.next();
			if (custom.containsKey(key) && !defaults.get(key).equals(custom.get(key))) {
				argsBuilder.append("-p", key, custom.get(key));
			}
		}
	}

	private static void getEpubParameters(ArgumentsBuilder argsBuilder) {
		Map<String, String> defaults = new HashMap<>();
		defaults.put("cover-image", "");
		defaults.put("epub-identifier", "");
		defaults.put("epub2-compatible", "yes");
		defaults.put("generate-epub-trigger", "yes");
		Map<String, String> custom = new HashMap<>();
		try {
			Preferences preferences = Preferences.getInstance(Constants.PREFERENCES);
			custom.putAll(preferences.get(EpubParametersView.PARAMS));
		} catch (IOException e) {
			LOGGER.log(Level.ERROR, "Error saving preferences", e);
		}
		if (custom.size() == 0) {
			return;
		}
		Set<String> keys = defaults.keySet();
		Iterator<String> it = keys.iterator();
		while (it.hasNext()) {
			String key = it.next();
			if (custom.containsKey(key) && !defaults.get(key).equals(custom.get(key))) {
				argsBuilder.append("-p", key, custom.get(key));
			}
		}
	}

	private static void getEclipseHelpParameters(ArgumentsBuilder argsBuilder) {
		Map<String, String> defaults = new HashMap<>();
		defaults.put("plugin-id", "");
		defaults.put("plugin-index-basename", "index.xml");
		defaults.put("plugin-name", "");
		defaults.put("plugin-provider", "");
		defaults.put("plugin-toc-basename", "toc.xml");
		defaults.put("plugin-version", "1.0.0");
		Map<String, String> custom = new HashMap<>();
		try {
			Preferences preferences = Preferences.getInstance(Constants.PREFERENCES);
			custom.putAll(preferences.get(EclipseHelpParametersView.PARAMS));
		} catch (IOException e) {
			LOGGER.log(Level.ERROR, "Error saving preferences", e);
		}
		if (custom.size() == 0) {
			return;
		}
		Set<String> keys = defaults.keySet();
		Iterator<String> it = keys.iterator();
		while (it.hasNext()) {
			String key = it.next();
			if (custom.containsKey(key) && !defaults.get(key).equals(custom.get(key))) {
				argsBuilder.append("-p", key, custom.get(key));
			}
		}
	}

	private static void getHtmlHelpParameters(ArgumentsBuilder argsBuilder) {
		Map<String, String> defaults = new HashMap<>();
		defaults.put("hhc-basename", "toc.hhc");
		defaults.put("hhp-template", "template.hhp");
		defaults.put("hhx-basename", "index.hhx");
		Map<String, String> custom = new HashMap<>();
		try {
			Preferences preferences = Preferences.getInstance(Constants.PREFERENCES);
			custom.putAll(preferences.get(HtmlHelpParametersView.PARAMS));
		} catch (IOException e) {
			LOGGER.log(Level.ERROR, "Error saving preferences", e);
		}
		if (custom.size() == 0) {
			return;
		}
		Set<String> keys = defaults.keySet();
		Iterator<String> it = keys.iterator();
		while (it.hasNext()) {
			String key = it.next();
			if (custom.containsKey(key) && !defaults.get(key).equals(custom.get(key))) {
				argsBuilder.append("-p", key, custom.get(key));
			}
		}
	}

	private static void getFOParameters(ArgumentsBuilder argsBuilder) {
		Map<String, String> defaults = new HashMap<>();
		defaults.put("base-font-size", "10pt");
		defaults.put("body-bottom-margin", "0.5in");
		defaults.put("body-font-family", "serif");
		defaults.put("body-start-indent", "2pc");
		defaults.put("body-top-margin", "0.5in");
		defaults.put("choice-bullets", "&#x2022;");
		defaults.put("equation-block-equation-width", "90%");
		defaults.put("equation-block-number-width", "10%");
		defaults.put("external-href-after", "]");
		defaults.put("external-href-before", "[");
		defaults.put("footer-center",
				"two-sides even:: {{chapter-title}};;" + "two-sides part||chapter||appendices||appendix odd::¬"
						+ "{{section1-title}};;" + "one-side even||odd:: {{chapter-title}}");
		defaults.put("footer-center-width", "6");
		defaults.put("footer-height", "0.4in");
		defaults.put("footer-left", "two-sides even:: {{page-number}}");
		defaults.put("footer-left-width", "2");
		defaults.put("footer-right", "two-sides first||odd:: {{page-number}};;" + "one-side:: {{page-number}}");
		defaults.put("footer-right-width", "2");
		defaults.put("footer-separator", "yes");
		defaults.put("header-center", "{{document-title}}");
		defaults.put("header-center-width", "6");
		defaults.put("header-height", "0.4in");
		defaults.put("header-left", "");
		defaults.put("header-left-width", "2");
		defaults.put("header-right", "");
		defaults.put("header-right-width", "2");
		defaults.put("header-separator", "yes");
		defaults.put("hyphenate", "no");
		defaults.put("index-column-count", "2");
		defaults.put("index-column-gap", "2em");
		defaults.put("justified", "no");
		defaults.put("link-bullet", "&#x2022;");
		defaults.put("menucascade-separator", "&#x2192;");
		defaults.put("note-icon-height", "7mm");
		defaults.put("note-icon-suffix", ".png");
		defaults.put("note-icon-width", "7mm");
		defaults.put("page-bottom-margin", "0.5in");
		defaults.put("page-height", "");
		defaults.put("page-inner-margin", "1.25in");
		defaults.put("page-orientation", "portrait");
		defaults.put("page-outer-margin", "1in");
		defaults.put("page-ref-after", "");
		defaults.put("page-ref-before", "");
		defaults.put("page-top-margin", "0.5in");
		defaults.put("page-width", "");
		defaults.put("paper-type", "A4");
		defaults.put("pdf-outline", "no");
		defaults.put("show-external-links", "no");
		defaults.put("show-imagemap-links", "yes");
		defaults.put("show-link-page", "no");
		defaults.put("show-xref-page", "no");
		defaults.put("title-color", "black");
		defaults.put("title-font-family", "sans-serif");
		defaults.put("two-sided", "no");
		defaults.put("ul-li-bullets", "&#x2022; &#x2013;");
		defaults.put("unordered-step-bullets", "&#x2022;");
		defaults.put("use-multimedia-extensions", "no");
		defaults.put("watermark", "all");
		defaults.put("xfc-render-as-table", "note");
		Map<String, String> custom = new HashMap<>();
		try {
			Preferences preferences = Preferences.getInstance(Constants.PREFERENCES);
			custom.putAll(preferences.get(FoParametersView.PARAMS));
		} catch (IOException e) {
			LOGGER.log(Level.ERROR, "Error saving preferences", e);
		}
		if (custom.size() == 0) {
			return;
		}
		Set<String> keys = defaults.keySet();
		Iterator<String> it = keys.iterator();
		while (it.hasNext()) {
			String key = it.next();
			if (custom.containsKey(key) && !defaults.get(key).equals(custom.get(key))) {
				argsBuilder.append("-p", key, custom.get(key));
			}
		}
	}

	private static void getHelpCommonParameters(ArgumentsBuilder argsBuilder) {
		Map<String, String> defaults = new HashMap<>();
		defaults.put("add-toc-root", "yes");
		defaults.put("number-toc-entries", "yes");
		Map<String, String> custom = new HashMap<>();
		try {
			Preferences preferences = Preferences.getInstance(Constants.PREFERENCES);
			custom.putAll(preferences.get(HelpCommonParametersView.PARAMS));
		} catch (IOException e) {
			LOGGER.log(Level.ERROR, "Error saving preferences", e);
		}
		if (custom.size() == 0) {
			return;
		}
		if (custom.size() == 0) {
			return;
		}
		Set<String> keys = defaults.keySet();
		Iterator<String> it = keys.iterator();
		while (it.hasNext()) {
			String key = it.next();
			if (custom.containsKey(key) && !defaults.get(key).equals(custom.get(key))) {
				argsBuilder.append("-p", key, custom.get(key));
			}
		}
	}

	private static void getHtmlParameters(ArgumentsBuilder argsBuilder) {
		Map<String, String> defaults = new HashMap<>();
		defaults.put("add-index-toc", "yes");
		defaults.put("chain-pages", "none");
		defaults.put("chain-topics", "no");
		defaults.put("css", "");
		defaults.put("cssResourceName", "base.css");
		defaults.put("custom-css", "");
		defaults.put("default-table-width", "");
		defaults.put("external-link-icon-height", "10");
		defaults.put("external-link-icon-suffix", "new_window.png");
		defaults.put("external-link-icon-width", "10");
		defaults.put("format-to-type", "");
		defaults.put("generator-info", "Conversa " + Constants.VERSION);
		defaults.put("ignore-navigation-links", "auto"); // TODO redefine in web help
		defaults.put("javascripts", "");
		defaults.put("mathjax", "no");
		defaults.put("mathjax-url", "");
		defaults.put("mark-external-links", "no");
		defaults.put("navigation-icon-height", "16");
		defaults.put("navigation-icon-suffix", ".png");
		defaults.put("navigation-icon-width", "16");
		defaults.put("screen-resolution", "96");
		defaults.put("xhtml-mime-type", "text/html");
		Map<String, String> custom = new HashMap<>();
		try {
			Preferences preferences = Preferences.getInstance(Constants.PREFERENCES);
			custom.putAll(preferences.get(HtmlParametersView.PARAMS));
		} catch (IOException e) {
			LOGGER.log(Level.ERROR, "Error saving preferences", e);
		}
		Set<String> keys = defaults.keySet();
		Iterator<String> it = keys.iterator();
		while (it.hasNext()) {
			String key = it.next();
			if (custom.containsKey(key) && custom.containsKey(key) && !defaults.get(key).equals(custom.get(key))) {
				argsBuilder.append("-p", key, custom.get(key));
			}
		}

		if (!argsBuilder.containsArgument("xsl-resources-directory")) {
			argsBuilder.append("-p", "xsl-resources-directory", "resources/");
		}
	}

	private static void getCommonParameters(ArgumentsBuilder argsBuilder) {
		Map<String, String> defaults = new HashMap<>();
		defaults.put("appendix-number-format", "A");
		defaults.put("cause-number-format", "A");
		defaults.put("center", "");
		defaults.put("equation-number-after", ")");
		defaults.put("equation-number-before", "(");
		defaults.put("extended-toc", "none");
		defaults.put("external-resource-base", "");
		defaults.put("highlight-source", "yes");
		defaults.put("index-range-separator", "&#x2013;");
		defaults.put("link-auto-text", "number text");
		defaults.put("note-icon-list",
				"attention caution danger fastpath important note notes remember restriction tip");
		defaults.put("number", "");
		defaults.put("number-separator1", ".");
		defaults.put("number-separator2", "-");
		defaults.put("mark-important-steps", "no");
		defaults.put("part-number-format", "I");
		defaults.put("prepend-chapter-to-section-number", "no");
		defaults.put("remedy-number-format", "A");
		defaults.put("show-draft-comments", "no");
		defaults.put("troubleSolution-number-format", "1");
		defaults.put("title-after", "");
		defaults.put("title-page", "auto");
		defaults.put("title-prefix-separator1", ". ");
		defaults.put("use-note-icon", "no");
		defaults.put("watermark-image", "");
		defaults.put("xref-auto-text", "number");
		defaults.put("xsl-resources-directory", "resources/");
		Map<String, String> custom = new HashMap<>();
		try {
			Preferences preferences = Preferences.getInstance(Constants.PREFERENCES);
			custom.putAll(preferences.get(CommonParametersView.PARAMS));
		} catch (IOException e) {
			LOGGER.log(Level.ERROR, "Error saving preferences", e);
		}
		if (custom.size() == 0) {
			return;
		}
		Set<String> keys = defaults.keySet();
		Iterator<String> it = keys.iterator();
		while (it.hasNext()) {
			String key = it.next();
			if (custom.containsKey(key) && !defaults.get(key).equals(custom.get(key))) {
				argsBuilder.append("-p", key, custom.get(key));
			}
		}
	}

	private static String path(String p) {
		if (File.separatorChar != '/') {
			return p.replace('/', File.separatorChar);
		}
		return p;
	}

	private static void loadSettings() {
		try {
			Preferences preferences = Preferences.getInstance(Constants.PREFERENCES);
			defaultFoProcessor = preferences.get("foProcessor", "default", "builtin-FOP");
			externalFop = preferences.get("foProcessor", "externalFOP", "");
			xepPath = preferences.get("foProcessor", "XEP", "");
			ahPath = preferences.get("foProcessor", "AH", "");
			hhcPath = preferences.get("foProcessor", "MHC", "");
			xfcPath = preferences.get("foProcessor", "XMFC", "");
			pluginId = preferences.get(EclipseHelpParametersView.PARAMS, "plugin-id", "");
		} catch (IOException e) {
			LOGGER.log(Level.ERROR, "Error loading preferences", e);
		}
	}

	public static String getLog() {
		return log.toString();
	}
}
