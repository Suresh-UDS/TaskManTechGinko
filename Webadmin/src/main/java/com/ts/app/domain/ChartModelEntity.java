package com.ts.app.domain;

import java.util.List;

public class ChartModelEntity {

    private List<String> x;
    private List<Status> status;

    public List<String> getX() {
        return x;
    }

    public void setX(List<String> x) {
        this.x = x;
    }

    public List<Status> getStatus() {
        return status;
    }

    public void setStatus(List<Status> status) {
        this.status = status;
    }
}
