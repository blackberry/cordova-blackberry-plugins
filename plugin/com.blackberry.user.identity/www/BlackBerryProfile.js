/*
 * Copyright 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
var _self = {},
    _ID = "com.blackberry.user.identity.blackberry.profile";

function defineReadOnlyField(obj, field, value) {
    Object.defineProperty(obj, field, {
        "value": value,
        "writable": false
    });
}


/*
 * Define constants for type constants
 */

/*
 * The identity provider name for BlackBerry Profile.
 */
defineReadOnlyField(_self, "BBPROFILE_PROVIDER_NAME", "ids:rim:profile");

/*
 * Application-scoped profile data
 * Entries stored with this type are access protected to allow
 * only the creating application access to the data. No other application
 * is able to retrieve, modify, delete or list the values. If the
 * same application is installed on another device with the same user, it
 * will have access to the data. This creates a private-store of data for 
 * the application that is accessible only from the specific application 
 * on any device with the same BlackBerry ID user logged in.
 */
defineReadOnlyField(_self, "PROFILE_TYPE_APP", "1");

/*
 * Vendor-scoped profile data.
 * Entries stored with this type are access protected to allow
 * all applications developed by the same vendor access to the data. No
 * other vendor's applications will be able to retrieve, modify, delete or
 * list the values. If there are several applications installed on a device
 * from the same vendor, they will all have access to these values. If 
 * apps from the same vendor are installed on another device, and the same 
 * BlackBerry ID user is logged in to that device, all apps from that 
 * vendor will have access to the data. This creates a vendor 
 * private-store of data that is accessible only from the specific 
 * vendor's applications on any device with the same BlackBerry ID user 
 * logged in.
 */
defineReadOnlyField(_self, "PROFILE_TYPE_VENDOR", "2");

/*
 * Default creation flags
 * No options specified, and the creation will follow the default
 * behavior where no caching and no extra encryption will be performed for
 * the new entry.
 */
defineReadOnlyField(_self, "CREATE_DATA_DEFAULT", "0");

/*
 * Device-To-Device encryption, dynamic keys, no user involvement
 * To have additional encryption performed on the data prior to
 * being stored remotely. Data is encrypted with dynamically generated keys
 * shared between devices using the same BlackBerry ID user. Only devices
 * with the same user will have the keys to decrypt this data.  The keys
 * are shared between devices and not included in backups or transferred as
 * part of device swap, so if a user only has one device, and it is lost,
 * the keys are not recoverable, and any remote data stored with this
 * encryption will be non-recoverable. Performing a "Security Wipe" will
 * retain the keys and the stored data is recoverable if the same user
 * logs back into the device. If the user has multiple devices,
 * and are data enabled, the devices with the same BlackBerry ID user will
 * exchange the keys securely so that all of them can store and retrieve
 * the data stored with this encryption. Operations will return
 * @c IDS_NOT_READY while the encryption keys are exchanged; the app can
 * repeat the request after a short wait to avoid failures during this one
 * time key exchange window.
 * 
 */
defineReadOnlyField(_self, "CREATE_DATA_ENCRYPT_D2D", "1");

/*
 * Enable local caching of the entry
 * Override the default behavior to enable local data caching for
 * this entry. 
 * In cases where the application may need data stored locally for quick or
 * repeated access, the value can be cached securely on the device and 
 * retrieved on demand, even when not connected to the remote storage copy.
 * The cache is synchronized with the remote copy so that the cache is 
 * always up to date while the device has appropriate data coverage.
 */
defineReadOnlyField(_self, "CREATE_DATA_CACHED", "10");

/*
 * Use the default flags for get requests
 * If options are not specified, the get request will follow the
 * default behavior where the entry is not cached.  If the entry is already
 * being cached, this flag will not disable caching.
 */
defineReadOnlyField(_self, "GET_DATA_DEFAULT", "0");

/*
 * Enable local caching of the entry
 * Override the default behavior to enable local data caching for
 * this entry. 
 * In cases where the application may need data stored locally for quick or
 * repeated access, the value can be cached securely on the device and 
 * retrieved on demand, even when not connected to the remote storage copy.
 * The cache is synchronized with the remote copy so that the cache is 
 * always up to date while the device has appropriate data coverage.
 */
defineReadOnlyField(_self, "GET_DATA_CACHED", "1");

/*
 * Use the default flags for set requests
 * If options are not specified, the update process will follow
 * the default behavior where the entry is not cached.  If the entry is
 * already being cached, this flag will not disable caching.
 */
defineReadOnlyField(_self, "SET_DATA_DEFAULT", "0");

/*
 * Enable local caching of the entry
 * Override the default behavior to enable local data caching for
 * this entry. 
 * In cases where the application may need data stored locally for quick or
 * repeated access, the value can be cached securely on the device and 
 * retrieved on demand, even when not connected to the remote storage copy.
 * The cache is synchronized with the remote copy so that the cache is 
 * always up to date while the device has appropriate data coverage.
 */
defineReadOnlyField(_self, "SET_DATA_CACHED", "1");

/*
 * Use the default flags for delete requests
 * If options are not specified, the deletion will follow the
 * default behavior where the specified remote entry is deleted as
 * well as the cached copy if is was cached.
 */
defineReadOnlyField(_self, "DELETE_DATA_DEFAULT", "0");

/*
 * Remove local cached copy of the entry
 * Override the default behavior to remove only the cached copy,
 * but leave the remote copy unchanged. 
 * In cases where the application may need data stored locally for quick 
 * or repeated access, the value can be cached securely on the device and 
 * retrieved on demand, even when not connected to the remote storage copy.
 * The cache is synchronized with the remote copy so that the cache is 
 * always up to date while the device has appropriate data coverage.
 */
defineReadOnlyField(_self, "DELETE_DATA_CACHE_ONLY", "1");

/*
 * Delete all entries under profile type
 * Removes all the entries for the given type. The name 
 * specified must be empty when using this flag. To avoid accidental 
 * removal of shared entries, use type PROFILE_TYPE_VENDOR, which does
 * not allow this flag.
 */
defineReadOnlyField(_self, "DELETE_DATA_CACHE_ALL", "2");

/*
 * Default list flags
 * If options are not specified, the list process will follow the
 * default behavior of listing the remotely available entries.
 */
defineReadOnlyField(_self, "LIST_DATA_DEFAULT", "0");


/*
 * Notifications will now be sent for this entry
 * The request to receive notifications was successful. Change
 * notifications will now be sent.
 */
defineReadOnlyField(_self, "NOTIFY_STARTED", "0");

/*
 * Notifications will no longer be sent for this entry
 * The request to stop receiving notifications was successful, or
 * the request to start receiving has failed. Change notifications will
 * NOT be sent.
 */
defineReadOnlyField(_self, "NOTIFY_STOPPED", "1");

/*
 * The entry has changed
 * The provider has detected that the entry has changed and is
 * notifying the application. A change can include the entry being created,
 * deleted, or modified.
 */
defineReadOnlyField(_self, "NOTIFY_CHANGED", "2");



module.exports = _self;

