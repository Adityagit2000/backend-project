import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    try {
        const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
        //TODO: get all videos based on query, sort, pagination
    
        // Parse query parameters
        // Construct initial query
        // Add query parameter if provided
        // Fetch videos
    
        page = parseInt(page)
        limit = parseInt(limit)
    
        let videoQuery = {}
    
        if (query) {
            videoQuery = {title: {$regex: query, $options: "i"}}
        }
    
        let sortOptions = {}
        if (sortBy && sortType) {
            sortOptions[sortBy] = sortType === 'desc' ? -1 : 1
        } else {
            sortOptions.createdAt = -1
        }
    
        const skip = (page - 1)*limit
        
        let videos = await Video.find(videoQuery)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .populate("user")
    
        if (userId) {
            videos = videos.filter(video => video.user.id === userId)
        }
    
        const totalVideos = await Video.countDocuments(videoQuery)
    
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            totalVideos,
            "Videos retrieved successfully"
        ))
    } catch (error) {
        throw new ApiError(500, "Failed to retrieve videos")
    }
})

const publishAVideo = asyncHandler(async (req, res) => {
    try {
        const { title, description} = req.body
        // TODO: get video, upload to cloudinary, create video
    
        const {video} = req.files
        if (!video) {
            throw new ApiError(400, "No video file uploaded")
        }
    
        const cloudinaryResponse = await uploadOnCloudinary(video.tempFilePath)
    
        const newVideo = new Video({
            title,
            description,
            videoFile: cloudinaryResponse.secure_url,
            thumbnail: cloudinaryResponse.thumbnail_url,
            duration: cloudinaryResponse.duration,
            owner: req.user.id
        })
    
        const createdVideo = await newVideo.save()
    
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            createdVideo,
            "Video Published"
        ))
    } catch (error) {
        throw new ApiError(500, "Failed to publish video")
    }
})  

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    try {
        const video = await Video.findById(videoId)
    
        if (!video) {
            throw new ApiError(404, "Video not found")
        }
    
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            video,
            "Video got by its ID"
        ))
    } catch (error) {
        throw new ApiError(500, "Failed to fetch video")
    }
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const {title, description, thumbnail} = req.body
    //TODO: update video details like title, description, thumbnail

    // Find video by its ID
    // Update the video details
    try {        
        let video = await Video.findById(videoId)
        if (!video) {
            throw new ApiResponse(404, "Video not found")
        }
    
        video.title = title || video.title,
        video.description = description || video.description,
        video.thumbnail = thumbnail || video.thumbnail
    
        video = await video.save()
    
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            video,
            "Video updated successfully"
        ))
    } catch (error) {
        throw new ApiError(500, "Failed to update video")
    }
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    try {
        const video = await Video.findById(videoId)
        if (!video) {
            throw new ApiError(404, "Video not found")
        }
    
        await Video.findByIdAndDelete(videoId)
    
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            null,
            "Video deleted successfully"
        ))
    } catch (error) {
        throw new ApiError(500, "Failed to delete video")
    }
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    // Check if the video exists
    // toggle the publish status of the video
    // Save the updated video document

    try {
        const video = await Video.findById(videoId)
        if (!video) {
            throw new ApiError(404, "Video not found")
        }
    
        video.isPublished = !video.isPublished
    
        await video.save()
    
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            null,
            "Successfully toggle publish status"
        ))
    } catch (error) {
        throw new ApiError(500, "Failed to toggle publish status")
    }
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}   