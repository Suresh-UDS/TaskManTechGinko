package com.ts.app.domain;


import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "feedback_questions")
//@Cacheable(true)
//@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class FeedbackQuestion extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    @Column(name = "id")
    private long id;

    @Column(name = "question")
    private String question;

    @Column(name = "remarks_required")
    private boolean remarksRequired;

    @Column(name = "answer_type")
    private FeedbackAnswerType answerType;

    @ManyToOne()
    @JoinColumn(name = "feedback_id")
    private Feedback feedback;

    @Column(name = "score_type")
    private String scoreType;

    @Column(name ="image")
    private String image;

    @Column(name="remarks")
    private String remarks;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

	public Feedback getFeedback() {
		return feedback;
	}

	public void setFeedback(Feedback feedback) {
		this.feedback = feedback;
	}

	public FeedbackAnswerType getAnswerType() {
		return answerType;
	}

	public void setAnswerType(FeedbackAnswerType answerType) {
		this.answerType = answerType;
	}

	public String getScoreType() {
		return scoreType;
	}

	public void setScoreType(String scoreType) {
		this.scoreType = scoreType;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }


    public boolean isRemarksRequired() {
        return remarksRequired;
    }

    public void setRemarksRequired(boolean remarksRequired) {
        this.remarksRequired = remarksRequired;
    }
}
