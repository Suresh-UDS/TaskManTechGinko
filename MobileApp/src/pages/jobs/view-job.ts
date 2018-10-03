import { Component } from '@angular/core';
import {LoadingController, NavController, NavParams, PopoverController} from 'ionic-angular';
import {authService} from "../service/authService";
import {CompleteJobPage} from "./completeJob";
import {JobService} from "../service/jobService";
import {AttendancePopoverPage} from "../attendance/attendance-popover";
import {ViewTicket} from "../ticket/view-ticket";
import{componentService} from "../service/componentService";
import{Camera,CameraOptions} from "@ionic-native/camera";

declare var demo;

@Component({
  selector: 'page-view-job',
  templateUrl: 'view-job.html'
})
export class ViewJobPage {

    jobDetails:any;
    completedImages:any;
    ticketDetails:any;
    categories:any;

    checkListItems:any;
    takenImages:any;
    showIcon:any;
    index:any;
    spinner:any;

    constructor(public navCtrl: NavController,public jobService:JobService,public navParams:NavParams,
                public authService: authService, private loadingCtrl:LoadingController,
                private popoverCtrl:PopoverController,private component:componentService,private camera:Camera) {
        this.spinner=true;
        this.categories = 'details';
        this.checkListItems=[];
        this.takenImages=[];
        this.jobDetails=[];
        this.jobDetails=this.navParams.get('job');
        console.log("Job details");
        console.log(this.jobDetails);

        if(this.jobDetails.ticketId){
            this.component.showLoader("Getting Job Details");
            this.jobService.getTicketDetails(this.jobDetails.ticketId).subscribe(
                response=>{
                    if(response.errorStatus){
                        demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage)
                    }else{
                        this.component.closeAll();
                        this.ticketDetails = response;
                    }

                },err=>
                {
                    this.component.showToastMessage('Error in getting Job Details','bottom');
                    console.log(err);
                }
            )
        }

        this.jobService.getJobDetails(this.jobDetails.id).subscribe(
            response=>{
                if(response.errorStatus){
                    demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage)
                }else{
                    this.spinner=false;
                    console.log("Response from job details");
                    console.log(response);
                    this.jobDetails = response;
                    this.checkListItems = this.jobDetails.checklistItems;
                    if(response.images.length>0){
                        console.log("Images available");
                        this.completedImages=[];
                        // for(let image of response.images){
                        //     this.jobService.getCompletedImage(image.employeeEmpId,image.photoOut).subscribe(
                        //         imageData=>{
                        //             this.spinner=false;
                        //             console.log(imageData);
                        //             this.completedImages.push(imageData._body);
                        //         },err=>{
                        //             this.spinner=false;
                        //             console.log("Error in getting images");
                        //             console.log(err);
                        //         }
                        //     )
                        // }

                    }
                }

            }
        )
    }

    ionViewWillEnter() {

    }

    completeJob(job)
    {
        this.navCtrl.push(CompleteJobPage,{job:job})
    }

    viewImage(img)
    {
        let popover = this.popoverCtrl.create(AttendancePopoverPage,{i:img},{cssClass:'view-img',showBackdrop:false});
        popover.present({
        });
    }

    gotoTicket(){
        console.log("Going to ticket page");
        console.log(this.jobDetails)
        console.log(this.jobDetails.ticketId)
        var ticket={
            id:this.jobDetails.ticketId
        };
        this.navCtrl.push(ViewTicket,{ticket:ticket})
    }

    viewCamera(i) {
        console.log(i);
        const options: CameraOptions = {
            quality: 50,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        };

        this.camera.getPicture(options).then((imageData) => {

            // console.log('imageData -' +imageData);
            imageData = 'data:image/jpeg;base64,' + imageData;
            // imageData = imageData.replace("assets-library://", "cdvfile://localhost/assets-library/");

            // if(this.checkListItems[i].image_1 !=null){
            //     console.log("image_1"+this.checkListItems[i].image_1);
            //     if(this.checkListItems[i].image_2 !=null){
            //         console.log("image_2"+this.checkListItems[i].image_2);
            //
            //         if(this.checkListItems[i].image_3 !=null){
            //             console.log("image_3"+this.checkListItems[i].image_3);
            //
            //             this.cs.showToastMessage('Cannot add more than 3 images','bottom');
            //         }else{
            //             console.log("No third image");
            //             this.checkListItems[i].image_3 = imageData;
            //         }
            //     }else{
            //         console.log("No second image");
            //         this.checkListItems[i].image_2 = imageData;
            //     }
            // }else{
            //     console.log("No first image");
            //     this.checkListItems[i].image_1 = imageData;
            // }

            this.checkListItems[i].image_1 = imageData;


        })

    }

    resetRemarks(i,completed){
        console.log(i);
        console.log(completed);
        if(completed){
            this.checkListItems[i].remarks=null;
        }
    }

    saveJob(job) {
        this.component.showLoader('upload Image');
        console.log("view jobs ")
        console.log(job)
        this.jobService.saveJob(job).subscribe(
            response => {
                if(response.errorStatus){
                    this.component.closeAll();
                    demo.showSwal('warning-message-and-confirmation-ok',response.errorMessage)
                }else{
                    console.log("Save Job response");
                    this.component.closeLoader();
                    this.component.showToastMessage('Image Upload Successfully', 'bottom');
                    console.log(response);
                }

            }, err => {
                console.log("Error in saving response");
                console.log(err);
                this.component.closeLoader();
                this.component.showToastMessage('Error in upload image, please try again...', 'bottom');
            })


    }
    show(show,i)
    {
        this.showIcon = !show;
        this.index = i;
    }






}
