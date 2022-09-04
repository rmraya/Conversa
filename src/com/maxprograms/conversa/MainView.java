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
import java.io.IOException;
import java.io.InputStream;
import java.lang.System.Logger;
import java.lang.System.Logger.Level;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.text.Collator;
import java.text.MessageFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

import org.eclipse.swt.SWT;
import org.eclipse.swt.dnd.DND;
import org.eclipse.swt.dnd.DropTarget;
import org.eclipse.swt.dnd.DropTargetEvent;
import org.eclipse.swt.dnd.DropTargetListener;
import org.eclipse.swt.dnd.FileTransfer;
import org.eclipse.swt.dnd.Transfer;
import org.eclipse.swt.events.MouseEvent;
import org.eclipse.swt.events.MouseListener;
import org.eclipse.swt.events.SelectionAdapter;
import org.eclipse.swt.events.SelectionEvent;
import org.eclipse.swt.graphics.Cursor;
import org.eclipse.swt.graphics.Rectangle;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.program.Program;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Event;
import org.eclipse.swt.widgets.Listener;
import org.eclipse.swt.widgets.Menu;
import org.eclipse.swt.widgets.MenuItem;
import org.eclipse.swt.widgets.MessageBox;
import org.eclipse.swt.widgets.ScrollBar;
import org.eclipse.swt.widgets.Shell;
import org.eclipse.swt.widgets.Table;
import org.eclipse.swt.widgets.TableColumn;
import org.eclipse.swt.widgets.TableItem;
import org.json.JSONException;

import com.maxprograms.conversa.controllers.Controller;
import com.maxprograms.conversa.models.Publication;
import com.maxprograms.conversa.views.AboutBox;
import com.maxprograms.conversa.views.ConversionDialog;
import com.maxprograms.conversa.views.PreferencesDialog;
import com.maxprograms.utils.Locator;
import com.maxprograms.widgets.CustomBar;
import com.maxprograms.widgets.CustomItem;
import com.maxprograms.xml.Catalog;
import com.maxprograms.xml.Document;
import com.maxprograms.xml.Element;
import com.maxprograms.xml.SAXBuilder;

public class MainView {

	protected static final Logger LOGGER = System.getLogger(MainView.class.getName());

	private Display display;
	protected Shell shell;
	private Menu systemMenu;
	private boolean isMac;
	protected Controller controller;
	protected Table table;
	protected TableColumn mapColumn;
	protected TableColumn dateColumn;
	protected int sortField;

