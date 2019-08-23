@echo off

set CLASSPATH="lib\conversa.jar;lib\ditac.jar;lib\flexmark.jar;lib\mapdb.jar;lib\openxliff.jar;lib\relaxng.jar;lib\resolver.jar;lib\saxon9.jar;lib\snowball.jar;lib\whcmin.jar;lib\xslthl;lib\win64\swt.jar"

start .\jre\bin\javaw.exe  -cp %CLASSPATH% com.maxprograms.conversa.Conversa


