package com.ts.app.domain;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.List;

public class Series {

    private String name;
    private List<Integer> data;
    private JSONObject marker;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Integer> getData() {
        return data;
    }

    public void setData(List<Integer> data) {
        this.data = data;
    }

    public JSONObject getMarker() {
        return marker;
    }

    public void setMarker(JSONObject marker) {
        this.marker = marker;
    }
}