	public MainView(Display display) {
		this.display = display;
		shell = new Shell(display, SWT.SHELL_TRIM);
		shell.setText("Conversa DITA Publisher");
		GridLayout shellLayout = new GridLayout();
		shellLayout.marginWidth = 0;
		shellLayout.marginHeight = 0;
		shell.setLayout(shellLayout);
		if (File.separator.equals("\\")) {
			shell.setImage(Conversa.getResourcemanager().getWinLogo());
		} else if (System.getProperty("os.name").toLowerCase().startsWith("mac")) {
			shell.setImage(Conversa.getResourcemanager().getMacLogo());
		} else {
			shell.setImage(Conversa.getResourcemanager().getLinuxLogo());
		}

		shell.addListener(SWT.Close, new Listener() {

			@Override
			public void handleEvent(Event arg0) {
				Locator.remember(shell, "MainView");
			}
		});
		shell.addListener(SWT.Resize, new Listener() {

			@Override
			public void handleEvent(Event arg0) {
				fixColumns();
			}
		});

		systemMenu = display.getSystemMenu();

		if (systemMenu != null && System.getProperty("os.name").toLowerCase().startsWith("mac")) {

			isMac = true;

			MenuItem sysItem = getItem(systemMenu, SWT.ID_ABOUT);
			if (sysItem != null) {
				sysItem.addSelectionListener(new SelectionAdapter() {
					@Override
					public void widgetSelected(SelectionEvent e) {
						AboutBox box = new AboutBox(shell, SWT.DIALOG_TRIM);
						box.show();
					}
				});
			}
			sysItem = getItem(systemMenu, SWT.ID_QUIT);
			if (sysItem != null) {
				sysItem.addSelectionListener(new SelectionAdapter() {
					@Override
					public void widgetSelected(SelectionEvent e) {
						shell.close();
					}
				});
			}
			sysItem = getItem(systemMenu, SWT.ID_PREFERENCES);
			if (sysItem != null) {
				sysItem.addSelectionListener(new SelectionAdapter() {
					@Override
					public void widgetSelected(SelectionEvent e) {
						PreferencesDialog dialog = new PreferencesDialog(shell, SWT.CLOSE | SWT.RESIZE);
						dialog.show();
					}
				});
			}
		}

		Menu bar = display.getMenuBar();
		if (bar == null) {
			bar = new Menu(shell, SWT.BAR);
			shell.setMenuBar(bar);
		}
		createMenu(bar);

		CustomBar customBar = new CustomBar(shell, SWT.NONE);
		customBar.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

		CustomItem publish = customBar.addItem(SWT.PUSH);
		publish.setText("Publish DITA Map");
		publish.setImage(Conversa.getResourcemanager().getPaper());
		publish.addMouseListener(new MouseListener() {

			@Override
			public void mouseUp(MouseEvent arg0) {
				// do nothing
			}

			@Override
			public void mouseDown(MouseEvent arg0) {
				publishMap();
			}

			@Override
			public void mouseDoubleClick(MouseEvent arg0) {
				// do nothing
			}
		});

		CustomItem preferences = customBar.addItem(SWT.PUSH);
		preferences.setText("Preferences");
		preferences.setImage(Conversa.getResourcemanager().getGear());
		preferences.addMouseListener(new MouseListener() {

			@Override
			public void mouseUp(MouseEvent arg0) {
				// do nothing
			}

			@Override
			public void mouseDown(MouseEvent arg0) {
				PreferencesDialog dialog = new PreferencesDialog(shell, SWT.CLOSE | SWT.RESIZE);
				dialog.show();
			}

			@Override
			public void mouseDoubleClick(MouseEvent arg0) {
				// do nothing
			}
		});

		customBar.addFiller();

		CustomItem helpItem = customBar.addItem(SWT.PUSH);
		helpItem.setText("User Guide");
		helpItem.setImage(Conversa.getResourcemanager().getHelp());
		helpItem.addMouseListener(new MouseListener() {

			@Override
			public void mouseUp(MouseEvent arg0) {
				// do nothing

			}

			@Override
			public void mouseDown(MouseEvent arg0) {
				try {
					Program.launch(new File("docs/conversa.pdf").toURI().toURL().toString());
				} catch (MalformedURLException e) {
					LOGGER.log(Level.ERROR, "Error opening help file", e);
					MessageBox box = new MessageBox(shell, SWT.ICON_WARNING | SWT.OK);
					box.setMessage("There was an error opening help file.");
					box.open();
				}
			}

			@Override
			public void mouseDoubleClick(MouseEvent arg0) {
				// do nothin
			}
		});

		table = new Table(shell, SWT.H_SCROLL | SWT.V_SCROLL | SWT.SINGLE | SWT.FULL_SELECTION);
		GridData tableData = new GridData(GridData.FILL_BOTH);
		table.setLayoutData(tableData);
		table.setLinesVisible(true);
		table.setHeaderVisible(true);
		table.setFocus();
		if (isMac) {
			table.setBackgroundImage(Conversa.getResourcemanager().getMacBackground());
		} else {
			table.setBackgroundImage(Conversa.getResourcemanager().getBackground());
		}
		table.addMouseListener(new MouseListener() {

			@Override
			public void mouseUp(MouseEvent arg0) {
				// do nothing
			}

			@Override
			public void mouseDown(MouseEvent arg0) {
				// do nothing
			}

			@Override
			public void mouseDoubleClick(MouseEvent arg0) {
				if (table.getSelectionCount() == 1) {
					publishMap();
				}
			}
		});
		mapColumn = new TableColumn(table, SWT.NONE);
		mapColumn.setText("DITA Map");

		dateColumn = new TableColumn(table, SWT.NONE);
		dateColumn.setText("Published");

		Listener sortListener = new Listener() {
			@Override
			public void handleEvent(Event e) {
				if (table.getSortDirection() == SWT.UP) {
					table.setSortDirection(SWT.DOWN);
				} else {
					table.setSortDirection(SWT.UP);
				}
				TableColumn column = (TableColumn) e.widget;
				table.setSortColumn(column);
				if (column == mapColumn) {
					sortField = 0;
				}
				if (column == dateColumn) {
					sortField = 1;
				}
				try {
					loadPublications();
				} catch (JSONException | IOException ex) {
					MessageBox box = new MessageBox(shell, SWT.ICON_ERROR | SWT.OK);
					box.setMessage(ex.getMessage());
				}
			}
		};

		mapColumn.addListener(SWT.Selection, sortListener);
		dateColumn.addListener(SWT.Selection, sortListener);

		table.setSortColumn(mapColumn);
		table.setDragDetect(true);
		table.setSortDirection(SWT.UP);

		int operations = DND.DROP_MOVE | DND.DROP_COPY | DND.DROP_LINK | DND.DROP_DEFAULT;
		DropTarget target = new DropTarget(table, operations);
		final FileTransfer fileTransfer = FileTransfer.getInstance();
		Transfer[] types = new Transfer[] { fileTransfer };
		target.setTransfer(types);

		target.addDropListener(new DropTargetListener() {

			@Override
			public void dragEnter(DropTargetEvent arg0) {
				// do nothing
			}

			@Override
			public void dragLeave(DropTargetEvent arg0) {
				// do nothing
			}

			@Override
			public void dragOperationChanged(DropTargetEvent arg0) {
				// do nothing
			}

			@Override
			public void dragOver(DropTargetEvent arg0) {
				// do nothing
			}

			@Override
			public void drop(DropTargetEvent event) {
				if (FileTransfer.getInstance().isSupportedType(event.currentDataType)) {
					String[] data = (String[]) event.data;
					for (int i = 0; i < data.length; i++) {
						try {
							File f = new File(data[i]);
							SAXBuilder builder = new SAXBuilder();
							builder.setEntityResolver(new Catalog(Conversa.getCatalogFile()));
							Document doc = builder.build(f.toURI().toURL());
							Element root = doc.getRootElement();
							if (ditaClass(root, "map/map")) {
								ConversionDialog dialog = new ConversionDialog(shell, SWT.DIALOG_TRIM);
								dialog.setMap(f);
								dialog.show();
							}
						} catch (Exception e) {
							// do nothing
						}
					}
				}
			}

			@Override
			public void dropAccept(DropTargetEvent arg0) {
				// do nothing
			}
		});

		Menu menu = new Menu(table);
		table.setMenu(menu);

		MenuItem remove = new MenuItem(menu, SWT.PUSH);
		remove.setText("Remove Publication");
		remove.addSelectionListener(new SelectionAdapter() {
			@Override
			public void widgetSelected(SelectionEvent event) {
				if (table.getSelectionCount() == 1) {
					try {
						Publication p = (Publication) table.getSelection()[0].getData("publication");
						Conversa.getController().removePublication(p);
						loadPublications();
					} catch (JSONException | IOException e) {
						MessageBox box = new MessageBox(shell, SWT.ICON_ERROR | SWT.OK);
						box.setMessage(e.getMessage());
					}
				}
			}
		});

		try {
			loadPublications();
		} catch (JSONException | IOException e) {
			MessageBox box = new MessageBox(shell, SWT.ICON_ERROR | SWT.OK);
			box.setMessage(e.getMessage());
		}
	}

