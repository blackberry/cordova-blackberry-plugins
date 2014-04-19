ifndef QCONFIG
QCONFIG=qconfig.mk
endif
include $(QCONFIG)

NAME=barcodescanner
PLUGIN=yes
UTILS=yes

include ../../../../../../meta.mk

SRCS+=barcodescanner_ndk.cpp \
      barcodescanner_js.cpp

include $(MKFILES_ROOT)/qtargets.mk

LIBS+=bb bbutility img zxing camapi QtCore

EXTRA_LIBVPATH+= \
    $(QNX_TARGET)/../target-override/$(CPUVARDIR)/usr/lib \
    $(QNX_TARGET)/../target-override/$(CPUVARDIR)/lib \
    $(NULL)
