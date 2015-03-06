include ../../common.mk

filetransfer_curl.o: qnxcurl.h

qnxcurl.h: .FORCE
	rm -f qnxcurl.h
	$(CC) ../../testcurl.c 2> /dev/null && touch qnxcurl.h || cp ../../qnxcurlstub.h qnxcurl.h
	rm -f a.out

.FORCE:
