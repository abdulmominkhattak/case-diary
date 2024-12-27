import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc, query, where, collectionData, getDoc, getDocs } from '@angular/fire/firestore';
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
  createCase(caseData: any): Promise<any[]> {
    const caseCollection = collection(this.firestore, this.collectionName);
    console.log('Creating case with data:', caseData);

    const currentCaseData = {
      ...caseData,
      cdate: caseData.cdate || new Date().toISOString().split('T')[0] // Use current date if cdate is not provided
    };

    const nextCaseData = {
      ...caseData,
      cdate: caseData.nextDate,
      previousDate: caseData.cdate || new Date().toISOString().split('T')[0], // Use current date if cdate is not provided
      nextDate: ''
    };

    const promises = [addDoc(caseCollection, currentCaseData)];
    if (caseData.nextDate) {
      promises.push(addDoc(caseCollection, nextCaseData));
    }

    return Promise.all(promises)
      .then(docRefs => {
        docRefs.forEach(docRef => console.log('Document written with ID: ', docRef.id));
        return docRefs;
      })
      .catch(error => {
        console.error('Error adding documents: ', error);
        throw error;
      });
  }

  // Update a case entry
  async updateCase(caseId: string, updateData: any): Promise<void> {
    const caseDocRef = doc(this.firestore, `${this.collectionName}/${caseId}`);
    const caseCollection = collection(this.firestore, this.collectionName);

    // Fetch the current case data
    const caseSnapshot = await getDoc(caseDocRef);
    const currentCaseData = caseSnapshot.data();

    if (!currentCaseData) {
      throw new Error('Case not found');
    }

    // If there is an existing nextDate, delete the old next date entry
    if (currentCaseData['nextDate']) {
      const oldNextDateQuery = query(caseCollection, where('userId', '==', currentCaseData['userId']), where('cdate', '==', currentCaseData['nextDate']));
      const oldNextDateSnapshot = await getDocs(oldNextDateQuery);
      oldNextDateSnapshot.forEach(doc => deleteDoc(doc.ref));
    }

    // Update the current case entry
    await updateDoc(caseDocRef, updateData);

    // If a new nextDate is provided, create a new entry for the next date
    if (updateData.nextDate) {
      const nextCaseData = {
        ...currentCaseData,
        cdate: updateData.nextDate,
        previousDate: currentCaseData['cdate'],
        nextDate: ''
      };
      await addDoc(caseCollection, nextCaseData);
    }

    console.log('Document updated with ID: ', caseId);
  }
}