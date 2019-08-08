package com.ts.app.domain;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "sap_business_categories")
public class SapBusinessCategories extends AbstractAuditingEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String elementsJson;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getElementsJson() {
        return elementsJson;
    }

    public void setElementsJson(String elementsJson) {
        this.elementsJson = elementsJson;
    }
}
