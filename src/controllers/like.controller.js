import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from "../models/video.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video

    // Check if user has already liked the video
    // if not liked then like it 
    // if already liked it then remove it 

    const userId = req.user._id

    const isVideoLiked = await Video.findOne({ _id: videoId, likes: userId})

    if (!isVideoLiked) {
        await Video.findByIdAndUpdate(videoId, {$pull: {likes: userId}})
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            null,
            "Video like removed"
        ))
    } else {
        Video.findByIdAndUpdate(videoId, {$addToSet: {likes: userId}})
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            null,
            "Video liked"
        ))
    }

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

    // Check if user has already liked the comment
    // If the user has already liked the comment, remove their like
    // If the user hasn't liked the comment, add their like

    const userId = req.user._id

    const isCommentLiked = Comment.findOne({ _id: commentId, likes: userId})

    if (!isCommentLiked) {
        Comment.findByIdAndUpdate(commentId, {$pull: {likes: userId}})
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            null,
            "Comment like removed"
        ))
    } else {
        Comment.findByIdAndUpdate(commentId, {$addToSet: {likes: userId}})
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            null,
            "Comment liked"
        ))
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const userId = req.user._id
    //TODO: toggle like on tweet

    // Check if the user has already liked the tweet
    // If the user has already liked the tweet, remove their like
    // If the user hasn't liked the tweet, add their like

    const tweet = await tweetId.findById(tweetId)
    if (!tweet) {
       throw new ApiError(404, "Tweet not found")
    } 

    const isTweetLiked = tweet.likes.includes(userId)
    
    if (!isTweetLiked) {
        tweet.likes.pull(userId)
        await tweet.save()

        return res
        .status(200)
        .json(new ApiResponse(
            200,
            null,
            "Tweet like removed"
        ))
    } else {
        tweet.likes.push(userId)
        await tweet.save()

        return res
        .status(200)
        .json(new ApiResponse(
            200,
            null,
            "Tweet liked"
        ))
    }


})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    // Find all videos liked by the user

    const userId = req.user._id

    const likedVideos = await Video.find({likes: userId})

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        likedVideos,
        ""
    ))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}