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
    private InfoBoxModelCollection infoBox;

    public ConfigResponseModel(AppVersionModel versions, ParametersModel parameters, InfoBoxModelCollection infoBox) {
        this.versions = versions;
        this.parameters = parameters;
        this.infoBox = infoBox;
    }

    public VersionModel getVersion() {
        return versions.getAndroidVersion();
    }

    public InfoBoxModelCollection getInfoBox() {
        return infoBox;
    }

    public InfoBoxModel getInfoBox(String languageKey) {
        if (infoBox == null) return null;
        return infoBox.getInfoBox(languageKey);
    }

    public ParametersModel getParameters() {
        return parameters;
    }
}
