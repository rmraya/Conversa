#!/bin/bash

cd "$(dirname "$0")/"

bin/java -XstartOnFirstThread --module-path lib -m conversa/com.maxprograms.conversa.Conversa $@

