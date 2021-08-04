import { HttpClient, HttpEventType, HttpHeaders, HttpProgressEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "../environments/environment";
import { map } from 'rxjs/operators'

const BACKEND_HOST = environment.apiUrl;
const uploadUrl = `${BACKEND_HOST}/api/files`

@Injectable({
    providedIn: 'root'
})
export class RestService {

    sendEmailRes = {};
    sendEmailReq: any;

    constructor(private http: HttpClient) { }

    // Folder upload API
    uploadFile = (files: FileList) => {

        const fileData = new FormData();

        for (const file of files) {
          fileData.append('myfile', file)
        }

        return this.http.post(uploadUrl, fileData, {
            reportProgress: true,
            observe: 'events'
        })
        .pipe(
            map(event => {
                return this.getEventMessage(event)
            })
        )
    }

    getEventMessage = (event: any) => {
        switch(event.type){
            case HttpEventType.UploadProgress:
                return this.fileUploadProgress(event)
            case HttpEventType.Response:
                return event.body;
            default:
                return `Upload Event -> ${event.type}`;
        }
    }

    fileUploadProgress = (event: any) => {

        const percentDone = Math.round(100 * (event.loaded / event.total));
        return {
            progress: percentDone
        }
    }

    sendMail = async () => {

      const emailPayload = {
        uuid: this.sendEmailReq.uuid,
        emailFrom: this.sendEmailReq.emailFrom,
        emailTo: this.sendEmailReq.emailTo,
        time: this.sendEmailReq.time
      }

      await this.http.post(`${uploadUrl}/send`, emailPayload).toPromise()
      .then(response => {
        this.sendEmailRes = response
      })
      .catch(err => {
        this.sendEmailRes = err
      })

      return this.sendEmailRes;
    }
}
