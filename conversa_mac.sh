#!/bin/sh

cd "$(dirname "$0")/"

OPTIONS=" -Xmx1500m -Xdock:name=Conversa -XstartOnFirstThread "
CLASSPATH="lib/conversa.jar:lib/ditac.jar:lib/flexmark.jar:lib/mapdb.jar:lib/openxliff.jar:lib/relaxng.jar:lib/resolver.jar:lib/saxon10.jar:lib/snowball.jar:lib/whcmin.jar:lib/xslthl:lib/mac64/swt.jar"
export JAVA_HOME="$PWD/jre/Contents/Home"
JAVA="$JAVA_HOME/bin/java"

${JAVA} ${OPTIONS} -cp ${CLASSPATH} com.maxprograms.conversa.Conversa