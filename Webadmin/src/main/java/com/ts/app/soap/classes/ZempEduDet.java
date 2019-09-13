//
// This file was generated by the JavaTM Architecture for XML Binding(JAXB) Reference Implementation, v2.2.11 
// See <a href="http://java.sun.com/xml/jaxb">http://java.sun.com/xml/jaxb</a> 
// Any modifications to this file will be lost upon recompilation of the source schema. 
// Generated on: 2019.08.27 at 01:01:31 AM IST 
//


package com.ts.app.soap.classes;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ZempEduDet complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ZempEduDet"&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="EmpId" type="{urn:sap-com:document:sap:rfc:functions}numeric8"/&gt;
 *         &lt;element name="EducEst" type="{urn:sap-com:document:sap:rfc:functions}char2"/&gt;
 *         &lt;element name="QualificNo" type="{urn:sap-com:document:sap:rfc:functions}numeric8"/&gt;
 *         &lt;element name="MajorSub1No" type="{urn:sap-com:document:sap:rfc:functions}numeric5"/&gt;
 *         &lt;element name="MajorSub2No" type="{urn:sap-com:document:sap:rfc:functions}numeric5"/&gt;
 *         &lt;element name="LanguTxt" type="{urn:sap-com:document:sap:rfc:functions}char15"/&gt;
 *         &lt;element name="BoardUniv" type="{urn:sap-com:document:sap:rfc:functions}char80"/&gt;
 *         &lt;element name="FinalGrade" type="{urn:sap-com:document:sap:rfc:functions}char4"/&gt;
 *         &lt;element name="YearOfPass" type="{urn:sap-com:document:sap:rfc:functions}date10"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ZempEduDet", propOrder = {
    "empId",
    "educEst",
    "qualificNo",
    "majorSub1No",
    "majorSub2No",
    "languTxt",
    "boardUniv",
    "finalGrade",
    "yearOfPass"
})
public class ZempEduDet {

    @XmlElement(name = "EmpId", required = true)
    protected String empId;
    @XmlElement(name = "EducEst", required = true)
    protected String educEst;
    @XmlElement(name = "QualificNo", required = true)
    protected String qualificNo;
    @XmlElement(name = "MajorSub1No", required = true)
    protected String majorSub1No;
    @XmlElement(name = "MajorSub2No", required = true)
    protected String majorSub2No;
    @XmlElement(name = "LanguTxt", required = true)
    protected String languTxt;
    @XmlElement(name = "BoardUniv", required = true)
    protected String boardUniv;
    @XmlElement(name = "FinalGrade", required = true)
    protected String finalGrade;
    @XmlElement(name = "YearOfPass", required = true)
    protected String yearOfPass;

    /**
     * Gets the value of the empId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getEmpId() {
        return empId;
    }

    /**
     * Sets the value of the empId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setEmpId(String value) {
        this.empId = value;
    }

    /**
     * Gets the value of the educEst property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getEducEst() {
        return educEst;
    }

    /**
     * Sets the value of the educEst property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setEducEst(String value) {
        this.educEst = value;
    }

    /**
     * Gets the value of the qualificNo property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getQualificNo() {
        return qualificNo;
    }

    /**
     * Sets the value of the qualificNo property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setQualificNo(String value) {
        this.qualificNo = value;
    }

    /**
     * Gets the value of the majorSub1No property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getMajorSub1No() {
        return majorSub1No;
    }

    /**
     * Sets the value of the majorSub1No property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setMajorSub1No(String value) {
        this.majorSub1No = value;
    }

    /**
     * Gets the value of the majorSub2No property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getMajorSub2No() {
        return majorSub2No;
    }

    /**
     * Sets the value of the majorSub2No property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setMajorSub2No(String value) {
        this.majorSub2No = value;
    }

    /**
     * Gets the value of the languTxt property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getLanguTxt() {
        return languTxt;
    }

    /**
     * Sets the value of the languTxt property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setLanguTxt(String value) {
        this.languTxt = value;
    }

    /**
     * Gets the value of the boardUniv property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getBoardUniv() {
        return boardUniv;
    }

    /**
     * Sets the value of the boardUniv property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setBoardUniv(String value) {
        this.boardUniv = value;
    }

    /**
     * Gets the value of the finalGrade property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getFinalGrade() {
        return finalGrade;
    }

    /**
     * Sets the value of the finalGrade property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setFinalGrade(String value) {
        this.finalGrade = value;
    }

    /**
     * Gets the value of the yearOfPass property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getYearOfPass() {
        return yearOfPass;
    }

    /**
     * Sets the value of the yearOfPass property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setYearOfPass(String value) {
        this.yearOfPass = value;
    }

}