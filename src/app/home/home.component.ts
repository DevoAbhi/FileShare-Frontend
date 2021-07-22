import { Component, OnDestroy, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { Subscription } from 'rxjs';
import { uploadType } from './utils/types/upload';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit, OnDestroy{

  upload: uploadType = {
    file: '',
    progress: 0
  };
  private subscription: Subscription | undefined;
  form!: FormGroup
  // scaleX: any;

  constructor(private restService: RestService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      emailFrom : new FormControl(null, [Validators.required]),
      emailTo : new FormControl(null, [Validators.required])
    }) as FormGroup
  }

  onDragOver = (event: Event) => {
    event = event || window.event
    event.preventDefault();
    const dropZone = document.querySelector('.drop-section')
    if(!dropZone?.classList.contains('dragged')){
      dropZone?.classList.add('dragged');
    }
  }

  onDragLeave = (event: Event) => {
    event = event || window.event
    event.preventDefault();
    const dropZone = document.querySelector('.drop-section')
    dropZone?.classList.remove('dragged');
  }

  onDrop = (event: DragEvent) => {
    event.preventDefault();
    const dropZone = document.querySelector('.drop-section')
    dropZone?.classList.remove('dragged');

    const file:File = event.dataTransfer?.files[0] as File;
    this.onUploadFile(file)
  }

  onBrowse = () => {
    const fileInput: HTMLElement = document.querySelector('.fileInput') as HTMLElement;
    fileInput?.click()
  }

  onBrowseFile = (event: any) => {
    const file: File = event.target.files[0] as File;
    if(file != null) {
      this.onUploadFile(file);
    }
    console.log(event)
  }

  onUploadFile = (file: File) => {

    this.subscription = (this.restService.uploadFile(file)).subscribe((result) => {
      this.upload! = result as uploadType
      console.log(result)
      // this.scaleX = `scale(${(this.upload.progress/100)})`;
      // console.log(this.scaleX)

      this.showLink(this.upload)
    })
  }

  showLink = (upload: uploadType) => {
    const { file } = upload
    console.log(file)
  }

  onCopy = () => {
    const fileUrl: HTMLInputElement = document.querySelector('#fileUrl') as HTMLInputElement;
    fileUrl.select();
    document.execCommand('copy');
  }

  onSubmit = async () => {
    if(!this.form) {
      return;
    }

    console.log(this.form.value)
    const uuid = this.upload.file.split('/').pop() || "";
    const emailFrom = this.form.value.emailFrom;
    const emailTo = this.form.value.emailTo;

    const response = await this.restService.sendMail(uuid, emailFrom, emailTo);
    console.log(response);

  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

}
