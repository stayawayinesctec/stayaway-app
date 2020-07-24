/*
 * Copyright (c) 2020 INESC TEC <https://www.inesctec.pt>
 *
 * This Source Code Form is subject to the terms of the European Union
 * Public License, v. 1.2. If a copy of the EUPL was not distributed with
 * this file, You can obtain one at https://opensource.org/licenses/EUPL-1.2.
 *
 * SPDX-License-Identifier: EUPL-1.2
 */

package fct.inesctec.stayaway.tracing.internal.networking.models;

public class ConfigResponseModel {
    private AppVersionModel versions;
    private ParametersModel parameters;
    private String message;

    public ConfigResponseModel(AppVersionModel versions, ParametersModel parameters, String message) {
        this.versions = versions;
        this.parameters = parameters;
        this.message = message;
    }

    public AppVersionModel getVersions() {
        return versions;
    }
    public VersionModel getAndroidVersion() {
        return versions.getAndroidVersion();
    }
    public VersionModel getIOSVersion() {
        return versions.getIOSVersion();
    }

    public String getMessage() {
        return message;
    }

    public ParametersModel getParameters() {
        return parameters;
    }
}
