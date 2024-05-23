import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"

const getVideoComments = asyncHandler(async(req, res) => {

    // Extract parameters from request
    // Fetch comments from the database based on VideoId
    // Count total number of comments for pagination
    // Construct response object
    // Send response

    try {
        const {videoId} = req.params
        const {page = 1, limit = 10} = req.query
    
        const comments = await Comment.find({ videoId })
        .limit(Number(limit));
    
        const totalComments = await Comment.countDocuments({ videoId })
    
        const response = {
            comments,
            paginaiton: {
                totalComments,
                totalPages: Math.ceil(totalComments / limit),
                currentPage: Number(page),
                hasNextPage: (page * limit) < totalComments
            }
        }
    
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            response,
            ""
        ))
    } catch (error) {
        throw new ApiError(500, "Internal Server Error")
    }
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video

    // Validate required fields
    // Check if the video exists
    // Check if the user exists
    // Create new comment object
    // Save the comment to the database


   try {
     const {videoId, userId} = req.body    
 
     if (!videoId || !userId || !content) {
         throw new ApiError(400, "VideoId, UserId and content are required")
     }
 
     const video = await Video.findById(videoId)
     if (!video) {
         throw new ApiError(404, "Video not found")
     }
 
     const user = await User.findById(userId)
     if (!user) {
         throw new ApiError(404, "User not found")
     }
 
     const comment = new Comment({
         videoId,
         userId,
         content
     })
 
     await comment.save()
 
     return res
     .status(200)
     .json(
         new ApiResponse(
             200,
             comment,
             "Comment added successfully"
         )
     )
   } catch (error) {
        throw new ApiError(500, "Internal Server error")
   }

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment

    // Extract comment ID and updated content from database
    // Validate comment ID and updated content
    // Check if the comment exists
    // Update the comment content

    try {
        const {commentId, content} = req.body
    
        if (!commentId || !content) {
            throw new ApiError(404, "Comment ID and content not found")
        }
    
        const comment = await Comment.findById(commentId)
        if (!comment) {
            throw new ApiError(404, "Comment not found")
        }
    
        comment.content = content
        await comment.save()
    
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            comment,
            "Comment updated successfully"
        ))
    } catch (error) {
        throw new ApiError(500, "Internal Server error")
    }

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    
    // Extract commentId from database
    // Validate comment Id
    // Check if the comment exists
    // Delete comment from the database

    try {
        const {commentId} = req.params
    
        if (!commentId) {
            throw new ApiError(400, "Comment ID doesn't exists")
        }
    
        const comment = await Comment.findById(commentId)
        if (!comment) {
            throw new ApiError(404, "Comment not found")
        }
    
        await comment.delete()
    
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            null,
            "Comment deleted successfully"
        ))
    } catch (error) {
        throw new ApiError(500, "Internal Server error")
    }
})


export {
    getVideoComments,
    addComment, 
    updateComment,
    deleteComment
}

