package com.ts.app.domain;


import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Set;


import com.ts.app.domain.Employee;
import com.ts.app.domain.UserNew;
import com.ts.app.domain.Site;
import java.time.ZonedDateTime;

//@Entity
//@Table(name = "user_login")
//@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class UserLogin extends AbstractAuditingEntity implements Serializable {
	
	
	
	 @Id
	    @GeneratedValue(strategy = GenerationType.AUTO)
	    private Long id;	 
	
	   	   
	    @Size(min = 1, max = 100)
	    @Column(length = 100)
	    private String photoIn;
	    
	     
	    @Size(min = 1, max = 100)
	    @Column(length = 100)
	    private String photoOut;
	    
	    @Column
	    private int hoursWorked;
	    
	    @Column
	    private int latitude;
	    
	    @Column
	    private int longitude;
	    
	    @Column
	    private ZonedDateTime loginTime;
	    
	    @Column
	    private ZonedDateTime logoutTime;
	 
		 
		  
		 
		@ManyToOne(fetch = FetchType.LAZY)
			@JoinColumn(name = "employeeId", nullable = false)
		  private Employee employee;
		  
		  @ManyToOne(fetch = FetchType.LAZY)
			@JoinColumn(name = "siteId", nullable = false)
		  private Site site;
	  	    

	 

	public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

		 public String getPhotoIn() {
				return photoIn;
			}

			public void setPhotoIn(String photoIn) {
				this.photoIn = photoIn;
			}

			public String getPhotoOut() {
				return photoOut;
			}

			public void setPhotoOut(String photoOut) {
				this.photoOut = photoOut;
			}

			public int getHoursWorked() {
				return hoursWorked;
			}

			public void setHoursWorked(int hoursWorked) {
				this.hoursWorked = hoursWorked;
			}

			public int getLatitude() {
				return latitude;
			}

			public void setLatitude(int latitude) {
				this.latitude = latitude;
			}

			public int getLongitude() {
				return longitude;
			}

			public void setLongitude(int longitude) {
				this.longitude = longitude;
			}

			public ZonedDateTime getLoginTime() {
				return loginTime;
			}

			public void setLoginTime(ZonedDateTime loginTime) {
				this.loginTime = loginTime;
			}

			public ZonedDateTime getLogoutTime() {
				return logoutTime;
			}

			public void setLogoutTime(ZonedDateTime logoutTime) {
				this.logoutTime = logoutTime;
			}

			public Employee getEmployee() {
				return employee;
			}

			public void setEmployee(Employee employee) {
				this.employee = employee;
			}

			public Site getSite() {
				return site;
			}

			public void setSite(Site site) {
				this.site = site;
			}



}
