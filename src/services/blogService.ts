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
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

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

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
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
      return []; // Never reached
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
