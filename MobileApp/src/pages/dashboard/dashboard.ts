import { Component, Input, ViewChild, ElementRef, Renderer } from '@angular/core';
import {
    ActionSheetController, AlertController, Events, Item, ItemSliding, LoadingController, ModalController,
    NavController, Platform
} from 'ionic-angular';
import {authService} from "../service/authService";
import {DatePickerProvider} from "ionic2-date-picker";
import {componentService} from "../service/componentService";
import {SiteService} from "../service/siteService";
import {EmployeeService} from "../service/employeeService";
import {JobService} from "../service/jobService";
import {CreateRateCardPage} from "../rate-card/create-rate-card";
import {CreateJobPage} from "../jobs/add-job";
import {CreateQuotationPage} from "../quotation/create-quotation";
import {CreateEmployeePage} from "../employee-list/create-employee";
import {CompleteJobPage} from "../jobs/completeJob";
import {ViewJobPage} from "../jobs/view-job";
import {LoginPage} from "../login/login";
import{SiteListPage} from "../site-list/site-list";
import {DBService} from "../service/dbService";
import {AttendanceService} from "../service/attendanceService";
import {AssetService} from "../service/assetService";
import {DatabaseProvider} from "../../providers/database-provider";
declare var demo;
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'

})
export class DashboardPage {
  @ViewChild('date') MyCalendar: ElementRef;
  todaysJobs: any;
  allJobs:any;
  selectedSite:any;
  selectedEmployee:any;
  categories:any;
  loader:any;
  dateView:any;
  employee:any;
  sites:any;
  spinner=true;
  empSpinner=false;
  searchCriteria:any;
  index:any;
  all="all";
    ref:any;
    firstLetter:any;
    selectDate:any;
    selectSite=false;
    empSelect:any;
    empIndex:any;
    empActive=false;
    count=0;
    overdueCount:any;
    upcomingCount:any;
    completeCount:any;
    userType:any;
    openMore:any;
    closeMore:any;
    rateCard:any;
    addJob:any;
    addQuotation:any;
    platform:any;
    addEmployee:any;
    slideIndex:any;
    attendance:any;

  constructor(public renderer: Renderer,public attendanceService:AttendanceService,public assetService:AssetService,public componentService:componentService,public plt: Platform,public myService:authService,private loadingCtrl:LoadingController,public navCtrl: NavController,public component:componentService,public authService:authService,public modalCtrl: ModalController,
              private datePickerProvider: DatePickerProvider, private siteService:SiteService, private employeeService: EmployeeService, private jobService:JobService, public events:Events, private actionSheetCtrl:ActionSheetController, private alertController:AlertController, private dbService:DBService, private databaseProvider: DatabaseProvider) {


      this.rateCard=CreateQuotationPage;
      this.addJob=CreateJobPage;
      this.addQuotation=CreateQuotationPage;
      this.addEmployee=CreateEmployeePage;
      this.attendance=SiteListPage;

    this.categories='overdue';
    this.selectDate=new Date();
    this.searchCriteria={};
   /* this.categories = [
      'overdue','upcoming','completed'
      ];
      */

   this.events.subscribe('userType',(userType)=>{
       console.log("user type in dashboard");
       console.log(userType);
       this.userType = userType;
   });
   console.log("User Role in dashboard");
   console.log(window.localStorage.getItem('userRole'));
      this.userType=window.localStorage.getItem('userRole')
  }

/*
  showCalendar2() {
    const dateSelected =
        this.datePickerProvider.showCalendar(this.modalCtrl);

    dateSelected.subscribe(date =>
        console.log("second date picker: date selected is", date));
  }
*/
  ionViewDidLoad()
  {

      if (this.plt.is('android')) {
          this.platform="android"
          console.log("=====Platform=====:"+this.platform);
      }
      else if (this.plt.is('ios')) {
          this.platform="ios"
          console.log("=====Platform=====:"+this.platform);
      }

    this.searchSites();
      
    this.searchCriteria={
        checkInDateTimeFrom:new Date()
    }
      this.searchJobs(this.searchCriteria);




  }

  ionViewWillEnter(){

  }

