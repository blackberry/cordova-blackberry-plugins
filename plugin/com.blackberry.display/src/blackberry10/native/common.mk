ifndef QCONFIG
QCONFIG=qconfig.mk
endif
include $(QCONFIG)

NAME=display
PLUGIN=yes
UTILS=yes

include ../../../../../../meta.mk

SRCS+=preventSleep_js.cpp \
      preventSleep_ndk.cpp

include $(MKFILES_ROOT)/qtargets.mk
