package com.msm.mesh

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.msm.mesh.ui.theme.MSMMeshTheme
import com.msm.mesh.ui.DiscoveryScreen
import com.msm.mesh.ui.MainScreen
import com.msm.mesh.ui.ChatScreen
import com.msm.mesh.ui.GatewayScreen

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MSMMeshTheme {
                Surface(modifier = Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
                    val navController = rememberNavController()
                    NavHost(navController, startDestination = "main") {
                        composable("main") { MainScreen(navController) }
                        composable("discovery") { DiscoveryScreen(navController) }
                        composable("chat/{nodeId}") { backStackEntry ->
                            ChatScreen(navController, backStackEntry.arguments?.getString("nodeId") ?: "")
                        }
                        composable("gateway") { GatewayScreen(navController) }
                    }
                }
            }
        }
    }
}
