// import { AppConstant } from './../../shared/constant/app.constant';
import { ImageService } from '../../../shared/services/imageupload.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AppConfigService } from '../../../shared/services/app.config.service';

let AppConstant: any = {};
@Component({
    templateUrl: 'imageupload.component.html'
})

export class ImageUploadComponent implements OnInit {
    @ViewChild('imgFile', {static: false}) imgFile;
    data: any = {};
    uploadUrl: string = `${AppConstant.API_BASE}media/upload`;
    imageUrl: string;
    htmlContent: string;

    constructor(private uploadService: ImageService, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

    ngOnInit() {
        // this.getDocument(1);
        this.getDocumentViewer(3);
    }


    getDocument(id) {
        this.uploadService.getDocument(id)
            .subscribe((res: any) => {

                this.imageUrl = res.result.base64String;
            })
    }

    getDocumentViewer(id) {
        this.uploadService.getDocumentViewer(id)
            .subscribe((res: any) => {
                this.htmlContent = res.result;
            })
    }
    UploadImage() {
        let fi = this.imgFile.nativeElement;
        var params = {
            'title': this.data.title
        };

        this.uploadService.uploadImage(this.uploadUrl, params, fi.files[0])
            .then((val: any) => {
            }, (error) => {

            });


    }





}