import { Component } from '@angular/core';
import {ModalController, NavController, NavParams, ViewController} from "ionic-angular";
import {DatePickerProvider} from "ionic2-date-picker";
import {DatePicker} from "@ionic-native/date-picker";
import {SiteService} from "../../service/siteService";
import {componentService} from "../../service/componentService";
import {ExpenseService} from "../../service/expenseService";

/**
 * Generated class for the AddExpense page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-add-expense',
  templateUrl: 'add-expense.html',
})
export class AddExpense {
    selectedSite: any;
    expense_type: any;
  selectOptions: { cssClass: string; };
  siteList: any;
  scrollSite: boolean;
  msg: string;
  selectedProject: any;
  clientList: any;
  searchCriteria: any;
  selectDate: Date;
    mode:any;
    expenseDetails:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController,
              private datePicker: DatePicker, private modalCtrl: ModalController,private siteService:SiteService,
              private component: componentService, private expenseService: ExpenseService)
  {  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddExpense');
    this.component.showLoader('Getting Project');
    this.selectOptions = {
      cssClass: 'selectbox-popover'
    }
    this.siteService.getAllProjects().subscribe(
      response => {
        this.component.closeLoader();
        console.log("project");
        console.log(response);
        this.clientList = response;
        this.selectedProject = this.clientList[0];
        this.selectSite(this.selectedProject);
        console.log('select default value:');
      },
      error => {
        this.component.closeLoader();
        if (error.type == 3) {
          this.msg = 'Server Unreachable'
        }
        this.component.showToastMessage(this.msg, 'bottom');
      }
    )

    this.expenseService.getExpenseCategories().subscribe(
      response=>{
        console.log("Expense categories");
        console.log(response);
        this.expense_type = response;
      },
      error=>{
        if (error.type ==3){
          this.msg = 'server Unreachable'
        }
        this.component.showToastMessage(this.msg,'bottom');
      }
    )
  }

  selectSite(project) {
    this.selectedProject = project;
    this.scrollSite = true;
    this.siteService.findSitesByProject(project.id).subscribe(
      response => {
        console.log("Site By ProjectId");
        console.log(response);
        this.siteList = response;
        console.log(this.siteList);
      },
      error => {
        if (error.type == 3) {
          this.msg = 'Server Unreachable';
        }
        this.component.showToastMessage(this.msg, 'bottom');
      }
    )
  }



  dismiss(){
        let data={'foo':'bar'};
        this.viewCtrl.dismiss(data);
    }
  saveExpense() {

      if(this.selectedProject){
          this.expenseDetails.projectId = this.selectedProject.id;
      }

      if(this.selectedSite){
          this.expenseDetails.siteId = this.selectedSite.id;
      }
  }

  showCalendar() {
      this.datePicker.show({
        date: new Date(),
        mode: 'date',
        androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK,
        allowFutureDates:false
      }).then(
        date=>{
          this.selectDate = date;
          console.log("date:",date);
        },
          err=>console.log("Error occured while getting date:"+err)
      );



  }
}
