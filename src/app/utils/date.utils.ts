import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateUtils {
  formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  formatDateForDisplay(date: string): string {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  }

  getCurrentDate(): Date {
    return new Date();
  }
}