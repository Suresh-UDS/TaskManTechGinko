package com.ts.app.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Set;


@Entity
@Table(name = "feedback_transaction")
@Cacheable(true)
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class FeedbackTransaction extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    @Column(name = "id")
    private long id;

    @Column(name = "name")
    private String name;

    private String reviewerName;

    private String reviewerCode;

    private long siteId;

    private String siteName;

    private long projectId;

    private String projectName;

    private String remarks;

    @ManyToOne()
    @JoinColumn(name = "feedback_id")
    private FeedbackMapping feedback;

    @OneToMany(mappedBy = "feedbackTransaction", cascade = {CascadeType.ALL}, fetch = FetchType.EAGER, orphanRemoval=true)
    private Set<FeedbackTransactionResult> results;

    @Column(name = "block")
    private String block;

    @Column(name = "floor")
    private String floor;

    @Column(name = "zone")
    private String zone;

    private float rating;
    
    private boolean overallFeedback;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBlock() {
        return block;
    }

    public void setBlock(String block) {
        this.block = block;
    }

    public String getFloor() {
        return floor;
    }

    public void setFloor(String floor) {
        this.floor = floor;
    }

    public String getZone() {
        return zone;
    }

    public void setZone(String zone) {
        this.zone = zone;
    }

	public String getReviewerName() {
		return reviewerName;
	}

	public void setReviewerName(String reviewerName) {
		this.reviewerName = reviewerName;
	}

	public long getSiteId() {
		return siteId;
	}

	public void setSiteId(long siteId) {
		this.siteId = siteId;
	}

	public String getSiteName() {
		return siteName;
	}

	public void setSiteName(String siteName) {
		this.siteName = siteName;
	}

	public long getProjectId() {
		return projectId;
	}

	public void setProjectId(long projectId) {
		this.projectId = projectId;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public FeedbackMapping getFeedback() {
		return feedback;
	}

	public void setFeedback(FeedbackMapping feedback) {
		this.feedback = feedback;
	}

	public float getRating() {
		return rating;
	}

	public void setRating(float rating) {
		this.rating = rating;
	}

	public Set<FeedbackTransactionResult> getResults() {
		return results;
	}

	public void setResults(Set<FeedbackTransactionResult> results) {
		this.results = results;
	}

    public String getReviewerCode() {
        return reviewerCode;
    }

    public void setReviewerCode(String reviewerCode) {
        this.reviewerCode = reviewerCode;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

	public boolean isOverallFeedback() {
		return overallFeedback;
	}

	public void setOverallFeedback(boolean overallFeedback) {
		this.overallFeedback = overallFeedback;
	}
    
}
