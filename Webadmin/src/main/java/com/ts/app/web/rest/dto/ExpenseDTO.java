package com.ts.app.web.rest.dto;

import com.ts.app.domain.CategoryWiseExpense;
import com.ts.app.domain.ExpenseDocument;
import com.ts.app.domain.PaymentType;

import java.io.Serializable;
import java.sql.Date;
import java.util.List;

public class ExpenseDTO extends BaseDTO implements Serializable {

    private long id;

    private long siteId;

    private String siteName;

    private long projectId;

    private String projectName;

    private String description;

    private double debitAmount;

    private double creditAmount;

    private double balanceAmount;

    private String mode;

    private String currency;

    private Date expenseDate;

    private Date creditedDate;

    private String receiptNumber;

    private boolean billable;

    private boolean reimbursable;

    private PaymentType paymentType;

    private long quantity;

    private double unitPrice;

    private String expenseType;

    private String expenseCategory;

    private String documentTitle;

    private String documentFile;

    private String documentType;

    private double totalDebitAmount;

    private double totalCreditAmount;

    private double totalBalanceAmount;

    private List<ExpenseDocument> expenseDocumentList;

    private List<CategoryWiseExpense> categoryWiseExpenses;

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

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getBalanceAmount() {
        return balanceAmount;
    }

    public void setBalanceAmount(double balanceAmount) {
        this.balanceAmount = balanceAmount;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getReceiptNumber() {
        return receiptNumber;
    }

    public void setReceiptNumber(String receiptNumber) {
        this.receiptNumber = receiptNumber;
    }

    public boolean isBillable() {
        return billable;
    }

    public void setBillable(boolean billable) {
        this.billable = billable;
    }

    public boolean isReimbursable() {
        return reimbursable;
    }

    public void setReimbursable(boolean reimbursable) {
        this.reimbursable = reimbursable;
    }

    public PaymentType getPaymentType() {
        return paymentType;
    }

    public void setPaymentType(PaymentType paymentType) {
        this.paymentType = paymentType;
    }

    public long getQuantity() {
        return quantity;
    }

    public void setQuantity(long quantity) {
        this.quantity = quantity;
    }

    public double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(double unitPrice) {
        this.unitPrice = unitPrice;
    }


    public String getExpenseType() {
        return expenseType;
    }

    public void setExpenseType(String expenseType) {
        this.expenseType = expenseType;
    }

    public String getExpenseCategory() {
        return expenseCategory;
    }

    public void setExpenseCategory(String expenseCategory) {
        this.expenseCategory = expenseCategory;
    }

    public double getDebitAmount() {
        return debitAmount;
    }

    public void setDebitAmount(double debitAmount) {
        this.debitAmount = debitAmount;
    }

    public double getCreditAmount() {
        return creditAmount;
    }

    public void setCreditAmount(double creditAmount) {
        this.creditAmount = creditAmount;
    }

    public String getDocumentTitle() {
        return documentTitle;
    }

    public void setDocumentTitle(String documentTitle) {
        this.documentTitle = documentTitle;
    }

    public String getDocumentFile() {
        return documentFile;
    }

    public void setDocumentFile(String documentFile) {
        this.documentFile = documentFile;
    }

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public Date getExpenseDate() {
        return expenseDate;
    }

    public void setExpenseDate(Date expenseDate) {
        this.expenseDate = expenseDate;
    }

    public Date getCreditedDate() {
        return creditedDate;
    }

    public void setCreditedDate(Date creditedDate) {
        this.creditedDate = creditedDate;
    }

    public double getTotalDebitAmount() {
        return totalDebitAmount;
    }

    public void setTotalDebitAmount(double totalDebitAmount) {
        this.totalDebitAmount = totalDebitAmount;
    }

    public double getTotalCreditAmount() {
        return totalCreditAmount;
    }

    public void setTotalCreditAmount(double totalCreditAmount) {
        this.totalCreditAmount = totalCreditAmount;
    }

    public double getTotalBalanceAmount() {
        return totalBalanceAmount;
    }

    public void setTotalBalanceAmount(double totalBalanceAmount) {
        this.totalBalanceAmount = totalBalanceAmount;
    }

    public List<CategoryWiseExpense> getCategoryWiseExpenses() {
        return categoryWiseExpenses;
    }

    public void setCategoryWiseExpenses(List<CategoryWiseExpense> categoryWiseExpenses) {
        this.categoryWiseExpenses = categoryWiseExpenses;
    }

    public List<ExpenseDocument> getExpenseDocumentList() {
        return expenseDocumentList;
    }

    public void setExpenseDocumentList(List<ExpenseDocument> expenseDocumentList) {
        this.expenseDocumentList = expenseDocumentList;
    }
}
