package fct.inesctec.stayaway.tracing.internal.networking.models;

import java.util.HashMap;

class InfoBoxModelCollection extends HashMap<String, InfoBoxModel> {
    public InfoBoxModel getInfoBox(String languageKey) {
        return get(languageKey);
    }
}