  searchJobs(searchCriteria){
      if(this.selectedEmployee){
          console.log("employee selected");
          searchCriteria.employeeId = this.selectedEmployee.id;
      }
      if(this.selectedSite){
          console.log("site selected");
          searchCriteria.siteId = this.selectedSite;
      }
      if(this.selectDate){
          searchCriteria.checkInDateTimeFrom = this.selectDate;
      }
      searchCriteria.CheckInDateTimeFrom = new Date(searchCriteria.checkInDateTimeFrom);
      this.jobService.getJobs(searchCriteria).subscribe(
          response=>{
              console.log("Jobs from search criteria");
              console.log(response);
              this.allJobs = response.transactions;
              this.component.closeLoader();
              console.log("====Jobs=====:");
              console.log(this.allJobs);
              this.overdueCount=this.allJobs.filter((data,i)=>{
                  if(data.status=='OVERDUE')
                  {
                      return data;
                  }

              }).length

              console.log("Count------:"+this.overdueCount);

              this.completeCount=this.allJobs.filter((data,i)=>{
                  if(data.status=='COMPLETED')
                  {
                      return data;
                  }
              }).length

              console.log("Count------:"+this.completeCount);

              this.upcomingCount=this.allJobs.filter((data,i)=>{
                  if(data.status=='OPEN' || data.status=='ASSIGNED' || data.status=='INPROGRESS')
                  {
                      return data;
                  }
              }).length

              console.log("Count------:"+this.upcomingCount);


          },err=>{
              console.log("Error in getting josb");
              this.component.closeLoader();
          }
      )
  }
  
  searchSite(){
      this.siteService.searchSite().subscribe(
          response=>{
              console.log('ionViewDidLoad SitePage:');
              console.log(response);
              this.sites=response.json();
              this.spinner=false;
              // this.empSpinner=true;
              this.component.closeLoader();
          },
          error=>{
              console.log('ionViewDidLoad SitePage:'+error);
              this.component.closeLoader();
              // this.navCtrl.push(LoginPage);

          }
      );


  }

  searchSites(){
      var searchCriteria = {
          findAll:true,
          currPage:1,
          sort:10,
          sortByAsc:true,
          report:true
      }

      this.siteService.searchSites(searchCriteria).subscribe(
          response=>{
              this.sites=response.transactions;
              this.spinner=false;
              this.component.closeLoader();
          },
          error=> {
              console.log('ionViewDidLoad SitePage:' + error);
              this.component.closeLoader();

          }
          );
  }


  getAllJobs(sDate){
    this.component.showLoader('Getting All Jobs');
    console.log("selected date");
    console.log(sDate);
    var currDate = new Date(sDate);
    var search={checkInDateTimeFrom:currDate};
    this.jobService.getJobs(search).subscribe(response=>{
      console.log("All jobs of current user");
      console.log(response);
      this.allJobs = response;
      this.component.closeLoader();
    })
  }




    first(emp)
    {
        this.firstLetter=emp.charAt(0);
    }




    showCalendar() {
        const dateSelected =
            this.datePickerProvider.showCalendar(this.modalCtrl);

        dateSelected.subscribe(date =>
        {
            this.selectDate=date;
            console.log("Date selected");
            console.log(date);

            this.searchCriteria.checkInDateTimeFrom = date;
            // this.getAllJobs(this.selectDate)
            this.searchJobs(this.searchCriteria);
            console.log("first date picker: date selected is", date);
        });

    }

    selectEmployee(emp,i){
      console.log("Selected Employee");
      console.log(emp.id+" "+ emp.name);

      this.searchCriteria={
          employeeId:emp.id,
          CheckInDateTimeFrom:this.selectDate,
      };
      this.searchJobs(this.searchCriteria);
      this.empActive=true;
      this.empIndex=i;
    }

