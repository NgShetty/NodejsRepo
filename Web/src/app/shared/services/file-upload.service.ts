import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { CommonService } from './common.service';
import { FileType } from 'src/app/Application/_models/File';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  restServiceURI: string;
  tenantID:any;
  attr:any;

  constructor(private http: HttpClient, private _commonService: CommonService) {
    //uncomment before deploying
      this.attr = "/1b3ea420-656e-4df1-953d-1ef5feaa5ce3/apppool/cc32786e-9517-4f47-bf41-7d8a61a8251d/appentry/61c4b8bf-ea45-4fe5-ba25-c9328fd69a29";
      this.restServiceURI = _commonService.corsURL;

    //comment before deploying
    //this.attr = "/1b3ea420-656e-4df1-953d-1ef5feaa5ce3/apppool/cc32786e-9517-4f47-bf41-7d8a61a8251d/appentry/61c4b8bf-ea45-4fe5-ba25-c9328fd69a29";
    //this.restServiceURI = "http://localhost:51888/tenant";


    // if(!this.tenantID)
    // this.tenantID="1b3ea420-656e-4df1-953d-1ef5feaa5ce3";

  }

  uploadFile(formData, isCertificate: boolean, certificateType: string, dzkolu: string, fileType: number): any {

    if (!isCertificate) {
      const uploadReq = new HttpRequest('POST', `${this.restServiceURI + this.attr + this.getSubPartURL(fileType)}`, formData, { responseType: 'json' });
      return this.http.request(uploadReq);
    }

    if (isCertificate) {
      const uploadReqCert = new HttpRequest('POST', `${this.restServiceURI + this.attr + this.getSubPartURL(fileType)}?isCertificateUpload=${isCertificate}&certType=${certificateType}&dzkolu=${dzkolu}`, formData, { responseType: 'json' });
      return this.http.request(uploadReqCert);
    }

  }

  deleteFile(filePath, fileType: number): any {
    return this.http.delete(`${this.restServiceURI + this.attr + this.getSubPartURL(fileType)}?filePath=${filePath}`)
  }

  downloadFileFromServer(filePath, fileType:number): any {
    return this.http.get(
      `${this.restServiceURI + this.attr + this.getSubPartURL(fileType)}?filePath=${filePath}`,
      { observe: 'response', responseType: 'blob' });

  }

  downloadFile(filePath,fileType:number) {

    let blob;
    this.downloadFileFromServer(filePath,fileType).subscribe(resultBlob => {
      blob = resultBlob;

      var binaryData = [];
      binaryData.push(blob.body);

      var reader = new FileReader();
      reader.readAsBinaryString(new Blob(binaryData));

      var downloadLink = document.createElement('a');

      //add filename to download attr of anchor tag
      var arr = blob.url.split("/");
      if (arr)
        downloadLink.download = arr[arr.length - 1];

      const imageFile = new File([new Blob(binaryData)], "");
      downloadLink.href = window.URL.createObjectURL(imageFile);
      downloadLink.click();

    });
  }

  getSubPartURL(fileType: any)
  {
    var subUrl="";

    if(fileType==FileType.APNSCert)
    subUrl="/configurations/apns/cert";
    else if(fileType==FileType.AudioFile)
    subUrl="/media/audio";
    else if(fileType==FileType.GoogleServicesJson)
    subUrl="/configurations/fcm/google-services";
    else if(fileType==FileType.ImageFile)
    subUrl="/media/image";
    else if(fileType==FileType.AppIcon)
    subUrl="/media/icon";

    return subUrl;
  }
}
