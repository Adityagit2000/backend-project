import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription

    // Check if user is already subscribed to the channel
    // If already subscribed, unsubscribe it
    // if not subscribed, subscribe it

    const userId = req.user.id

    const subscription = await Subscription.findOne({userId, channelId})

    if (subscription) {
        await Subscription.deleteOne({userId, channelId})
        res
        .json({
            subscribed: false
        })
    } else {
        await Subscription.create({userId, channelId})
        res
        .json({
            subscribed: true
        })
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // Find all subscriptions for the given channelId
    // Extract user information from subscriptions

    const subscriptions = await Subscription.find({channelId}).populate("userId")

    const subscribers = subscriptions.map(subscription => ({
        userId: subscription.userId._id,
        channel: subscription.userId.channel
    }))

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        subscribers,
        "Total subscribers got"
    ))
})

// controller to return channel list to which user has subscribed
// Retrive the user details from the database
// Fetch the list of channel ID's that the user has subscribed to
// Retrieve the details of the subscribed channels
// Return the list of subscribed channels in the response 
const getSubscribedChannels = asyncHandler(async (req, res) => {
    try {
        const { subscriberId } = req.params
    
        const user = await User.findById(subscriberId)
    
        const subscribedChannelId = user ? user.SubscribedChannels : []
    
        const subscribedChannels = await ChannelMergerNode.find({_id: {$in: subscribedChannelId}})
    
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            subscribedChannels,
            "Subscribed Channels retrieved successfully"
        ))
    } catch (error) {
        throw new ApiError(400, "Failed to retrieve subscribed channels")
    }
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}