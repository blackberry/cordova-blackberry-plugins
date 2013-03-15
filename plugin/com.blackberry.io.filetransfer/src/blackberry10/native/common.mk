ifndef QCONFIG
QCONFIG=qconfig.mk
endif
include $(QCONFIG)

NAME=filetransfer
PLUGIN=yes

include ../../../../../../meta.mk

EXTRA_SRCVPATH+=../../../../ui.dialog/native

SRCS+=filetransfer_curl.cpp \
      filetransfer_js.cpp \
      ../../../../ui.dialog/native/dialog_bps.cpp

EXTRA_INCVPATH+=../../../../ui.dialog/native

LIBS+=bps curl

include $(MKFILES_ROOT)/qtargets.mk
