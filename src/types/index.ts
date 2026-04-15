export interface Video {
  id: string;
  title: string;
  performers: string[]; // performer IDs
  tags: string[];
  dateAdded: string;
  duration: number; // seconds
  rating: number; // 1-5
  notes: string;
  isFavorite: boolean;
  collections: string[]; // collection IDs
  thumbnailColor: string; // placeholder color
}

export interface Performer {
  id: string;
  name: string;
  aliases: string[];
  tags: string[];
  notes: string;
  videoCount: number;
  avatarColor: string;
}

export interface Tag {
  id: string;
  name: string;
  category: string;
  videoCount: number;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  videoIds: string[];
  createdAt: string;
  coverColor: string;
}

export interface UserPreferences {
  displayName: string;
  defaultSort: "dateAdded" | "title" | "rating" | "duration";
  itemsPerRow: number;
}
