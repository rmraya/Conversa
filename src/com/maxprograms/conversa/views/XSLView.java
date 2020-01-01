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
package com.maxprograms.conversa.views;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TreeSet;
import java.lang.System.Logger.Level;
import java.lang.System.Logger;

import javax.xml.parsers.ParserConfigurationException;

import org.eclipse.swt.SWT;
import org.eclipse.swt.custom.CTabFolder;
import org.eclipse.swt.custom.CTabItem;
import org.eclipse.swt.events.SelectionEvent;
import org.eclipse.swt.events.SelectionListener;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.program.Program;
import org.eclipse.swt.widgets.Button;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.FileDialog;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.widgets.MessageBox;
import org.xml.sax.SAXException;

import com.maxprograms.conversa.Constants;
import com.maxprograms.utils.Preferences;
import com.maxprograms.xml.Document;
import com.maxprograms.xml.Element;
import com.maxprograms.xml.SAXBuilder;
import com.maxprograms.xml.XMLOutputter;

public class XSLView extends Composite {

	protected static final Logger LOGGER = System.getLogger(XSLView.class.getName());

	private CommonParametersView commonView;
	private FoParametersView foView;
	private HtmlParametersView htmlView;
	private EpubParametersView epubView;
	private HelpParametersView helpView;

	public XSLView(Composite parent, int style) {
		super(parent, style);
		GridLayout layout = new GridLayout();
		layout.marginWidth = 0;
		layout.marginHeight = 0;
		setLayout(layout);
		setLayoutData(new GridData(GridData.FILL_BOTH));

		CTabFolder folder = new CTabFolder(this, SWT.NONE);
		folder.setLayoutData(new GridData(GridData.FILL_BOTH));
		folder.addSelectionListener(new SelectionListener() {

			@Override
			public void widgetSelected(SelectionEvent arg0) {
				((CTabItem) arg0.item).getControl().setFocus();
			}

			@Override
			public void widgetDefaultSelected(SelectionEvent arg0) {
				// do nothing
			}
		});

		CTabItem commonItem = new CTabItem(folder, SWT.NONE);
		commonItem.setText("Common");
		commonView = new CommonParametersView(folder, SWT.BORDER);
		commonItem.setControl(commonView);

		CTabItem xslFoItem = new CTabItem(folder, SWT.NONE);
		xslFoItem.setText("XSL-FO");
		foView = new FoParametersView(folder, SWT.BORDER);
		xslFoItem.setControl(foView);

		CTabItem htmlItem = new CTabItem(folder, SWT.NONE);
		htmlItem.setText("HTML");
		htmlView = new HtmlParametersView(folder, SWT.BORDER);
		htmlItem.setControl(htmlView);

		CTabItem epubItem = new CTabItem(folder, SWT.NONE);
		epubItem.setText("EPUB");
		epubView = new EpubParametersView(folder, SWT.NONE);
		epubItem.setControl(epubView);

		CTabItem helpItem = new CTabItem(folder, SWT.NONE);
		helpItem.setText("Help Systems");
		helpView = new HelpParametersView(folder, SWT.NONE);
		helpItem.setControl(helpView);

		folder.getItem(0).getControl().setFocus();

		Composite bottom = new Composite(this, SWT.NONE);
		bottom.setLayout(new GridLayout(5, false));
		bottom.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Label filler = new Label(bottom, SWT.NONE);
		filler.setText("");
		filler.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Button export = new Button(bottom, SWT.PUSH);
		export.setText("Export XSL Parameters");
		export.addSelectionListener(new SelectionListener() {

			@Override
			public void widgetSelected(SelectionEvent arg0) {
				FileDialog fd = new FileDialog(getShell(), SWT.SAVE);
				fd.setFilterExtensions(new String[] { "*.xml" });
				fd.setFilterNames(new String[] { "XML Files [*.xml]" });
				fd.setOverwrite(true);
				String file = fd.open();
				if (file != null) {
					if (!file.endsWith(".xml")) {
						file = file + ".xml";
					}
					try {
						Document doc = new Document(null, "xslParams", null);
						Element root = doc.getRootElement();
						root.addContent("\n");
						Preferences prefs = Preferences.getInstance(Constants.PREFERENCES);
						addElements(root, CommonParametersView.PARAMS, prefs.get(CommonParametersView.PARAMS));
						addElements(root, FoParametersView.PARAMS, prefs.get(FoParametersView.PARAMS));
						addElements(root, HtmlParametersView.PARAMS, prefs.get(HtmlParametersView.PARAMS));
						addElements(root, EpubParametersView.PARAMS, prefs.get(EpubParametersView.PARAMS));
						addElements(root, HelpCommonParametersView.PARAMS, prefs.get(HelpCommonParametersView.PARAMS));
						addElements(root, WebHelpParametersView.PARAMS, prefs.get(WebHelpParametersView.PARAMS));
						addElements(root, HtmlHelpParametersView.PARAMS, prefs.get(HtmlHelpParametersView.PARAMS));
						addElements(root, EclipseHelpParametersView.PARAMS,
								prefs.get(EclipseHelpParametersView.PARAMS));
						try (FileOutputStream output = new FileOutputStream(new File(file))) {
							XMLOutputter outputter = new XMLOutputter();
							outputter.preserveSpace(true);
							outputter.output(doc, output);
						}
						MessageBox box = new MessageBox(getShell(), SWT.ICON_INFORMATION | SWT.OK);
						box.setMessage("XSL parameters exported.");
						box.open();
					} catch (IOException e) {
						LOGGER.log(Level.ERROR, "Error exporting preferences", e);
						MessageBox box = new MessageBox(getShell(), SWT.ICON_ERROR | SWT.OK);
						box.setMessage("There was an error exporting preferences.");
						box.open();
					}
				}
			}

			@Override
			public void widgetDefaultSelected(SelectionEvent arg0) {
				// do nothing
			}
		});

		Button importButton = new Button(bottom, SWT.PUSH);
		importButton.setText("Import XSL Parameters");
		importButton.addSelectionListener(new SelectionListener() {

			@Override
			public void widgetSelected(SelectionEvent arg0) {
				FileDialog fd = new FileDialog(getShell(), SWT.OPEN);
				fd.setFilterExtensions(new String[] { "*.xml" });
				fd.setFilterNames(new String[] { "XML Files [*.xml]" });
				fd.setOverwrite(true);
				String f = fd.open();
				if (f != null) {
					File file = new File(f);
					if (!file.exists()) {
						MessageBox box = new MessageBox(getShell(), SWT.ICON_WARNING | SWT.OK);
						box.setMessage("Selected file does not exist.");
						box.open();
						return;
					}
				}
				SAXBuilder builder = new SAXBuilder();
				try {
					Document doc = builder.build(f);
					Element root = doc.getRootElement();
					if (!root.getName().equals("xslParams")) {
						MessageBox box = new MessageBox(getShell(), SWT.ICON_WARNING | SWT.OK);
						box.setMessage("Selected file does not contain XSL parameters.");
						box.open();
						return;
					}
					loadDefaults();
					Preferences prefs = Preferences.getInstance(Constants.PREFERENCES);
					List<Element> list = root.getChildren();
					Iterator<Element> it = list.iterator();
					while (it.hasNext()) {
						Element section = it.next();
						String sectionName = section.getName();
						Map<String, String> table = new HashMap<>();
						List<Element> parameters = section.getChildren();
						Iterator<Element> p = parameters.iterator();
						while (p.hasNext()) {
							Element param = p.next();
							table.put(param.getAttributeValue("name"), param.getText());
						}
						prefs.save(sectionName, table);
					}
					loadValues();
				} catch (SAXException | IOException | ParserConfigurationException e) {
					LOGGER.log(Level.ERROR, "Error importing preferences", e);
					MessageBox box = new MessageBox(getShell(), SWT.ICON_ERROR | SWT.OK);
					box.setMessage("There was an error importing preferences.");
					box.open();
				}
			}

			@Override
			public void widgetDefaultSelected(SelectionEvent arg0) {
				// do nothing
			}
		});

		Button loadDefaults = new Button(bottom, SWT.PUSH);
		loadDefaults.setText("Load Default Values");
		loadDefaults.addSelectionListener(new SelectionListener() {

			@Override
			public void widgetSelected(SelectionEvent arg0) {
				MessageBox box = new MessageBox(getShell(), SWT.ICON_QUESTION | SWT.YES | SWT.NO);
				box.setMessage("Load default values?");
				if (box.open() == SWT.YES) {
					loadDefaults();
				}
			}

			@Override
			public void widgetDefaultSelected(SelectionEvent arg0) {
				// do nothing
			}
		});

		Button help = new Button(bottom, SWT.PUSH);
		help.setText("Show Reference Guide");
		help.addSelectionListener(new SelectionListener() {

			@Override
			public void widgetSelected(SelectionEvent arg0) {
				try {
					Program.launch(new File("docs/xsl_parameters.pdf").toURI().toURL().toString());
				} catch (MalformedURLException e) {
					LOGGER.log(Level.ERROR, "Error opening Reference Guide", e);
					MessageBox box = new MessageBox(getShell(), SWT.ICON_ERROR | SWT.OK);
					box.setMessage("Error opening Reference Guide");
					box.open();
				}

			}

			@Override
			public void widgetDefaultSelected(SelectionEvent arg0) {
				// do nothing
			}
		});

	}

	protected void loadValues() {
		commonView.loadValues();
		foView.loadValues();
		htmlView.loadValues();
		epubView.loadValues();
		helpView.loadValues();
	}

	protected void loadDefaults() {
		commonView.loadDefaults();
		foView.loadDefaults();
		htmlView.loadDefaults();
		epubView.loadDefaults();
		helpView.loadDefaults();
	}

	protected static void addElements(Element root, String sectionName, Map<String, String> table) {
		Element section = new Element(sectionName);
		root.addContent("  ");
		root.addContent(section);
		root.addContent("\n");
		TreeSet<String> keys = new TreeSet<>();
		keys.addAll(table.keySet());
		Iterator<String> it = keys.iterator();
		while (it.hasNext()) {
			String key = it.next();
			String value = table.get(key);
			Element param = new Element("param");
			param.setAttribute("name", key);
			param.setText(value);
			section.addContent("\n    ");
			section.addContent(param);
		}
		if (!keys.isEmpty()) {
			section.addContent("\n  ");
		}
	}

}