    activeSite(id,i)
    {
         var search={siteId:id};
         this.selectedSite = id;
        this.index=i;
        console.log("Selected Site Id");
        console.log(id);
        this.selectSite=true;
        this.searchCriteria={
            siteId:id
        };
        this.searchJobs(this.searchCriteria);
        this.empSpinner=true;
        var searchCriteria = {

            siteId:id,
            list:true
        };
        this.attendanceService.searchEmpAttendances(searchCriteria).subscribe(response=>{
                if(response.transactions && response.transactions.length !==0)
                {
                    this.employee=response.transactions;
                    this.empSpinner=false;
                    this.empSelect=false;
                    this.selectSite=true;
                    console.log("Spinner:"+this.empSpinner);
                    console.log(this.employee);
                }
                else
                {
                    this.empSelect=true;
                    this.empSpinner=false;
                    this.employee=[]
                }
            },
            error=>{
                console.log(error);
                console.log(this.employee);
            })
    }


    doRefresh(refresher,segment)
    {
        this.ref=true;
        if(segment=="all")
        {
            this.getJobs(this.ref);
            refresher.complete();
        }

    }


    getJobs(ref)
    {
        if(this.allJobs)
        {
            if(ref)
            {
                this.searchJobs(this.searchCriteria);
            }
            else
            {
                this.allJobs=this.allJobs;
            }
        }
        else
        {
            this.searchJobs(this.searchCriteria);
        }
    }


    // Slide
    open(itemSlide: ItemSliding, item: Item,c)
    {
        this.count=c;
        if(c==1)
        {
            this.count=0;
            console.log('------------:'+this.count);
            this.close(itemSlide);
        }
        else
        {
            this.count=1;
            console.log('------------:'+this.count);
            itemSlide.setElementClass("active-sliding", true);
            itemSlide.setElementClass("active-slide", true);
            itemSlide.setElementClass("active-options-right", true);
            item.setElementStyle("transform", "translate3d(-150px, 0px, 0px)")
        }
    }
    close(item: ItemSliding) {
        this.count=0;
        item.close();
        item.setElementClass("active-sliding", false);
        item.setElementClass("active-slide", false);
        item.setElementClass("active-options-right", false);
    }

    compeleteJob(job)
    {
        this.navCtrl.push(CompleteJobPage,{job:job})
    }

    viewJob(job)
    {
        console.log("========view job ===========");
        console.log(job);
        this.navCtrl.push(ViewJobPage,{job:job})
    }

    presentActionSheet(){
        let actionSheet = this.actionSheetCtrl.create({
            title:'Add',
            buttons:[
                {
                    text:'Quotation',
                    handler:()=>{
                        console.log("Quotation sheet Controller");
                        this.navCtrl.push(CreateQuotationPage);

                    }
                },
                {
                    text:'Job',
                    handler:()=>{
                    this.navCtrl.push(CreateJobPage);
                }
                },

                {
                    text:'Employee',
                    handler:()=>{
                        console.log('Complete job');
                    this.navCtrl.push(CreateEmployeePage);

                }
                },

                {
                    text:'Cancel',
                    role:'cancel',
                    handler:()=>{
                        console.log("Cancel clicker");
                    }
                }
            ]
        });

        actionSheet.present();
    }

