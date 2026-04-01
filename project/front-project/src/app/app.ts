import { Component, signal } from '@angular/core';

import {  OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [],
  template: `
    <h1>Hello yio, {{ title() }}</h1>
    
    <button (click)="callBackend()" style="padding: 10px 20px; font-size: 16px; margin: 10px;">
      点击：调用后端接口！
    </button>
    
    <p>后端返回的消息：{{ message() }}</p>
    
  `,
  styles: [],
})
export class App {
   message = signal('无。。。');
   constructor(private http: HttpClient) {}  // 直接注入

  protected readonly title = signal('front-project');

  callBackend() {
    this.message.set('正在请求...');
    // Docker 容器访问宿主机：host.docker.internal：'/api/hello',
    this.http.get('/api/hello', { responseType: 'text' }).subscribe({
      next: (res) => this.message.set(res),
      error: (err) => this.message.set('调用失败：' + err.message),
    });
  }
}
