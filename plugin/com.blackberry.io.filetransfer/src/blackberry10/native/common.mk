ifndef QCONFIG
QCONFIG=qconfig.mk
endif
include $(QCONFIG)

NAME=filetransfer
PLUGIN=yes
UTILS=yes

include ../../../../../../meta.mk

EXTRA_SRCVPATH+=../../../../../../ui.dialog/native

 SRCS+=filetransfer_curl.cpp \
      filetransfer_js.cpp \
      ../../../../../../com.blackberry.ui.dialog/src/blackberry10/native/dialog_bps.cpp

EXTRA_INCVPATH+=../../../../../../com.blackberry.ui.dialog/src/blackberry10/native

LIBS+=bps curl

include $(MKFILES_ROOT)/qtargets.mk