    syncData(){
        let alert =this.alertController.create({
            title:'Confirm Sync',
            message:'Network available do you wish to sync to local?',
            buttons:[{
                text:'Cancel',
                role:'cancel',
                handler:()=>{
                    console.log('Cancel clicked');

                }
            },{
                text:'Sync',
                handler:()=>{
                    this.setDataSync();
                    this.componentService.showLoader("Data Sync");
                    this.markOfflineAttendance().then(response=>{
                        console.log(response);
                        this.dbService.dropAttendance().then(
                            response=>{
                                // this.dbService.dropEmployee().then(response=>{
                                    this.dbService.setSites().then(data=>{
                                        console.log(data);
                                        this.dbService.getSite().then(response=>{
                                            console.log(response);
                                            this.dbService.setEmployee().then(response=>{
                                                console.log(response);
                                                this.componentService.closeAll();
                                                demo.showSwal('success-message-and-ok','Success','Data Sync Successful');

                                            },err=>{
                                                console.log(err);
                                                this.componentService.closeAll();
                                                demo.showSwal('warning-message-and-confirmation-ok','Error in syncing Data');

                                            })
                                        },err=>{
                                            console.log(err);
                                            this.componentService.closeAll();
                                            demo.showSwal('warning-message-and-confirmation-ok','Error in syncing Data');

                                        })
                                    },err=>{
                                        console.log(err);
                                        this.componentService.closeAll();
                                        demo.showSwal('warning-message-and-confirmation-ok','Error in syncing Data');

                                    })
                                // },err=>{
                                //     console.log(err);
                                //     this.componentService.closeAll();
                                //     demo.showSwal('warning-message-and-confirmation-ok','Error in syncing Data');
                                // });

                        },
                            error=>{
                                console.log(error);
                                this.componentService.closeAll();
                                demo.showSwal('warning-message-and-confirmation-ok','Error in syncing Data');

                            })


                    },err=>{
                        console.log(err)
                        this.dbService.setSites().then(data=>{
                            console.log(data);
                            this.dbService.getSite().then(response=>{
                                console.log(response);
                                this.dbService.setEmployee().then(response=>{
                                    console.log(response);
                                    this.componentService.closeAll();
                                    demo.showSwal('success-message-and-ok','Success','Data Sync Successful');

                                },err=>{
                                    console.log(err);
                                    this.componentService.closeAll();
                                    demo.showSwal('warning-message-and-confirmation-ok','Error in syncing Data');
                                })
                            },err=>{
                                console.log(err);
                                this.componentService.closeAll();
                                demo.showSwal('warning-message-and-confirmation-ok','Error in syncing Data');
                            })
                        },err=>{
                            console.log(err);
                            this.componentService.closeAll();
                            demo.showSwal('warning-message-and-confirmation-ok','Error in syncing Data');
                        })
                    })

                }
            }]
        })

        alert.present();
    }

    getSiteTable(){
        this.databaseProvider.getSiteData().then(sites=>{
            console.log("Sites from SQLite");
            console.log(sites);
            for(var i=0; i<sites.length;i++){
                console.log("site id - "+sites[i].id);
                this.databaseProvider.getEmployeeDataBySiteId(sites[i].id).then(employees=>{
                    console.log("Employees for site id - ");
                    console.log(employees);
                })
            }
        })

        this.databaseProvider.getJobsData().then(jobs=>{
            console.log("Jobs from sqlite");
            console.log(jobs);
        })

        this.databaseProvider.getEmployeeData().then(employees=>{
            console.log("Employees from sqlite");
            console.log(employees);
        })
    }

