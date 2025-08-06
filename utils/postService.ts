import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit, 
  startAfter, 
  serverTimestamp,
  increment,
  deleteField,
  type DocumentData,
  type QueryConstraint,
  type DocumentSnapshot,
  type Firestore 
} from 'firebase/firestore'

import type { 
  UserPost,
  PostComment,
  PostInteraction,
  CreatePostData,
  UpdatePostData,
  PostWithAuthor,
  CommentWithAuthor,
  FeedPost,
  PostResponse,
  PostsResponse,
  CommentResponse,
  CommentsResponse,
  InteractionResponse,
  PostQuery,
  PostSortBy
} from '~/types/post'

import type { UserProfile } from '~/types/user'
import { dbService } from '~/utils/database'

export class PostService {
  private db: Firestore | null = null

  constructor() {
    this.initializeFirestore()
  }

  private initializeFirestore() {
    try {
      const { $firebase } = useNuxtApp()
      this.db = $firebase?.db || null
    } catch (error) {
      console.warn('Firestore not available:', error)
    }
  }

  private ensureFirestore(): Firestore {
    if (!this.db) {
      this.initializeFirestore()
    }
    
    if (!this.db) {
      throw new Error('Firestore no está disponible')
    }
    
    return this.db
  }

  // ============== POST OPERATIONS ==============

