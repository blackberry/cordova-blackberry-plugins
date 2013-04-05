ifndef QCONFIG
QCONFIG=qconfig.mk
endif
include $(QCONFIG)

NAME=pushjnext
PLUGIN=yes
UTILS=yes

include ../../../../../../meta.mk

SRCS+=push_js.cpp \
      push_ndk.cpp \
	  ConnectionTimerThread.cpp

include $(MKFILES_ROOT)/qtargets.mk

LIBS+=PushService