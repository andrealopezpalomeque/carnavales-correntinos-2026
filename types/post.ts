// Post types and interfaces for social features

export type PostType = 'text' | 'image' | 'mixed'
export type PostPrivacy = 'public' | 'friends' | 'comparsa' | 'agrupacion'
export type InteractionType = 'like' | 'comment' | 'share'

// Main post interface
export interface UserPost {
  id?: string
  authorId: string
  type: PostType
  content: string
  images?: string[]
  privacy: PostPrivacy
  tags?: string[]
  location?: string
  createdAt: Date
  updatedAt: Date
  
  // Interaction counters
  likes: number
  comments: number
  shares?: number
  
  // Optional metadata
  isEdited?: boolean
  editHistory?: Array<{
    content: string
    editedAt: Date
  }>
}

// Post interaction (likes, shares, etc.)
export interface PostInteraction {
  id?: string
  postId: string
  userId: string
  type: InteractionType
  createdAt: Date
  
  // Additional data for specific interaction types
  metadata?: {
    reactionType?: string // for different like reactions
    shareMessage?: string // for shares with custom message
  }
}

// Post comments
export interface PostComment {
  id?: string
  postId: string
  authorId: string
  content: string
  parentCommentId?: string // for reply threads
  createdAt: Date
  updatedAt: Date
  likes: number
  
  // Comment metadata
  isEdited?: boolean
  editHistory?: Array<{
    content: string
    editedAt: Date
  }>
}

// Data for creating a new post
export interface CreatePostData {
  type: PostType
  content: string
  images?: string[]
  privacy: PostPrivacy
  tags?: string[]
  location?: string
}

// Data for updating an existing post
export interface UpdatePostData {
  content?: string
  images?: string[]
  privacy?: PostPrivacy
  tags?: string[]
  location?: string
}

// Post with author information (for display)
export interface PostWithAuthor extends UserPost {
  author: {
    uid: string
    displayName: string
    photoURL: string | null
    favoriteComparsa?: string
    favoriteAgrupacion?: string
  }
  
  // User's interaction status with this post
  userInteractions?: {
    hasLiked: boolean
    hasShared: boolean
    userComment?: PostComment
  }
}

// Comment with author information
export interface CommentWithAuthor extends PostComment {
  author: {
    uid: string
    displayName: string
    photoURL: string | null
  }
  
  // Nested replies (if any)
  replies?: CommentWithAuthor[]
  
  // User's interaction with this comment
  userHasLiked?: boolean
}

// Feed post (post with additional context for feed display)  
export interface FeedPost extends PostWithAuthor {
  // Relationship context
  relationshipType: 'self' | 'friend' | 'same_comparsa' | 'same_agrupacion' | 'public'
  
  // Temporal context
  isRecent: boolean // posted within last 24 hours
  timeAgo: string // "2 hours ago", "yesterday", etc.
  
  // Engagement preview
  recentComments?: CommentWithAuthor[] // last 2-3 comments
  topLikers?: Array<{
    uid: string
    displayName: string
    photoURL: string | null
  }> // first few people who liked
}

// Post statistics (for analytics)
export interface PostStats {
  postId: string
  authorId: string
  totalViews: number
  uniqueViews: number
  likes: number
  comments: number
  shares: number
  engagementRate: number
  createdAt: Date
  
  // Breakdown by time
  viewsByHour?: Record<string, number>
  viewsByDay?: Record<string, number>
}

// Post report (for moderation)
export interface PostReport {
  id?: string
  postId: string
  reporterId: string
  reason: 'spam' | 'inappropriate' | 'harassment' | 'false_information' | 'other'
  description?: string
  createdAt: Date
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  reviewedBy?: string
  reviewedAt?: Date
}

// Response interfaces for API operations
export interface PostResponse {
  success: boolean
  error?: string
  data?: UserPost
}

export interface PostsResponse {
  success: boolean
  error?: string
  data?: UserPost[]
  hasMore?: boolean
  nextCursor?: string
}

export interface CommentResponse {
  success: boolean
  error?: string
  data?: PostComment
}

export interface CommentsResponse {
  success: boolean
  error?: string
  data?: PostComment[]
  hasMore?: boolean
  nextCursor?: string
}

export interface InteractionResponse {
  success: boolean
  error?: string
  data?: PostInteraction
}

// Validation helpers
export const POST_CONSTRAINTS = {
  MIN_CONTENT_LENGTH: 1,
  MAX_CONTENT_LENGTH: 5000,
  MAX_IMAGES: 10,
  MAX_TAGS: 10,
  MAX_TAG_LENGTH: 50,
  MAX_LOCATION_LENGTH: 100
} as const

export const COMMENT_CONSTRAINTS = {
  MIN_CONTENT_LENGTH: 1,
  MAX_CONTENT_LENGTH: 1000,
  MAX_REPLY_DEPTH: 3
} as const

// Utility types
export type PostSortBy = 'newest' | 'oldest' | 'most_liked' | 'most_commented'
export type PostFilterBy = 'all' | 'friends' | 'comparsa' | 'agrupacion' | 'own'

export interface PostQuery {
  authorId?: string
  privacy?: PostPrivacy[]
  type?: PostType[]
  tags?: string[]
  sortBy?: PostSortBy
  filterBy?: PostFilterBy
  limit?: number
  cursor?: string
  dateFrom?: Date
  dateTo?: Date
}