  async createPost(userId: string, postData: CreatePostData): Promise<PostResponse> {
    try {
      const db = this.ensureFirestore()
      const postsRef = collection(db, 'posts')
      const postDoc = doc(postsRef)

      const post: UserPost = {
        id: postDoc.id,
        authorId: userId,
        type: postData.type,
        content: postData.content.trim(),
        images: postData.images || [],
        privacy: postData.privacy,
        tags: postData.tags?.map(tag => tag.trim().toLowerCase()) || [],
        ...(postData.location && postData.location.trim() && { location: postData.location.trim() }),
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: 0,
        comments: 0,
        shares: 0,
        isEdited: false
      }

      // Prepare data for Firestore, removing undefined fields
      const firestoreData: any = {
        id: post.id,
        authorId: post.authorId,
        type: post.type,
        content: post.content,
        images: post.images,
        privacy: post.privacy,
        tags: post.tags,
        likes: post.likes,
        comments: post.comments,
        shares: post.shares,
        isEdited: post.isEdited,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      // Only add location if it has a value and is not undefined
      if (post.location && typeof post.location === 'string' && post.location.trim()) {
        firestoreData.location = post.location.trim()
      }

      await setDoc(postDoc, firestoreData)

      return { success: true, data: post }
    } catch (error: any) {
      console.error('Error creating post:', error)
      return { success: false, error: error.message || 'Error al crear la publicación' }
    }
  }

  async getPost(postId: string): Promise<PostResponse> {
    try {
      const db = this.ensureFirestore()
      const postRef = doc(db, 'posts', postId)
      const postSnap = await getDoc(postRef)

      if (!postSnap.exists()) {
        return { success: false, error: 'Publicación no encontrada' }
      }

      const data = postSnap.data()
      const post: UserPost = {
        id: postSnap.id,
        authorId: data.authorId,
        type: data.type,
        content: data.content,
        images: data.images || [],
        privacy: data.privacy,
        tags: data.tags || [],
        location: data.location,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        likes: data.likes || 0,
        comments: data.comments || 0,
        shares: data.shares || 0,
        isEdited: data.isEdited || false,
        editHistory: data.editHistory || []
      }

      return { success: true, data: post }
    } catch (error: any) {
      console.error('Error getting post:', error)
      return { success: false, error: error.message || 'Error al obtener la publicación' }
    }
  }

  async updatePost(postId: string, userId: string, updateData: UpdatePostData): Promise<PostResponse> {
    try {
      const db = this.ensureFirestore()
      const postRef = doc(db, 'posts', postId)
      const postSnap = await getDoc(postRef)

      if (!postSnap.exists()) {
        return { success: false, error: 'Publicación no encontrada' }
      }

      const postData = postSnap.data()
      if (postData.authorId !== userId) {
        return { success: false, error: 'No tienes permisos para editar esta publicación' }
      }

      // Prepare update data
      const updates: any = {
        updatedAt: serverTimestamp(),
        isEdited: true
      }

      // Add to edit history if content is being changed
      if (updateData.content && updateData.content !== postData.content) {
        const editHistory = postData.editHistory || []
        editHistory.push({
          content: postData.content,
          editedAt: serverTimestamp()
        })
        updates.editHistory = editHistory
        updates.content = updateData.content.trim()
      }

      // Update other fields
      if (updateData.images !== undefined) updates.images = updateData.images
      if (updateData.privacy) updates.privacy = updateData.privacy
      if (updateData.tags !== undefined) {
        updates.tags = updateData.tags.map(tag => tag.trim().toLowerCase())
      }
      if (updateData.location !== undefined) {
        const trimmedLocation = updateData.location?.trim()
        if (trimmedLocation) {
          updates.location = trimmedLocation
        } else {
          // Use FieldValue.delete() to properly remove the field from Firestore
          updates.location = deleteField()
        }
      }

      await updateDoc(postRef, updates)

      // Return updated post
      return await this.getPost(postId)
    } catch (error: any) {
      console.error('Error updating post:', error)
      return { success: false, error: error.message || 'Error al actualizar la publicación' }
    }
  }

  async deletePost(postId: string, userId: string): Promise<PostResponse> {
    try {
      const db = this.ensureFirestore()
      const postRef = doc(db, 'posts', postId)
      const postSnap = await getDoc(postRef)

      if (!postSnap.exists()) {
        return { success: false, error: 'Publicación no encontrada' }
      }

      const postData = postSnap.data()
      if (postData.authorId !== userId) {
        return { success: false, error: 'No tienes permisos para eliminar esta publicación' }
      }

      // Delete the post
      await deleteDoc(postRef)

      // TODO: Also delete related comments and interactions
      // This should be done in a batch operation or cloud function

      return { success: true }
    } catch (error: any) {
      console.error('Error deleting post:', error)
      return { success: false, error: error.message || 'Error al eliminar la publicación' }
    }
  }

  async getUserPosts(userId: string, queryOptions: Partial<PostQuery> = {}): Promise<PostsResponse> {
    try {
      const db = this.ensureFirestore()
      const postsRef = collection(db, 'posts')
      
      // Simple query without ordering to avoid Firebase index requirement
      const limitCount = queryOptions.limit || 20
      const q = query(
        postsRef, 
        where('authorId', '==', userId),
        firestoreLimit(limitCount * 2) // Get more posts to allow for in-memory sorting
      )
      
      const querySnapshot = await getDocs(q)
      
      let posts: UserPost[] = []
      querySnapshot.forEach(doc => {
        const data = doc.data()
        posts.push({
          id: doc.id,
          authorId: data.authorId,
          type: data.type,
          content: data.content,
          images: data.images || [],
          privacy: data.privacy,
          tags: data.tags || [],
          location: data.location,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          likes: data.likes || 0,
          comments: data.comments || 0,
          shares: data.shares || 0,
          isEdited: data.isEdited || false,
          editHistory: data.editHistory || []
        })
      })

      // Sort in memory to avoid Firebase index requirement
      const sortBy = queryOptions.sortBy || 'newest'
      if (sortBy === 'newest') {
        posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      } else if (sortBy === 'oldest') {
        posts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      } else if (sortBy === 'most_liked') {
        posts.sort((a, b) => (b.likes || 0) - (a.likes || 0))
      } else if (sortBy === 'most_commented') {
        posts.sort((a, b) => (b.comments || 0) - (a.comments || 0))
      }

      // Apply limit after sorting and check if there are more
      const hasMore = posts.length > limitCount
      if (hasMore) {
        posts = posts.slice(0, limitCount)
      }

      console.log(`📄 Retrieved and sorted ${posts.length} posts for user ${userId}`)

      return {
        success: true,
        data: posts,
        hasMore,
        nextCursor: hasMore && posts.length > 0 ? posts[posts.length - 1].id : undefined
      }
    } catch (error: any) {
      console.error('Error getting user posts:', error)
      return { success: false, error: error.message || 'Error al obtener las publicaciones' }
    }
  }

  async getFeedPosts(userId: string, queryOptions: Partial<PostQuery> = {}): Promise<PostsResponse> {
    try {
      console.log('🔍 Getting feed posts for user:', userId)
      
      // Get filter type
      const filterBy = queryOptions.filterBy || 'friends'
      console.log('📊 Filter type:', filterBy)
      
      const db = this.ensureFirestore()
      const postsRef = collection(db, 'posts')
      let posts: UserPost[] = []
      
      if (filterBy === 'friends') {
        // Get user's friends to show their posts
        console.log('👥 Getting user friends...')
        const userFriends = await dbService.getUserFriends(userId)
        const friendIds = userFriends.map(friend => friend.uid)
        
        // Include user's own posts
        friendIds.push(userId)
        console.log('📋 Friend IDs (including self):', friendIds)

        if (friendIds.length === 1) {
          // Only user's own posts
          console.log('ℹ️ No friends found, showing only user posts')
          const constraints: QueryConstraint[] = [
            where('authorId', '==', userId),
            orderBy('createdAt', 'desc'),
            firestoreLimit(queryOptions.limit || 20)
          ]
          
          const q = query(postsRef, ...constraints)
          const querySnapshot = await getDocs(q)
          console.log('📄 User posts found:', querySnapshot.docs.length)
          
          for (const doc of querySnapshot.docs) {
            const data = doc.data()
            posts.push({
              id: doc.id,
              authorId: data.authorId,
              type: data.type,
              content: data.content,
              images: data.images || [],
              privacy: data.privacy,
              tags: data.tags || [],
              location: data.location,
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
              likes: data.likes || 0,
              comments: data.comments || 0,
              shares: data.shares || 0,
              isEdited: data.isEdited || false,
              editHistory: data.editHistory || []
            })
          }
        } else {
          // Get posts from friends (Firestore 'in' query supports up to 10 values)
          const batchSize = 10
          
          for (let i = 0; i < friendIds.length; i += batchSize) {
            const batch = friendIds.slice(i, i + batchSize)
            console.log('🔄 Processing batch:', batch)
            
            const constraints: QueryConstraint[] = [
              where('authorId', 'in', batch),
              where('privacy', 'in', ['public', 'friends']),
              orderBy('createdAt', 'desc'),
              firestoreLimit(queryOptions.limit || 20)
            ]

            const q = query(postsRef, ...constraints)
            const querySnapshot = await getDocs(q)
            console.log('📄 Batch posts found:', querySnapshot.docs.length)

            for (const doc of querySnapshot.docs) {
              const data = doc.data()
              posts.push({
                id: doc.id,
                authorId: data.authorId,
                type: data.type,
                content: data.content,
                images: data.images || [],
                privacy: data.privacy,
                tags: data.tags || [],
                location: data.location,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
                likes: data.likes || 0,
                comments: data.comments || 0,
                shares: data.shares || 0,
                isEdited: data.isEdited || false,
                editHistory: data.editHistory || []
              })
            }
          }
        }
      } else if (filterBy === 'all') {
        // Show all public posts
        console.log('🌍 Getting all public posts')
        const constraints: QueryConstraint[] = [
          where('privacy', '==', 'public'),
          orderBy('createdAt', 'desc'),
          firestoreLimit(queryOptions.limit || 20)
        ]
        
        const q = query(postsRef, ...constraints)
        const querySnapshot = await getDocs(q)
        console.log('📄 Public posts found:', querySnapshot.docs.length)
        
        for (const doc of querySnapshot.docs) {
          const data = doc.data()
          posts.push({
            id: doc.id,
            authorId: data.authorId,
            type: data.type,
            content: data.content,
            images: data.images || [],
            privacy: data.privacy,
            tags: data.tags || [],
            location: data.location,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            likes: data.likes || 0,
            comments: data.comments || 0,
            shares: data.shares || 0,
            isEdited: data.isEdited || false,
            editHistory: data.editHistory || []
          })
        }
      }

      // Sort all posts by creation date
      posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

      // Limit to requested amount
      const limitCount = queryOptions.limit || 20
      const limitedPosts = posts.slice(0, limitCount)
      
      console.log('✅ Final posts count:', limitedPosts.length)

      return {
        success: true,
        data: limitedPosts,
        hasMore: posts.length > limitCount
      }
    } catch (error: any) {
      console.error('❌ Error getting feed posts:', error)
      return { success: false, error: error.message || 'Error al obtener el feed' }
    }
  }

  // ============== POST INTERACTIONS ==============

  async likePost(postId: string, userId: string): Promise<InteractionResponse> {
    try {
      const db = this.ensureFirestore()
      
      // Check if user already liked this post
      const existingLike = await this.getUserPostInteraction(postId, userId, 'like')
      if (existingLike) {
        return { success: false, error: 'Ya has dado like a esta publicación' }
      }

      // Create like interaction
      const likesRef = collection(db, 'postLikes')
      const likeDoc = doc(likesRef)
      
      const likeData: PostInteraction = {
        id: likeDoc.id,
        postId,
        userId,
        type: 'like',
        createdAt: new Date()
      }

      await setDoc(likeDoc, {
        ...likeData,
        createdAt: serverTimestamp()
      })

      // Update post like counter
      const postRef = doc(db, 'posts', postId)
      await updateDoc(postRef, {
        likes: increment(1)
      })

      return { success: true, data: likeData }
    } catch (error: any) {
      console.error('Error liking post:', error)
      return { success: false, error: error.message || 'Error al dar like' }
    }
  }

  async unlikePost(postId: string, userId: string): Promise<InteractionResponse> {
    try {
      const db = this.ensureFirestore()
      
      // Find existing like
      const likesRef = collection(db, 'postLikes')
      const q = query(
        likesRef,
        where('postId', '==', postId),
        where('userId', '==', userId)
      )
      
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        return { success: false, error: 'No has dado like a esta publicación' }
      }

      // Delete the like
      const likeDoc = querySnapshot.docs[0]
      await deleteDoc(likeDoc.ref)

      // Update post like counter
      const postRef = doc(db, 'posts', postId)
      await updateDoc(postRef, {
        likes: increment(-1)
      })

      return { success: true }
    } catch (error: any) {
      console.error('Error unliking post:', error)
      return { success: false, error: error.message || 'Error al quitar like' }
    }
  }