    markOfflineAttendance(){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.dbService.getAttendance().then(response=>{
                    console.log(response);
                    // this.componentService.closeAll()
                    var data:any;
                    data = response;
                    for(var i=0;i<data.length;i++) {
                        console.log("=================="+data[i].siteId)
                        console.log(data[i].offlineCheckin)
                        if(data[i].offlineCheckin == 'true')
                        {
                            this.attendanceIn(data[i]).then(
                                response=>{
                                    console.log(response)
                                    resolve("sss")
                                })
                        }
                        else {
                            this.attendanceService.markAttendanceCheckOut(data[i].siteId, data[i].employeeEmpId, data[i].latitudeIn, data[i].longitudeIn, data[i].checkOutImage, data[i].attendanceId).subscribe(
                                response => {
                                    resolve("ssss")
                                    console.log("Offline attendance data synced to server");
                                },
                                error2 => {
                                    console.log("Error in syncing attendance to server");
                                    this.componentService.closeAll()
                                    this.componentService.showToastMessage("Error in syncing attendance to server","center")
                                })
                        }
                    }
                },err=>{
                    console.log(err)
                    reject(err)
                })
            }, 3000)

        })
    }


    attendanceOut(data,id)
    {
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                this.attendanceService.markAttendanceCheckOut(data.siteId, data.employeeEmpId, data.latitudeIn, data.longitudeIn, data.checkOutImage,id).subscribe(
                    response => {
                        console.log("Offline attendance data synced to server");
                        resolve("s")
                    },
                    error2 => {
                        console.log("Error in syncing attendance to server");
                        this.componentService.closeAll()
                        this.componentService.showToastMessage("Error in syncing attendance to server","bottom")
                    })
            },3000)

        })

    }

    attendanceIn(data)
    {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.attendanceService.markAttendanceCheckIn(data.siteId, data.employeeEmpId, data.latitudeIn, data.longitudeIn, data.checkInImage).subscribe(
                    response => {
                        console.log("Offline attendance data synced to server");
                        console.log(response)
                        if(data.offlineCheckOut == 'true') {
                            this.attendanceOut(data, response.json().id).then(
                                response => {
                                    resolve("Attendance checked in and checked out successfully");
                                }
                            )
                        }else{
                            resolve("Attendance checked in and checked out successfully");
                        }

                    }, error2 => {
                        console.log("Error in syncing attendance to server");
                        this.componentService.closeAll()
                        this.componentService.showToastMessage("Error in syncing attendance to server","center")
                    })
            }, 3000)

        })

    }

    setDataSync()
    {
        this.componentService.showLoader("Data Sync");
        this.dbService.getReading().then(
            response=> {
                console.log(response)
                this.saveReadingToServer(response).then(
                    response=>{
                        this.dbService.dropReadingTable().then(
                            response=>{
                                console.log(response);
                                this.dbService.dropPPMJobTable().then(
                                    response=>{
                                        console.log(response);
                                        this.dbService.dropAMCJobTable().then(
                                            response=>{
                                                console.log(response);
                                                this.setData().then(
                                                    response=>{
                                                        console.log(response);
                                                    },
                                                    error=>{
                                                        console.log(error)
                                                    })
                                            })
                                    }
                                )
                            }
                        );

                    },
                    error=>{
                        this.componentService.closeAll();
                        this.componentService.showToastMessage("Error server sync","bottom")
                    })
            },error=>{
                this.setData().then(
                    response=>{
                        console.log(response);
                    },
                    error=>{
                        console.log(error)
                    })
            })
    }

    setData()
    {
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                this.dbService.setAsset().then(
                    response=>{
                        console.log(response)
                        this.dbService.getAsset().then(
                            response=>{
                                console.log(response)
                                this.dbService.setPPM().then(
                                    response=>{
                                        console.log(response)
                                        this.dbService.setAMC().then(
                                            response=>{
                                                console.log(response)
                                                this.dbService.setConfig().then(
                                                    response=>{
                                                        console.log(response)
                                                        this.dbService.setJobs().then(
                                                            response=>{
                                                                console.log(response);
                                                            })
                                                        // this.dbService.setPPMJobs().then(
                                                        //     response=>{
                                                        //         console.log(response)
                                                        //         this.dbService.setAMCJobs().then(
                                                        //             response=> {
                                                        console.log(response)
                                                        this.dbService.setTickets().then(
                                                            response => {
                                                                console.log(response)
                                                                // this.dbService.setSites().then(
                                                                //     response=> {
                                                                //         console.log(response)
                                                                // this.dbService.setEmployee().then(
                                                                //     response=> {
                                                                //         console.log(response)
                                                                this.dbService.setViewReading().then(
                                                                    response => {
                                                                        console.log(response)
                                                                        this.dbService.setAssetPreviousReading().then(
                                                                            response => {
                                                                                console.log(response)
                                                                                resolve("data s")
                                                                                this.componentService.closeAll();
                                                                                demo.showSwal('success-message-and-ok','Success','Data Sync Successful');
                                                                            })
                                                                    })
                                                                // })
                                                                // })
                                                            })
                                                    })
                                            })
                                    })
                                // })
                                // })
                            })
                    })


            },3000)
        })
    }

    saveReadingToServer(readings)
    {
        return new Promise((resolve,reject)=>{
            for(var i=0;i<readings.length;i++)
            {
                this.assetService.saveReading({name:readings[i].name,uom:readings[i].uom,initialValue:readings[i].initialValue,finalValue:readings[i].finalValue,consumption:readings[i].consumption,assetId:readings[i].assetId,assetParameterConfigId:readings[i].assetParameterConfigId}).subscribe(
                    response => {
                        if(response.errorStatus){
                            demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage);
                        }else{
                            console.log("save reading sync to server");
                            console.log(response);
                            resolve("s")
                        }

                    },
                    error => {
                        console.log("save readings error sync to server");
                        reject("no")
                    })
            }

        })
    }

}
