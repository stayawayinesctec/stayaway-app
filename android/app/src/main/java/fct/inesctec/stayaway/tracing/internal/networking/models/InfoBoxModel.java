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