  async getUserPostInteraction(postId: string, userId: string, type: 'like' | 'share'): Promise<PostInteraction | null> {
    try {
      const db = this.ensureFirestore()
      const collectionName = type === 'like' ? 'postLikes' : 'postShares'
      const interactionsRef = collection(db, collectionName)
      
      const q = query(
        interactionsRef,
        where('postId', '==', postId),
        where('userId', '==', userId)
      )
      
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]
        const data = doc.data()
        return {
          id: doc.id,
          postId: data.postId,
          userId: data.userId,
          type: data.type,
          createdAt: data.createdAt?.toDate() || new Date(),
          metadata: data.metadata
        }
      }
      
      return null
    } catch (error) {
      console.error('Error getting user post interaction:', error)
      return null
    }
  }

  // ============== COMMENT OPERATIONS ==============

  async createComment(postId: string, userId: string, content: string, parentCommentId?: string): Promise<CommentResponse> {
    try {
      const db = this.ensureFirestore()
      const commentsRef = collection(db, 'postComments')
      const commentDoc = doc(commentsRef)

      const comment: PostComment = {
        id: commentDoc.id,
        postId,
        authorId: userId,
        content: content.trim(),
        parentCommentId,
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: 0
      }

      // Prepare data for Firestore, removing undefined fields
      const firestoreData: any = {
        id: comment.id,
        postId: comment.postId,
        authorId: comment.authorId,
        content: comment.content,
        likes: comment.likes,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      // Only add parentCommentId if it has a value
      if (parentCommentId && parentCommentId.trim()) {
        firestoreData.parentCommentId = parentCommentId.trim()
      }

      await setDoc(commentDoc, firestoreData)

      // Update post comment counter
      const postRef = doc(db, 'posts', postId)
      await updateDoc(postRef, {
        comments: increment(1)
      })

      return { success: true, data: comment }
    } catch (error: any) {
      console.error('Error creating comment:', error)
      return { success: false, error: error.message || 'Error al crear el comentario' }
    }
  }

  async getComments(postId: string, limitCount: number = 20): Promise<CommentsResponse> {
    try {
      const db = this.ensureFirestore()
      const commentsRef = collection(db, 'postComments')
      
      // Get top-level comments (no parent comment)
      // Note: Removed orderBy to avoid composite index requirement
      // We'll sort in memory instead
      const q = query(
        commentsRef,
        where('postId', '==', postId),
        firestoreLimit(limitCount * 2) // Get more to account for filtering
      )

      const querySnapshot = await getDocs(q)
      
      let comments: PostComment[] = []
      querySnapshot.forEach(doc => {
        const data = doc.data()
        // Only include top-level comments (no parent)
        if (!data.parentCommentId) {
          comments.push({
            id: doc.id,
            postId: data.postId,
            authorId: data.authorId,
            content: data.content,
            parentCommentId: data.parentCommentId,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            likes: data.likes || 0,
            isEdited: data.isEdited || false,
            editHistory: data.editHistory || []
          })
        }
      })

      // Sort comments by creation date (newest first) since we removed orderBy from query
      comments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      
      // Apply the original limit after sorting
      const hasMore = comments.length > limitCount
      if (hasMore) {
        comments = comments.slice(0, limitCount)
      }

      return {
        success: true,
        data: comments,
        hasMore
      }
    } catch (error: any) {
      console.error('Error getting comments:', error)
      return { success: false, error: error.message || 'Error al obtener los comentarios' }
    }
  }

  async getReplies(commentId: string, limitCount: number = 10): Promise<CommentsResponse> {
    try {
      const db = this.ensureFirestore()
      const commentsRef = collection(db, 'postComments')
      
      // Get replies (avoiding composite index requirement)
      const q = query(
        commentsRef,
        where('parentCommentId', '==', commentId),
        firestoreLimit(limitCount * 2)
      )

      const querySnapshot = await getDocs(q)
      
      let replies: PostComment[] = []
      querySnapshot.forEach(doc => {
        const data = doc.data()
        replies.push({
          id: doc.id,
          postId: data.postId,
          authorId: data.authorId,
          content: data.content,
          parentCommentId: data.parentCommentId,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          likes: data.likes || 0,
          isEdited: data.isEdited || false,
          editHistory: data.editHistory || []
        })
      })

      // Sort replies by creation date (oldest first for conversational flow)
      replies.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      
      // Apply the original limit after sorting
      const hasMore = replies.length > limitCount
      if (hasMore) {
        replies = replies.slice(0, limitCount)
      }

      return {
        success: true,
        data: replies,
        hasMore
      }
    } catch (error: any) {
      console.error('Error getting replies:', error)
      return { success: false, error: error.message || 'Error al obtener las respuestas' }
    }
  }

  async updateComment(commentId: string, userId: string, content: string): Promise<CommentResponse> {
    try {
      const db = this.ensureFirestore()
      const commentRef = doc(db, 'postComments', commentId)
      const commentSnap = await getDoc(commentRef)

      if (!commentSnap.exists()) {
        return { success: false, error: 'Comentario no encontrado' }
      }

      const commentData = commentSnap.data()
      if (commentData.authorId !== userId) {
        return { success: false, error: 'No tienes permisos para editar este comentario' }
      }

      const updates = {
        content: content.trim(),
        updatedAt: serverTimestamp(),
        isEdited: true
      }

      // Add to edit history if content changed
      if (commentData.content !== content.trim()) {
        const editHistory = commentData.editHistory || []
        editHistory.push({
          content: commentData.content,
          editedAt: serverTimestamp()
        })
        updates.editHistory = editHistory
      }

      await updateDoc(commentRef, updates)

      return await this.getComment(commentId)
    } catch (error: any) {
      console.error('Error updating comment:', error)
      return { success: false, error: error.message || 'Error al actualizar el comentario' }
    }
  }

  async deleteComment(commentId: string, userId: string): Promise<CommentResponse> {
    try {
      const db = this.ensureFirestore()
      const commentRef = doc(db, 'postComments', commentId)
      const commentSnap = await getDoc(commentRef)

      if (!commentSnap.exists()) {
        return { success: false, error: 'Comentario no encontrado' }
      }

      const commentData = commentSnap.data()
      if (commentData.authorId !== userId) {
        return { success: false, error: 'No tienes permisos para eliminar este comentario' }
      }

      // Delete the comment
      await deleteDoc(commentRef)

      // Delete any replies to this comment
      const repliesRef = collection(db, 'postComments')
      const repliesQuery = query(repliesRef, where('parentCommentId', '==', commentId))
      const repliesSnapshot = await getDocs(repliesQuery)
      
      const deletePromises = repliesSnapshot.docs.map(doc => deleteDoc(doc.ref))
      await Promise.all(deletePromises)

      // Update post comment counter
      const postRef = doc(db, 'posts', commentData.postId)
      const decrementAmount = 1 + repliesSnapshot.docs.length // Main comment + replies
      await updateDoc(postRef, {
        comments: increment(-decrementAmount)
      })

      return { success: true }
    } catch (error: any) {
      console.error('Error deleting comment:', error)
      return { success: false, error: error.message || 'Error al eliminar el comentario' }
    }
  }

  async getComment(commentId: string): Promise<CommentResponse> {
    try {
      const db = this.ensureFirestore()
      const commentRef = doc(db, 'postComments', commentId)
      const commentSnap = await getDoc(commentRef)

      if (!commentSnap.exists()) {
        return { success: false, error: 'Comentario no encontrado' }
      }

      const data = commentSnap.data()
      const comment: PostComment = {
        id: commentSnap.id,
        postId: data.postId,
        authorId: data.authorId,
        content: data.content,
        parentCommentId: data.parentCommentId,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        likes: data.likes || 0,
        isEdited: data.isEdited || false,
        editHistory: data.editHistory || []
      }

      return { success: true, data: comment }
    } catch (error: any) {
      console.error('Error getting comment:', error)
      return { success: false, error: error.message || 'Error al obtener el comentario' }
    }
  }

  async enrichCommentWithAuthor(comment: PostComment): Promise<CommentWithAuthor | null> {
    try {
      const author = await dbService.getUserProfile(comment.authorId)
      if (!author) return null

      const commentWithAuthor: CommentWithAuthor = {
        ...comment,
        author: {
          uid: author.uid,
          displayName: author.displayName || 'Usuario',
          photoURL: author.photoURL
        }
      }

      return commentWithAuthor
    } catch (error) {
      console.error('Error enriching comment with author:', error)
      return null
    }
  }

  async enrichCommentsWithAuthors(comments: PostComment[]): Promise<CommentWithAuthor[]> {
    const enrichedComments: CommentWithAuthor[] = []
    
    for (const comment of comments) {
      const enrichedComment = await this.enrichCommentWithAuthor(comment)
      if (enrichedComment) {
        enrichedComments.push(enrichedComment)
      }
    }
    
    return enrichedComments
  }

  // ============== HELPER METHODS ==============

  async enrichPostWithAuthor(post: UserPost): Promise<PostWithAuthor | null> {
    try {
      const author = await dbService.getUserProfile(post.authorId)
      if (!author) return null

      const postWithAuthor: PostWithAuthor = {
        ...post,
        author: {
          uid: author.uid,
          displayName: author.displayName || 'Usuario',
          photoURL: author.photoURL,
          favoriteComparsa: author.favoriteComparsa,
          favoriteAgrupacion: author.favoriteAgrupacion
        }
      }

      return postWithAuthor
    } catch (error) {
      console.error('Error enriching post with author:', error)
      return null
    }
  }

  async enrichPostsWithAuthors(posts: UserPost[]): Promise<PostWithAuthor[]> {
    const enrichedPosts: PostWithAuthor[] = []
    
    for (const post of posts) {
      const enrichedPost = await this.enrichPostWithAuthor(post)
      if (enrichedPost) {
        enrichedPosts.push(enrichedPost)
      }
    }
    
    return enrichedPosts
  }
}

