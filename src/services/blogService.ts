import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc, 
  query, 
  where, 
  orderBy, 
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  authorImageUrl?: string;
  coverUrl: string;
  slug: string;
  status: 'draft' | 'published';
  createdAt: string;
  // SEO & Keywords
  seoTitle?: string;
  metaDescription?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string;
  hashtags?: string;
}

const COLLECTION_NAME = 'posts';

export const blogService = {
  getPosts: async (includeDrafts = false): Promise<BlogPost[]> => {
    try {
      const q = includeDrafts 
        ? query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'))
        : query(collection(db, COLLECTION_NAME), where('status', '==', 'published'), orderBy('createdAt', 'desc'));
      
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as BlogPost[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
      return [];
    }
  },

  getPostById: async (id: string): Promise<BlogPost | undefined> => {
    try {
      const snap = await getDoc(doc(db, COLLECTION_NAME, id));
      if (snap.exists()) {
        return { ...snap.data(), id: snap.id } as BlogPost;
      }
      return undefined;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `${COLLECTION_NAME}/${id}`);
      return undefined;
    }
  },

  getPostBySlug: async (slug: string): Promise<BlogPost | undefined> => {
    try {
      const q = query(collection(db, COLLECTION_NAME), where('slug', '==', slug));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const doc = snap.docs[0];
        return { ...doc.data(), id: doc.id } as BlogPost;
      }
      return undefined;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
      return undefined;
    }
  },

  savePost: async (post: BlogPost) => {
    try {
      const postRef = doc(db, COLLECTION_NAME, post.id);
      await setDoc(postRef, {
        ...post,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${post.id}`);
    }
  },

  deletePost: async (id: string) => {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
    }
  }
};
