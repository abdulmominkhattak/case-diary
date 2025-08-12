import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateUtils {

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  getCurrentDate(): string {
    return this.formatDateForInput(new Date());
  }

  getTomorrowsDate(): string {
    const today = new Date();
    return this.formatDateForInput(new Date(today.setDate(today.getDate() + 1)));
  }
}