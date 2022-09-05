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

import org.eclipse.swt.SWT;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.widgets.Shell;

import com.maxprograms.conversa.Conversa;
import com.maxprograms.utils.Locator;
import com.maxprograms.widgets.CustomLink;

public class Licenses {

    protected Shell shell;
    private Display display;

    public Licenses(Shell parent, int style) {
        shell = new Shell(parent, style);
        shell.setText("Licenses");
        display = shell.getDisplay();
        shell.setLayout(new GridLayout(2, false));
        if (File.separator.equals("\\")) {
            shell.setImage(Conversa.getResourcemanager().getWinLogo());
        } else if (System.getProperty("os.name").toLowerCase().startsWith("mac")) {
            shell.setImage(Conversa.getResourcemanager().getMacLogo());
        } else {
            shell.setImage(Conversa.getResourcemanager().getLinuxLogo());
        }
        shell.addListener(SWT.Close, event -> Locator.remember(shell, "Licenses"));

        Label conversa = new Label(shell, SWT.NONE);
        conversa.setText("Conversa DITA Publisher");

        CustomLink conversaLink = new CustomLink(shell, SWT.NONE);
        conversaLink.setText("MIT License");
        conversaLink.setURL(new File("lib/licenses/conversa.txt").getAbsolutePath());

        Label ditac = new Label(shell, SWT.NONE);
        ditac.setText("DITA Converter");

        CustomLink ditacLink = new CustomLink(shell, SWT.NONE);
        ditacLink.setText("Mozilla Public License, version 2.0");
        ditacLink.setURL(new File("LEGAL/MPL-2.0.html").getAbsolutePath());

        Label java = new Label(shell, SWT.NONE);
        java.setText("Java Runtime Environment");

        CustomLink javaLink = new CustomLink(shell, SWT.NONE);
        javaLink.setText("GPL2 With Classpath Exception");
        javaLink.setURL(new File("lib/licenses/java.html").getAbsolutePath());

        Label swt = new Label(shell, SWT.NONE);
        swt.setText("SWT");

        CustomLink swtLink = new CustomLink(shell, SWT.NONE);
        swtLink.setText("Eclipse Public License Version 1.0");
        swtLink.setURL(new File("lib/licenses/EclipsePublicLicense1.0.html").getAbsolutePath());

        Label openxliff = new Label(shell, SWT.NONE);
        openxliff.setText("OpenXLIFF");

        CustomLink openxliffLink = new CustomLink(shell, SWT.NONE);
        openxliffLink.setText("Eclipse Public License Version 1.0");
        openxliffLink.setURL(new File("lib/licenses/EclipsePublicLicense1.0.html").getAbsolutePath());

        Label resolver = new Label(shell, SWT.NONE);
        resolver.setText("Apache XML Resolver");

        CustomLink resolverLink = new CustomLink(shell, SWT.NONE);
        resolverLink.setText("Apache License 2.0");
        resolverLink.setURL(new File("lib/licenses/Apache2.0.html").getAbsolutePath());

        Label saxon = new Label(shell, SWT.NONE);
        saxon.setText("Saxon HE");

        CustomLink saxonLink = new CustomLink(shell, SWT.NONE);
        saxonLink.setText("Mozilla Public License, version 2.0");
        saxonLink.setURL(new File("LEGAL/MPL-2.0.html").getAbsolutePath());

        Label whc = new Label(shell, SWT.NONE);
        whc.setText("Web Help Compiler");

        CustomLink whcLink = new CustomLink(shell, SWT.NONE);
        whcLink.setText("MIT License");
        whcLink.setURL(new File("LEGAL/whc.LICENSE").getAbsolutePath());

        Label xslthl = new Label(shell, SWT.NONE);
        xslthl.setText("XSLT Syntax Highlighting");

        CustomLink xslthlLink = new CustomLink(shell, SWT.NONE);
        xslthlLink.setText("zlib/libpng License");
        xslthlLink.setURL(new File("LEGAL/xslthl.LICENSE").getAbsolutePath());

        Label fop = new Label(shell, SWT.NONE);
        fop.setText("Apache FOP 2.7");

        CustomLink fopLink = new CustomLink(shell, SWT.NONE);
        fopLink.setText("Apache License 2.0");
        fopLink.setURL(new File("lib/licenses/Apache2.0.html").getAbsolutePath());

        Label mapDB = new Label(shell, SWT.NONE);
        mapDB.setText("MapDB");

        CustomLink mapdbLink = new CustomLink(shell, SWT.NONE);
        mapdbLink.setText("Apache License 2.0");
        mapdbLink.setURL(new File("lib/licenses/Apache2.0.html").getAbsolutePath());

        Label relaxng = new Label(shell, SWT.NONE);
        relaxng.setText("Jing");

        CustomLink relaxngLink = new CustomLink(shell, SWT.NONE);
        relaxngLink.setText("Jing Copying Conditions");
        relaxngLink.setURL(new File("LEGAL/relaxng.LICENSE").getAbsolutePath());

        Label snowball = new Label(shell, SWT.NONE);
        snowball.setText("Snowball");

        CustomLink snowballLink = new CustomLink(shell, SWT.NONE);
        snowballLink.setText("BSD License");
        snowballLink.setURL(new File("LEGAL/snowball.LICENSE").getAbsolutePath());

        Label flexmark = new Label(shell, SWT.NONE);
        flexmark.setText("flexmark-java");

        CustomLink flexMarkLink = new CustomLink(shell, SWT.NONE);
        flexMarkLink.setText("BSD License");
        flexMarkLink.setURL(new File("LEGAL/flexmark.LICENSE").getAbsolutePath());

        shell.pack();
    }

    public void show() {
        Locator.setLocation(shell, "Licenses");
        shell.open();
        while (!shell.isDisposed()) {
            if (!display.readAndDispatch()) {
                display.sleep();
            }
        }
    }
}