package com.ts.app.domain;


import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "feedback_transaction_result")
@Cacheable(true)
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class FeedbackTransactionResult extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    @Column(name = "id")
    private long id;

    @Column(name = "question")
    private String question;

    @Column(name = "answer")
    private String answer;

    @Column(name = "answer_type")
    private FeedbackAnswerType answerType;

    @Column(name = "score_type")
    private String scoreType;

    @Column(name="remarks_required")
    private boolean remarksRequired;

    @Column(name = "remarks")
    private String remarks;

    @ManyToOne(cascade = {CascadeType.ALL}, fetch = FetchType.EAGER)
    @JoinColumn(name = "feedback_transaction_id", referencedColumnName = "id")
    private FeedbackTransaction feedbackTransaction;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public FeedbackTransaction getFeedbackTransaction() {
		return feedbackTransaction;
	}

	public void setFeedbackTransaction(FeedbackTransaction feedbackTransaction) {
		this.feedbackTransaction = feedbackTransaction;
	}

	public String getAnswer() {
		return answer;
	}

	public void setAnswer(String answer) {
		this.answer = answer;
	}

	public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

	public FeedbackAnswerType
    getAnswerType() {
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

    public boolean isRemarksRequired() {
        return remarksRequired;
    }

    public void setRemarksRequired(boolean remarksRequired) {
        this.remarksRequired = remarksRequired;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
