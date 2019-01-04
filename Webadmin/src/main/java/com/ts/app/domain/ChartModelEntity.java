package com.ts.app.domain;

import java.util.List;

public class ChartModelEntity {

    private List<String> x;
    private List<Status> status;
    private List<AverageStatus> avgStatus;

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

	public List<AverageStatus> getAvgStatus() {
		return avgStatus;
	}

	public void setAvgStatus(List<AverageStatus> avgStatus) {
		this.avgStatus = avgStatus;
	}
}
