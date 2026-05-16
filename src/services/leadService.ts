import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface LeadData {
  name: string;
  email: string;
  phone: string;
  message?: string;
  source: 'contact_form' | 'price_calculator' | 'cta';
  details?: any;
}

export const leadService = {
  submitLead: async (data: LeadData) => {
    try {
      await addDoc(collection(db, 'leads'), {
        ...data,
        createdAt: serverTimestamp()
      });
      console.log('Lead submitted successfully');
      
      // In a real production app, you might trigger a Cloud Function here
      // that syncs this document to Google Sheets using the Sheets API.
      // For now, storing in Firestore is the standard "Backend" approach.
    } catch (error) {
      console.error('Lead submission failed:', error);
      throw error;
    }
  }
};
