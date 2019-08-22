#!/bin/bash

cd "$(dirname "$0")/"

OPTIONS=" -Xmx1500m"
CLASSPATH="lib/conversa.jar:lib/ditac.jar:lib/dtd.jar:lib/flexmark.jar:lib/json.jar:lib/jsoup-1.11.3.jar:lib/mapdb.jar:lib/openxliff.jar:lib/relaxng.jar:lib/resolver.jar:lib/saxon9.jar:lib/snowball.jar:lib/whcmin.jar:lib/xslthl:lib/gtk64/swt.jar"
JAVA=./jre/bin/java

${JAVA} ${OPTIONS} -cp ${CLASSPATH} com.maxprograms.conversa.Conversa