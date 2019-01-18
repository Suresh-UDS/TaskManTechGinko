package com.ts.app.domain;


import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

//@Entity
//@Table(name = "user")
//@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class UserNew extends AbstractAuditingEntity implements Serializable {
	
	
	
	 @Id
	    @GeneratedValue(strategy = GenerationType.AUTO)
	    private Long id;
	 
	
	@NotNull
	    @Pattern(regexp = "^[a-z0-9]*$|(anonymousUser)")
	    @Size(min = 1, max = 50)
	    @Column(length = 50, unique = true, nullable = false)
	    private String name;
	 
	  @ManyToOne(fetch = FetchType.LAZY)
		@JoinColumn(name = "userGroupId", nullable = false)
	  private UserGroup userGroup;
	  
//	  @OneToMany(mappedBy = "employee")  
//	    private Set<Employee> employee;  

	  
	    

		@NotNull	  
	    @Size(min = 1, max = 50)
	    @Column(length = 50, unique = true, nullable = false)
	    private String password;
	    
	   

		@NotNull	  
	    @Size(min = 1, max = 1)
	    @Column(length = 1, unique = true, nullable = false)
	    private String adm_flg;
	 

	public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

	  
		 public UserGroup getUserGroup() {
				return userGroup;
			}

			public void setUserGroup(UserGroup userGroup) {
				this.userGroup = userGroup;
			}
			
			 public String getPassword() {
					return password;
				}

				public void setPassword(String password) {
					this.password = password;
				}

				public String getAdm_flg() {
					return adm_flg;
				}

				public void setAdm_flg(String adm_flg) {
					this.adm_flg = adm_flg;
				}
				/*
				
				public Set<Employee> getEmployee() {
					return employee;
				}

				public void setEmployee(Set<Employee> employee) {
					this.employee = employee;
				}
				*/


}
