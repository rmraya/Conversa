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
package com.maxprograms.conversa.views;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;
import java.util.Vector;
import java.lang.System.Logger.Level;
import java.lang.System.Logger;

import javax.xml.parsers.ParserConfigurationException;

import org.eclipse.swt.SWT;
import org.eclipse.swt.events.PaintEvent;
import org.eclipse.swt.events.PaintListener;
import org.eclipse.swt.events.SelectionAdapter;
import org.eclipse.swt.events.SelectionEvent;
import org.eclipse.swt.events.SelectionListener;
import org.eclipse.swt.graphics.Cursor;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.Button;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.FileDialog;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.widgets.MessageBox;
import org.eclipse.swt.widgets.Table;
import org.eclipse.swt.widgets.TableColumn;
import org.eclipse.swt.widgets.TableItem;
import org.xml.sax.SAXException;

import com.maxprograms.conversa.Conversa;
import com.maxprograms.utils.FileUtils;
import com.maxprograms.xml.Document;
import com.maxprograms.xml.Element;
import com.maxprograms.xml.Indenter;
import com.maxprograms.xml.SAXBuilder;
import com.maxprograms.xml.XMLOutputter;

public class XmlCatalogView extends Composite {

	protected static final Logger LOGGER = System.getLogger(XmlCatalogView.class.getName());

	private static Document catalogDoc;
	protected Table catalogTable;
	private Vector<Element> holder;
	private int count;

	public XmlCatalogView(Composite parent, int style) {
		super(parent, style);
		GridLayout layout = new GridLayout();
		layout.marginWidth = 0;
		layout.marginHeight = 0;
		setLayout(layout);
		setLayoutData(new GridData(GridData.FILL_BOTH));

		try {
			loadCatalogue(Conversa.getCatalogFile());
		} catch (SAXException | IOException | ParserConfigurationException e1) {
			LOGGER.log(Level.ERROR, "Error loading catalog", e1);
			MessageBox box = new MessageBox(getShell(), SWT.ICON_ERROR | SWT.OK);
			box.setMessage("There was an error loading catalog.");
			box.open();
			getShell().close();
		}

		catalogTable = new Table(this, SWT.BORDER | SWT.V_SCROLL | SWT.H_SCROLL | SWT.SINGLE | SWT.FULL_SELECTION);
		GridData tableData = new GridData(GridData.FILL_BOTH);
		tableData.heightHint = 10 * catalogTable.getItemHeight();
		tableData.widthHint = 650;
		catalogTable.setLayoutData(tableData);
		catalogTable.setLinesVisible(true);
		catalogTable.setHeaderVisible(true);

		final TableColumn dtdFile = new TableColumn(catalogTable, SWT.NONE);
		dtdFile.setText("URI");

		try {
			fillCatalogTable();
		} catch (IOException e) {
			LOGGER.log(Level.ERROR, "Error loading catalog", e);
			MessageBox box = new MessageBox(getShell(), SWT.ICON_ERROR | SWT.OK);
			box.setMessage("There was an error loading catalog.");
			box.open();
			getShell().close();
		}

		//
		// Buttons
		//

		Composite catalogBottom = new Composite(this, SWT.NONE);
		catalogBottom.setLayout(new GridLayout(4, false));
		catalogBottom.setLayoutData(new GridData(GridData.GRAB_HORIZONTAL | GridData.FILL_HORIZONTAL));

		Label catalogFiller = new Label(catalogBottom, SWT.NONE);
		catalogFiller.setText("");
		catalogFiller.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		Button addButton = new Button(catalogBottom, SWT.PUSH);
		addButton.setText("Add Catalog Entry");
		addButton.addSelectionListener(new SelectionListener() {

			@Override
			public void widgetSelected(SelectionEvent arg0) {
				addCatalogue();
			}

			@Override
			public void widgetDefaultSelected(SelectionEvent arg0) {
				// do nothing
			}
		});

		Button removeButton = new Button(catalogBottom, SWT.PUSH);
		removeButton.setText("Remove Catalog Entry");
		removeButton.addSelectionListener(new SelectionAdapter() {

			@Override
			public void widgetSelected(SelectionEvent arg0) {
				deleteCatalogEntry();
			}
		});

		addPaintListener(new PaintListener() {

			@Override
			public void paintControl(PaintEvent arg0) {
				dtdFile.setWidth(catalogTable.getClientArea().width);
			}
		});

	}

