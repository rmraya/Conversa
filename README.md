# Conversa DITA Publisher

![alt text](https://www.maxprograms.com/images/conversa.png "Conversa DITA Publisher")
**Conversa** is an open source graphical user interface for  **DITA Converter** (ditac) from [XMLmind](http://www.xmlmind.com/ditac/) that you can use to easily publish your DITA projects in multiple formats.

Conversa works right out of the box. Just install it and generate PDF, HTML, EPUB or Web Help from your DITA files using the default configuration.

The output formats supported by Conversa are:

- PDF
- HTML
- EPUB 2 & 3
- PostScript
- Eclipse Help
- Web Help & Web Help with HTML5
- HTML Help
- XSL-FO
- RTF
- DOCX
- ODT

## Installers

Ready to use installers are available at [https://www.maxprograms.com/products/conversa.html](https://www.maxprograms.com/products/conversa.html)

## Building Yourself

You need Java 17 and Apache Ant 1.10.12 or newer

- Checkout this repository
- Point your JAVA_HOME variabe to JDK 17
- Copy the appropriate version of `swt.jar` from `/SWT` folder to `/lib`
- Download `ditac plus fop` package from [http://xmlmind.com/ditac/download.shtml](http://xmlmind.com/ditac/download.shtml)
- Unzip the downloaded package into a folder named `ditac`
- Run `ant compile` to recompile the source code if you made changes
- Get a JRE (Java Runtme Environment) from [Adoptium](https://adoptium.net/) and save it in a folder named `jre`

Use the `.bat` or `.sh` launchers included in the project to run Conversa.
