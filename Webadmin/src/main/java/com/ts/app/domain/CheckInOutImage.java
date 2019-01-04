package com.ts.app.domain;

/**
 * Created by karth on 6/2/2017.
 */


import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "in_out_transaction_images")
public class CheckInOutImage extends AbstractAuditingEntity implements Serializable,Cloneable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employeeId", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "projectId", nullable = true)

    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "siteId", nullable = true)
    private Site site;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "jobId", nullable = true)
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "checkInOutId", nullable = false)
    private CheckInOut checkInOut;

    private String photoOut;

    private String photoIn;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Site getSite() {
        return site;
    }

    public void setSite(Site site) {
        this.site = site;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Job getJob() {
        return job;
    }

    public void setJob(Job job) {
        this.job = job;
    }

    public CheckInOut getCheckInOut() {
        return checkInOut;
    }

    public void setCheckInOut(CheckInOut checkInOut) {
        this.checkInOut = checkInOut;
    }

    public String getPhotoOut() {
        return photoOut;
    }

    public void setPhotoOut(String photoOut) {
        this.photoOut = photoOut;
    }

    public String getPhotoIn() {
        return photoIn;
    }

    public void setPhotoIn(String photoIn) {
        this.photoIn = photoIn;
    }
}
