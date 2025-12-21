

import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Message } from '../../shared/models/message';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';



declare var google: any;

@Component({
    selector: 'credit-map',
    templateUrl: 'map.component.html',
   // styleUrls: ['./map.component.css']

})
export class MapComponent implements OnInit {
    constructor(private fb: FormBuilder,private route: ActivatedRoute, ) { }

    options: any;

    goeLocation: FormGroup;
    ZOOM: number = 9;
    overlays: any[];

    dialogVisible: boolean;

    markerTitle: string;

    selectedPosition: any;

    infoWindow: any;

    draggable: boolean;

    msgs: Message[] = [];

    
    latitude: number;
   
     longitude: number;

    @Output() closeForm = new EventEmitter<boolean>();

    ngOnChanges(changes: SimpleChanges) {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
     
        if ((this.latitude != undefined && this.longitude != undefined) || this.latitude != NaN && this.longitude != NaN)
            this.setLocation();
        //this. getProductFees(this.productId); 
    }
    ngOnInit() {
        this.latitude = +this.route.snapshot.params['lat'];
        this.longitude = +this.route.snapshot.params['log'];
      
        this.options = {
            center: { lat: this.latitude, lng: this.longitude },
            zoom: this.ZOOM
        };

        this.initOverlays();
        this.infoWindow = new google.maps.InfoWindow();
    }

    handleMapClick(event) {
        this.dialogVisible = true;
        this.selectedPosition = event.latLng;
    }
    setLocation() {
        this.options = {};
        var mapCenter = new google.maps.LatLng(this.latitude, this.longitude);
        this.initOverlays();
        //markerEvent.map.panTo(mapCenter);

        this.overlays.push(new google.maps.Marker({ position: { lat: this.latitude, lng: this.longitude },  title: this.markerTitle, draggable: this.draggable }));
        this.markerTitle = null;
        this.dialogVisible = false;
    }

    closeFormWindow() {
        this.closeForm.emit(true);
    }

    handleOverlayClick(event) {
        this.msgs = [];
        let isMarker = event.overlay.getTitle != undefined;
        
        if (isMarker) {
            let title = event.overlay.getTitle();
            this.infoWindow.setContent('<div>' + title + '</div>');
            this.infoWindow.open(event.map, event.overlay);
            event.map.setCenter(event.overlay.getPosition());
 
            this.msgs.push({ severity: 'info', summary: 'Marker Selected', detail: title });
        }
        else {
            this.msgs.push({ severity: 'info', summary: 'Shape Selected', detail: '' });
        }
    }

    addMarker() {
        this.overlays.push(new google.maps.Marker({ position: { lat: this.selectedPosition.lat(), lng: this.selectedPosition.lng() }, title: this.markerTitle, draggable: this.draggable }));
        this.markerTitle = null;
        this.dialogVisible = false;
    }

    handleDragEnd(event) {
        this.msgs = [];
        this.msgs.push({ severity: 'info', summary: 'Marker Dragged', detail: event.overlay.getTitle() });
    }

    initOverlays() {

        if (!this.overlays || !this.overlays.length) {
            this.overlays = [
                new google.maps.Marker({ position: { lat: this.latitude, lng: this.longitude }, title: "First Bank Plc" }),

            ];
        }
    }

    zoomIn(map) {
        map.setZoom(map.getZoom() + 1);
    }

    zoomOut(map) {
        map.setZoom(map.getZoom() - 1);
    }

    clear() {
        this.overlays = [];
    }
}
