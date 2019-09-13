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
 * <p>Java class for ZempPrevempDet complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ZempPrevempDet"&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="EmpId" type="{urn:sap-com:document:sap:rfc:functions}numeric8"/&gt;
 *         &lt;element name="NamePrevOrg" type="{urn:sap-com:document:sap:rfc:functions}char60"/&gt;
 *         &lt;element name="Addr1PrevOrg" type="{urn:sap-com:document:sap:rfc:functions}char40"/&gt;
 *         &lt;element name="Addr2PrevOrg" type="{urn:sap-com:document:sap:rfc:functions}char40"/&gt;
 *         &lt;element name="Addr3PrevOrg" type="{urn:sap-com:document:sap:rfc:functions}char40"/&gt;
 *         &lt;element name="StartDatePrevOrg" type="{urn:sap-com:document:sap:rfc:functions}date10"/&gt;
 *         &lt;element name="EndDatePrevOrg" type="{urn:sap-com:document:sap:rfc:functions}date10"/&gt;
 *         &lt;element name="DesigPrevOrgTxt" type="{urn:sap-com:document:sap:rfc:functions}char30"/&gt;
 *         &lt;element name="AreaOfWork" type="{urn:sap-com:document:sap:rfc:functions}char40"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ZempPrevempDet", propOrder = {
    "empId",
    "namePrevOrg",
    "addr1PrevOrg",
    "addr2PrevOrg",
    "addr3PrevOrg",
    "startDatePrevOrg",
    "endDatePrevOrg",
    "desigPrevOrgTxt",
    "areaOfWork"
})
public class ZempPrevempDet {

    @XmlElement(name = "EmpId", required = true)
    protected String empId;
    @XmlElement(name = "NamePrevOrg", required = true)
    protected String namePrevOrg;
    @XmlElement(name = "Addr1PrevOrg", required = true)
    protected String addr1PrevOrg;
    @XmlElement(name = "Addr2PrevOrg", required = true)
    protected String addr2PrevOrg;
    @XmlElement(name = "Addr3PrevOrg", required = true)
    protected String addr3PrevOrg;
    @XmlElement(name = "StartDatePrevOrg", required = true)
    protected String startDatePrevOrg;
    @XmlElement(name = "EndDatePrevOrg", required = true)
    protected String endDatePrevOrg;
    @XmlElement(name = "DesigPrevOrgTxt", required = true)
    protected String desigPrevOrgTxt;
    @XmlElement(name = "AreaOfWork", required = true)
    protected String areaOfWork;

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
     * Gets the value of the namePrevOrg property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getNamePrevOrg() {
        return namePrevOrg;
    }

    /**
     * Sets the value of the namePrevOrg property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setNamePrevOrg(String value) {
        this.namePrevOrg = value;
    }

    /**
     * Gets the value of the addr1PrevOrg property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getAddr1PrevOrg() {
        return addr1PrevOrg;
    }

    /**
     * Sets the value of the addr1PrevOrg property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setAddr1PrevOrg(String value) {
        this.addr1PrevOrg = value;
    }

    /**
     * Gets the value of the addr2PrevOrg property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getAddr2PrevOrg() {
        return addr2PrevOrg;
    }

    /**
     * Sets the value of the addr2PrevOrg property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setAddr2PrevOrg(String value) {
        this.addr2PrevOrg = value;
    }

    /**
     * Gets the value of the addr3PrevOrg property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getAddr3PrevOrg() {
        return addr3PrevOrg;
    }

    /**
     * Sets the value of the addr3PrevOrg property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setAddr3PrevOrg(String value) {
        this.addr3PrevOrg = value;
    }

    /**
     * Gets the value of the startDatePrevOrg property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getStartDatePrevOrg() {
        return startDatePrevOrg;
    }

    /**
     * Sets the value of the startDatePrevOrg property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setStartDatePrevOrg(String value) {
        this.startDatePrevOrg = value;
    }

    /**
     * Gets the value of the endDatePrevOrg property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getEndDatePrevOrg() {
        return endDatePrevOrg;
    }

    /**
     * Sets the value of the endDatePrevOrg property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setEndDatePrevOrg(String value) {
        this.endDatePrevOrg = value;
    }

    /**
     * Gets the value of the desigPrevOrgTxt property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDesigPrevOrgTxt() {
        return desigPrevOrgTxt;
    }

    /**
     * Sets the value of the desigPrevOrgTxt property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDesigPrevOrgTxt(String value) {
        this.desigPrevOrgTxt = value;
    }

    /**
     * Gets the value of the areaOfWork property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getAreaOfWork() {
        return areaOfWork;
    }

    /**
     * Sets the value of the areaOfWork property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setAreaOfWork(String value) {
        this.areaOfWork = value;
    }

}