	protected void fixColumns() {
		if (table != null) {
			Rectangle area = table.getClientArea();
			mapColumn.setWidth(area.width * 66 / 100);
			int vbar = 0;
			ScrollBar vscroll = table.getVerticalBar();
			if (vscroll != null && vscroll.isVisible()) {
				vbar = vscroll.getSize().x;
			}
			dateColumn.setWidth(area.width - mapColumn.getWidth() - vbar);
		}
	}

	private void createMenu(Menu bar) {
		MenuItem file = new MenuItem(bar, SWT.CASCADE);
		file.setText("&File");
		Menu fileMenu = new Menu(file);
		file.setMenu(fileMenu);

		MenuItem publish = new MenuItem(fileMenu, SWT.PUSH);
		publish.setText("Publish DITA Map");
		publish.setImage(Conversa.getResourcemanager().getPaper());
		publish.addSelectionListener(new SelectionAdapter() {
			@Override
			public void widgetSelected(SelectionEvent event) {
				publishMap();
			}

		});

		if (!isMac) {

			new MenuItem(fileMenu, SWT.SEPARATOR);

			MenuItem close = new MenuItem(fileMenu, SWT.PUSH);
			if (File.separator.equals("\\")) {
				close.setText("Exit\tAlt + F4");
				close.setAccelerator(SWT.ALT | SWT.F4);
			} else {
				close.setText("Quit\tCtrl + Q");
				close.setAccelerator(SWT.CTRL | 'Q');
			}
			close.addSelectionListener(new SelectionAdapter() {
				@Override
				public void widgetSelected(SelectionEvent event) {
					shell.close();
				}
			});

			MenuItem settings = new MenuItem(bar, SWT.CASCADE);
			settings.setText("&Settings");
			Menu settingsMenu = new Menu(settings);
			settings.setMenu(settingsMenu);

			MenuItem preferences = new MenuItem(settingsMenu, SWT.PUSH);
			preferences.setText("Preferences");
			preferences.setImage(Conversa.getResourcemanager().getGear());
			preferences.addSelectionListener(new SelectionAdapter() {
				@Override
				public void widgetSelected(SelectionEvent e) {
					PreferencesDialog dialog = new PreferencesDialog(shell, SWT.CLOSE | SWT.RESIZE);
					dialog.show();
				}
			});

		}

		MenuItem help = new MenuItem(bar, SWT.CASCADE);
		help.setText("&Help");
		Menu helpMenu = new Menu(help);
		help.setMenu(helpMenu);

		MenuItem pdfHelp = new MenuItem(helpMenu, SWT.PUSH);
		pdfHelp.setText("Conversa User Guide\tF1");
		pdfHelp.setAccelerator(SWT.F1);
		pdfHelp.addSelectionListener(new SelectionAdapter() {
			@Override
			public void widgetSelected(SelectionEvent event) {
				try {
					Program.launch(new File("docs/conversa.pdf").toURI().toURL().toString());
				} catch (MalformedURLException e) {
					LOGGER.log(Level.ERROR, "Error opening help", e);
					MessageBox box = new MessageBox(shell, SWT.ICON_WARNING | SWT.OK);
					box.setMessage("There was an error opening help file.");
					box.open();
				}
			}
		});

		MenuItem ditacHelp = new MenuItem(helpMenu, SWT.PUSH);
		ditacHelp.setText("XMLmind DITA Converter Manual");
		ditacHelp.addSelectionListener(new SelectionAdapter() {
			@Override
			public void widgetSelected(SelectionEvent event) {
				try {
					Program.launch(new File("docs/manual.pdf").toURI().toURL().toString());
				} catch (MalformedURLException e) {
					LOGGER.log(Level.ERROR, "Error opening help", e);
					MessageBox box = new MessageBox(shell, SWT.ICON_WARNING | SWT.OK);
					box.setMessage("There was an error opening help file.");
					box.open();
				}
			}
		});

		new MenuItem(helpMenu, SWT.SEPARATOR);

		MenuItem updatesItem = new MenuItem(helpMenu, SWT.PUSH);
		updatesItem.setText("Check for Updates");
		updatesItem.addSelectionListener(new SelectionAdapter() {
			@Override
			public void widgetSelected(SelectionEvent event) {
				checkUpdates(false);
			}
		});

		MenuItem releaseHistory = new MenuItem(helpMenu, SWT.PUSH);
		releaseHistory.setText("Conversa Release History");
		releaseHistory.addSelectionListener(new SelectionAdapter() {
			@Override
			public void widgetSelected(SelectionEvent event) {
				Program.launch("http://www.maxprograms.com/products/conversalog.html");
			}
		});

		if (!isMac) {
			new MenuItem(helpMenu, SWT.SEPARATOR);

			MenuItem aboutItem = new MenuItem(helpMenu, SWT.PUSH);
			aboutItem.setText("About Conversa");
			aboutItem.addSelectionListener(new SelectionAdapter() {
				@Override
				public void widgetSelected(SelectionEvent e) {
					AboutBox box = new AboutBox(shell, SWT.DIALOG_TRIM);
					box.show();
				}
			});
		}

	}

