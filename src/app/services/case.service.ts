import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, updateDoc, query, where, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface CaseEntry {
  id?: string;
  userId: string;
  previousDate: string;
  caseDescription: string;
  courtDescription: string;
  caseStatus: string;
  nextDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class CaseService {
  private collectionName = 'case-entries';

  constructor(private firestore: Firestore) { }

  // Fetch cases by userId and date
  getCases(userId: string, date: string): Observable<any[]> {
    const caseCollection = collection(this.firestore, this.collectionName);
    const caseQuery = query(caseCollection, where('userId', '==', userId), where('cdate', '==', date));
    return collectionData(caseQuery, { idField: 'id' }) as Observable<any[]>;
  }

  // Create a new case entry
  createCase(caseData: any): Promise<any> {
    const caseCollection = collection(this.firestore, this.collectionName);
    console.log('caseData', caseData);
    const futureCaseData = {
      ...caseData,
      cdate: caseData.nextDate,
      previousDate: caseData.cdate,
      nextDate: ''
    };
    addDoc(caseCollection, futureCaseData);
    return addDoc(caseCollection, caseData);
  }

  // Update a case entry
  updateCase(caseId: string, updateData: any): Promise<void> {
    const caseDocRef = doc(this.firestore, `${this.collectionName}/${caseId}`);
    return updateDoc(caseDocRef, updateData);
  }
}