package com.iguruapp.bibletrivia

import com.facebook.react.bridge.*
import com.google.android.gms.games.PlayGames
import com.google.android.gms.games.GamesSignInClient
import com.google.android.gms.games.LeaderboardsClient
import android.util.Log

class PlayGamesModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "PlayGamesModule"
    }

    @ReactMethod
    fun signIn(promise: Promise) {
        val gamesSignInClient = PlayGames.getGamesSignInClient(currentActivity!!)
        gamesSignInClient.isAuthenticated().addOnCompleteListener { task ->
            val isAuthenticated = task.isSuccessful && task.result.isAuthenticated
            if (isAuthenticated) {
                Log.d("PlayGamesModule", "User is already authenticated")
                promise.resolve(true)
            } else {
                Log.d("PlayGamesModule", "User is not authenticated, triggering sign-in")
                gamesSignInClient.signIn().addOnCompleteListener { signInTask ->
                    val success = signInTask.isSuccessful && signInTask.result.isAuthenticated
                    promise.resolve(success)
                }
            }
        }
    }

    @ReactMethod
    fun showLeaderboard(leaderboardId: String, promise: Promise) {
        if (currentActivity == null) {
            promise.reject("E_NO_ACTIVITY", "Activity is null")
            return
        }
        
        PlayGames.getLeaderboardsClient(currentActivity!!)
            .getLeaderboardIntent(leaderboardId)
            .addOnSuccessListener { intent ->
                currentActivity!!.startActivityForResult(intent, 9004)
                promise.resolve(null)
            }
            .addOnFailureListener { e ->
                promise.reject("E_LEADERBOARD_ERROR", e.message)
            }
    }

    @ReactMethod
    fun submitScore(leaderboardId: String, score: Double, promise: Promise) {
        if (currentActivity == null) {
            promise.reject("E_NO_ACTIVITY", "Activity is null")
            return
        }

        PlayGames.getLeaderboardsClient(currentActivity!!)
            .submitScore(leaderboardId, score.toLong())
        
        promise.resolve(null)
    }
}