	protected void publishMap() {
		ConversionDialog dialog = new ConversionDialog(shell, SWT.DIALOG_TRIM);
		if (table.getSelectionCount() == 1) {
			dialog.setPublication((Publication) table.getSelection()[0].getData("publication"));
		}
		dialog.show();
	}

	public void show() {
		Locator.position(shell, "MainView");
		shell.open();
		fixColumns();
		display.asyncExec(new Runnable() {
			@Override
			public void run() {
				checkUpdates(true);
			}
		});
		while (!shell.isDisposed()) {
			if (!display.readAndDispatch()) {
				display.sleep();
			}
		}
	}

	protected void checkUpdates(boolean silent) {
		try {
			URL url = new URL("https://www.maxprograms.com/conversa");
			URLConnection connection = url.openConnection();
			connection.setConnectTimeout(10000);
			try (InputStream input = connection.getInputStream()) {
				byte[] array = new byte[1024];
				int read = input.read(array);
				if (read > 0) {
					String version = new String(array).trim();
					if (!version.equals(Constants.VERSION + " (" + Constants.BUILD + ")")) {
						MessageBox box = new MessageBox(shell, SWT.ICON_QUESTION | SWT.YES | SWT.NO);
						MessageFormat mf = new MessageFormat("Installed version is: {0}\n"
								+ "Available version is: {1}\n" + "\n" + "Visit download site?");
						Object[] args = { Constants.VERSION + " (" + Constants.BUILD + ")", version };
						box.setMessage(mf.format(args));
						if (box.open() == SWT.YES) {
							Program.launch("http://www.maxprograms.com/downloads/");
						}
					} else {
						if (!silent) {
							MessageBox box = new MessageBox(shell, SWT.ICON_WARNING | SWT.OK);
							box.setMessage("No updates available.");
							box.open();
						}
					}
				} else {
					if (!silent) {
						MessageBox box = new MessageBox(shell, SWT.ICON_INFORMATION | SWT.OK);
						box.setMessage("Unable to check for updates.");
						box.open();
					}
				}
			}
		} catch (Exception e) {
			if (!silent) {
				MessageBox box = new MessageBox(shell, SWT.ICON_WARNING | SWT.OK);
				box.setMessage("Unable to check for updates.");
				box.open();
			}
		}
	}

