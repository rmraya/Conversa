@echo off

set CLASSPATH="lib\conversa.jar;lib\ditac.jar;lib\flexmark.jar;lib\json.jar;lib\openxliff.jar;lib\relaxng.jar;lib\resolver.jar;lib\saxon10.jar;lib\snowball.jar;lib\whcmin.jar;lib\xslthl;lib\swt.jar"

start .\jre\bin\javaw.exe  -cp %CLASSPATH% com.maxprograms.conversa.Conversa


