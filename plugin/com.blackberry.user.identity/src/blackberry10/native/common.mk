ifndef QCONFIG
QCONFIG=qconfig.mk
endif
include $(QCONFIG)

NAME=idsext
PLUGIN=yes
UTILS=yes

include ../../../../../../meta.mk

SRCS+=ids_js.cpp
      

include $(MKFILES_ROOT)/qtargets.mk

LIBS+=ids
