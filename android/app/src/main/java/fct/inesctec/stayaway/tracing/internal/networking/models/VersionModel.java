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

public class VersionModel {
    private String name;
    private String build;

    public VersionModel(String name, String build) {
        this.name = name;
        this.build = build;
    }

    public String getName() {
        return name;
    }
    public String getBuild() {
        return build;
    }
}
