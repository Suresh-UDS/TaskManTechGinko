package com.ts.app.web.rest.dto;


import javax.validation.constraints.Size;

/**
 * A DTO representing a Device
 */
public class DeviceDTO extends BaseDTO {



    @Size(min = 1, max = 50)
    private String uniqueId;

    private long id;

    private String active;

    private String imei;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getUniqueId() {
		return uniqueId;
	}

	public void setUniqueId(String uniqueId) {
		this.uniqueId = uniqueId;
	}

    public void setImei(String imei) { this.imei = imei; }

    public String getImei() {return imei;}

	public String getActive() {
		return active;
	}

	public void setActive(String active) {
		this.active = active;
	}

	public DeviceDTO() {
    }




    @Override
    public String toString() {
        return "DeviceDTO{" +
           
            "uniqueId='" + uniqueId + '\'' +
            ", imei='" + imei + '\'' +

            "}";
    }
}