	private static void loadCatalogue(String catalogueFile)
			throws SAXException, IOException, ParserConfigurationException {
		SAXBuilder builder = new SAXBuilder();
		catalogDoc = builder.build(catalogueFile);
	}

	private static void saveCatalog() throws IOException {
		XMLOutputter outputter = new XMLOutputter();
		outputter.preserveSpace(true);
		Indenter.indent(catalogDoc.getRootElement(), 2);
		try (FileOutputStream output = new FileOutputStream(Conversa.getCatalogFile())) {
			outputter.output(catalogDoc, output);
		}
	}

	private void fillCatalogTable() throws IOException {
		catalogTable.removeAll();
		holder = new Vector<>();
		count = 0;
		Element root = catalogDoc.getRootElement();
		getShell().setCursor(new Cursor(getShell().getDisplay(), SWT.CURSOR_WAIT));
		recurseCatalog(root);
		getShell().setCursor(new Cursor(getShell().getDisplay(), SWT.CURSOR_ARROW));
	}

	private void recurseCatalog(Element e) throws IOException {
		List<Element> entries = e.getChildren();
		Iterator<Element> d = entries.iterator();
		while (d.hasNext()) {
			Element entry = d.next();
			String type = entry.getName();
			if (type.equals("nextCatalog")) {
				String[] content = { getFullPath(entry.getAttributeValue("catalog")) };
				TableItem item = new TableItem(catalogTable, SWT.NONE);
				item.setText(content);
				holder.add(count++, entry);
			}
			recurseCatalog(entry);
		}
	}

	private static String getFullPath(String relative) throws IOException {
		if (relative.startsWith("..")) {
			return FileUtils.getAbsolutePath(Conversa.getCatalogFile(), relative);
		}
		return relative;
	}

	protected void deleteCatalogEntry() {
		if (catalogTable.getSelectionIndices().length == 0) {
			MessageBox box = new MessageBox(getShell(), SWT.ICON_WARNING | SWT.OK);
			box.setMessage("Select a catalog entry.");
			box.open();
			return;
		}
		MessageBox box = new MessageBox(getShell(), SWT.ICON_QUESTION | SWT.YES | SWT.NO);
		box.setMessage("Remove selected entry?");
		if (box.open() == SWT.NO) {
			return;
		}
		int index = catalogTable.getSelectionIndices()[0];
		Element e = holder.get(index);
		remove(catalogDoc.getRootElement(), e);
		try {
			saveCatalog();
			fillCatalogTable();
		} catch (Exception e1) {
			LOGGER.log(Level.ERROR, "Error saving catalog", e1);
			MessageBox ebox = new MessageBox(getShell(), SWT.ICON_ERROR | SWT.OK);
			ebox.setMessage("There was an error saving catalog.");
			ebox.open();
		}

	}

	private void remove(Element main, Element e) {
		try {
			main.removeChild(e);
		} catch (Exception e1) {
			List<Element> content = main.getChildren();
			Iterator<Element> i = content.iterator();
			while (i.hasNext()) {
				Element child = i.next();
				remove(child, e);
			}
		}

	}

	protected void addCatalogue() {
		FileDialog fd = new FileDialog(getShell(), SWT.OPEN);
		String[] names = { "XML Files [*.xml]", "All Files [*.*]" };
		String[] extensions = { "*.xml", "*.*" };
		fd.setFilterNames(names);
		fd.setFilterExtensions(extensions);
		String name = fd.open();
		if (name != null) {
			try {
				Element e = new Element("nextCatalog");
				File catalog = new File(Conversa.getCatalogFile());
				e.setAttribute("catalog", FileUtils.getRelativePath(catalog.getAbsolutePath(), name));
				catalogDoc.getRootElement().addContent(e);
				catalogDoc.getRootElement().addContent("\n");
				saveCatalog();
				fillCatalogTable();
			} catch (Exception e1) {
				MessageBox box = new MessageBox(getShell(), SWT.ICON_ERROR | SWT.OK);
				box.setMessage(e1.getMessage());
				box.open();
			}
		}
	}

}
