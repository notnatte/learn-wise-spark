
import { supabase } from '@/lib/supabase';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface OfflineLesson {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'video' | 'quiz';
  lastSynced: Date;
  localChanges: boolean;
}

interface OfflineProgress {
  id: string; // Updated to match expected property
  lessonId: string;
  userId: string; // Added this missing property
  progress: number;
  completed: boolean;
  lastUpdated: Date;
}

interface OfflineAIChat {
  id: string;
  messages: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }[];
  lastSynced: Date;
}

interface LearnWiseDB extends DBSchema {
  lessons: {
    key: string;
    value: OfflineLesson;
  };
  progress: {
    key: string;
    value: OfflineProgress;
  };
  aiChats: {
    key: string;
    value: OfflineAIChat;
  };
}

export class OfflineManager {
  private db: IDBPDatabase<LearnWiseDB> | null = null;
  private syncInProgress = false;

  async initialize() {
    this.db = await openDB<LearnWiseDB>('learn-wise-offline', 1, {
      upgrade(db) {
        db.createObjectStore('lessons');
        db.createObjectStore('progress');
        db.createObjectStore('aiChats');
      },
    });
  }

  async downloadLesson(lessonId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Mock lesson data since we don't have the actual table
    const lessonData = {
      id: lessonId,
      title: 'Sample Lesson',
      content: 'This is sample content',
      type: 'text' as const,
    };

    // Store in IndexedDB
    await this.db.put('lessons', {
      id: lessonData.id,
      title: lessonData.title,
      content: lessonData.content,
      type: lessonData.type,
      lastSynced: new Date(),
      localChanges: false
    }, lessonId);
  }

  async saveProgress(progress: OfflineProgress): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.put('progress', progress, progress.id);
  }

  async saveAIChat(chat: OfflineAIChat): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.put('aiChats', chat, chat.id);
  }

  async getOfflineLesson(lessonId: string): Promise<OfflineLesson | undefined> {
    if (!this.db) throw new Error('Database not initialized');
    return this.db.get('lessons', lessonId);
  }

  async getOfflineProgress(lessonId: string): Promise<OfflineProgress | undefined> {
    if (!this.db) throw new Error('Database not initialized');
    return this.db.get('progress', lessonId);
  }

  async getOfflineAIChat(chatId: string): Promise<OfflineAIChat | undefined> {
    if (!this.db) throw new Error('Database not initialized');
    return this.db.get('aiChats', chatId);
  }

  async syncWithServer(): Promise<void> {
    if (!this.db || this.syncInProgress) return;
    this.syncInProgress = true;

    try {
      // Sync progress - using a mock implementation since we don't have actual tables
      const progressCursor = await this.db.transaction('progress').store.openCursor();
      
      while (progressCursor) {
        const progress = progressCursor.value;
        
        console.log('Syncing progress:', progress);
        // Actual implementation would upload to Supabase

        await progressCursor.continue();
      }

      // Sync AI chats
      const chatCursor = await this.db.transaction('aiChats').store.openCursor();
      
      while (chatCursor) {
        const chat = chatCursor.value;
        
        console.log('Syncing AI chat:', chat);
        // Actual implementation would upload to Supabase

        await chatCursor.continue();
      }

      // Update last synced timestamps
      const lessonCursor = await this.db.transaction('lessons', 'readwrite').store.openCursor();
      
      while (lessonCursor) {
        const lesson = lessonCursor.value;
        lesson.lastSynced = new Date();
        await lessonCursor.update(lesson);
        await lessonCursor.continue();
      }

    } catch (error) {
      console.error('Error during sync:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  async checkForUpdates(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const lessonCursor = await this.db.transaction('lessons').store.openCursor();
    
    while (lessonCursor) {
      const lesson = lessonCursor.value;
      
      // Mock implementation to check for updates
      console.log('Checking for updates for lesson:', lesson.id);
      // Actual implementation would check Supabase for newer version

      await lessonCursor.continue();
    }
  }

  async clearOfflineData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.clear('lessons');
    await this.db.clear('progress');
    await this.db.clear('aiChats');
  }
}
