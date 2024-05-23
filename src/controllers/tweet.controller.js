import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet

    // Extract data from request body
    // Create a new tweet document
    // Save the tweet document to the database
    // Return the newly created tweet in the response

    try {
        const {content} = req.body        

        if (!content) {
            throw new ApiError(400, "Content is required")
        }
        
        const newTweet  = new Tweet({
            content,
            owner: req.user.id,
        })
    
        const createdTweet = await newTweet.save()
    
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            createdTweet,
            "Tweet created successfully"
        ))
    } catch (error) {
        throw new ApiError(500, "Failed to create tweet")
    }
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets

    // Fetch tweets from the database for the specified user
    // Return the user's tweets in the response

    try {
        const userId = req.user.id
        const userTweets = await Tweet.find({owner: userId})
    
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            userTweets,
            "User tweets retrieved successfully"
        ))
    } catch (error) {
        throw new ApiError(500, "Failed to retrieve user tweets")
    }
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet

    // Find the tweet by its Id
    // Check if the tweet exists
    // Update the tweet content
    // Save the updated tweet to the database

    try {
        const {tweetId} = req.params
        const {content} = req.body

        if (!content) {
            throw new ApiError(400, "Content is required")
        }
    
        const tweet = await Tweet.findById(tweetId)
        if (!tweet) {
            throw new ApiError(404, "Tweet not found")
        }
    
        tweet.content = content
    
        const updatedTweet = await tweet.save()
        
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            updatedTweet,
            "tweet updated successfully"
        ))
    } catch (error) {
        throw new ApiError(500, "Failed to update Tweet")
    }
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet

    try {
        const {tweetId} = req.params
    
        const deletedTweet = await Tweet.findByIdAndDelete(tweetId)
        if (!deletedTweet) {
            throw new ApiError(404, "Tweet not found")
        }
    
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            null,
            "Tweet deleted successfully"
        ))
    } catch (error) {
        throw new ApiError(500, "Failed to delete tweet")
    }


})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}