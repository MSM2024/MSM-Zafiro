package com.msm.mesh.ui

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import androidx.navigation.NavController
import com.msm.mesh.mesh.BluetoothMeshManager
import com.msm.mesh.mesh.MeshNode
import com.msm.mesh.mesh.WifiDirectMeshManager
import com.msm.mesh.ui.theme.*
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DiscoveryScreen(navController: NavController) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val node = remember { MeshNode.getInstance() }
    val discoveredNodes by node.discoveredNodes.collectAsState()
    val btManager = remember { BluetoothMeshManager(context) }
    val wifiManager = remember { WifiDirectMeshManager(context) }
    var isScanning by remember { mutableStateOf(false) }

    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { granted ->
        if (granted.values.all { it }) {
            btManager.startScanning()
            wifiManager.discoverServices()
            wifiManager.registerReceiver()
            isScanning = true
        }
    }

    fun requestPermissions() {
        val permissions = mutableListOf(
            Manifest.permission.BLUETOOTH_SCAN,
            Manifest.permission.BLUETOOTH_CONNECT,
            Manifest.permission.ACCESS_FINE_LOCATION,
        )
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            permissions.add(Manifest.permission.POST_NOTIFICATIONS)
        }
        permissionLauncher.launch(permissions.toTypedArray())
    }

    DisposableEffect(Unit) {
        onDispose {
            btManager.shutdown()
            wifiManager.cleanup()
        }
    }

    LaunchedEffect(Unit) {
        btManager.discoveredNodes.collect { info ->
            node.addDiscoveredNode(info)
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Descubrir Nodos", fontSize = 16.sp) },
                navigationIcon = {
                    TextButton(onClick = { navController.popBackStack() }) { Text("←") }
                },
                actions = {
                    TextButton(onClick = {
                        if (isScanning) { btManager.stopScanning(); isScanning = false }
                        else requestPermissions()
                    }) {
                        Text(if (isScanning) "Detener" else "Escanear", color = Cyan500)
                    }
                }
            )
        }
    ) { padding ->
        Column(Modifier.fillMaxSize().padding(padding).padding(16.dp)) {
            if (discoveredNodes.isEmpty()) {
                Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("Sin nodos descubiertos", color = TextSecondary, fontSize = 14.sp)
                        Spacer(Modifier.height(8.dp))
                        Text("Activa Bluetooth y Wi-Fi Direct", color = TextSecondary, fontSize = 12.sp)
                    }
                }
            } else {
                LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    items(discoveredNodes) { nodeInfo ->
                        Card(
                            onClick = { navController.navigate("chat/${nodeInfo.nodeId}") },
                            colors = CardDefaults.cardColors(containerColor = DarkCard),
                            modifier = Modifier.fillMaxWidth(),
                        ) {
                            Row(
                                Modifier.padding(12.dp).fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically,
                            ) {
                                Column {
                                    Text(nodeInfo.displayName, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                                    Text(nodeInfo.deviceName, fontSize = 11.sp, color = TextSecondary)
                                }
                                if (nodeInfo.isGateway) {
                                    Text("GATEWAY", fontSize = 9.sp, color = Amber400)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
