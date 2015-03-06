#include <curl/curl.h>
#ifdef CURL_ISOCPP
#define CURL_CINIT(na,t,nu) CURLOPT_ ## na = CURLOPTTYPE_ ## t + nu
#else
/* The macro "##" is ISO C, we assume pre-ISO C doesn't support it. */
#define CURL_CINIT(name,type,number) CURLOPT_/**/name = type + number
#endif

typedef enum {
    CURL_CINIT(QNX_PROXYINFO_, LONG, 10000)
} CURLoption_qnx_proxyinfo;

#define CURLOPT_QNX_PROXYINFO (CURLoption)CURLOPT_QNX_PROXYINFO_