	static MenuItem getItem(Menu menu, int id) {
		MenuItem[] items = menu.getItems();
		for (int i = 0; i < items.length; i++) {
			if (items[i].getID() == id)
				return items[i];
		}
		return null;
	}

	public void loadPublications() throws JSONException, IOException {
		Cursor arrow = shell.getCursor();
		Cursor wait = new Cursor(display, SWT.CURSOR_WAIT);
		shell.setCursor(wait);
		display.update();
		List<Publication> publications = Conversa.getController().getPublications();

		Publication[] array = publications.toArray(new Publication[publications.size()]);
		final Collator collator = Collator.getInstance(Locale.getDefault());
		Arrays.sort(array, new Comparator<Publication>() {

			@Override
			public int compare(Publication o1, Publication o2) {
				if (table.getSortDirection() == SWT.UP) {
					if (sortField == 0) {
						return collator.compare(o1.getDitamap().toLowerCase(Locale.getDefault()),
								o2.getDitamap().toLowerCase(Locale.getDefault()));
					}
					return o1.getLastPublished().compareTo(o2.getLastPublished());

				}
				if (sortField == 0) {
					return collator.compare(o2.getDitamap().toLowerCase(Locale.getDefault()),
							o1.getDitamap().toLowerCase(Locale.getDefault()));
				}
				return o2.getLastPublished().compareTo(o1.getLastPublished());
			}
		});

		table.removeAll();
		SimpleDateFormat dformat = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		for (int i = 0; i < array.length; i++) {
			Publication p = array[i];
			TableItem item = new TableItem(table, SWT.NONE);
			item.setText(new String[] { p.getDitamap(), dformat.format(p.getLastPublished()) });
			item.setData("publication", p);
		}

		shell.setCursor(arrow);
		wait.dispose();
	}

	protected static boolean ditaClass(Element e, String string) {
		String cls = e.getAttributeValue("class", ""); //$NON-NLS-1$ //$NON-NLS-2$
		String[] parts = cls.split("\\s"); //$NON-NLS-1$
		for (int i = 0; i < parts.length; i++) {
			if (parts[i].equals(string)) {
				return true;
			}
		}
		return false;
	}
}
