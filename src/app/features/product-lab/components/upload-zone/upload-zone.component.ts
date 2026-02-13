import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, CloudUpload } from 'lucide-angular';

interface UploadFile {
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
}

@Component({
  selector: 'app-upload-zone',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './upload-zone.component.html',
  styleUrls: ['./upload-zone.component.scss']
})
export class UploadZoneComponent {
  @Input() acceptedTypes: string[] = ['*/*'];
  @Input() maxFileSize: number = 10 * 1024 * 1024; // 10MB
  @Input() multiple: boolean = true;
  
  @Output() filesUploaded = new EventEmitter<FileList>();
  @Output() fileProgress = new EventEmitter<{file: File, progress: number}>();
  
  files: UploadFile[] = [];
  isDragOver: boolean = false;
  
  readonly CloudUpload = CloudUpload;
  
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }
  
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }
  
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    
    if (event.dataTransfer?.files) {
      this.handleFiles(event.dataTransfer.files);
    }
  }
  
  onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(input.files);
    }
  }
  
  private handleFiles(fileList: FileList): void {
    Array.from(fileList).forEach(file => {
      if (this.validateFile(file)) {
        const uploadFile: UploadFile = {
          name: file.name,
          size: file.size,
          type: file.type,
          progress: 0,
          status: 'pending'
        };
        
        this.files.push(uploadFile);
        this.uploadFile(file, uploadFile);
      }
    });
    
    this.filesUploaded.emit(fileList);
  }
  
  private validateFile(file: File): boolean {
    if (file.size > this.maxFileSize) {
      console.warn(`File ${file.name} exceeds maximum size limit`);
      return false;
    }
    
    return true;
  }
  
  private uploadFile(file: File, uploadFile: UploadFile): void {
    uploadFile.status = 'uploading';
    
    // Simulate upload progress
    const interval = setInterval(() => {
      if (uploadFile.progress < 100) {
        uploadFile.progress += 10;
        this.fileProgress.emit({file, progress: uploadFile.progress});
      } else {
        uploadFile.status = 'completed';
        clearInterval(interval);
      }
    }, 200);
  }
  
  removeFile(index: number): void {
    this.files.splice(index, 1);
  }
  
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}