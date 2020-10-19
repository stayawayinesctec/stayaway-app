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

public class InfoBoxModel {
    private String id;
    private String title;
    private String text;
    private String url;

    public InfoBoxModel(String id, String title, String text, String url) {
        this.id = id;
        this.title = title;
        this.text = text;
        this.url = url;
    }

    public String getId() { return id; }

    public String getTitle() {
        return title;
    }

    public String getText() {
        return text;
    }

    public String getUrl() {
        return url;
    }
}
