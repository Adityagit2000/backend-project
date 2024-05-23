import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    //TODO: create playlist

    // Check if name is provided
    // Create a new playlist document 
    // Assign the playlist to the user who created it
    // Save the playlist to the database

    if (!name) {
        throw new ApiError(400, "Name is required for the playlist")
    }

    const playlist = new Playlist({
        name,
        description,
        createdBy: userId
    })

    await playlist.save()

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        playlist,
        "Playlist created"
    ))
    

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    // Check if userId is the valid ObjectId
    // Find playlists created by the specified user

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invaid userId")
    }

    const playlists = await Playlist.find({createdBy: userId})

    if (!playlists) {
        throw new ApiError(404, "Playlist not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        playlists,
        ""
    ))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    // Check if userId is valid ObjectId
    // Find the playlist by its ID
    
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        playlist,
        "Playlist not Found"
    ))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    // Find the playlists by its ID
    // Check if the playlist exists
    // Add the videoId to the playlist's video array
    // Save the updated playlist's document

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    playlist.videos.push(videoId)
    await playlist.save()

    return res
    .status(200)
    .json({
        message: "Video added to playlist"
    })
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    
    // Find the playlist by its ID
    // Check if the playlist exists
    // Remove the videoId from the playlist's videos array
    // Save the updated playlist document

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    playlist.videos.pull(videoId)

    await playlist.save()

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        null,
        "Video removed from playlist"
    ))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    // Find the playlist by its ID and delete it

    const deletePlaylist = await Playlist.findByIdAndDelete(playlistId)

    if (!deletePlaylist) {
        throw new ApiError(404, "Playlist not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        null,
        "Playlist deleted successfully"
    ))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    // Find the playlist by its ID
    // Check if the playlist exists
    // Update the playlist properties
    // Save the updated playlist document

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist doesn't exists")
    }

    if (name) {
        playlist.name = name
    }

    if (description) {
        playlist.description = description
    }

    await playlist.save()

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        playlist,
        "Playlist updated successfully"
    ))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}