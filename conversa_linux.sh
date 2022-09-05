#!/bin/sh

cd "$(dirname "$0")/"

OPTIONS=" -Xmx1500m "
CLASSPATH="lib/conversa.jar:lib/ditac.jar:lib/flexmark.jar:lib/json.jar:lib/jsoup.jar:lib/openxliff.jar:lib/relaxng.jar:lib/resolver.jar:lib/saxon10.jar:lib/snowball.jar:lib/whcmin.jar:lib/xslthl:lib/swt.jar"
export JAVA_HOME="$PWD/jre/"
JAVA="$JAVA_HOME/bin/java"

${JAVA} ${OPTIONS} -cp ${CLASSPATH} com.maxprograms.conversa.Conversa