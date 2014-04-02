ifndef QCONFIG
QCONFIG=qconfig.mk
endif
include $(QCONFIG)

NAME=screenshot
PLUGIN=yes
UTILS=yes

include ../../../../../../meta.mk

SRCS+=screenshot_ndk.cpp \
      screenshot_js.cpp \
      Logger.cpp

include $(MKFILES_ROOT)/qtargets.mk

LIBS+=bb bbutility jpeg png img QtCore

EXTRA_LIBVPATH+= \
    $(QNX_TARGET)/$(CPUVARDIR)/usr/lib/qt4/lib \
    $(QNX_TARGET)/../target-override/$(CPUVARDIR)/usr/lib \
    $(QNX_TARGET)/../target-override/$(CPUVARDIR)/lib \
    $(NULL)

