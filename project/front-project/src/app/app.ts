import { Component, signal } from '@angular/core';

import {  OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [],
  template: `
    <h1>Hello yio, {{ title() }}</h1>
  <p>后端返回的消息：{{ message }}</p>
    
  `,
  styles: [],
})
export class App {
   message = '等待响应...';
   constructor(private http: HttpClient) {}  // 直接注入

  protected readonly title = signal('front-project');

  ngOnInit() {
    this.http.get('/api/hello', { responseType: 'text' }).subscribe({
      next: (res) => this.message = res,
      error: (err) => this.message = '调用失败：' + err.message
    });
  }
}