// Export singleton instance
export const postService = new PostService()

// Export utility functions
export const posts = {
  // Post operations
  create: (userId: string, data: CreatePostData) => postService.createPost(userId, data),
  get: (postId: string) => postService.getPost(postId),
  update: (postId: string, userId: string, data: UpdatePostData) => postService.updatePost(postId, userId, data),
  delete: (postId: string, userId: string) => postService.deletePost(postId, userId),
  
  // Query operations
  getUserPosts: (userId: string, options?: Partial<PostQuery>) => postService.getUserPosts(userId, options),
  getFeed: (userId: string, options?: Partial<PostQuery>) => postService.getFeedPosts(userId, options),
  
  // Interaction operations
  like: (postId: string, userId: string) => postService.likePost(postId, userId),
  unlike: (postId: string, userId: string) => postService.unlikePost(postId, userId),
  
  // Comment operations
  createComment: (postId: string, userId: string, content: string, parentCommentId?: string) => postService.createComment(postId, userId, content, parentCommentId),
  getComments: (postId: string, limitCount?: number) => postService.getComments(postId, limitCount),
  getReplies: (commentId: string, limitCount?: number) => postService.getReplies(commentId, limitCount),
  updateComment: (commentId: string, userId: string, content: string) => postService.updateComment(commentId, userId, content),
  deleteComment: (commentId: string, userId: string) => postService.deleteComment(commentId, userId),
  
  // Utility operations
  enrichWithAuthor: (post: UserPost) => postService.enrichPostWithAuthor(post),
  enrichWithAuthors: (posts: UserPost[]) => postService.enrichPostsWithAuthors(posts),
  enrichCommentWithAuthor: (comment: PostComment) => postService.enrichCommentWithAuthor(comment),
  enrichCommentsWithAuthors: (comments: PostComment[]) => postService.enrichCommentsWithAuthors(comments)
}