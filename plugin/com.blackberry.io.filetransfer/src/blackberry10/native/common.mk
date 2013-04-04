ifndef QCONFIG
QCONFIG=qconfig.mk
endif
include $(QCONFIG)

NAME=filetransfer
PLUGIN=yes

include ../../../../../../meta.mk

SRCS+=filetransfer_curl.cpp \
      filetransfer_js.cpp

LIBS+=bps curl

include $(MKFILES_ROOT)/qtargets.mk
