import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import { OnInit } from '@angular/core';
import {AssetService} from "../service/assetService";
declare const swal: any;
declare const $: any;


/**
 * Generated class for the CalenderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-calender-page',
  templateUrl: 'calender-page.html',
})
export class CalenderPage {
    spinner:any;
date:any;
assetDetails:any;
searchCriteria:any;
ppmSchedule:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private assetService:AssetService) {
      this.assetDetails=this.navParams.get('assetDetails');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CalenderPage');
    console.log('asset details');
    console.log(this.assetDetails);
    this.getCalendarSchedule();
  }

  getCalendarSchedule(){
      this.spinner=true;
      var date = new Date(), y = date.getFullYear(), m = date.getMonth();
      var firstDay = new Date(y, m, 1);
      var lastDay = new Date(y, m + 1, 0);
      var search={
          checkInDateTimeFrom:firstDay,
          checkInDateTimeTo:lastDay,
          assetId:this.assetDetails.id
      };
      this.assetService.getPPMScheduleCalendar(this.assetDetails.id,search).subscribe(
          response=>{
              this.spinner=false;
              console.log("PPM calendar schedule");
              console.log(response);
              if(response.length>0){
                  this.ppmSchedule = response;
                  this.ppmSchedule.forEach(function(value){
                      value.description=value.assetTitle;
                      value.title=value.title+'-'+value.assetTitle;
                  });
                  this.loadCalendar();
              }else{
                  this.spinner=false;
                  console.log('Error Response');
              }

          },
          error=>{
              console.log(error);
          }
      )
  }
    loadCalendar() {
        const $calendar = $('#fullCalendar');
        const today = new Date();
        const y = today.getFullYear();
        const m = today.getMonth();
        const d = today.getDate();

        $calendar.fullCalendar({
            viewRender: function (view: any, element: any) {
                // We make sure that we activate the perfect scrollbar when the view isn't on Month
                if (view.name !== 'month') {
                    const $fc_scroller = $('.fc-scroller');
                    $fc_scroller.perfectScrollbar();
                }
            },
            header: {
                left: 'title',
                center: 'today',
                right: 'prev,next',
            },
            defaultDate: today,
            selectable: true,
            selectHelper: true,
            views: {
                month: { // name of view
                    titleFormat: 'MMM YYYY'
                    // other view-specific options here
                },
                week: {
                    titleFormat: ' MMM D YYYY'
                },
                day: {
                    titleFormat: 'D MMM, YYYY'
                }
            },

            select: function (start: any, end: any) {
                // on select we show the Sweet Alert modal with an input
                swal({
                    title: 'Create an Event',
                    html: '<div class="form-group">' +
                    '<input class="form-control" placeholder="Event Title" id="input-field">' +
                    '</div>',
                    showCancelButton: true,
                    confirmButtonClass: 'btn btn-success',
                    cancelButtonClass: 'btn btn-danger',
                    buttonsStyling: false
                }).then(function (result: any) {

                    let eventData;
                    const event_title = $('#input-field').val();

                    if (event_title) {
                        eventData = {
                            title: event_title,
                            start: start,
                            end: end
                        };
                        $calendar.fullCalendar('renderEvent', eventData, true); // stick? = true
                    }

                    $calendar.fullCalendar('unselect');

                });


            },
            editable: true,
            eventLimit:1,                                                    // allow "more" link when too many events
            eventLimitText:"",
            events: this.ppmSchedule,
            


            // color classes: [ event-blue | event-azure | event-green | event-orange | event-red ]
            // events: [
            //     this.ppmSchedule[0],
            //     {
            //         title: 'All Day Event',
            //         start: new Date(y, m, 1),
            //         className: 'event-default'
            //     },
            //     {
            //         id: 999,
            //         title: 'Repeating Event',
            //         start:this.date,
            //         allDay: false,
            //         className: 'event-rose'
            //     },
            //     {
            //         id: 999,
            //         title: 'Repeating Event',
            //         start: new Date(y, m, d + 3, 6, 0),
            //         allDay: false,
            //         className: 'event-rose'
            //     },
            //     {
            //         title: 'Meeting',
            //         start: new Date(y, m, d - 1, 10, 30),
            //         allDay: false,
            //         className: 'event-green'
            //     },
            //     {
            //         title: 'Lunch',
            //         start: new Date(y, m, d + 7, 12, 0),
            //         end: new Date(y, m, d + 7, 14, 0),
            //         allDay: false,
            //         className: 'event-red'
            //     },
            //     {
            //         title: 'Md-pro Launch',
            //         start: new Date(y, m, d - 2, 12, 0),
            //         allDay: true,
            //         className: 'event-azure'
            //     },
            //     {
            //         title: 'Birthday Party',
            //         start: new Date(y, m, d + 1, 19, 0),
            //         end: new Date(y, m, d + 1, 22, 30),
            //         allDay: false,
            //         className: 'event-azure'
            //     },
            //     {
            //         title: 'Click for Creative Tim',
            //         start: new Date(y, m, 21),
            //         end: new Date(y, m, 22),
            //         url: 'https://www.creative-tim.com/',
            //         className: 'event-orange'
            //     },
            //     {
            //         title: 'Click for Google',
            //         start: new Date(y, m, 21),
            //         end: new Date(y, m, 22),
            //         url: 'https://www.creative-tim.com/',
            //         className: 'event-orange'
            //     }
            // ]
        });
    }

}
